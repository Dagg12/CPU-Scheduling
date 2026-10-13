/**
 * Round Robin (RR)
 *
 * - Configurable time quantum (default 3).
 * - FIFO ready queue.
 * - A process runs for at most one quantum (or until it finishes).
 * - Newly arriving processes are enqueued at the end.
 * - If a process is preempted it is re-enqueued at the end.
 * - Idle when ready queue is empty.
 */

import { computeMetrics } from './metrics.js'

export function runRoundRobin(processes, quantum = 3) {
  if (!processes || processes.length === 0) {
    return {
      timeline: [],
      firstStartMap: {},
      completionMap: {},
      metrics: computeMetrics([], [], {}, {}),
      readyQueueSnapshots: {}
    }
  }

  const q = Math.max(1, parseInt(quantum, 10) || 3)
  const procs = processes.map((p) => ({ ...p }))
  const remaining = new Map(procs.map((p) => [p.id, p.burstTime]))
  const firstStartMap = {}
  const completionMap = {}
  const timeline = []
  const readyQueueSnapshots = {}

  // Sort by arrival for deterministic arrival handling
  const sorted = [...procs].sort((a, b) => {
    if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime
    return String(a.id).localeCompare(String(b.id))
  })

  const readyQueue = [] // FIFO of process IDs
  const arrived = new Set()
  let currentTime = 0
  let completed = 0
  const n = procs.length
  const totalBurst = procs.reduce((s, p) => s + p.burstTime, 0)
  const upperBound = Math.max(...procs.map((p) => p.arrivalTime)) + totalBurst + q + 1

  // Helper: enqueue newly arrived processes (in arrival order)
  function enqueueArrivals(upToTime) {
    for (const p of sorted) {
      if (!arrived.has(p.id) && p.arrivalTime <= upToTime) {
        arrived.add(p.id)
        readyQueue.push(p.id)
      }
    }
  }

  // Start: enqueue processes that arrive at time 0
  enqueueArrivals(0)

  while (completed < n && currentTime < upperBound) {
    // If queue empty, advance time until something arrives
    if (readyQueue.length === 0) {
      // Find next arrival
      const nextArrival = sorted.find((p) => !arrived.has(p.id))
      if (!nextArrival) break
      while (currentTime < nextArrival.arrivalTime) {
        timeline.push({ time: currentTime, processId: null })
        readyQueueSnapshots[currentTime] = []
        currentTime++
      }
      enqueueArrivals(currentTime)
      continue
    }

    const pid = readyQueue.shift()
    if (remaining.get(pid) <= 0) continue

    if (firstStartMap[pid] === undefined) {
      firstStartMap[pid] = currentTime
    }

    const runTime = Math.min(q, remaining.get(pid))

    for (let t = 0; t < runTime; t++) {
      // Snapshot of ready queue (not including current running process)
      readyQueueSnapshots[currentTime] = [...readyQueue]
      timeline.push({ time: currentTime, processId: pid })
      remaining.set(pid, remaining.get(pid) - 1)
      currentTime++

      // Processes that arrive during this quantum join the ready queue
      enqueueArrivals(currentTime)

      if (remaining.get(pid) === 0) break
    }

    if (remaining.get(pid) === 0) {
      completionMap[pid] = currentTime
      completed++
    } else {
      // Preempted – re-enqueue at the end
      readyQueue.push(pid)
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
