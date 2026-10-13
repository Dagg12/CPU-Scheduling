import React from 'react'
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react'

export default function SimulationControls({
  isPlaying,
  onPlay,
  onPause,
  onStep,
  onReset,
  speed,
  onSpeedChange,
  currentTime,
  makespan,
  disabled
}) {
  return (
    <div className="controls-bar">
      {!isPlaying ? (
        <button className="btn btn-primary" onClick={onPlay} disabled={disabled}>
          <Play size={16} /> Play
        </button>
      ) : (
        <button className="btn btn-primary" onClick={onPause}>
          <Pause size={16} /> Pause
        </button>
      )}

      <button className="btn btn-outline" onClick={onStep} disabled={disabled || isPlaying}>
        <SkipForward size={16} /> Step
      </button>

      <button className="btn btn-outline" onClick={onReset} disabled={disabled}>
        <RotateCcw size={16} /> Reset
      </button>

      <div className="speed-slider">
        <span>Speed</span>
        <input
          type="range"
          min="0.25"
          max="4"
          step="0.25"
          value={speed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
        />
        <span>{speed.toFixed(2)}×</span>
      </div>

      <div style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Time: <strong style={{ color: 'var(--text)' }}>{currentTime ?? 0}</strong>
        {makespan != null && <> / {makespan}</>}
      </div>
    </div>
  )
}
