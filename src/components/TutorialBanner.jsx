import React, { useState, useEffect } from 'react';
import { Modal, Button, Badge, Row, Col } from 'react-bootstrap';
import './TutorialBanner.css';

const TutorialBanner = ({ show, onHide }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const tutorialSteps = [
    {
      content: (
        <div>
          <div className="tutorial-visual mb-5">
            <div className="game-preview">
              <div className="mini-grid">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className={`mini-cell ${i % 3 === 0 ? 'active-demo' : ''}`}></div>
                ))}
              </div>
            </div>
          </div>
            <p className="game-description text-muted mb-4" style={{ lineHeight: '1.6' }}>
                El <strong>Juego de la Vida</strong> es una simulación matemática que funciona como un
                "juego de 0 jugadores" en una cuadrícula, donde cada cuadro es una célula que puede estar
                <strong> viva</strong> o <strong>muerta</strong>. Su funcionamiento es automático y se basa
                en reglas muy simples de vecindad.

                El tiempo transcurre en <strong>generaciones</strong>, que son los ciclos donde todas las
                células se actualizan simultáneamente.
            </p>
        </div>
      )
    },
    {
      content: (
        <div>
          <h6 className="mb-3">Reglas básicas:</h6>
          <Row>
             <Col md={6}>
                <div className="rule-box mb-3 border border-success rounded-3">
                    <h6 className={"text-success"}>Nacimiento</h6>
                    <p className="small">Una célula muerta con exactamente <strong>3</strong> vecinas vivas nace.</p>
                </div>
                 <div className="rule-box  border border-success rounded-3">
                     <h6 className={"text-success"}>Supervivencia</h6>
                     <p className="small">Una célula viva con <strong>2 o 3</strong> vecinas vivas sigue viva en la siguiente generación.</p>
                 </div>
             </Col>
             <Col>
                 <div className="rule-box mb-5 border border-danger rounded-3">
                     <h6 className={"text-danger"}>Muerte por soledad</h6>
                     <p className="small">Una célula viva con <strong>menos de 2</strong> vecinas vivas muere.</p>
                 </div>
                 <div className="rule-box   border border-danger rounded-3">
                     <h6 className={"text-danger"}>Muerte por sobrepoblación</h6>
                     <p className="small">Una célula viva con <strong>más de 3</strong> vecinas vivas muere.</p>
                 </div>
             </Col>
          </Row>
          <div className="mt-3 p-3 bg-light rounded">
            <small className="text-muted">
              <strong>Observación: </strong>
                Lo fascinante es que, a partir
                de estas instrucciones tan básicas, emergen patrones complejos, estructuras que se mueven
                y comportamientos impredecibles con solo observar cómo evoluciona el estado inicial que tú dibujaste.

            </small>
          </div>
        </div>
      )
    },
    {
      content: (
        <div>
          <p className="game-description text-muted mb-3">
            Cada célula no solo vive y muere, también hace sonido!. ¿Comó suena el juego de la vida?
          </p>
          <p className="game-description text-muted mb-4" style={{ lineHeight: '1.6' }}> Imagina que la pantalla es una partitura en movimiento, el tiempo avanza de izquierda
          a derecha. Una barra invisible barre la pantalla repetidamente. Cada vez que la barra toca una célula viva, se produce un sonido. Si la cuadricula cambia, la melodía cambia.</p>

          <div className="tutorial-visual mb-5">
            <div className="game-preview">
                <div className="mini-grid">
                    {[...Array(16)].map((_, i) => {
                        // Calculamos la columna actual (0, 1, 2 o 3)
                        const colIndex = i % 4;
                        // Definimos cuál es la columna activa del escáner (ej: columna 2)
                        const isScannerCol = colIndex === 2;

                        return (
                            <div
                                key={i}
                                className={`mini-cell 
                        ${i % 3 === 0 ? 'active-demo' : ''} 
                        ${isScannerCol ? 'scanner-active' : ''}` // Clase nueva
                                }
                            ></div>
                        );
                    })}
                </div>
            </div>
        </div>
          <div className="color-demo mb-4">
            <h6 className="mb-3">Evolución de colores por generación:</h6>
              <p className="game-description text-muted mb-4" style={{ lineHeight: '1.6' }}> A diferencia de un instrumento
              normal, aquí las notas envejecen, la supervivencia se transforma en sonido.</p>
            <Row className="g-3 justify-content-center text-center">
              <Col xs={3} md={3}>
                <div className="color-sample generation-0"></div>
                <small>Generación 0<br/>Recién nacida</small>
              </Col>
              <Col xs={3} md={3}>
                <div className="color-sample generation-1"></div>
                <small>Generación 1<br/>Joven</small>
              </Col>
              <Col xs={3} md={3}>
                <div className="color-sample generation-2"></div>
                <small>Generación 2<br/>Adulta</small>
              </Col>
                {/*
              <Col xs={6} md={3}>
                <div className="color-sample generation-3"></div>
                <small>Generación 3+<br/>Ancestral</small>
              </Col>*/}
            </Row>
          </div>
        </div>
      )
    },
    {
      content: (
        <div>
          <h6 className="mb-3">Cómo interactuar con el programa:</h6>

          <div className="controls-guide">
            <Row className="g-3">
              <Col md={6}>
                <div className="control-item">
                  <h6 className="text-primary">Click en las celdas</h6>
                  <p className="small">Haz click para crear o eliminar células. Las nuevas células tendrán el instrumento seleccionado.</p>
                </div>

                <div className="control-item">
                  <h6 className="text-primary">▶️ Reproducir/Pausar</h6>
                  <p className="small">Inicia la evolución del juego y la reproducción musical simultáneamente.</p>
                </div>
              </Col>

              <Col md={6}>
                <div className="control-item">
                  <h6 className="text-primary">Configuración</h6>
                  <p className="small">Ajusta el tempo (BPM), cambia instrumentos, escalas musicales y dimensiones de la grilla.</p>
                </div>

                <div className="control-item">
                  <h6 className="text-primary">Patrones</h6>
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
            ¡Iniciar!
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default TutorialBanner;