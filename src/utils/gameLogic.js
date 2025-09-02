const INSTRUMENT_NAMES = ["Synth", "AMSynth", "FMSynth"];

const createEmptyGrid = (rows, cols) =>
  Array(rows)
    .fill()
    .map(() => Array(cols).fill(null));

const countNeighbors = (grid, x, y, rows, cols) => {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;

      const row = (x + i + rows) % rows;
      const col = (y + j + cols) % cols;

      const cell = grid[row] && grid[row][col];
      if (cell !== null && cell !== undefined) {
        count++;
      }
    }
  }
  return count;
};

const nextGeneration = (grid, rows, cols) => {
  const newGrid = createEmptyGrid(rows, cols);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const neighbors = countNeighbors(grid, row, col, rows, cols);
      const currentCell = grid[row][col];
      const isAlive = currentCell !== null && currentCell !== undefined;

      if (isAlive && (neighbors === 2 || neighbors === 3)) {
        // Célula sobrevive, incrementa su generación
        const cellData = typeof currentCell === 'object' ? currentCell : { generation: 0 };
        const nextGen = cellData.generation + 1;
        
        // Asigna instrumento según generaciones vividas
        let instrument;
        if (nextGen === 1) {
          instrument = "Synth"; // Azul - primera generación
        } else if (nextGen === 2) {
          instrument = "AMSynth"; // Segunda generación
        } else {
          instrument = "FMSynth"; // Naranja - más de dos generaciones
        }
        
        newGrid[row][col] = {
          instrument: instrument,
          generation: nextGen
        };
      } else if (!isAlive && neighbors === 3) {
        // Nueva célula nace con Synth (azul)
        newGrid[row][col] = {
          instrument: "Synth",
          generation: 0
        };
      }
    }
  }

  return newGrid;
};

const randomizeGrid = (rows, cols) => {
  const newGrid = createEmptyGrid(rows, cols);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (Math.random() > 0.7) {
        // Todas las células nuevas empiezan con Synth (azul) y generación 0
        newGrid[row][col] = {
          instrument: "Synth",
          generation: 0
        };
      }
    }
  }
  return newGrid;
};

export {
  INSTRUMENT_NAMES,
  createEmptyGrid,
  countNeighbors,
  nextGeneration,
  randomizeGrid
};