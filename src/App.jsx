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

const INSTRUMENT_NAMES = ['Synth', 'AMSynth', 'FMSynth', 'Oscilador'];

const POLYSYNTH_INSTRUMENTS = {
  'Synth': () => new Tone.PolySynth(Tone.Synth).toDestination(),
  'AMSynth': () => new Tone.PolySynth(Tone.AMSynth).toDestination(),
  'FMSynth': () => new Tone.PolySynth(Tone.FMSynth).toDestination(),
};

const SCALES = {
  'Mayor': ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"],
  'Menor': ["C4", "D4", "Eb4", "F4", "G4", "Ab4", "Bb4", "C5"],
  'Pentatónica': ["C4", "Eb4", "F4", "G4", "Bb4", "C5", "Eb5", "F5"],
  'Cromática': ["C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4"],
};

// Función para crear un grid vacío
const createEmptyGrid = () => Array(ROWS).fill().map(() => Array(COLS).fill(null));

// Función para contar vecinos con topología toroidal (sin fronteras)
// Las células vivas son aquellas que tienen un instrumento asignado (no null)
const countNeighbors = (grid, x, y) => {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      
      // Calcular coordenadas con wrapping (topología toroidal)
      const row = (x + i + ROWS) % ROWS;
      const col = (y + j + COLS) % COLS;
      
      // Célula está viva si tiene un instrumento asignado
      if (grid[row][col] !== null) count++;
    }
  }
  return count;
};

// Función para calcular la siguiente generación del Juego de la Vida
// Mantiene los instrumentos asignados pero aplica las reglas de vida/muerte
const nextGeneration = (grid) => {
  const newGrid = createEmptyGrid();
  
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const neighbors = countNeighbors(grid, row, col);
      const currentInstrument = grid[row][col];
      const isAlive = currentInstrument !== null;
      
      // Reglas del Juego de la Vida
      if (isAlive && (neighbors === 2 || neighbors === 3)) {
        // Célula viva se mantiene viva con el mismo instrumento
        newGrid[row][col] = currentInstrument;
      } else if (!isAlive && neighbors === 3) {
        // Célula muerta nace con un instrumento aleatorio
        const randomInstrument = INSTRUMENT_NAMES[Math.floor(Math.random() * INSTRUMENT_NAMES.length)];
        newGrid[row][col] = randomInstrument;
      }
      // En cualquier otro caso, la célula muere (se queda null)
    }
  }
  
  return newGrid;
};

function App() {
  // Grid único que combina instrumentos y células vivas del Juego de la Vida
  const [grid, setGrid] = useState(createEmptyGrid());
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
    synthsRef.current = {
      'Synth': POLYSYNTH_INSTRUMENTS['Synth'](),
      'AMSynth': POLYSYNTH_INSTRUMENTS['AMSynth'](),
      'FMSynth': POLYSYNTH_INSTRUMENTS['FMSynth'](),
    };

    sequenceRef.current = new Tone.Sequence((time, stepIndex) => {
      // Actualizar el Juego de la Vida en cada paso del secuenciador
      if (stepIndex === 0) { // Solo actualizar al inicio de cada ciclo completo
        setGrid(currentGrid => nextGeneration(currentGrid));
      }

      const currentGrid = gridRef.current;
      const currentScaleNotes = SCALES[activeScale];

      for (let row = 0; row < ROWS; row++) {
        // Solo reproducir sonido si hay un instrumento asignado (célula viva)
        const instrument = currentGrid[row][stepIndex];
        
        if (instrument && instrument !== 'Oscilador') {
          const note = currentScaleNotes[row];
          synthsRef.current[instrument]?.triggerAttackRelease(note, "8n", time);
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
    // Click para asignar/quitar instrumento (y por tanto célula viva/muerta)
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = newGrid[row][col] === activeInstrument ? null : activeInstrument;
    setGrid(newGrid);
  };

  const clearGrid = () => {
    setGrid(createEmptyGrid());
  };

  const randomizeGrid = () => {
    const newGrid = createEmptyGrid();
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (Math.random() > 0.7) {
          const randomInstrument = INSTRUMENT_NAMES[Math.floor(Math.random() * INSTRUMENT_NAMES.length)];
          newGrid[row][col] = randomInstrument;
        }
      }
    }
    setGrid(newGrid);
  };

  return (
      <div className="app-container">
        <Card>
          <CardBody title="Juego de la Vida" subtitle="Sintetizador + el juego de la vida" />

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

          <div style={{ marginBottom: '20px' }}>
            <h3>Juego de la Vida</h3>
            <p style={{ fontSize: '14px', color: '#666' }}>
              Click para asignar instrumentos. Las células con instrumentos están "vivas" y evolucionan según las reglas del Juego de la Vida.
            </p>
            <Grid grid={grid} onCellClick={handleCellClick} />
          </div>

          <div className="controls-card">
            <Boton onClick={clearGrid} isLoading={false}>
              Limpiar
            </Boton>
            <Boton onClick={randomizeGrid} isLoading={false}>
              Aleatorio
            </Boton>
            <Boton onClick={handleStartStop} isLoading={false}>
              {isPlaying ? "Detener" : "Reproducir"}
            </Boton>
          </div>
        </Card>
      </div>
  );
}

export default App;
