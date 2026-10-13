/**
 * First Come First Served (FCFS) – Non-preemptive
 *
 * - Processes are ordered by arrival time.
 * - Tie-break: lower Process ID (lexicographic) wins.
 * - Idle time is inserted when no process has arrived.
 */

import { computeMetrics } from './metrics.js'

export function runFCFS(processes) {
  if (!processes || processes.length === 0) {
    return {
      timeline: [],
      firstStartMap: {},
      completionMap: {},
      metrics: computeMetrics([], [], {}, {}),
      readyQueueSnapshots: {}
    }
  }

  // Deep copy and sort by arrival, then by ID
  const sorted = processes
    .map((p) => ({ ...p }))
    .sort((a, b) => {
      if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime
      return String(a.id).localeCompare(String(b.id))
    })

  const timeline = [] // { time, processId }  time is the start of the unit [t, t+1)
  const firstStartMap = {}
  const completionMap = {}
  const readyQueueSnapshots = {}

  let currentTime = 0
  let idx = 0
  const n = sorted.length
  const remaining = new Map(sorted.map((p) => [p.id, p.burstTime]))

  while (idx < n) {
    // Skip idle time until next process arrives
    if (sorted[idx].arrivalTime > currentTime) {
      while (currentTime < sorted[idx].arrivalTime) {
        timeline.push({ time: currentTime, processId: null })
        readyQueueSnapshots[currentTime] = []
        currentTime++
      }
    }

    // Collect all processes that have arrived by currentTime and not yet finished
    const ready = sorted
      .slice(idx)
      .filter((p) => p.arrivalTime <= currentTime && remaining.get(p.id) > 0)
      .sort((a, b) => {
        if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime
        return String(a.id).localeCompare(String(b.id))
      })

    if (ready.length === 0) {
      // Should not happen, but safety
      timeline.push({ time: currentTime, processId: null })
      readyQueueSnapshots[currentTime] = []
      currentTime++
      continue
    }

    // Pick the first in FCFS order (already sorted)
    const selected = ready[0]
    const pid = selected.id

    if (firstStartMap[pid] === undefined) {
      firstStartMap[pid] = currentTime
    }

    // Run until completion (non-preemptive)
    const burst = remaining.get(pid)
    for (let t = 0; t < burst; t++) {
      const queueAtT = ready
        .filter((p) => p.id !== pid)
        .map((p) => p.id)
      readyQueueSnapshots[currentTime] = queueAtT
      timeline.push({ time: currentTime, processId: pid })
      currentTime++
    }

    remaining.set(pid, 0)
    completionMap[pid] = currentTime

    // Advance idx past completed processes
    while (idx < n && remaining.get(sorted[idx].id) === 0) {
      idx++
    }
  }

  const metrics = computeMetrics(processes, timeline, firstStartMap, completionMap)

  return {
    timeline,
    firstStartMap,
    completionMap,
    metrics,
    readyQueueSnapshots
  }
}
