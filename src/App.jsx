import { useState, useEffect, useRef } from "react";
import * as Tone from "tone";
import "./App.css";

// Componentes
import Grid from "./components/Grid";
import Boton from "./components/Boton";
import Card, { CardBody } from "./components/Card.jsx";

// --- Constantes de Configuración ---
const INSTRUMENT_NAMES = ["Synth", "AMSynth", "FMSynth"];

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

// --- Funciones Auxiliares ---

// Función para crear un grid vacío con dimensiones dinámicas
const createEmptyGrid = (rows, cols) =>
  Array(rows)
    .fill()
    .map(() => Array(cols).fill(null));

// Función para contar vecinos con topología toroidal (sin fronteras)
const countNeighbors = (grid, x, y, rows, cols) => {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;

      const row = (x + i + rows) % rows;
      const col = (y + j + cols) % cols;

      if (grid[row] && grid[row][col] !== null) {
        count++;
      }
    }
  }
  return count;
};

// Función para calcular la siguiente generación del Juego de la Vida
const nextGeneration = (grid, rows, cols) => {
  const newGrid = createEmptyGrid(rows, cols);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const neighbors = countNeighbors(grid, row, col, rows, cols);
      const currentInstrument = grid[row][col];
      const isAlive = currentInstrument !== null;

      if (isAlive && (neighbors === 2 || neighbors === 3)) {
        newGrid[row][col] = currentInstrument;
      } else if (!isAlive && neighbors === 3) {
        const randomInstrument =
          INSTRUMENT_NAMES[Math.floor(Math.random() * INSTRUMENT_NAMES.length)];
        newGrid[row][col] = randomInstrument;
      }
    }
  }

  return newGrid;
};

// Función para generar una escala extendida a través de múltiples octavas
const generateScaleNotes = (baseScale, totalRows) => {
  const extendedScale = [];
  const baseLength = baseScale.length;
  if (baseLength === 0) return [];

  for (let i = 0; i < totalRows; i++) {
    const baseNote = baseScale[i % baseLength];
    const octaveOffset = Math.floor(i / baseLength);

    // Separa el nombre de la nota de la octava
    const noteParts = baseNote.match(/([A-Ga-g]#?b?)([0-9]+)/);
    if (noteParts) {
      const noteName = noteParts[1];
      const baseOctave = parseInt(noteParts[2], 10);
      const newOctave = baseOctave + octaveOffset;
      extendedScale.push(`${noteName}${newOctave}`);
    } else {
      extendedScale.push(baseNote); // Fallback si no tiene octava
    }
  }
  return extendedScale;
};

function App() {
  // Estado para dimensiones del grid
  const [numRows, setNumRows] = useState(8);
  const [numCols, setNumCols] = useState(16);

  const [grid, setGrid] = useState(() => createEmptyGrid(numRows, numCols));
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeInstrument, setActiveInstrument] = useState("Synth");
  const [activeScale, setActiveScale] = useState("Mayor");
  const [bpm, setBpm] = useState(120);

  const [currentStep, setCurrentStep] = useState(0);

  const synthsRef = useRef(null);
  const sequenceRef = useRef(null);
  const gridRef = useRef(grid);

  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  // Efecto para reiniciar el grid cuando las dimensiones cambian
  useEffect(() => {
    setGrid(createEmptyGrid(numRows, numCols));
  }, [numRows, numCols]);

  // Efecto principal para configurar y controlar Tone.js
  useEffect(() => {
    synthsRef.current = {
      Synth: POLYSYNTH_INSTRUMENTS["Synth"](),
      AMSynth: POLYSYNTH_INSTRUMENTS["AMSynth"](),
      FMSynth: POLYSYNTH_INSTRUMENTS["FMSynth"](),
    };

    const currentScaleNotes = generateScaleNotes(SCALES[activeScale], numRows);

    sequenceRef.current = new Tone.Sequence(
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
            synthsRef.current[instrument]?.triggerAttackRelease(
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

    if (Tone.Transport.state === "started") {
      Tone.Transport.stop();
      Tone.Transport.start();
    }

    return () => {
      sequenceRef.current?.dispose();
      Object.values(synthsRef.current ?? {}).forEach((synth) =>
        synth.dispose(),
      );
    };
  }, [activeScale, numRows, numCols]); // <- Dependencias actualizadas

  const handleStartStop = async () => {
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
    const newGrid = grid.map((r) => [...r]);
    newGrid[row][col] =
      newGrid[row][col] === activeInstrument ? null : activeInstrument;
    setGrid(newGrid);
  };

  const clearGrid = () => {
    setGrid(createEmptyGrid(numRows, numCols));
  };

  const randomizeGrid = () => {
    const newGrid = createEmptyGrid(numRows, numCols);
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        if (Math.random() > 0.7) {
          const randomInstrument =
            INSTRUMENT_NAMES[
              Math.floor(Math.random() * INSTRUMENT_NAMES.length)
            ];
          newGrid[row][col] = randomInstrument;
        }
      }
    }
    setGrid(newGrid);
  };

  const handleDimensionChange = (setter) => (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setter(value);
    }
  };
  const gridStyles = {
    gridTemplateColumns: `repeat(${numCols}, 1fr)`,
    gap: "2px", // También podemos mover 'gap' aquí si queremos que sea dinámico
  };
  return (
    <div className="app-container">
      <Card>
        <CardBody
          title="Juego de la Vida Musical"
          subtitle="Secuenciador generativo con Tone.js"
        />

        {/* Panel superior con controles principales */}
        <div className="top-controls">
          <div className="control-group">
            <label>Instrumento</label>
            <select
              value={activeInstrument}
              onChange={(e) => setActiveInstrument(e.target.value)}
            >
              {INSTRUMENT_NAMES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label>Escala</label>
            <select
              value={activeScale}
              onChange={(e) => setActiveScale(e.target.value)}
            >
              {Object.keys(SCALES).map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group bpm-slider">
            <label>Velocidad: {bpm} BPM</label>
            <input
              type="range"
              min="40"
              max="240"
              value={bpm}
              onChange={(e) => setBpm(parseInt(e.target.value, 10))}
            />
          </div>

          <div className="play-buttons">
            <Boton onClick={handleStartStop} isLoading={false}>
              {isPlaying ? "⏸ Detener" : "▶ Reproducir"}
            </Boton>
          </div>
        </div>

        {/* Panel secundario */}
        <div className="secondary-controls">
          <div className="control-group">
            <label>Filas</label>
            <input
              type="number"
              value={numRows}
              min="1"
              onChange={handleDimensionChange(setNumRows)}
            />
          </div>
          <div className="control-group">
            <label>Columnas</label>
            <input
              type="number"
              value={numCols}
              min="1"
              onChange={handleDimensionChange(setNumCols)}
            />
          </div>
          <Boton onClick={clearGrid}>Limpiar</Boton>
          <Boton onClick={randomizeGrid}>Aleatorio</Boton>
        </div>

        {/* Grid */}
        <div className="grid-container">
          <Grid
            grid={grid}
            onCellClick={handleCellClick}
            style={gridStyles}
            currentStep={currentStep} // nuevo
          />
        </div>
      </Card>
    </div>
  );
}

export default App;
