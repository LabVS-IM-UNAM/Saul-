// src/components/Grid.jsx

import React, { useState, useRef } from "react";

function Grid({ grid, onCellClick, style, currentStep }) {
  if (!Array.isArray(grid)) return null;

  const [isMouseDown, setIsMouseDown] = useState(false);
  const gridRef = useRef(null);

  const handleMouseDown = (rowIndex, colIndex) => {
    setIsMouseDown(true);
    onCellClick(rowIndex, colIndex);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseEnter = (rowIndex, colIndex) => {
    if (isMouseDown) {
      onCellClick(rowIndex, colIndex);
    }
  };

  return (
    <div 
      className="grid" 
      style={{...style, userSelect: 'none'}} 
      ref={gridRef}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
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
              onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
              onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
              title={instrument ? `Instrumento: ${instrument} (Gen: ${generation})` : "Celda vacía"}
            />
          );
        }),
      )}
    </div>
  );
}

export default Grid;
