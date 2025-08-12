// src/components/Grid.jsx

import React from "react";

function Grid({ grid, onCellClick, style, currentStep }) {
  if (!Array.isArray(grid)) return null;

  return (
    <div className="grid" style={style}>
      {grid.map((row, rowIndex) =>
        row.map((cellValue, colIndex) => {
          const isActiveStep = colIndex === currentStep;
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`grid-cell 
                ${cellValue ? "active" : ""} 
                instrument-${cellValue || "none"} 
                ${isActiveStep ? "active-step" : ""}`}
              onClick={() => onCellClick(rowIndex, colIndex)}
              title={cellValue ? `Instrumento: ${cellValue}` : "Celda vacía"}
            />
          );
        }),
      )}
    </div>
  );
}

export default Grid;
