import React from 'react'

const PALETTE = {
  waiting: '#3b82f6',
  response: '#10b981',
  turnaround: '#8b5cf6',
  util: '#06b6d4',
  throughput: '#f59e0b',
  FCFS: '#3b82f6',
  SRTF: '#10b981',
  'Round Robin': '#a855f7',
  pie: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#14b8a6']
}

function BarChart({ title, labels, values, unit = '', colors = null, color = '#3b82f6' }) {
  const max = Math.max(...values, 0.001)
  const height = 170
  const barWidth = 34
  const gap = 16
  const chartWidth = Math.max(labels.length * (barWidth + gap) + 50, 220)
  const chartHeight = height + 42

  return (
    <div className="chart-card">
      <div className="chart-title">{title}</div>
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="bar-chart-svg" preserveAspectRatio="xMidYMid meet">
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line
            key={f}
            x1={32}
            y1={height - height * f + 10}
            x2={chartWidth - 8}
            y2={height - height * f + 10}
            stroke="#e2e8f0"
            strokeWidth="1"
            strokeDasharray="4 3"
          />
        ))}
        {labels.map((label, i) => {
          const h = Math.max(3, (values[i] / max) * (height - 22))
          const x = 40 + i * (barWidth + gap)
          const y = height - h + 10
          const fill = colors ? colors[i % colors.length] : color
          return (
            <g key={label}>
              <rect x={x} y={y} width={barWidth} height={h} rx="6" fill={fill} opacity="0.92">
                <animate attributeName="height" from="0" to={h} dur="0.65s" fill="freeze" />
                <animate attributeName="y" from={height + 10} to={y} dur="0.65s" fill="freeze" />
              </rect>
              <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a">
                {typeof values[i] === 'number' ? values[i].toFixed(values[i] % 1 === 0 ? 0 : 2) : values[i]}
              </text>
              <text x={x + barWidth / 2} y={height + 28} textAnchor="middle" fontSize="11" fill="#64748b">
                {label}
              </text>
            </g>
          )
        })}
      </svg>
      {unit && <div className="chart-unit">{unit}</div>}
    </div>
  )
}

function GroupedBarChart({ title, categories, series, unit = '' }) {
  const max = Math.max(...series.flatMap((s) => s.values), 0.001)
  const height = 175
  const groupWidth = 72
  const barW = 16
  const chartWidth = categories.length * (groupWidth + 14) + 48
  const chartHeight = height + 52

  return (
    <div className="chart-card chart-card-wide">
      <div className="chart-title">{title}</div>
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="bar-chart-svg" preserveAspectRatio="xMidYMid meet">
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line key={f} x1={36} y1={height - height * f + 8} x2={chartWidth - 8} y2={height - height * f + 8}
            stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 3" />
        ))}
        {categories.map((cat, ci) => {
          const gx = 45 + ci * (groupWidth + 14)
          return (
            <g key={cat}>
              {series.map((s, si) => {
                const h = Math.max(3, (s.values[ci] / max) * (height - 18))
                const x = gx + si * (barW + 4)
                const y = height - h + 8
                return (
                  <rect key={s.name} x={x} y={y} width={barW} height={h} rx="4" fill={s.color} opacity="0.92">
                    <animate attributeName="height" from="0" to={h} dur="0.55s" fill="freeze" />
                    <animate attributeName="y" from={height + 8} to={y} dur="0.55s" fill="freeze" />
                  </rect>
                )
              })}
              <text x={gx + (series.length * (barW + 4)) / 2 - 2} y={height + 28} textAnchor="middle" fontSize="11" fill="#64748b">
                {cat}
              </text>
            </g>
          )
        })}
      </svg>
      <div className="chart-legend">
        {series.map((s) => (
          <span key={s.name} className="chart-legend-item">
            <span className="chart-legend-swatch" style={{ background: s.color }} />
            {s.name}
          </span>
        ))}
      </div>
      {unit && <div className="chart-unit">{unit}</div>}
    </div>
  )
}

