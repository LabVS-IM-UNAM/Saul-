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
  }

  initialize() {
    if (this.isInitialized) return;
    
    this.synths = {
      Synth: POLYSYNTH_INSTRUMENTS["Synth"](),
      AMSynth: POLYSYNTH_INSTRUMENTS["AMSynth"](),
      FMSynth: POLYSYNTH_INSTRUMENTS["FMSynth"](),
    };
    
    this.isInitialized = true;
  }

  createSequence(activeScale, numRows, numCols, gridRef, setCurrentStep, setGrid, nextGeneration) {
    this.dispose();
    this.initialize();

    const currentScaleNotes = generateScaleNotes(SCALES[activeScale], numRows);

    this.sequence = new Tone.Sequence(
      (time, stepIndex) => {
        setCurrentStep(stepIndex);
        if (stepIndex === 0) {
          setGrid((currentGrid) =>
            nextGeneration(currentGrid, numRows, numCols),
          );
        }

        const currentGrid = gridRef.current;

        for (let row = 0; row < numRows; row++) {
          const instrument = currentGrid[row][stepIndex];

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
    Tone.getTransport().start();
  }

  stop() {
    Tone.getTransport().stop();
  }

  dispose() {
    this.sequence?.dispose();
    Object.values(this.synths ?? {}).forEach((synth) =>
      synth.dispose(),
    );
    this.synths = {};
    this.sequence = null;
    this.isInitialized = false;
  }
}

export { AudioEngine, SCALES, POLYSYNTH_INSTRUMENTS, generateScaleNotes };