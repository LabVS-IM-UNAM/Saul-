import React from 'react';
import Cell from './Cell';

export default function Grid({grid,setGrid}){
    return (
        <div style={{display:'grid',gridTemplateColumns:`repeat(${grid[0].length}, 20px)`}}>
            {grid.map((row,i) =>
                row.map((cell,j) => (
                    <Cell
                        key={`${i}-${j}`}
                        alive={cell}
                        onClick = {() => {
                            const newGrid = grid.map(arr => [...arr]);
                            newGrid[i][j] = grid[i][j] ? 0 : 1;
                            setGrid(newGrid);
                        }}
                    />
                ))
            )}
        </div>
    );
}
