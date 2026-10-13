import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Settings, Play as PlayIcon, Cpu, Clock, Layers, Zap } from 'lucide-react'
import GanttChart from './GanttChart'
import MetricCards from './MetricCards'
import SimulationControls from './SimulationControls'
import { LiveProgressBar } from './Charts'
import { runFCFS } from '../algorithms/fcfs'
import { runSRTF } from '../algorithms/srtf'
import { runRoundRobin } from '../algorithms/roundRobin'
import { validateWorkload, sanitizeProcess } from '../utils/validation'

const PROCESS_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'
]

export default function Simulation({
  processes,
  algorithm,
  setAlgorithm,
  quantum,
  setQuantum,
  simulationResult,
  setSimulationResult
}) {
  const [error, setError] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [hasRun, setHasRun] = useState(false)
  const [isRunningAnim, setIsRunningAnim] = useState(false)
  const timerRef = useRef(null)

  const runSimulation = useCallback(() => {
    const cleaned = processes.map(sanitizeProcess)
    const validation = validateWorkload(cleaned)
    if (!validation.isValid) {
      setError(validation.message)
      setSimulationResult(null)
      setHasRun(false)
      return
    }
    setError('')
    setIsRunningAnim(true)

    setTimeout(() => {
      let result
      if (algorithm === 'FCFS') result = runFCFS(cleaned)
      else if (algorithm === 'SRTF') result = runSRTF(cleaned)
      else result = runRoundRobin(cleaned, quantum)

      setSimulationResult(result)
      setCurrentTime(0)
      setIsPlaying(false)
      setHasRun(true)
      setIsRunningAnim(false)
    }, 550)
  }, [processes, algorithm, quantum, setSimulationResult])

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  useEffect(() => {
    if (!isPlaying || !simulationResult) return
    const makespan = simulationResult.timeline.length
    if (currentTime >= makespan) {
      setIsPlaying(false)
      return
    }
    const intervalMs = Math.max(70, 380 / speed)
    timerRef.current = setInterval(() => {
      setCurrentTime((t) => {
        if (t + 1 >= makespan) {
          setIsPlaying(false)
          return makespan
        }
        return t + 1
      })
    }, intervalMs)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isPlaying, speed, simulationResult, currentTime])

  function handlePlay() {
    if (!simulationResult) {
      runSimulation()
      setTimeout(() => setIsPlaying(true), 600)
      return
    }
    if (currentTime >= (simulationResult.timeline.length || 0)) setCurrentTime(0)
    setIsPlaying(true)
  }

  function handlePause() { setIsPlaying(false) }

  function handleStep() {
    if (!simulationResult) { runSimulation(); return }
    setIsPlaying(false)
    setCurrentTime((t) => Math.min(t + 1, simulationResult.timeline.length))
  }

  function handleReset() {
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const timeline = simulationResult?.timeline || []
  const makespan = timeline.length
  const readyQueue = simulationResult?.readyQueueSnapshots?.[Math.min(currentTime, Math.max(0, makespan - 1))] || []
  const currentSlot = timeline[currentTime]
  const runningProcess = currentSlot?.processId ?? null

  const colorMap = useMemo(() => {
    const m = {}
    processes.forEach((p, i) => { m[p.id] = PROCESS_COLORS[i % PROCESS_COLORS.length] })
    return m
  }, [processes])

  const remainingMap = useMemo(() => {
    const rem = {}
    processes.forEach((p) => { rem[p.id] = p.burstTime })
    for (let t = 0; t < currentTime && t < timeline.length; t++) {
      const pid = timeline[t]?.processId
      if (pid && rem[pid] != null) rem[pid] = Math.max(0, rem[pid] - 1)
    }
    return rem
  }, [processes, timeline, currentTime])

  return (
    <div className="sim-page">
      <div className="sim-top-grid">
        <div className="card sim-settings-card">
          <div className="card-title">
            <Settings size={18} />
            Simulation settings
          </div>
          <p className="card-subtitle">
            Choose an algorithm. Priority does not affect FCFS, SRTF or Round Robin.
          </p>

          <label className="field-label">Scheduling algorithm</label>
          <div className="algo-toggle" style={{ marginBottom: '1rem' }}>
            {['FCFS', 'SRTF', 'Round Robin'].map((a) => (
              <button
                key={a}
                className={algorithm === a ? 'active' : ''}
                onClick={() => {
                  setAlgorithm(a)
                  setHasRun(false)
                  setSimulationResult(null)
                  setCurrentTime(0)
                  setIsPlaying(false)
                }}
              >
                {a}
              </button>
            ))}
          </div>

          {algorithm === 'Round Robin' && (
            <div style={{ marginBottom: '1rem' }}>
              <label className="field-label">Time quantum</label>
              <div className="quantum-control">
                <button className="btn btn-outline btn-sm" onClick={() => setQuantum(Math.max(1, quantum - 1))}>−</button>
                <input
                  type="number"
                  min="1"
                  value={quantum}
                  onChange={(e) => setQuantum(Math.max(1, parseInt(e.target.value, 10) || 1))}
                />
                <button className="btn btn-outline btn-sm" onClick={() => setQuantum(quantum + 1)}>+</button>
              </div>
            </div>
          )}

          {error && <div className="alert alert-error">{error}</div>}

          <button
            className={`btn btn-primary btn-run ${isRunningAnim ? 'running' : ''}`}
            onClick={runSimulation}
            disabled={isRunningAnim}
          >
            {isRunningAnim ? (
              <><span className="spinner" /> Computing schedule…</>
            ) : (
              <><PlayIcon size={16} /> Run simulation</>
            )}
          </button>
        </div>

        <div className="card sim-status-card">
          <div className="card-title">
            <Cpu size={18} />
            Live CPU status
          </div>

          <div className={`cpu-stage ${runningProcess ? 'busy' : 'idle'} ${isPlaying ? 'playing' : ''}`}>
            <div className="cpu-core">
              <div className="cpu-ring" />
              <div className="cpu-inner">
                {runningProcess ? (
                  <span className="cpu-running-id" style={{ color: colorMap[runningProcess] || '#3b82f6' }}>
                    {runningProcess}
                  </span>
                ) : (
                  <span className="cpu-idle-text">IDLE</span>
                )}
              </div>
            </div>
            <div className="cpu-stage-label">
              {runningProcess ? (
                <>
                  <Zap size={14} className="zap-icon" />
                  Executing <strong style={{ color: colorMap[runningProcess] }}>{runningProcess}</strong>
                </>
              ) : (
                'CPU waiting for work'
              )}
            </div>
          </div>

          <div className="status-stats">
            <div className="status-stat">
              <Clock size={14} />
              <span>Time</span>
              <strong>{currentTime}{makespan > 0 ? ` / ${makespan}` : ''}</strong>
            </div>
            <div className="status-stat">
              <Layers size={14} />
              <span>Ready</span>
              <strong>{readyQueue.length}</strong>
            </div>
          </div>

          {makespan > 0 && (
            <LiveProgressBar current={currentTime} total={makespan} label="Schedule progress" />
          )}

          <div className="ready-section">
            <div className="field-label">Ready queue</div>
            <div className="ready-queue">
              {readyQueue.length === 0 ? (
                <span className="queue-chip empty">Empty</span>
              ) : (
                readyQueue.map((id) => (
                  <span
                    className="queue-chip"
                    key={id}
                    style={{ background: (colorMap[id] || '#3b82f6') + '22', color: colorMap[id] || '#3b82f6' }}
                  >
                    {id}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Live process pipeline – dramatic */}
      {hasRun && processes.length > 0 && (
        <div className="process-pipeline">
          <div className="pipeline-title">Process pipeline — live execution</div>
          <div className="process-live-row">
            {processes.map((p, idx) => {
              const rem = remainingMap[p.id] ?? p.burstTime
              const done = rem === 0
              const active = runningProcess === p.id
              const pct = p.burstTime > 0 ? ((p.burstTime - rem) / p.burstTime) * 100 : 0
              const col = colorMap[p.id] || PROCESS_COLORS[idx % PROCESS_COLORS.length]
              return (
                <div
                  key={p.id}
                  className={`process-live-card ${active ? 'active' : ''} ${done ? 'done' : ''}`}
                  style={active ? { borderColor: col, boxShadow: `0 0 0 3px ${col}33` } : undefined}
                >
                  <div className="plc-header">
                    <span className="plc-id" style={{ color: col }}>{p.id}</span>
                    {active && <span className="plc-badge pulse" style={{ background: col + '22', color: col }}>RUNNING</span>}
                    {done && <span className="plc-badge done">DONE</span>}
                  </div>
                  <div className="plc-bar-track">
                    <div
                      className="plc-bar-fill"
                      style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${col}, ${col}cc)` }}
                    />
                  </div>
                  <div className="plc-meta">
                    Remaining: <strong>{rem}</strong> / {p.burstTime}
                  </div>
                  {active && isPlaying && (
                    <div className="plc-ticker">
                      <span className="ticker-dot" style={{ background: col }} />
                      Executing…
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {hasRun && simulationResult && (
        <div className="card gantt-card">
          <div className="card-title">Execution timeline</div>
          <p className="card-subtitle">
            Yellow cells appear only when playback reaches that time. Column <em>n</em> = interval [<em>n</em>−1, <em>n</em>).
          </p>

          <SimulationControls
            isPlaying={isPlaying}
            onPlay={handlePlay}
            onPause={handlePause}
            onStep={handleStep}
            onReset={handleReset}
            speed={speed}
            onSpeedChange={setSpeed}
            currentTime={currentTime}
            makespan={makespan}
            disabled={!hasRun}
          />

          <div className="gantt-host">
            <GanttChart
              processes={processes}
              timeline={timeline}
              currentTime={currentTime}
              showCurrent={true}
              progressive={true}
            />
          </div>
        </div>
      )}

      {hasRun && simulationResult?.metrics && (
        <div className="metrics-section">
          <MetricCards metrics={simulationResult.metrics} />
        </div>
      )}
    </div>
  )
}
