// src/components/Grid.jsx

import React, { useRef } from "react";

function Grid({ grid, onCellClick, style, currentStep }) {
  const isPointerDownRef = useRef(false);

  if (!Array.isArray(grid)) return null;

  const handlePointerDown = (e, rowIndex, colIndex) => {
    isPointerDownRef.current = true;
    onCellClick(rowIndex, colIndex);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handlePointerEnter = (rowIndex, colIndex) => {
    if (isPointerDownRef.current) {
      onCellClick(rowIndex, colIndex);
    }
  };

  const endPointerInteraction = () => {
    isPointerDownRef.current = false;
  };

  return (
    <div className="grid-scroll-container">
      <div
        className="grid"
        style={{ ...style, userSelect: "none" }}
        onPointerUp={endPointerInteraction}
        onPointerCancel={endPointerInteraction}
        onPointerLeave={endPointerInteraction}
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
                onPointerDown={(e) => handlePointerDown(e, rowIndex, colIndex)}
                onPointerEnter={() => handlePointerEnter(rowIndex, colIndex)}
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
