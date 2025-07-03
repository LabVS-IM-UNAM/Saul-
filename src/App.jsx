import { useState, useEffect, useRef } from 'react';
import * as Tone from "tone";
import './App.css';

// Componentes
import Grid from './components/Grid';
import Boton from './components/Boton';
import Card, { CardBody } from './components/Card.jsx';

// --- Constantes de Configuración ---
const COLS = 16;
const ROWS = 8;

// Definimos los instrumentos que estarán disponibles en el menú
const INSTRUMENT_NAMES = ['Synth', 'AMSynth', 'FMSynth', 'PluckSynth'];

// Definimos los instrumentos que USARÁN POLYSYNTH.
// El nombre de esta constante es POLYSYNTH_INSTRUMENTS (con H).
const POLYSYNTH_INSTRUMENTS = {
  'Synth': () => new Tone.PolySynth(Tone.Synth).toDestination(),
  'AMSynth': () => new Tone.PolySynth(Tone.AMSynth).toDestination(),
  'FMSynth': () => new Tone.PolySynth(Tone.FMSynth).toDestination(),
};

// Definimos las escalas musicales
const SCALES = {
  'Mayor': ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"],
  'Menor': ["C4", "D4", "Eb4", "F4", "G4", "Ab4", "Bb4", "C5"],
  'Pentatónica': ["C4", "Eb4", "F4", "G4", "Bb4", "C5", "Eb5", "F5"],
  'Cromática': ["C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4"],
};

function App() {
  const [grid, setGrid] = useState(Array(ROWS).fill().map(() => Array(COLS).fill(null)));
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeInstrument, setActiveInstrument] = useState('Synth');
  const [activeScale, setActiveScale] = useState('Mayor');

  const synthsRef = useRef(null);
  const sequenceRef = useRef(null);
  const gridRef = useRef(grid);

  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  useEffect(() => {
    // Creamos las instancias de los PolySynth usando el nombre correcto de la constante
    synthsRef.current = {
      'Synth': POLYSYNTH_INSTRUMENTS['Synth'](),
      'AMSynth': POLYSYNTH_INSTRUMENTS['AMSynth'](), // CORREGIDO
      'FMSynth': POLYSYNTH_INSTRUMENTS['FMSynth'](), // CORREGIDO
    };

    sequenceRef.current = new Tone.Sequence((time, stepIndex) => {
      const currentGrid = gridRef.current;
      const currentScaleNotes = SCALES[activeScale];

      for (let row = 0; row < ROWS; row++) {
        const instrument = currentGrid[row][stepIndex];
        if (instrument) {
          const note = currentScaleNotes[row];

          if (instrument === 'PluckSynth') {
            const pluckSynth = new Tone.PluckSynth().toDestination();
            pluckSynth.triggerAttackRelease(note, "8n", time);
            pluckSynth.dispose(time + Tone.Time("8n").toSeconds());
          } else {
            synthsRef.current[instrument]?.triggerAttackRelease(note, "8n", time);
          }
        }
      }
    }, [...Array(COLS).keys()], "8n").start(0);

    if (Tone.Transport.state === "started") {
      Tone.Transport.stop();
      Tone.Transport.start();
    }

    return () => {
      sequenceRef.current?.dispose();
      Object.values(synthsRef.current ?? {}).forEach(synth => synth.dispose());
    };
  }, [activeScale]);

  const handleStartStop = async () => {
    // La advertencia sobre "AudioContext" se soluciona aquí, al hacer clic en el botón.
    await Tone.start();
    if (isPlaying) {
      Tone.Transport.stop();
      setIsPlaying(false);
    } else {
      Tone.Transport.start();
      setIsPlaying(true);
    }
  };

  const handleCellClick = (row, col) => {
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = newGrid[row][col] === activeInstrument ? null : activeInstrument;
    setGrid(newGrid);
  };

  return (
      <div className="app-container">
        <Card>
          <CardBody title="Secuenciador por Pasos" subtitle="con Tone.js y React" />

          <div className="controls-card">
            <div className="control-group">
              <label htmlFor="instrument-select">Instrumento:</label>
              <select
                  id="instrument-select"
                  value={activeInstrument}
                  onChange={(e) => setActiveInstrument(e.target.value)}
              >
                {INSTRUMENT_NAMES.map(name => (
                    <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="scale-select">Escala:</label>
              <select
                  id="scale-select"
                  value={activeScale}
                  onChange={(e) => setActiveScale(e.target.value)}
              >
                {Object.keys(SCALES).map(name => (
                    <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
          </div>

          <Grid grid={grid} onCellClick={handleCellClick} />

          <Boton onClick={handleStartStop} isLoading={false}>
            {isPlaying ? "Detener" : "Reproducir"}
          </Boton>
        </Card>
      </div>
  );
}

export default App;
