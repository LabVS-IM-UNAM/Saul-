import * as React from "react";
import { useState, useEffect } from "react";
import Card, { CardBody } from "./components/Card.jsx";
import List from "./components/List";
import Boton from "./components/Boton";

function App() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => setIsLoading(!isLoading);
  /*
  const handlerClick = () => {
    console.log("El estado anterior es:  ", isLoading);
    setIsLoading(!isLoading);
    console.log("Cambiando el estado de isLoading a ", !isLoading);
  };*/

  const list = ["Goku", "Tanjiro", "Eren"];
  const list_void = [];

  const handleSelect = (elemento) => {
    console.log("Impirimiendo ", elemento);
  };

  // Se encargara almacenar la logica de que es lo que se renderiza o no
  const contenido = list.length ? (
    <List data={list} onSelect={handleSelect} />
  ) : (
    "Sin elementos"
  );

  // Utilizas short circuit logical operators
  const contenido2 = list_void.length !== 0 && (
    <List data={list_void} onSelect={handleSelect} />
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Card>
        <CardBody title="Hola Mundo" subtitle="Subtitulo"></CardBody>
        {contenido}
        <Boton
          onClick={handleClick}
          isLoading={isLoading}
          children="Hola boton"
        ></Boton>
      </Card>
    </div>
  );
}

export default App;
