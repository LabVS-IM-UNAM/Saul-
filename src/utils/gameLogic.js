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

      if (grid[row] && grid[row][col] !== null) {
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
      const currentInstrument = grid[row][col];
      const isAlive = currentInstrument !== null;

      if (isAlive && (neighbors === 2 || neighbors === 3)) {
        newGrid[row][col] = currentInstrument;
      } else if (!isAlive && neighbors === 3) {
        let randomInstrument;
        randomInstrument = INSTRUMENT_NAMES[Math.floor(Math.random() * INSTRUMENT_NAMES.length)];
        newGrid[row][col] = randomInstrument;
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
        let randomInstrument;
        randomInstrument = INSTRUMENT_NAMES[
            Math.floor(Math.random() * INSTRUMENT_NAMES.length)
            ];
        newGrid[row][col] = randomInstrument;
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