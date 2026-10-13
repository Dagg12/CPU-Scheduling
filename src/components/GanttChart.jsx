import React, { useMemo } from 'react'

/**
 * Spreadsheet-style Gantt chart with progressive reveal.
 * During playback, execution cells only appear up to currentTime.
 * Column N = interval [N-1, N).
 */
export default function GanttChart({
  processes,
  timeline,
  currentTime = null,
  showCurrent = false,
  progressive = false
}) {
  const { maxTime, processOrder, matrix } = useMemo(() => {
    if (!timeline || timeline.length === 0 || !processes || processes.length === 0) {
      return { maxTime: 0, processOrder: [], matrix: {} }
    }
    const maxT = timeline.length
    const order = processes.map((p) => p.id)
    const mat = {}
    order.forEach((id) => { mat[id] = Array(maxT).fill(false) })
    timeline.forEach((slot) => {
      if (slot.processId && mat[slot.processId]) {
        mat[slot.processId][slot.time] = true
      }
    })
    return { maxTime: maxT, processOrder: order, matrix: mat }
  }, [processes, timeline])

  if (maxTime === 0) {
    return (
      <div className="alert alert-info">
        No schedule to display. Add processes and run a simulation.
      </div>
    )
  }

  const timeHeaders = Array.from({ length: maxTime }, (_, i) => i + 1)
  const revealUpTo = progressive && currentTime != null ? currentTime : maxTime

  return (
    <div className="gantt-section">
      <div className="gantt-wrapper">
        <table className="gantt-table">
          <thead>
            <tr>
              <th className="process-id-col">Process</th>
              {timeHeaders.map((t) => (
                <th
                  key={t}
                  className={showCurrent && currentTime === t - 1 ? 'time-current' : ''}
                >
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {processOrder.map((pid) => (
              <tr key={pid}>
                <td className="process-id-col">{pid}</td>
                {timeHeaders.map((t) => {
                  const timeIdx = t - 1
                  const isPastOrNow = timeIdx < revealUpTo
                  const isExec = matrix[pid]?.[timeIdx] && isPastOrNow
                  const isCurrent =
                    showCurrent && currentTime !== null && timeIdx === currentTime - 1
                      ? false
                      : showCurrent && currentTime !== null && timeIdx === currentTime
                  const isFutureExec =
                    progressive &&
                    matrix[pid]?.[timeIdx] &&
                    timeIdx >= revealUpTo

                  const classes = [
                    'gantt-cell',
                    isExec ? 'exec' : '',
                    isCurrent && isExec ? 'current' : '',
                    isFutureExec ? 'future' : ''
                  ]
                    .filter(Boolean)
                    .join(' ')

                  return (
                    <td
                      key={t}
                      className={classes}
                      title={
                        isExec
                          ? `${pid} executes during [${timeIdx}, ${timeIdx + 1})`
                          : isFutureExec
                            ? 'Scheduled (not yet reached)'
                            : `Not running at [${timeIdx}, ${timeIdx + 1})`
                      }
                    />
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="gantt-legend">
        <div className="legend-item">
          <div className="legend-swatch exec" />
          Execution (revealed)
        </div>
        <div className="legend-item">
          <div className="legend-swatch idle" />
          Idle / waiting
        </div>
        {progressive && (
          <div className="legend-item">
            <div className="legend-swatch future" />
            Not yet reached
          </div>
        )}
        <div className="legend-item">
          Makespan: <strong>{maxTime}</strong>
        </div>
        {showCurrent && currentTime !== null && (
          <div className="legend-item">
            Live time: <strong>t = {currentTime}</strong>
          </div>
        )}
      </div>
    </div>
  )
}