/** Pie chart with labels and percentages */
function PieChart({ title, labels, values, colors = PALETTE.pie }) {
  const total = values.reduce((a, b) => a + b, 0) || 1
  const size = 200
  const cx = size / 2
  const cy = size / 2
  const r = 78
  let angle = -Math.PI / 2

  const slices = values.map((v, i) => {
    const portion = v / total
    const start = angle
    const end = angle + portion * Math.PI * 2
    angle = end
    const large = portion > 0.5 ? 1 : 0
    const x1 = cx + r * Math.cos(start)
    const y1 = cy + r * Math.sin(start)
    const x2 = cx + r * Math.cos(end)
    const y2 = cy + r * Math.sin(end)
    const mid = (start + end) / 2
    const lx = cx + (r + 18) * Math.cos(mid)
    const ly = cy + (r + 18) * Math.sin(mid)
    const path =
      portion >= 0.999
        ? `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} Z`
        : `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`
    return {
      path,
      color: colors[i % colors.length],
      label: labels[i],
      value: v,
      pct: (portion * 100).toFixed(1),
      lx,
      ly,
      showLabel: portion > 0.04
    }
  })

  return (
    <div className="chart-card">
      <div className="chart-title">{title}</div>
      <div className="pie-layout">
        <svg viewBox={`0 0 ${size} ${size}`} className="pie-svg" width="180" height="180">
          {slices.map((s, i) => (
            <path key={i} d={s.path} fill={s.color} stroke="#fff" strokeWidth="2" opacity="0.92">
              <animate attributeName="opacity" from="0" to="0.92" dur="0.5s" fill="freeze" />
            </path>
          ))}
        </svg>
        <div className="pie-legend">
          {slices.map((s, i) => (
            <div key={i} className="pie-legend-row">
              <span className="chart-legend-swatch" style={{ background: s.color }} />
              <span className="pie-legend-label">{s.label}</span>
              <span className="pie-legend-val">{s.value.toFixed(s.value % 1 ? 2 : 0)} ({s.pct}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ComparisonCharts({ comparison }) {
  if (!comparison) return null
  const algos = ['FCFS', 'SRTF', 'Round Robin']
  const wait = algos.map((a) => comparison[a].averages.waitingTime)
  const turn = algos.map((a) => comparison[a].averages.turnaroundTime)
  const resp = algos.map((a) => comparison[a].averages.responseTime)
  const util = algos.map((a) => comparison[a].cpuUtilisation)
  const thr = algos.map((a) => comparison[a].throughput)

  return (
    <div className="charts-grid">
      <GroupedBarChart
        title="Average Times Comparison"
        categories={['Waiting', 'Response', 'Turnaround']}
        series={[
          { name: 'FCFS', values: [wait[0], resp[0], turn[0]], color: PALETTE.FCFS },
          { name: 'SRTF', values: [wait[1], resp[1], turn[1]], color: PALETTE.SRTF },
          { name: 'Round Robin', values: [wait[2], resp[2], turn[2]], color: PALETTE['Round Robin'] }
        ]}
        unit="time units"
      />
      <BarChart title="CPU Utilisation %" labels={algos} values={util} colors={[PALETTE.FCFS, PALETTE.SRTF, PALETTE['Round Robin']]} unit="%" />
      <BarChart title="Throughput" labels={algos} values={thr} colors={[PALETTE.FCFS, PALETTE.SRTF, PALETTE['Round Robin']]} unit="proc / unit" />
      <PieChart
        title="Share of Average Waiting Time"
        labels={algos}
        values={wait.map((v) => Math.max(v, 0.01))}
        colors={[PALETTE.FCFS, PALETTE.SRTF, PALETTE['Round Robin']]}
      />
    </div>
  )
}

export function ProcessMetricCharts({ perProcess }) {
  if (!perProcess || perProcess.length === 0) return null
  const labels = perProcess.map((p) => p.id)
  const colors = PALETTE.pie
  return (
    <div className="charts-grid">
      <BarChart title="Waiting Time per Process" labels={labels} values={perProcess.map((p) => p.waitingTime)} colors={colors} unit="time units" />
      <BarChart title="Response Time per Process" labels={labels} values={perProcess.map((p) => p.responseTime)} colors={colors} unit="time units" />
      <BarChart title="Turnaround Time per Process" labels={labels} values={perProcess.map((p) => p.turnaroundTime)} colors={colors} unit="time units" />
      <PieChart
        title="Waiting Time Distribution"
        labels={labels}
        values={perProcess.map((p) => Math.max(p.waitingTime, 0.01))}
        colors={colors}
      />
      <PieChart
        title="Turnaround Time Distribution"
        labels={labels}
        values={perProcess.map((p) => Math.max(p.turnaroundTime, 0.01))}
        colors={colors}
      />
      <PieChart
        title="Burst Time Share"
        labels={labels}
        values={perProcess.map((p) => p.burstTime)}
        colors={colors}
      />
    </div>
  )
}

export function LiveProgressBar({ current, total, label }) {
  const pct = total > 0 ? Math.min(100, (current / total) * 100) : 0
  return (
    <div className="live-progress">
      <div className="live-progress-header">
        <span>{label}</span>
        <span>{pct.toFixed(0)}%</span>
      </div>
      <div className="live-progress-track">
        <div className="live-progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function Charts() {
  return null
}
