// src/components/Grid.jsx

import React, { useState, useRef } from "react";

function Grid({ grid, onCellClick, style, currentStep }) {
  if (!Array.isArray(grid)) return null;

  const [isMouseDown, setIsMouseDown] = useState(false);
  const gridRef = useRef(null);
  const lastTouchedCellRef = useRef(null);

  const handleMouseDown = (rowIndex, colIndex) => {
    setIsMouseDown(true);
    onCellClick(rowIndex, colIndex);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    lastTouchedCellRef.current = null;
  };

  const handleMouseEnter = (rowIndex, colIndex) => {
    if (isMouseDown) {
      onCellClick(rowIndex, colIndex);
    }
  };

  const handleTouchStart = (rowIndex, colIndex) => {
    lastTouchedCellRef.current = `${rowIndex}-${colIndex}`;
    handleMouseDown(rowIndex, colIndex);
  };

  const handleTouchMove = (e) => {
    if (!isMouseDown) return;
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);

    if (element && element.classList.contains("grid-cell")) {
      const row = parseInt(element.getAttribute("data-row"), 10);
      const col = parseInt(element.getAttribute("data-col"), 10);
      const cellKey = `${row}-${col}`;

      if (cellKey !== lastTouchedCellRef.current) {
        lastTouchedCellRef.current = cellKey;
        onCellClick(row, col);
      }
    }
  };

  return (
    <div className="grid-scroll-container">
      <div
        className="grid"
        style={{...style, userSelect: 'none'}}
        ref={gridRef}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchEnd={handleMouseUp}
        onTouchCancel={handleMouseUp}
        onTouchMove={handleTouchMove}
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
                data-row={rowIndex}
                data-col={colIndex}
                onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                onTouchStart={() => handleTouchStart(rowIndex, colIndex)}
                title={instrument ? `Instrumento: ${instrument} (Gen: ${generation})` : "Celda vacía"}
              />
            );
          }),
        )}
      </div>
    </div>
  );
}

export default Grid;
