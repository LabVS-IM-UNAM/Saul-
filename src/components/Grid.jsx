// src/components/Grid.jsx

import React from 'react';

// El componente ahora acepta una tercera prop: 'style'
function Grid({ grid, onCellClick, style }) {
    if (!Array.isArray(grid)) {
        return null;
    }

    return (
        // La prop 'style' se aplica directamente a este div.
        // Esto permite que el número de columnas se controle desde App.js
        <div className="grid" style={style}>
            {grid.map((row, rowIndex) =>
                row.map((cellValue, colIndex) => (
                    <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`grid-cell ${cellValue ? 'active' : ''} instrument-${cellValue}`}
                        onClick={() => onCellClick(rowIndex, colIndex)}
                        title={cellValue ? `Instrumento: ${cellValue}` : 'Celda vacía'}
                    />
                ))
            )}
        </div>
    );
}

export default Grid;
