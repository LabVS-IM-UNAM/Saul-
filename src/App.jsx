import * as React from 'react';
import { useState, useEffect } from 'react';
import Card, { CardBody } from "./components/Card.jsx";
import List from './components/List';
import Grid from './components/Grid';

function App() {
  const handleSelect = (elemento) => {
    console.log("Impirimiendo ", elemento);
  }
  
  const list = ['Goku', 'Tanjiro', 'Eren'];
  
  // Configuración para el Juego de la Vida
  const rows = 15;
  const cols = 15;
  
  // Estado del grid (inicialmente todas las celdas están muertas)
  const [gridState, setGridState] = useState(
    Array(rows).fill().map(() => Array(cols).fill(false))
  );
  
  // Función para cambiar el estado de una celda cuando se hace clic en ella
  const handleCellClick = (row, col) => {
    const newGridState = [...gridState];
    newGridState[row][col] = !newGridState[row][col]; // Cambiar estado (viva/muerta)
    setGridState(newGridState);
  };
  
  return (
    <div style = {{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px'
    }}>
      {/*
      <Card>
        <CardBody title="Hola" text="Hola Mundo"/>
        <List data={list} onSelect={handleSelect}/>
      </Card>
      */}
      
      <Card>
        <CardBody
            title="Juego de la Vida"
            subtitle="de Jhon Conway"
            text="Haz clic en las celdas para cambiar su estado"
        />
        <Grid
          rows={rows} 
          cols={cols} 
          gridState={gridState} 
          onCellClick={handleCellClick}
        />
      </Card>
    </div>
  );
}

export default App;