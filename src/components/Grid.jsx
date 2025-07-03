// src/components/Grid.jsx

import React from 'react';

// No es necesario importar CSS aquí si ya está importado en App.js o index.js

function Grid({ grid, onCellClick }) {
    // Verificamos que grid sea un array para evitar errores
    if (!Array.isArray(grid)) {
        return null; // No renderizar nada si el grid no está listo
    }

    return (
        <div className="grid">
            {grid.map((row, rowIndex) =>
                row.map((cellValue, colIndex) => (
                    <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`grid-cell ${cellValue ? 'active' : ''} instrument-${cellValue}`}
                        onClick={() => onCellClick(rowIndex, colIndex)}
                        // Añadimos un title para ver qué instrumento es al pasar el mouse
                        title={cellValue ? `Instrumento: ${cellValue}` : 'Celda vacía'}
                    />
                ))
            )}
        </div>
    );
}

export default Grid;
