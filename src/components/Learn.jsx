import React from 'react'

export default function Learn() {
  return (
    <div>
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
          CPU Scheduling Concepts
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Concise reference for CMPG324 Operating Systems. Use this page while
          preparing for practicals or examinations.
        </p>
      </div>

      {/* Algorithms */}
      <div className="card learn-section">
        <h3>1. First Come First Served (FCFS)</h3>
        <p>
          The simplest non-preemptive algorithm. Processes are executed in the
          order they arrive. Once a process starts it runs to completion.
        </p>
        <ul>
          <li>Easy to implement with a FIFO queue.</li>
          <li>Can cause long average waiting times (convoy effect).</li>
          <li>No starvation if every process eventually arrives.</li>
        </ul>
        <p><strong>Best for:</strong> batch systems where fairness by arrival is acceptable.</p>
      </div>

      <div className="card learn-section">
        <h3>2. Shortest Remaining Time First (SRTF)</h3>
        <p>
          The preemptive version of Shortest Job First. At every time unit the
          CPU is given to the arrived process with the smallest remaining burst
          time. A newly arriving shorter process can preempt the current one.
        </p>
        <ul>
          <li>Minimises average waiting and turnaround time when burst times are known.</li>
          <li>Risk of starvation for long processes if short jobs keep arriving.</li>
          <li>Requires knowledge (or estimates) of remaining burst times.</li>
        </ul>
        <p><strong>Best for:</strong> interactive systems that need good response for short jobs.</p>
      </div>

      <div className="card learn-section">
        <h3>3. Round Robin (RR)</h3>
        <p>
          Each process is given a fixed time slice (quantum). If it does not
          finish, it is preempted and placed at the end of the ready queue.
        </p>
        <ul>
          <li>Fair and responsive; no process waits indefinitely.</li>
          <li>Performance depends heavily on the quantum size.</li>
          <li>Too small → high context-switch overhead; too large → approaches FCFS.</li>
        </ul>
        <p><strong>Best for:</strong> time-sharing and interactive multi-user systems.</p>
      </div>

      {/* Metrics */}
      <div className="card learn-section">
        <h3>4. Performance Metrics &amp; Formulas</h3>

        <p><strong>Arrival Time</strong> – The time at which a process enters the ready queue.</p>
        <p><strong>Burst Time</strong> – The total CPU time the process requires.</p>
        <p><strong>Time Quantum</strong> – The maximum time a process may run before being preempted (Round Robin).</p>

        <div className="formula">
          Turnaround Time = Completion Time − Arrival Time
        </div>
        <div className="formula">
          Waiting Time = Turnaround Time − Burst Time
        </div>
        <div className="formula">
          Response Time = First CPU Start Time − Arrival Time
        </div>
        <div className="formula">
          CPU Utilisation = (Total Busy CPU Time / Makespan) × 100
        </div>
        <div className="formula">
          Throughput = Number of Completed Processes / Makespan
        </div>

        <p style={{ marginTop: '0.75rem' }}>
          <strong>Makespan</strong> (total elapsed time) is the time from the
          start of the first activity until the last process completes.
        </p>
      </div>

      {/* Gantt */}
      <div className="card learn-section">
        <h3>5. Gantt Charts</h3>
        <p>
          A Gantt chart shows which process occupies the CPU at each time unit.
          In this simulator we use a spreadsheet-style chart: rows are
          processes, columns are consecutive time units. A highlighted (yellow)
          cell means that process executed during that interval.
        </p>
        <p>
          Column numbering convention used here: column <strong>n</strong>
          represents the half-open interval [<em>n</em>−1, <em>n</em>).
        </p>
      </div>

      {/* Worked example */}
      <div className="card learn-section">
        <h3>6. Worked Example (FCFS)</h3>
        <p>Consider three processes:</p>
        <div className="table-wrapper" style={{ margin: '0.5rem 0' }}>
          <table>
            <thead>
              <tr>
                <th>Process</th>
                <th>Arrival</th>
                <th>Burst</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>P1</td><td>0</td><td>5</td></tr>
              <tr><td>P2</td><td>1</td><td>3</td></tr>
              <tr><td>P3</td><td>2</td><td>2</td></tr>
            </tbody>
          </table>
        </div>
        <p>FCFS execution order: P1 (0–5), P2 (5–8), P3 (8–10).</p>
        <div className="example-box">
          <strong>P1:</strong> Start = 0, Completion = 5 → TAT = 5, WT = 0, RT = 0<br />
          <strong>P2:</strong> Start = 5, Completion = 8 → TAT = 7, WT = 4, RT = 4<br />
          <strong>P3:</strong> Start = 8, Completion = 10 → TAT = 8, WT = 6, RT = 6<br />
          <br />
          Average Waiting Time = (0 + 4 + 6) / 3 = <strong>3.33</strong><br />
          Average Turnaround Time = (5 + 7 + 8) / 3 = <strong>6.67</strong><br />
          CPU Utilisation = 10 / 10 × 100 = <strong>100%</strong>
        </div>
      </div>

      <div className="card learn-section">
        <h3>7. Which algorithm is “best”?</h3>
        <p>
          There is no universal winner. Choice depends on the optimisation goal:
        </p>
        <ul>
          <li><strong>Minimise average waiting / turnaround</strong> → SRTF (when burst times are known).</li>
          <li><strong>Fairness &amp; responsiveness</strong> → Round Robin with a well-chosen quantum.</li>
          <li><strong>Simplicity / predictable order</strong> → FCFS.</li>
        </ul>
        <p>
          Use the <strong>Results &amp; Reports</strong> page to compare all three
          algorithms on the same workload and decide for yourself.
        </p>
      </div>
    </div>
  )
}
