import React, { useMemo } from 'react'
import { FileText, RefreshCw, BarChart2 } from 'lucide-react'
import GanttChart from './GanttChart'
import MetricCards from './MetricCards'
import { ComparisonCharts, ProcessMetricCharts } from './Charts'
import { runFCFS } from '../algorithms/fcfs'
import { runSRTF } from '../algorithms/srtf'
import { runRoundRobin } from '../algorithms/roundRobin'
import { sanitizeProcess } from '../utils/validation'

export default function ResultsReports({
  processes,
  algorithm,
  quantum,
  simulationResult,
  onNavigate
}) {
  const comparison = useMemo(() => {
    if (!processes || processes.length === 0) return null
    const cleaned = processes.map(sanitizeProcess)
    return {
      FCFS: runFCFS(cleaned).metrics,
      SRTF: runSRTF(cleaned).metrics,
      'Round Robin': runRoundRobin(cleaned, quantum).metrics
    }
  }, [processes, quantum])

  function handleExportPDF() {
    if (!simulationResult?.metrics) return
    const m = simulationResult.metrics
    const pp = m.perProcess || []
    const date = new Date().toLocaleString()

    const rows = pp
      .map(
        (r) =>
          `<tr>
            <td><strong>${r.id}</strong></td>
            <td>${r.arrivalTime}</td>
            <td>${r.burstTime}</td>
            <td>${r.priority}</td>
            <td>${r.firstStart}</td>
            <td>${r.completionTime}</td>
            <td>${r.turnaroundTime}</td>
            <td>${r.waitingTime}</td>
            <td>${r.responseTime}</td>
          </tr>`
      )
      .join('')

    let compRows = ''
    if (comparison) {
      const algos = ['FCFS', 'SRTF', 'Round Robin']
      const metricsList = [
        ['Avg Waiting Time', (a) => a.averages.waitingTime.toFixed(2)],
        ['Avg Response Time', (a) => a.averages.responseTime.toFixed(2)],
        ['Avg Turnaround Time', (a) => a.averages.turnaroundTime.toFixed(2)],
        ['CPU Utilisation %', (a) => a.cpuUtilisation.toFixed(1) + '%'],
        ['Throughput', (a) => a.throughput.toFixed(3)]
      ]
      compRows = metricsList
        .map(([label, fn]) => {
          const vals = algos.map((a) => fn(comparison[a]))
          return `<tr><td>${label}</td>${vals.map((v) => `<td>${v}</td>`).join('')}</tr>`
        })
        .join('')
    }

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>CPU Scheduling Results – ${algorithm}</title>
  <style>
    @page { margin: 18mm 16mm; size: A4; }
    * { box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; color: #0f172a; font-size: 11pt; line-height: 1.45; margin: 0; }
    .header { border-bottom: 3px solid #2563eb; padding-bottom: 12px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: flex-end; }
    .header h1 { font-size: 18pt; margin: 0; color: #1e40af; }
    .header .meta { font-size: 9pt; color: #64748b; text-align: right; }
    .badge { display: inline-block; background: #dbeafe; color: #1d4ed8; padding: 2px 10px; border-radius: 999px; font-size: 9pt; font-weight: 600; }
    h2 { font-size: 12pt; color: #1e40af; margin: 20px 0 8px; border-left: 4px solid #2563eb; padding-left: 8px; }
    .cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 12px 0 18px; }
    .card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; background: #f8fafc; }
    .card .lbl { font-size: 8pt; color: #64748b; text-transform: uppercase; letter-spacing: 0.04em; }
    .card .val { font-size: 16pt; font-weight: 700; color: #0f172a; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; font-size: 9.5pt; margin: 8px 0 16px; }
    th { background: #1e40af; color: #fff; text-align: left; padding: 7px 8px; font-weight: 600; }
    td { border-bottom: 1px solid #e2e8f0; padding: 6px 8px; }
    tr:nth-child(even) td { background: #f8fafc; }
    .footer { margin-top: 24px; padding-top: 10px; border-top: 1px solid #e2e8f0; font-size: 8pt; color: #94a3b8; display: flex; justify-content: space-between; }
    .note { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 8px 12px; font-size: 9pt; color: #1e40af; margin: 10px 0; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>CPU Scheduling Lab – Results Report</h1>
      <span class="badge">${algorithm}${algorithm === 'Round Robin' ? ' · q=' + quantum : ''}</span>
    </div>
    <div class="meta">
      CMPG324 · Operating Systems<br/>
      Generated: ${date}
    </div>
  </div>

  <div class="note">
    Workload: <strong>${processes.length}</strong> processes ·
    Makespan: <strong>${m.makespan}</strong> time units ·
    Total busy CPU: <strong>${m.totalBusyTime}</strong>
  </div>

  <h2>Aggregate performance metrics</h2>
  <div class="cards">
    <div class="card"><div class="lbl">Avg Waiting</div><div class="val">${m.averages.waitingTime.toFixed(2)}</div></div>
    <div class="card"><div class="lbl">Avg Response</div><div class="val">${m.averages.responseTime.toFixed(2)}</div></div>
    <div class="card"><div class="lbl">Avg Turnaround</div><div class="val">${m.averages.turnaroundTime.toFixed(2)}</div></div>
    <div class="card"><div class="lbl">CPU Utilisation</div><div class="val">${m.cpuUtilisation.toFixed(1)}%</div></div>
  </div>

  <h2>Per-process results</h2>
  <table>
    <thead>
      <tr>
        <th>Process</th><th>Arrival</th><th>Burst</th><th>Priority</th>
        <th>First Start</th><th>Completion</th><th>Turnaround</th><th>Waiting</th><th>Response</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  ${
    comparison
      ? `<h2>Algorithm comparison (same workload)</h2>
  <table>
    <thead><tr><th>Metric</th><th>FCFS</th><th>SRTF</th><th>Round Robin (q=${quantum})</th></tr></thead>
    <tbody>${compRows}</tbody>
  </table>`
      : ''
  }

  <div class="footer">
    <span>CPU Scheduling Simulator · CMPG324 · North-West University</span>
    <span>Save this page as PDF via Print → Save as PDF</span>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 300);
    };
  </script>
</body>
</html>`

    const win = window.open('', '_blank')
    if (!win) {
      alert('Please allow pop-ups to export the PDF report.')
      return
    }
    win.document.write(html)
    win.document.close()
  }

  if (!simulationResult) {
    return (
      <div className="card">
        <div className="alert alert-info">
          No simulation results yet. Go to <strong>Simulation</strong>, run an algorithm, then return here.
        </div>
        <button className="btn btn-primary" onClick={() => onNavigate('simulation')}>
          Go to Simulation
        </button>
      </div>
    )
  }

  const { metrics, timeline } = simulationResult
  const perProcess = metrics.perProcess || []

  const best = comparison
    ? {
        waiting: Math.min(
          comparison.FCFS.averages.waitingTime,
          comparison.SRTF.averages.waitingTime,
          comparison['Round Robin'].averages.waitingTime
        ),
        turnaround: Math.min(
          comparison.FCFS.averages.turnaroundTime,
          comparison.SRTF.averages.turnaroundTime,
          comparison['Round Robin'].averages.turnaroundTime
        ),
        response: Math.min(
          comparison.FCFS.averages.responseTime,
          comparison.SRTF.averages.responseTime,
          comparison['Round Robin'].averages.responseTime
        ),
        util: Math.max(
          comparison.FCFS.cpuUtilisation,
          comparison.SRTF.cpuUtilisation,
          comparison['Round Robin'].cpuUtilisation
        ),
        throughput: Math.max(
          comparison.FCFS.throughput,
          comparison.SRTF.throughput,
          comparison['Round Robin'].throughput
        )
      }
    : null

  return (
    <div className="results-page">
      <div className="card results-summary-card">
        <div className="results-summary-header">
          <div>
            <div className="card-title">
              <BarChart2 size={18} />
              Results summary
            </div>
            <p className="card-subtitle" style={{ marginBottom: 0 }}>
              Algorithm: <strong>{algorithm}</strong>
              {algorithm === 'Round Robin' && <> · Quantum: <strong>{quantum}</strong></>}
              {' · '}Processes: <strong>{processes.length}</strong>
              {' · '}Makespan: <strong>{metrics.makespan}</strong>
            </p>
          </div>
          <div className="btn-group">
            <button className="btn btn-primary" onClick={handleExportPDF}>
              <FileText size={16} /> Export PDF report
            </button>
            <button className="btn btn-outline" onClick={() => onNavigate('simulation')}>
              <RefreshCw size={16} /> Run another
            </button>
          </div>
        </div>
      </div>

      <MetricCards metrics={metrics} />

      <div className="card section-card">
        <div className="card-title">Graphical analysis – per process</div>
        <p className="card-subtitle">
          Multi-colour bar charts and pie charts for waiting, response, turnaround and burst distribution.
        </p>
        <ProcessMetricCharts perProcess={perProcess} />
      </div>

      {comparison && (
        <div className="card section-card">
          <div className="card-title">Algorithm comparison charts</div>
          <p className="card-subtitle">
            FCFS vs SRTF vs Round Robin on the same workload (RR quantum = {quantum}).
          </p>
          <ComparisonCharts comparison={comparison} />
        </div>
      )}

      {comparison && (
        <div className="card section-card">
          <div className="card-title">Comparison table</div>
          <p className="card-subtitle">Best values highlighted in green.</p>
          <div className="table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>FCFS</th>
                  <th>SRTF</th>
                  <th>Round Robin (q={quantum})</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Avg Waiting Time</td>
                  <td className={comparison.FCFS.averages.waitingTime === best.waiting ? 'highlight-best' : ''}>
                    {comparison.FCFS.averages.waitingTime.toFixed(2)}
                  </td>
                  <td className={comparison.SRTF.averages.waitingTime === best.waiting ? 'highlight-best' : ''}>
                    {comparison.SRTF.averages.waitingTime.toFixed(2)}
                  </td>
                  <td className={comparison['Round Robin'].averages.waitingTime === best.waiting ? 'highlight-best' : ''}>
                    {comparison['Round Robin'].averages.waitingTime.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td>Avg Turnaround Time</td>
                  <td className={comparison.FCFS.averages.turnaroundTime === best.turnaround ? 'highlight-best' : ''}>
                    {comparison.FCFS.averages.turnaroundTime.toFixed(2)}
                  </td>
                  <td className={comparison.SRTF.averages.turnaroundTime === best.turnaround ? 'highlight-best' : ''}>
                    {comparison.SRTF.averages.turnaroundTime.toFixed(2)}
                  </td>
                  <td className={comparison['Round Robin'].averages.turnaroundTime === best.turnaround ? 'highlight-best' : ''}>
                    {comparison['Round Robin'].averages.turnaroundTime.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td>Avg Response Time</td>
                  <td className={comparison.FCFS.averages.responseTime === best.response ? 'highlight-best' : ''}>
                    {comparison.FCFS.averages.responseTime.toFixed(2)}
                  </td>
                  <td className={comparison.SRTF.averages.responseTime === best.response ? 'highlight-best' : ''}>
                    {comparison.SRTF.averages.responseTime.toFixed(2)}
                  </td>
                  <td className={comparison['Round Robin'].averages.responseTime === best.response ? 'highlight-best' : ''}>
                    {comparison['Round Robin'].averages.responseTime.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td>CPU Utilisation %</td>
                  <td className={comparison.FCFS.cpuUtilisation === best.util ? 'highlight-best' : ''}>
                    {comparison.FCFS.cpuUtilisation.toFixed(1)}%
                  </td>
                  <td className={comparison.SRTF.cpuUtilisation === best.util ? 'highlight-best' : ''}>
                    {comparison.SRTF.cpuUtilisation.toFixed(1)}%
                  </td>
                  <td className={comparison['Round Robin'].cpuUtilisation === best.util ? 'highlight-best' : ''}>
                    {comparison['Round Robin'].cpuUtilisation.toFixed(1)}%
                  </td>
                </tr>
                <tr>
                  <td>Throughput</td>
                  <td className={comparison.FCFS.throughput === best.throughput ? 'highlight-best' : ''}>
                    {comparison.FCFS.throughput.toFixed(3)}
                  </td>
                  <td className={comparison.SRTF.throughput === best.throughput ? 'highlight-best' : ''}>
                    {comparison.SRTF.throughput.toFixed(3)}
                  </td>
                  <td className={comparison['Round Robin'].throughput === best.throughput ? 'highlight-best' : ''}>
                    {comparison['Round Robin'].throughput.toFixed(3)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="card section-card">
        <div className="card-title">Per-process results</div>
        <div className="table-wrapper" style={{ marginTop: '0.75rem' }}>
          <table>
            <thead>
              <tr>
                <th>Process ID</th>
                <th>Arrival</th>
                <th>Burst</th>
                <th>Priority</th>
                <th>First Start</th>
                <th>Completion</th>
                <th>Turnaround</th>
                <th>Waiting</th>
                <th>Response</th>
              </tr>
            </thead>
            <tbody>
              {perProcess.map((r) => (
                <tr key={r.id}>
                  <td><strong>{r.id}</strong></td>
                  <td>{r.arrivalTime}</td>
                  <td>{r.burstTime}</td>
                  <td>{r.priority}</td>
                  <td>{r.firstStart}</td>
                  <td>{r.completionTime}</td>
                  <td>{r.turnaroundTime}</td>
                  <td>{r.waitingTime}</td>
                  <td>{r.responseTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card section-card">
        <div className="card-title">Execution timeline</div>
        <div className="gantt-host" style={{ marginTop: '0.75rem' }}>
          <GanttChart processes={processes} timeline={timeline} progressive={false} />
        </div>
      </div>
    </div>
  )
}
