import { useEffect, useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { MIN_ROWS, MAX_ROWS, MIN_COLS, MAX_COLS } from '../utils/gameLogic';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const GridConfiguration = ({
  numRows,
  numCols,
  onRowsCommit,
  onColsCommit,
  onClear,
  onRandomize,
  savedState,
  onSaveInitialState,
  onRestoreSavedState
}) => {
  const [rowsDraft, setRowsDraft] = useState(String(numRows));
  const [colsDraft, setColsDraft] = useState(String(numCols));

  useEffect(() => {
    setRowsDraft(String(numRows));
  }, [numRows]);

  useEffect(() => {
    setColsDraft(String(numCols));
  }, [numCols]);

  const commitRows = () => {
    const parsed = parseInt(rowsDraft, 10);
    const value = Number.isNaN(parsed) ? numRows : clamp(parsed, MIN_ROWS, MAX_ROWS);
    setRowsDraft(String(value));
    onRowsCommit(value);
  };

  const commitCols = () => {
    const parsed = parseInt(colsDraft, 10);
    const value = Number.isNaN(parsed) ? numCols : clamp(parsed, MIN_COLS, MAX_COLS);
    setColsDraft(String(value));
    onColsCommit(value);
  };

  return (
    <div>
      <h6 className="small mb-2">Configuración</h6>
      <Row className="g-2 mb-2">
        <Col>
          <Form.Group controlId="rows-input">
            <Form.Label column={"sm"} className="small">Filas</Form.Label>
            <Form.Control
              type="number"
              value={rowsDraft}
              min={MIN_ROWS}
              max={MAX_ROWS}
              onChange={(e) => setRowsDraft(e.target.value)}
              onBlur={commitRows}
              size="sm"
            />
            <Form.Text className="text-muted">Máx. {MAX_ROWS}</Form.Text>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="cols-input">
            <Form.Label column={"sm"} className="small">Columnas</Form.Label>
            <Form.Control
              type="number"
              value={colsDraft}
              min={MIN_COLS}
              max={MAX_COLS}
              onChange={(e) => setColsDraft(e.target.value)}
              onBlur={commitCols}
              size="sm"
            />
            <Form.Text className="text-muted">Máx. {MAX_COLS}</Form.Text>
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
