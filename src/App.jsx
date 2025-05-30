import * as React from 'react';
//import Card from './components/Card';
import Card, {CardBody} from "./components/Card.jsx";
import  List from './components/List';


function App() {
    const handleSelect = (elemento) => {
        console.log("Impirimiendo ", elemento);
    }
    const list = ['Goku','Tanjiro','Eren']
    return (
        <Card>
            <CardBody title="Hola" text="Hola Mundo"/>
            <List data={list} onSelect={handleSelect}/>
        </Card>
    )
}

export default App;