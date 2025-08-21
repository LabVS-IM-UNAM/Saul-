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
        <div className="flex gap-4">
            <div className="w-4/5">
                <Grid grid={grid} setGrid={setGrid} />
            </div>
            <div className="w-1/5 flex flex-col gap-2 p-4 bg-gray-50 rounded-lg">
                <button 
                    onClick={() => {
                        runningRef.current = !runningRef.current;
                        if (runningRef.current) runSimulation();
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    {runningRef.current ? 'Stop' : 'Start'}
                </button>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Speed (ms)</label>
                    <input 
                        type="range" 
                        min="50" 
                        max="1000" 
                        value={intervalMs}
                        onChange={(e) => setIntervalMs(Number(e.target.value))}
                        className="w-full"
                    />
                    <span className="text-xs text-gray-600">{intervalMs}ms</span>
                </div>
                <button 
                    onClick={() => setGrid(generateEmptyGrid(rows, cols))}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Clear
                </button>
                <button 
                    onClick={() => setGrid(grid => grid.map(row => 
                        row.map(() => Math.random() > 0.7 ? 1 : 0)
                    ))}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Random
                </button>
            </div>
        </div>
    );
}
