/**
 * CSV import / export utilities
 */

export function processesToCSV(processes) {
  const header = 'Process ID,Arrival Time,Burst Time,Priority'
  const rows = processes.map(
    (p) => `${p.id},${p.arrivalTime},${p.burstTime},${p.priority}`
  )
  return [header, ...rows].join('\n')
}

export function resultsToCSV(results, algorithm, quantum = null) {
  const header =
    'Process ID,Arrival Time,Burst Time,Priority,First Start,Completion Time,Turnaround Time,Waiting Time,Response Time'
  const rows = results.map(
    (r) =>
      `${r.id},${r.arrivalTime},${r.burstTime},${r.priority},${r.firstStart},${r.completionTime},${r.turnaroundTime},${r.waitingTime},${r.responseTime}`
  )
  const meta = [
    `# Algorithm: ${algorithm}`,
    quantum != null ? `# Time Quantum: ${quantum}` : '# Time Quantum: N/A',
    `# Generated: ${new Date().toISOString()}`,
    ''
  ]
  return [...meta, header, ...rows].join('\n')
}

export function parseCSV(text) {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))

  if (lines.length < 2) {
    throw new Error('CSV must contain a header and at least one data row')
  }

  // Skip header
  const dataLines = lines.slice(1)
  const processes = []

  for (const line of dataLines) {
    const parts = line.split(',').map((p) => p.trim())
    if (parts.length < 4) continue

    const [id, arrival, burst, priority] = parts
    processes.push({
      id: id || `P${processes.length + 1}`,
      arrivalTime: Math.max(0, parseInt(arrival, 10) || 0),
      burstTime: Math.max(1, parseInt(burst, 10) || 1),
      priority: Math.max(1, parseInt(priority, 10) || 1)
    })
  }

  if (processes.length === 0) {
    throw new Error('No valid process rows found in CSV')
  }

  return processes
}

export function downloadCSV(content, filename) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
