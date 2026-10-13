import React from 'react'
import { ListOrdered, Play, BookOpen, BarChart3 } from 'lucide-react'

export default function Overview({
  processCount,
  algorithm,
  quantum,
  onNavigate
}) {
  return (
    <div>
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
          Welcome to the CPU Scheduling Lab
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '720px' }}>
          This simulator lets you build process workloads, run classic CPU scheduling
          algorithms (FCFS, SRTF and Round Robin), visualise execution with a
          live execution timeline, and compare performance metrics. Designed for
          CMPG324 Operating Systems practicals.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '1.5rem',
            marginTop: '1.25rem',
            flexWrap: 'wrap'
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Processes in workload
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{processCount}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Selected algorithm
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{algorithm}</div>
          </div>
          {algorithm === 'Round Robin' && (
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Time quantum
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{quantum}</div>
            </div>
          )}
        </div>
      </div>

      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
        Quick start
      </h3>
      <div className="quick-start">
        <div className="qs-card" onClick={() => onNavigate('builder')}>
          <ListOrdered size={22} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
          <h4>1. Build a workload</h4>
          <p>
            Add processes, load the sample dataset, generate random processes, or
            import a CSV.
          </p>
        </div>
        <div className="qs-card" onClick={() => onNavigate('simulation')}>
          <Play size={22} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
          <h4>2. Run a simulation</h4>
          <p>
            Choose FCFS, SRTF or Round Robin, set the quantum, then play or step
            through the schedule.
          </p>
        </div>
        <div className="qs-card" onClick={() => onNavigate('results')}>
          <BarChart3 size={22} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
          <h4>3. Analyse results</h4>
          <p>
            Inspect per-process metrics, averages, CPU utilisation and compare
            algorithms side-by-side.
          </p>
        </div>
        <div className="qs-card" onClick={() => onNavigate('learn')}>
          <BookOpen size={22} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
          <h4>4. Learn the concepts</h4>
          <p>
            Review algorithm explanations, metric formulas and a worked example
            before your practical or exam.
          </p>
        </div>
      </div>
    </div>
  )
}
