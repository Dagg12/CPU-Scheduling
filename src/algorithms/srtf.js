/**
 * Shortest Remaining Time First (SRTF) – Preemptive
 *
 * - At every time unit, choose the arrived process with the smallest remaining burst.
 * - Tie-break: earlier arrival, then lower Process ID.
 * - Idle when no process has arrived.
 */

import { computeMetrics } from './metrics.js'

export function runSRTF(processes) {
  if (!processes || processes.length === 0) {
    return {
      timeline: [],
      firstStartMap: {},
      completionMap: {},
      metrics: computeMetrics([], [], {}, {}),
      readyQueueSnapshots: {}
    }
  }

  const procs = processes.map((p) => ({ ...p }))
  const remaining = new Map(procs.map((p) => [p.id, p.burstTime]))
  const firstStartMap = {}
  const completionMap = {}
  const timeline = []
  const readyQueueSnapshots = {}

  const maxArrival = Math.max(...procs.map((p) => p.arrivalTime))
  const totalBurst = procs.reduce((s, p) => s + p.burstTime, 0)
  // Safety upper bound
  const upperBound = maxArrival + totalBurst + 1

  let currentTime = 0
  let completed = 0
  const n = procs.length

  while (completed < n && currentTime < upperBound) {
    // Build ready list
    const ready = procs.filter(
      (p) => p.arrivalTime <= currentTime && remaining.get(p.id) > 0
    )

    if (ready.length === 0) {
      timeline.push({ time: currentTime, processId: null })
      readyQueueSnapshots[currentTime] = []
      currentTime++
      continue
    }

    // Select shortest remaining; tie-break arrival then ID
    ready.sort((a, b) => {
      const ra = remaining.get(a.id)
      const rb = remaining.get(b.id)
      if (ra !== rb) return ra - rb
      if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime
      return String(a.id).localeCompare(String(b.id))
    })

    const selected = ready[0]
    const pid = selected.id

    if (firstStartMap[pid] === undefined) {
      firstStartMap[pid] = currentTime
    }

    // Snapshot ready queue (excluding the one about to run)
    readyQueueSnapshots[currentTime] = ready
      .filter((p) => p.id !== pid)
      .map((p) => p.id)

    // Execute one time unit
    timeline.push({ time: currentTime, processId: pid })
    remaining.set(pid, remaining.get(pid) - 1)
    currentTime++

    if (remaining.get(pid) === 0) {
      completionMap[pid] = currentTime
      completed++
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
