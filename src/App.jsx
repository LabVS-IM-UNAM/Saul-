import React, { useState, useEffect, useCallback, useRef } from 'react';
import Card, { CardBody } from "./components/Card.jsx";
import Boton from './components/Boton.jsx';
import Grid from './components/Grid.jsx';

function App() {
  // Configuración del grid
  const rows = 15;
  const cols = 30;

  // Estado del grid (inicialmente todas las celdas muertas)
  const [gridState, setGridState] = useState(
    Array(rows).fill().map(() => Array(cols).fill(false))
  );

  // Estado de ejecución (corriendo o pausado)
  const [isRunning, setIsRunning] = useState(false);
  const runningRef = useRef(isRunning);
  runningRef.current = isRunning;

  // Función para alternar el estado de una celda al hacer clic
  const handleCellClick = (row, col) => {
    const newGrid = gridState.map(arr => [...arr]);
    newGrid[row][col] = !newGrid[row][col];
    setGridState(newGrid);
  };

  // Función para rellenar el grid aleatoriamente
  const handleRandom = () => {
    const randomGrid = Array(rows).fill().map(() =>
      Array(cols).fill().map(() => Math.random() > 0.7)
    );
    setGridState(randomGrid);
  };

  // Función para calcular la siguiente generación
  const computeNextGrid = useCallback(() => {
    setGridState(g =>
      g.map((rowArr, i) =>
        rowArr.map((cell, j) => {
          let neighbors = 0;
          for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
              if (x === 0 && y === 0) continue;
              const ni = i + x;
              const nj = j + y;
              if (ni >= 0 && ni < rows && nj >= 0 && nj < cols) {
                if (g[ni][nj]) neighbors++;
              }
            }
          }
          // Reglas del Juego de la Vida
          if (cell && (neighbors === 2 || neighbors === 3)) return true;
          if (!cell && neighbors === 3) return true;
          return false;
        })
      )
    );
  }, [rows, cols]);

  // Efecto para ejecutar la simulación cuando isRunning sea true
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      computeNextGrid();
      if (!runningRef.current) {
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [isRunning, computeNextGrid]);

  // Manejador de inicio/pausa
  const handleStartPause = () => {
    setIsRunning(r => !r);
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <Card>
        <CardBody
          title="Juego de la Vida"
          subtitle="de John Conway"
          text="Haz clic en las celdas para cambiar su estado"
        />

        <Grid
          rows={rows}
          cols={cols}
          gridState={gridState}
          onCellClick={handleCellClick}
        />

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '15px' }}>
          <Boton
            text={isRunning ? 'Pausa' : 'Iniciar'}
            color={isRunning ? 'danger' : 'success'}
            onClick={handleStartPause}
          />
          <Boton
            text="Aleatorio"
            color="primary"
            onClick={handleRandom}
            disabled={isRunning}
          />
        </div>
      </Card>
    </div>
  );
}

export default App;
