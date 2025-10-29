import { Form, Button, Row, Col } from 'react-bootstrap';

const GridConfiguration = ({
  numRows,
  numCols,
  onRowsChange,
  onColsChange,
  onClear,
  onRandomize,
  savedState,
  onSaveInitialState,
  onRestoreSavedState
}) => {
  return (
    <div>
      <h6 className="small mb-2">Configuración</h6>
      <Row className="g-2 mb-2">
        <Col>
          <Form.Group controlId="rows-input">
            <Form.Label column={"sm"} className="small">Filas</Form.Label>
            <Form.Control
              type="number"
              value={numRows}
              min="1"
              onChange={onRowsChange}
              size="sm"
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="cols-input">
            <Form.Label column={"sm"} className="small">Columnas</Form.Label>
            <Form.Control
              type="number"
              value={numCols}
              min="1"
              onChange={onColsChange}
              size="sm"
            />
          </Form.Group>
        </Col>
      </Row>
      
      <div className="d-grid gap-2">
        <Button variant="outline-danger" onClick={onClear} size="sm">
          Borrar
        </Button>
        <Button variant="outline-success" onClick={onRandomize} size="sm">
          Aleatorio
        </Button>
        <Button 
          variant={savedState ? "outline-warning" : "outline-info"} 
          onClick={savedState ? onRestoreSavedState : onSaveInitialState} 
          size="sm"
        >
          {savedState ? "Restablecer estado guardado" : "Guardar estado inicial"}
        </Button>
      </div>
    </div>
  );
};

export default GridConfiguration;