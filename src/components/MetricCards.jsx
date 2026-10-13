import React from 'react'
import { Clock, Timer, RotateCcw, Cpu, Activity } from 'lucide-react'

export default function MetricCards({ metrics }) {
  if (!metrics) return null

  const cards = [
    {
      label: 'Average waiting time',
      value: metrics.averages.waitingTime.toFixed(2),
      unit: 'time units',
      icon: Clock,
      color: '#3b82f6'
    },
    {
      label: 'Average response time',
      value: metrics.averages.responseTime.toFixed(2),
      unit: 'time units',
      icon: Timer,
      color: '#10b981'
    },
    {
      label: 'Average turnaround time',
      value: metrics.averages.turnaroundTime.toFixed(2),
      unit: 'time units',
      icon: RotateCcw,
      color: '#8b5cf6'
    },
    {
      label: 'CPU utilisation',
      value: metrics.cpuUtilisation.toFixed(1) + '%',
      unit: '',
      icon: Cpu,
      color: '#06b6d4'
    },
    {
      label: 'Throughput',
      value: metrics.throughput.toFixed(3),
      unit: 'proc / unit',
      icon: Activity,
      color: '#f59e0b'
    }
  ]

  return (
    <div className="grid-metrics">
      {cards.map((c) => (
        <div className="metric-card" key={c.label}>
          <div className="label">
            <c.icon size={14} style={{ color: c.color }} />
            {c.label}
          </div>
          <div className="value">{c.value}</div>
          {c.unit && <div className="unit">{c.unit}</div>}
        </div>
      ))}
    </div>
  )
}
