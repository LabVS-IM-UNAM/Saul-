import * as React from 'react';
import { useState, useEffect } from 'react';
import Card, { CardBody } from "./components/Card.jsx";
import List from './components/List';
import Grid from './components/Grid';

function App() {
  const handleSelect = elemento => {
    console.log("Impirimiendo ", elemento);
  }
  
  const list = ['Goku', 'Tanjiro', 'Eren'];
  const list_void = [];

  // Se encargara almacenar la logica de que es lo que se renderiza o no 
  const contenido = list.length ?(<List data={list} onSelect={handleSelect}/> ):('Sin elementos');

  // Utilizas short circuit logical operators 
  const contenido2 = list_void.length !== 0 && (<List data={list_void} onSelect={handleSelect}/>);
        
  return (
    <div style = {{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <Card>
        <CardBody title="Hola Mundo" subtitle="Subtitulo"></CardBody>
        {contenido}
      </Card>
      
    </div>
  );
}

export default App;