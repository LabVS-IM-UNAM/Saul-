import { useState, useEffect, useRef } from "react";
import React from 'react';
import "./App.css";

import {Container, Card, Row, Col, Stack, Button, Collapse} from 'react-bootstrap';

// Componentes
import Grid from "./components/Grid";
import PlaybackControls from "./components/PlaybackControls";
import MobileTransportBar from "./components/MobileTransportBar";
import GridConfiguration from "./components/GridConfiguration";
import TutorialBanner from "./components/TutorialBanner";

// Utils
import {
  createEmptyGrid,
  nextGeneration,
  randomizeGrid,
  MIN_ROWS,
  MAX_ROWS,
  MIN_COLS,
  MAX_COLS,
} from "./utils/gameLogic";
import { AudioEngine } from "./utils/audioEngine";
import { downloadBlob } from "./utils/download";

function App() {
  const [numRows, setNumRows] = useState(8);
  const [numCols, setNumCols] = useState(16);
  const [grid, setGrid] = useState(() => createEmptyGrid(numRows, numCols));
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeInstrument, setActiveInstrument] = useState("Synth");
  const [activeScale, setActiveScale] = useState("Mayor");
  const [bpm, setBpm] = useState(120);
  const [currentStep, setCurrentStep] = useState(0);
  const [savedState, setSavedState] = useState(null);
  const [showTutorial, setShowTutorial] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [showMobileConfig, setShowMobileConfig] = useState(false);

  const audioEngineRef = useRef(new AudioEngine());
  const gridRef = useRef(grid);
  const isLoopingRef = useRef(isLooping);
  const hasCompletedFirstLoopRef = useRef(false);

  useEffect(() => {
    isLoopingRef.current = isLooping;
  }, [isLooping]);

  useEffect(() => {
    audioEngineRef.current.setBPM(bpm);
  }, [bpm]);

  useEffect(() => {
    document.body.classList.toggle("scroll-locked", isPlaying);
    return () => document.body.classList.remove("scroll-locked");
  }, [isPlaying]);

  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  useEffect(() => {
    setGrid(createEmptyGrid(numRows, numCols));
  }, [numRows, numCols]);

  useEffect(() => {
    const handleStep = (stepIndex) => {
      setCurrentStep(stepIndex);

      // Solo evolucionar cuando completamos un ciclo completo (llegamos al paso 0 después de haber pasado por todos los pasos)
      if (stepIndex === 0 && hasCompletedFirstLoopRef.current && !isLoopingRef.current) {
        setGrid((currentGrid) => nextGeneration(currentGrid, numRows, numCols));
      }

      // Marcar que completamos el primer ciclo cuando llegamos al último paso
      if (stepIndex === numCols - 1) {
        hasCompletedFirstLoopRef.current = true;
      }
    };

    audioEngineRef.current.createSequence(
      activeScale,
      numRows,
      numCols,
      () => gridRef.current,
      handleStep,
    );

    return () => {
      audioEngineRef.current.dispose();
    };
  }, [activeScale, numRows, numCols]);

  const handleStartStop = async () => {
    if (isPlaying) {
      audioEngineRef.current.stop();
      setIsPlaying(false);
    } else {
      await audioEngineRef.current.start();
      setIsPlaying(true);
    }
  };

  const handleRecordToggle = async () => {
    if (isRecording) {
      const blob = await audioEngineRef.current.stopRecording();
      setIsRecording(false);

      if (blob) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const filename = `juego-vida-${timestamp}.webm`;
        downloadBlob(blob, filename);
      }
    } else {
      await audioEngineRef.current.startRecording();
      setIsRecording(true);
    }
  };

  const handleCellClick = (row, col) => {
    const newGrid = grid.map((r) => [...r]);
    const currentCell = newGrid[row][col];
    
    if (currentCell === null || currentCell === undefined) {
      // Si la célula está vacía, crea una nueva con el instrumento activo
      newGrid[row][col] = {
        instrument: activeInstrument,
        generation: 0
      };
    } else {
      // Si la célula está ocupada, la limpia
      newGrid[row][col] = null;
    }
    
    setGrid(newGrid);
  };

  const clearGrid = () => {
    setGrid(createEmptyGrid(numRows, numCols));
    setSavedState(null);
    audioEngineRef.current.resetPosition();
    hasCompletedFirstLoopRef.current = false;
    setCurrentStep(0);
  };

  const handleRandomizeGrid = () => {
    setGrid(randomizeGrid(numRows, numCols));
    audioEngineRef.current.resetPosition();
    hasCompletedFirstLoopRef.current = false;
    setCurrentStep(0);
  };

  const handleSaveInitialState = () => {
    setSavedState({
      grid: grid.map(row => [...row]),
      numRows,
      numCols,
      activeInstrument,
      activeScale,
      bpm
    });
  };

  const handleRestoreSavedState = () => {
    if (savedState) {
      setGrid(savedState.grid.map(row => [...row]));
      setNumRows(savedState.numRows);
      setNumCols(savedState.numCols);
      setActiveInstrument(savedState.activeInstrument);
      setActiveScale(savedState.activeScale);
      setBpm(savedState.bpm);
      audioEngineRef.current.resetPosition();
      hasCompletedFirstLoopRef.current = false;
      setCurrentStep(0);
    }
  };

  const clampDimension = (value, min, max) => Math.min(Math.max(value, min), max);

  const handleRowsCommit = (value) => {
    setNumRows(clampDimension(value, MIN_ROWS, MAX_ROWS));
  };

  const handleColsCommit = (value) => {
    setNumCols(clampDimension(value, MIN_COLS, MAX_COLS));
  };

  const gridStyles = {
    gridTemplateColumns: `repeat(${numCols}, var(--cell-size))`,
    gridTemplateRows: `repeat(${numRows}, var(--cell-size))`,
    gap: "2px",
  };

  return (
    <>
      <div className="rotate-overlay">
        <span>🔄</span>
        <p>Gira tu dispositivo para jugar</p>
      </div>
    <Container fluid className="my-4 app-shell">
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <Card.Title as="h1">Juego de la Vida Musical</Card.Title>
              <Card.Subtitle className="text-muted">
                Basado en un secuenciador de sonidos
              </Card.Subtitle>
            </div>
            <Button 
              variant="outline-info" 
              size="sm" 
              onClick={() => setShowTutorial(true)}
              className="tutorial-btn"
            >
              Tutorial
            </Button>
          </div>

          <Row className="g-3 grid-area-row">
            <Col lg={9} className="grid-area-col">
              <div className="mb-3 grid-area-wrapper">
                <Grid
                  grid={grid}
                  onCellClick={handleCellClick}
                  style={gridStyles}
                  currentStep={currentStep}
                />
              </div>
            </Col>

            <Col lg={3} className="d-none d-lg-block">
              <div className="h-100">
                <h5 className="mb-3">Controles</h5>
                <Stack gap={3}>
                  <PlaybackControls
                    isPlaying={isPlaying}
                    onStartStop={handleStartStop}
                    isRecording={isRecording}
                    onRecordToggle={handleRecordToggle}
                    isLooping={isLooping}
                    onLoopToggle={() => setIsLooping((v) => !v)}
                    bpm={bpm}
                    onBpmChange={(e) => setBpm(parseInt(e.target.value, 10))}
                    activeInstrument={activeInstrument}
                    onInstrumentChange={(e) => setActiveInstrument(e.target.value)}
                    activeScale={activeScale}
                    onScaleChange={(e) => setActiveScale(e.target.value)}
                  />

                  <GridConfiguration
                    numRows={numRows}
                    numCols={numCols}
                    onRowsCommit={handleRowsCommit}
                    onColsCommit={handleColsCommit}
                    onClear={clearGrid}
                    onRandomize={handleRandomizeGrid}
                    savedState={savedState}
                    onSaveInitialState={handleSaveInitialState}
                    onRestoreSavedState={handleRestoreSavedState}
                  />
                </Stack>
              </div>
            </Col>
          </Row>

          <div className="d-lg-none">
            <Button
              variant="outline-secondary"
              size="sm"
              className="w-100 mb-2"
              onClick={() => setShowMobileConfig((v) => !v)}
              aria-expanded={showMobileConfig}
            >
              ⚙ Configuración {showMobileConfig ? "▲" : "▼"}
            </Button>
            <Collapse in={showMobileConfig}>
              <div>
                <Stack gap={3} className="mb-2">
                  <PlaybackControls
                    isPlaying={isPlaying}
                    onStartStop={handleStartStop}
                    isRecording={isRecording}
                    onRecordToggle={handleRecordToggle}
                    isLooping={isLooping}
                    onLoopToggle={() => setIsLooping((v) => !v)}
                    bpm={bpm}
                    onBpmChange={(e) => setBpm(parseInt(e.target.value, 10))}
                    activeScale={activeScale}
                    onScaleChange={(e) => setActiveScale(e.target.value)}
                    showTransportButtons={false}
                  />

                  <GridConfiguration
                    numRows={numRows}
                    numCols={numCols}
                    onRowsCommit={handleRowsCommit}
                    onColsCommit={handleColsCommit}
                    onClear={clearGrid}
                    onRandomize={handleRandomizeGrid}
                    savedState={savedState}
                    onSaveInitialState={handleSaveInitialState}
                    onRestoreSavedState={handleRestoreSavedState}
                  />
                </Stack>
              </div>
            </Collapse>
          </div>
        </Card.Body>
      </Card>

      <MobileTransportBar
        isPlaying={isPlaying}
        onStartStop={handleStartStop}
        isRecording={isRecording}
        onRecordToggle={handleRecordToggle}
        isLooping={isLooping}
        onLoopToggle={() => setIsLooping((v) => !v)}
      />

      <TutorialBanner
        show={showTutorial}
        onHide={() => setShowTutorial(false)}
      />
    </Container>
    </>
  );
}


export default App;
