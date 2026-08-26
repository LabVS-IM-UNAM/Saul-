import { Form, Button } from 'react-bootstrap';
import { SCALES } from '../utils/audioEngine';

const PlaybackControls = ({
  isPlaying,
  onStartStop,
  isRecording,
  onRecordToggle,
  isLooping,
  onLoopToggle,
  bpm,
  onBpmChange,
  activeScale,
  onScaleChange,
  showTransportButtons = true
}) => {
  return (
    <div>
      {showTransportButtons && (
        <>
          <Button
            variant={isPlaying ? "warning" : "primary"}
            onClick={onStartStop}
            className="w-100 mb-2"
            size="sm"
          >
            {isPlaying ? "⏸︎ Parar" : "▶︎ Iniciar"}
          </Button>

          <Button
            variant={isRecording ? "danger" : "success"}
            onClick={onRecordToggle}
            className="w-100 mb-2"
            size="sm"
            disabled={!isPlaying && !isRecording}
          >
            {isRecording ? "⏹ Detener Grabación" : "⏺ Grabar"}
          </Button>

          <Button
            variant={isLooping ? "info" : "outline-info"}
            onClick={onLoopToggle}
            className={`w-100 mb-2 ${isLooping ? "loop-active" : ""}`}
            size="sm"
          >
            <span className="loop-icon">🔁</span>
            {isLooping ? " Loop activo" : " Loop"}
          </Button>
        </>
      )}

      <Form.Group controlId="bpm-slider" className="mb-3">
        <Form.Label column={"sm"} className="small">Tempo: {bpm} BPM</Form.Label>
        <Form.Range
          min="40"
          max="480"
          value={bpm}
          onChange={onBpmChange}
          size="sm"
        />
      </Form.Group>


      <Form.Group controlId="scale-select" className="mb-3">
        <Form.Label column={"sm"} className="small">Escala</Form.Label>
        <Form.Select 
          value={activeScale} 
          onChange={onScaleChange}
          size="sm"
        >
          {Object.keys(SCALES).map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </Form.Select>
      </Form.Group>
    </div>
  );
};

export default PlaybackControls;