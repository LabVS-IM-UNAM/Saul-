import React from 'react';

function Grid(props) {
    const { rows, cols, gridState, onCellClick } = props
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 'auto'
    }}>
      {gridState.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex' }}>
          {row.map((isAlive, colIndex) => (
            <div 
              key={colIndex}
              onClick={() => onCellClick(rowIndex, colIndex)}
              style={{
                width: '32px',
                height: '32px',
                border: '1px solid black',
                backgroundColor: isAlive ? 'black' : 'white'
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Grid;