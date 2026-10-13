/**
 * Performance metrics calculation
 */

/**
 * Compute per-process and aggregate metrics from a completed schedule.
 * @param {Array} processes - Original process list
 * @param {Array} timeline - Array of { time, processId } for each time unit
 * @param {Object} firstStartMap - Map of processId -> first start time
 * @param {Object} completionMap - Map of processId -> completion time
 */
export function computeMetrics(processes, timeline, firstStartMap, completionMap) {
  if (!processes || processes.length === 0) {
    return {
      perProcess: [],
      averages: {
        waitingTime: 0,
        turnaroundTime: 0,
        responseTime: 0
      },
      cpuUtilisation: 0,
      throughput: 0,
      makespan: 0,
      totalBusyTime: 0
    }
  }

  const makespan = timeline.length
  let totalBusyTime = 0

  const perProcess = processes.map((p) => {
    const id = p.id
    const arrival = p.arrivalTime
    const burst = p.burstTime
    const firstStart = firstStartMap[id] ?? arrival
    const completion = completionMap[id] ?? arrival

    const turnaround = completion - arrival
    const waiting = turnaround - burst
    const response = firstStart - arrival

    totalBusyTime += burst

    return {
      id,
      arrivalTime: arrival,
      burstTime: burst,
      priority: p.priority,
      firstStart,
      completionTime: completion,
      turnaroundTime: turnaround,
      waitingTime: Math.max(0, waiting),
      responseTime: Math.max(0, response)
    }
  })

  const n = perProcess.length
  const sumWait = perProcess.reduce((s, r) => s + r.waitingTime, 0)
  const sumTurn = perProcess.reduce((s, r) => s + r.turnaroundTime, 0)
  const sumResp = perProcess.reduce((s, r) => s + r.responseTime, 0)

  const cpuUtilisation =
    makespan > 0 ? (totalBusyTime / makespan) * 100 : 0
  const throughput = makespan > 0 ? n / makespan : 0

  return {
    perProcess,
    averages: {
      waitingTime: n > 0 ? sumWait / n : 0,
      turnaroundTime: n > 0 ? sumTurn / n : 0,
      responseTime: n > 0 ? sumResp / n : 0
    },
    cpuUtilisation,
    throughput,
    makespan,
    totalBusyTime
  }
}
