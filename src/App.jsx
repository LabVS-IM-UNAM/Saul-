import * as React from "react";
import { useState, useEffect } from "react";
import Card, { CardBody } from "./components/Card.jsx";
import List from "./components/List";
import Boton from "./components/Boton";

function App() {
  //const list = ["Goku", "Tanjiro", "Eren"];
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState(["Goku", "Tanjiro", "Eren"]);

  const handleClick = () => setIsLoading(!isLoading);

  //add and pop
  const handleAdd = () => {
    setList((prevList) => [...prevList, `Minion ${prevList.length + 1}`]);
  };

  const handlePop = () => {
    setList((prevList) => prevList.slice(0, -1));
  };

  const handleSelect = (elemento) => {
    console.log("Impirimiendo ", elemento);
  };

  // Se encargara almacenar la logica de que es lo que se renderiza o no
  const contenido = list.length ? (
    <List data={list} onSelect={handleSelect} />
  ) : (
    "Sin elementos"
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
        <Boton onClick={handleAdd} children="Agregar"></Boton>
        <Boton
          onClick={handlePop}
          isLoading={list.length === 0}
          children="Pop"
        ></Boton>
        {contenido}
      </Card>
    </div>
  );
}

export default App;
