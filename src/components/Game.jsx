import React, { useState, useEffect, useRef } from 'react';
import Grid from './Grid';
import { generateEmptyGrid, computeNextGeneration } from '../utils/gameLogic';

export default function Game({ rows, cols }) {
    const [grid, setGrid] = useState(() => generateEmptyGrid(rows, cols));
    const runningRef = useRef(false);
    const [intervalMs, setIntervalMs] = useState(200);

    const runSimulation = () => {
        if (!runningRef.current) return;
        setGrid(g => computeNextGeneration(g, rows, cols));
        setTimeout(runSimulation, intervalMs);
    };

    return (
        <div>
            <button onClick={() => {
                runningRef.current = !runningRef.current;
                if (runningRef.current) runSimulation();
            }}>
                {runningRef.current ? 'Stop' : 'Start'}
            </button>
            <Grid grid={grid} setGrid={setGrid} />
        </div>
    );
}
