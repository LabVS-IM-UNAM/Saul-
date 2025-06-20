import { useState,useEffect,useRef } from 'react';
import * as Tone from "tone";
import './App.css';

// Componentes
import Grid from './components/Grid';
import Boton from './components/Boton';
import Card, {CardBody} from './components/Card.jsx';


function App() {
  const cols = 8;
  const rows = 4;
  const [grid,setGrid]=useState(Array(rows).fill().map(() => Array(cols).fill(0)));

  // =========== States ===========
  const [isPlaying,setIsPlaying] = useState(false);


  // =========== Referencias para sintetizador y secuenciador ===========
  //const synthRef = useRef(null);
  const synthsRef = useRef([]);
  const sequenceRef = useRef(null);

  // =========== Inicialización del sinte y secuenciador ===========
  // Creamos el sintetizador solo una vez, en el montaje del componente
  
  useEffect(() => {
    synthsRef.current = Array(rows).fill().map(() => new Tone.Synth({oscilator: {type:'square'},envelope:{attack: 0.01, decay: 0.1, sustain: 0.4, release: 0.61 }}).toDestination());

    sequenceRef.current = new Tone.Sequence((time, stepIndex) => {
      for (let row = 0; row < rows; row++) {
        if (grid[row][stepIndex] === 1) {
          // Cada fila con su nota e instrumento
          const note = ["C4", "E4", "G4","F4"][row]; // asigna notas diferentes
          synthsRef.current[row].triggerAttackRelease(note, "16n", time);
        }
      }
    }, [...Array(cols).keys()], "8n");
  }, [grid]);

 /* useEffect(() => {

    // Creación del sintetizador
    synthRef.current = new Tone.Synth({
      oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0.4, release: 0.61 },
    }).toDestination();        

    // Crea la secuencia de 0 a 7 pasos
    sequenceRef.current = new Tone.Sequence((time,stepIndex) => {

      // Toca la nota si la celda esta viva
      if (grid[0][stepIndex] === 1){
        synthRef.current.triggerAttackRelease("C4","16n",time);
      }
    },[...Array(cols).keys()],"8n");

    // Loop infinito
    sequenceRef.current.loop = true;

    return () => {
      sequenceRef.current.dispose();
      synthRef.current.dispose();
    };

 }, [grid]);*/

  // =========== Contol de inicio/stop ===========
  const handleStartStop = async () => { // uso de funcion asyn para esperar el sonido
    await Tone.start(); 
    if (isPlaying) {
      Tone.Transport.stop();
      setIsPlaying(false);
    } else {
      sequenceRef.current.start(0);
      Tone.Transport.start();
      setIsPlaying(true);
    }
  };

  return (
    <Card>
      <CardBody title="Prueba de secuenciador" subtitle="Sonidos con Tone.js" text = "Pulsa el boton para escuchar C4, E4, G4 en el secuenciador"></CardBody>
      <Grid grid={grid} setGrid={setGrid} />
    <Boton onClick={handleStartStop} isLoading={false} children="Hola Mundo">{isPlaying ? "Detener":"Reproducir"}</Boton>

    </Card>
  )
}

export default App;
