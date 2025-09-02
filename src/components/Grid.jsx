// src/components/Grid.jsx

import React from "react";

function Grid({ grid, onCellClick, style, currentStep }) {
  if (!Array.isArray(grid)) return null;

  return (
    <div className="grid" style={style}>
      {grid.map((row, rowIndex) =>
        row.map((cellValue, colIndex) => {
          const isActiveStep = colIndex === currentStep;
          // Extraer el instrumento del objeto o usar el valor directo para compatibilidad
          const instrument = cellValue?.instrument || cellValue;
          const generation = cellValue?.generation || 0;
          
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`grid-cell 
                ${cellValue ? "active" : ""} 
                instrument-${instrument || "none"} 
                ${isActiveStep ? "active-step" : ""}`}
              onClick={() => onCellClick(rowIndex, colIndex)}
              title={instrument ? `Instrumento: ${instrument} (Gen: ${generation})` : "Celda vacía"}
            />
          );
        }),
      )}
    </div>
  );
}

export default Grid;
