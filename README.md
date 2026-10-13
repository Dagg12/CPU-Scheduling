# CPU Scheduling Lab – CMPG324 Operating Systems

Professional browser-based CPU Scheduling Simulator for the CMPG324 Operating Systems module (North-West University).

## Features

- **Process Builder**: Add, edit, delete processes; load sample; generate random; 
- **Algorithms**: FCFS (non-preemptive), SRTF (preemptive), Round Robin (configurable quantum)
- **Gantt Chart**: Spreadsheet layout with sticky Process ID column, yellow execution cells, idle indication
- **Interactive Simulation**: Play / Pause / Step / Reset with adjustable speed and live ready-queue
- **Performance Metrics**: Waiting time, Response time, Turnaround time, CPU utilisation, Throughput
- **Results & Reports**: Per-process table + algorithm comparison
- **Learn**: Educational explanations with formulas and worked examples
- Fully offline after `npm install` – no backend required

## Quick Start (Windows / macOS / Linux)

```bash
# 1. Extract the ZIP
# 2. Open a terminal in the project folder

npm install
npm run dev
```

Open the URL shown (usually http://localhost:5173)

## Production Build

```bash
npm run build
npm run preview
```

## Default Sample Workload

| Process ID | Arrival Time | Burst Time | Priority |
|------------|--------------|------------|----------|
| A          | 11           | 8          | 4        |
| B          | 13           | 9          | 1        |
| C          | 6            | 9          | 2        |
| D          | 1            | 6          | 3        |

Priority is stored and displayed but **does not affect** FCFS, SRTF or Round Robin scheduling.

## Algorithms

1. **FCFS** – Non-preemptive, arrival-order, tie-break by process ID
2. **SRTF** – Preemptive shortest-remaining-time, tie-break arrival then ID
3. **Round Robin** – Configurable time quantum (default 3), FIFO ready queue

## Metrics

- Turnaround Time = Completion − Arrival
- Waiting Time = Turnaround − Burst
- Response Time = First Start − Arrival
- CPU Utilisation = (Total Busy Time / Makespan) × 100
- Throughput = Completed Processes / Makespan

## Author

CMPG324 – Operating Systems  
Compiled by: Dr Lanka Sejaphala  
North-West University

Build 1.0.0
