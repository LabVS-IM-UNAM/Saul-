import React, { useState, useEffect } from 'react';
import { Modal, Button, Badge, Row, Col } from 'react-bootstrap';
import './TutorialBanner.css';

const TutorialBanner = ({ show, onHide }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const tutorialSteps = [
    {
      title: "¡Bienvenido al Juego de la Vida Musical!",
      content: (
        <div>
          <p className="lead mb-3">
            Una combinación única entre el famoso <strong>Juego de la Vida de Conway</strong> y un secuenciador musical interactivo.
          </p>
          <div className="tutorial-visual mb-3">
            <div className="game-preview">
              <div className="mini-grid">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className={`mini-cell ${i % 3 === 0 ? 'active-demo' : ''}`}></div>
                ))}
              </div>
            </div>
          </div>
          <p>
            El Juego de la Vida es un autómata celular donde las células nacen, viven y mueren según reglas simples, creando patrones fascinantes que evolucionan en el tiempo.
          </p>
        </div>
      )
    },
    {
      title: "¿Cómo funciona el Juego de la Vida?",
      content: (
        <div>
          <h6 className="mb-3">Reglas básicas:</h6>
          <Row>
            <Col md={6}>
              <div className="rule-box mb-3">
                <h6 className="text-success">🟢 Nacimiento</h6>
                <p className="small">Una célula vacía con exactamente 3 vecinos vivos nace</p>
              </div>
              <div className="rule-box">
                <h6 className="text-info">💙 Supervivencia</h6>
                <p className="small">Una célula viva con 2 o 3 vecinos sobrevive</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="rule-box">
                <h6 className="text-danger">💀 Muerte</h6>
                <p className="small">Células con menos de 2 vecinos (soledad) o más de 3 (sobrepoblación) mueren</p>
              </div>
            </Col>
          </Row>
          <div className="mt-3 p-3 bg-light rounded">
            <small className="text-muted">
              <strong>Dato curioso:</strong> Estas simples reglas pueden crear patrones increíblemente complejos, desde estructuras estáticas hasta "naves espaciales" que se mueven por la grilla.
            </small>
          </div>
        </div>
      )
    },
    {
      title: "La Magia Musical: Colores y Sonidos",
      content: (
        <div>
          <p className="mb-3">
            Cada célula no solo vive y muere, ¡también hace música! El color de cada célula indica su "edad" y determina qué instrumento suena.
          </p>
          
          <div className="color-demo mb-4">
            <h6 className="mb-3">Evolución de colores por generación:</h6>
            <Row className="g-2">
              <Col xs={6} md={3}>
                <div className="color-sample generation-0"></div>
                <small>Generación 0<br/>Recién nacida</small>
              </Col>
              <Col xs={6} md={3}>
                <div className="color-sample generation-1"></div>
                <small>Generación 1<br/>Joven</small>
              </Col>
              <Col xs={6} md={3}>
                <div className="color-sample generation-2"></div>
                <small>Generación 2<br/>Adulta</small>
              </Col>
              <Col xs={6} md={3}>
                <div className="color-sample generation-3"></div>
                <small>Generación 3+<br/>Ancestral</small>
              </Col>
            </Row>
          </div>

          <div className="sound-info p-3 bg-light rounded">
            <h6 className="mb-2">🎵 Instrumentos disponibles:</h6>
            <div className="d-flex flex-wrap gap-2">
              <Badge bg="primary">Synth</Badge>
              <Badge bg="success">Piano</Badge>
              <Badge bg="warning">Drums</Badge>
              <Badge bg="info">Bass</Badge>
            </div>
            <p className="small mt-2 mb-0">
              Cada instrumento crea diferentes texturas sonoras mientras las células evolucionan.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Controles Interactivos",
      content: (
        <div>
          <h6 className="mb-3">Cómo interactuar con el programa:</h6>
          
          <div className="controls-guide">
            <Row className="g-3">
              <Col md={6}>
                <div className="control-item">
                  <h6 className="text-primary">🖱️ Click en las celdas</h6>
                  <p className="small">Haz click para crear o eliminar células. Las nuevas células tendrán el instrumento seleccionado.</p>
                </div>
                
                <div className="control-item">
                  <h6 className="text-success">▶️ Reproducir/Pausar</h6>
                  <p className="small">Inicia la evolución del juego y la reproducción musical simultáneamente.</p>
                </div>
              </Col>
              
              <Col md={6}>
                <div className="control-item">
                  <h6 className="text-warning">⚙️ Configuración</h6>
                  <p className="small">Ajusta el tempo (BPM), cambia instrumentos, escalas musicales y dimensiones de la grilla.</p>
                </div>
                
                <div className="control-item">
                  <h6 className="text-info">🎲 Patrones</h6>
                  <p className="small">Usa "Aleatorio" para generar patrones automáticamente o "Guardar/Restablecer" para conservar configuraciones.</p>
                </div>
              </Col>
            </Row>
          </div>
          
          <div className="mt-4 p-3 border rounded">
            <h6 className="text-center mb-3">💡 Consejo</h6>
            <p className="text-center small mb-0">
              Experimenta con diferentes patrones iniciales. Algunos crean melodías repetitivas, otros evolucionan constantemente. 
              ¡La música emerge de la vida artificial!
            </p>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 150);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 150);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    onHide();
  };

  useEffect(() => {
    if (show) {
      setCurrentStep(0);
    }
  }, [show]);

  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
      size="lg" 
      centered 
      backdrop="static"
      className="tutorial-modal"
    >
      <Modal.Header className="tutorial-header">
        <Modal.Title className="d-flex align-items-center">
          <span className="me-2">🎮🎵</span>
          {tutorialSteps[currentStep]?.title}
        </Modal.Title>
        <Button variant="outline-secondary" size="sm" onClick={handleClose}>
          ✕
        </Button>
      </Modal.Header>
      
      <Modal.Body className={`tutorial-body ${isAnimating ? 'animating' : ''}`}>
        <div className="step-indicator mb-3">
          <div className="d-flex justify-content-center gap-2">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`step-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
              />
            ))}
          </div>
        </div>
        
        <div className="tutorial-content">
          {tutorialSteps[currentStep]?.content}
        </div>
      </Modal.Body>
      
      <Modal.Footer className="tutorial-footer justify-content-between">
        <Button 
          variant="outline-secondary" 
          onClick={prevStep} 
          disabled={currentStep === 0}
        >
          ← Anterior
        </Button>
        
        <div className="step-counter">
          <small className="text-muted">
            Paso {currentStep + 1} de {tutorialSteps.length}
          </small>
        </div>
        
        {currentStep < tutorialSteps.length - 1 ? (
          <Button variant="primary" onClick={nextStep}>
            Siguiente →
          </Button>
        ) : (
          <Button variant="success" onClick={handleClose}>
            ¡Empezar a crear! 🚀
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default TutorialBanner;