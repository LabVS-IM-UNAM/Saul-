import * as Tone from "tone";

const POLYSYNTH_INSTRUMENTS = {
  Synth: () => new Tone.PolySynth(Tone.Synth).toDestination(),
  AMSynth: () => new Tone.PolySynth(Tone.AMSynth).toDestination(),
  FMSynth: () => new Tone.PolySynth(Tone.FMSynth).toDestination(),
};

const SCALES = {
  Mayor: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"],
  Menor: ["C4", "D4", "Eb4", "F4", "G4", "Ab4", "Bb4", "C5"],
  Pentatónica: ["C4", "Eb4", "F4", "G4", "Bb4", "C5", "Eb5", "F5"],
  Cromática: ["C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4"],
};

const generateScaleNotes = (baseScale, totalRows) => {
  const extendedScale = [];
  const baseLength = baseScale.length;
  if (baseLength === 0) return [];

  for (let i = 0; i < totalRows; i++) {
    const baseNote = baseScale[i % baseLength];
    const octaveOffset = Math.floor(i / baseLength);

    const noteParts = baseNote.match(/([A-Ga-g]#?b?)([0-9]+)/);
    if (noteParts) {
      const noteName = noteParts[1];
      const baseOctave = parseInt(noteParts[2], 10);
      const newOctave = baseOctave + octaveOffset;
      extendedScale.push(`${noteName}${newOctave}`);
    } else {
      extendedScale.push(baseNote);
    }
  }
  return extendedScale;
};

class AudioEngine {
  constructor() {
    this.synths = {};
    this.sequence = null;
    this.isInitialized = false;
    this.hasCompletedFirstLoop = false;
    this.currentStepIndex = 0;
    this.pausedStep = 0;
    this.recorder = null;
    this.isRecording = false;
  }

  initialize() {
    if (this.isInitialized) return;

    this.synths = {
      Synth: POLYSYNTH_INSTRUMENTS["Synth"](),
      AMSynth: POLYSYNTH_INSTRUMENTS["AMSynth"](),
      FMSynth: POLYSYNTH_INSTRUMENTS["FMSynth"](),
    };

    this.recorder = new Tone.Recorder();
    Tone.getDestination().connect(this.recorder);

    this.isInitialized = true;
  }

  createSequence(activeScale, numRows, numCols, gridRef, setCurrentStep, setGrid, nextGeneration) {
    // Preservar estados antes de dispose
    const preservedHasCompletedFirstLoop = this.hasCompletedFirstLoop;
    const preservedPausedStep = this.pausedStep;
    
    this.dispose();
    this.initialize();
    
    // Restaurar estados preservados
    this.hasCompletedFirstLoop = preservedHasCompletedFirstLoop;
    this.currentStepIndex = preservedPausedStep;

    const currentScaleNotes = generateScaleNotes(SCALES[activeScale], numRows);

    this.sequence = new Tone.Sequence(
      (time, stepIndex) => {
        this.currentStepIndex = stepIndex;
        setCurrentStep(stepIndex);
        
        // Solo evolucionar cuando completamos un ciclo completo (llegamos al paso 0 después de haber pasado por todos los pasos)
        if (stepIndex === 0 && this.hasCompletedFirstLoop) {
          setGrid((currentGrid) =>
            nextGeneration(currentGrid, numRows, numCols),
          );
        }
        
        // Marcar que completamos el primer ciclo cuando llegamos al último paso
        if (stepIndex === numCols - 1) {
          this.hasCompletedFirstLoop = true;
        }

        const currentGrid = gridRef.current;

        for (let row = 0; row < numRows; row++) {
          const cellData = currentGrid[row][stepIndex];
          const instrument = cellData?.instrument || cellData;

          if (
            instrument &&
            instrument !== "Oscilador" &&
            currentScaleNotes[row]
          ) {
            const note = currentScaleNotes[row];
            this.synths[instrument]?.triggerAttackRelease(
              note,
              "8n",
              time,
            );
          }
        }
      },
      [...Array(numCols).keys()],
      "8n",
    ).start(0);

    if (Tone.getTransport().state === "started") {
      Tone.getTransport().stop();
      Tone.getTransport().start();
    }
  }

  setBPM(bpm) {
    Tone.Transport.bpm.value = bpm;
  }

  async start() {
    await Tone.start();
    if (this.sequence && this.pausedStep > 0) {
      // Detener y recrear la secuencia comenzando desde el paso pausado
      this.sequence.stop();
      this.sequence.start(0, this.pausedStep);
    }
    Tone.getTransport().start();
  }

  stop() {
    // Guardar el paso actual cuando se pausa
    this.pausedStep = this.currentStepIndex;
    Tone.getTransport().stop();
  }

  resetPosition() {
    this.pausedStep = 0;
    this.currentStepIndex = 0;
    this.hasCompletedFirstLoop = false;
  }

  async startRecording() {
    if (!this.recorder) {
      this.initialize();
    }
    this.isRecording = true;
    this.recorder.start();
  }

  async stopRecording() {
    if (this.recorder && this.isRecording) {
      const recording = await this.recorder.stop();
      this.isRecording = false;
      return recording;
    }
    return null;
  }

  downloadRecording(blob, filename = "grabacion.webm") {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.download = filename;
    anchor.href = url;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  dispose() {
    this.sequence?.dispose();
    this.recorder?.dispose();
    Object.values(this.synths ?? {}).forEach((synth) =>
      synth.dispose(),
    );
    this.synths = {};
    this.sequence = null;
    this.recorder = null;
    this.isInitialized = false;
    this.hasCompletedFirstLoop = false;
    this.currentStepIndex = 0;
    this.pausedStep = 0;
    this.isRecording = false;
  }
}

export { AudioEngine, SCALES, POLYSYNTH_INSTRUMENTS, generateScaleNotes };