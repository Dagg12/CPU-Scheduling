import React, { useState } from 'react'
import { Plus, Shuffle, Trash2, RotateCcw } from 'lucide-react'
import { validateProcess } from '../utils/validation'

const SAMPLE = [
  { id: 'A', arrivalTime: 11, burstTime: 8, priority: 4 },
  { id: 'B', arrivalTime: 13, burstTime: 9, priority: 1 },
  { id: 'C', arrivalTime: 6, burstTime: 9, priority: 2 },
  { id: 'D', arrivalTime: 1, burstTime: 6, priority: 3 }
]

export default function ProcessBuilder({ processes, setProcesses }) {
  const [errors, setErrors] = useState({})
  const [globalError, setGlobalError] = useState('')
  const existingIds = processes.map((p) => p.id)

  function updateProcess(index, field, value) {
    const updated = processes.map((p, i) =>
      i === index ? { ...p, [field]: value } : p
    )
    setProcesses(updated)
    const result = validateProcess(updated[index], existingIds, processes[index].id)
    setErrors((prev) => ({ ...prev, [index]: result.errors }))
    setGlobalError('')
  }

  function addProcess() {
    let nextId = `P${processes.length + 1}`
    const ids = new Set(processes.map((p) => p.id))
    let n = processes.length + 1
    while (ids.has(nextId)) {
      n++
      nextId = `P${n}`
    }
    setProcesses([
      ...processes,
      { id: nextId, arrivalTime: 0, burstTime: 1, priority: 1 }
    ])
    setGlobalError('')
  }

  function deleteProcess(index) {
    setProcesses(processes.filter((_, i) => i !== index))
    setErrors({})
    setGlobalError('')
  }

  function loadSample() {
    setProcesses(SAMPLE.map((p) => ({ ...p })))
    setErrors({})
    setGlobalError('')
  }

  function generateRandom() {
    const count = Math.floor(Math.random() * 6) + 4
    const ids = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const list = []
    for (let i = 0; i < count; i++) {
      list.push({
        id: ids[i],
        arrivalTime: Math.floor(Math.random() * 15),
        burstTime: Math.floor(Math.random() * 12) + 1,
        priority: Math.floor(Math.random() * 5) + 1
      })
    }
    setProcesses(list)
    setErrors({})
    setGlobalError('')
  }

  function clearAll() {
    if (window.confirm('Clear the entire workload?')) {
      setProcesses([])
      setErrors({})
      setGlobalError('')
    }
  }

  return (
    <div>
      <div className="card">
        <div className="card-title">Process workload</div>
        <p className="card-subtitle">
          Define your processes or load a sample. Priority is stored for reference but does{' '}
          <strong>not</strong> affect FCFS, SRTF or Round Robin scheduling.
        </p>

        <div className="btn-group" style={{ marginBottom: '1rem' }}>
          <button className="btn btn-primary" onClick={addProcess}>
            <Plus size={16} /> Add process
          </button>
          <button className="btn btn-outline" onClick={loadSample}>
            <RotateCcw size={16} /> Load sample
          </button>
          <button className="btn btn-outline" onClick={generateRandom}>
            <Shuffle size={16} /> Generate random
          </button>
          <button className="btn btn-outline" onClick={clearAll} style={{ color: 'var(--danger)' }}>
            <Trash2 size={16} /> Clear all
          </button>
        </div>

        {globalError && <div className="alert alert-error">{globalError}</div>}

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Process ID</th>
                <th>Arrival Time</th>
                <th>Burst Time</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {processes.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem' }}>
                    No processes yet. Add one or load the sample.
                  </td>
                </tr>
              ) : (
                processes.map((p, idx) => {
                  const rowErrors = errors[idx] || {}
                  return (
                    <tr key={idx}>
                      <td>
                        <input
                          type="text"
                          value={p.id}
                          onChange={(e) => updateProcess(idx, 'id', e.target.value)}
                          className={rowErrors.id ? 'error' : ''}
                          maxLength={8}
                        />
                        {rowErrors.id && <div className="field-error">{rowErrors.id}</div>}
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          value={p.arrivalTime}
                          onChange={(e) => updateProcess(idx, 'arrivalTime', e.target.value)}
                          className={rowErrors.arrivalTime ? 'error' : ''}
                        />
                        {rowErrors.arrivalTime && (
                          <div className="field-error">{rowErrors.arrivalTime}</div>
                        )}
                      </td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          value={p.burstTime}
                          onChange={(e) => updateProcess(idx, 'burstTime', e.target.value)}
                          className={rowErrors.burstTime ? 'error' : ''}
                        />
                        {rowErrors.burstTime && (
                          <div className="field-error">{rowErrors.burstTime}</div>
                        )}
                      </td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          value={p.priority}
                          onChange={(e) => updateProcess(idx, 'priority', e.target.value)}
                          className={rowErrors.priority ? 'error' : ''}
                        />
                        {rowErrors.priority && (
                          <div className="field-error">{rowErrors.priority}</div>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-icon btn-outline"
                          onClick={() => deleteProcess(idx)}
                          title="Delete process"
                        >
                          <Trash2 size={15} color="var(--danger)" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
