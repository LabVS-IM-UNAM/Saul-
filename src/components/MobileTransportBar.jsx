import { Button } from 'react-bootstrap';

const MobileTransportBar = ({
  isPlaying,
  onStartStop,
  isRecording,
  onRecordToggle,
  isLooping,
  onLoopToggle
}) => {
  return (
    <div className="mobile-transport-bar d-lg-none">
      <Button
        variant={isPlaying ? "warning" : "primary"}
        onClick={onStartStop}
        aria-label={isPlaying ? "Parar" : "Iniciar"}
      >
        {isPlaying ? "⏸︎" : "▶︎"}
      </Button>

      <Button
        variant={isRecording ? "danger" : "success"}
        onClick={onRecordToggle}
        disabled={!isPlaying && !isRecording}
        aria-label={isRecording ? "Detener grabación" : "Grabar"}
      >
        {isRecording ? "⏹" : "⏺"}
      </Button>

      <Button
        variant={isLooping ? "info" : "outline-info"}
        onClick={onLoopToggle}
        className="loop-btn"
        aria-label={isLooping ? "Loop activo" : "Loop"}
      >
        🔁
      </Button>
    </div>
  );
};

export default MobileTransportBar;
