/**
 * Validation utilities for process data
 */

export function validateProcess(process, existingIds = [], excludeId = null) {
  const errors = {}

  // Process ID
  if (!process.id || String(process.id).trim() === '') {
    errors.id = 'Process ID is required'
  } else {
    const id = String(process.id).trim()
    const duplicates = existingIds.filter(
      (existing) => existing !== excludeId && existing === id
    )
    if (duplicates.length > 0) {
      errors.id = 'Process ID must be unique'
    }
  }

  // Arrival Time
  const arrival = Number(process.arrivalTime)
  if (process.arrivalTime === '' || process.arrivalTime === null || process.arrivalTime === undefined) {
    errors.arrivalTime = 'Arrival time is required'
  } else if (!Number.isInteger(arrival) || arrival < 0) {
    errors.arrivalTime = 'Arrival time must be a non-negative integer'
  }

  // Burst Time
  const burst = Number(process.burstTime)
  if (process.burstTime === '' || process.burstTime === null || process.burstTime === undefined) {
    errors.burstTime = 'Burst time is required'
  } else if (!Number.isInteger(burst) || burst <= 0) {
    errors.burstTime = 'Burst time must be a positive integer'
  }

  // Priority
  const priority = Number(process.priority)
  if (process.priority === '' || process.priority === null || process.priority === undefined) {
    errors.priority = 'Priority is required'
  } else if (!Number.isInteger(priority) || priority <= 0) {
    errors.priority = 'Priority must be a positive integer'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export function validateWorkload(processes) {
  if (!Array.isArray(processes) || processes.length === 0) {
    return { isValid: false, message: 'At least one process is required' }
  }

  const ids = processes.map((p) => String(p.id).trim())
  const uniqueIds = new Set(ids)
  if (uniqueIds.size !== ids.length) {
    return { isValid: false, message: 'Duplicate Process IDs detected' }
  }

  for (const p of processes) {
    const result = validateProcess(p, ids, p.id)
    if (!result.isValid) {
      return {
        isValid: false,
        message: `Invalid data for process ${p.id}: ${Object.values(result.errors).join(', ')}`
      }
    }
  }

  return { isValid: true, message: '' }
}

export function sanitizeProcess(process) {
  return {
    id: String(process.id || '').trim(),
    arrivalTime: Math.max(0, parseInt(process.arrivalTime, 10) || 0),
    burstTime: Math.max(1, parseInt(process.burstTime, 10) || 1),
    priority: Math.max(1, parseInt(process.priority, 10) || 1)
  }
}
