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
  const list_void = [];
  
  return (
    <div style = {{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <Card>
        {'' && 'string vacio'}
        {undefined && 'indefinido'}
        {null && 'nulo'}
        {false && 'falso'}

        {/* manera incorrecta */}
        {list_void && 'lista vacia'}

        {/* manera CORRECTA */}
        {list_void.length !== 0 && 'mi lista'}

        <CardBody title="Hola Mundo" subtitle="Subtitulo"></CardBody>
        <List data={list} onSelect={handleSelect}/>
      </Card>
      
    </div>
  );
}

export default App;