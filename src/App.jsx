import React, { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Overview from './components/Overview'
import ProcessBuilder from './components/ProcessBuilder'
import Simulation from './components/Simulation'
import ResultsReports from './components/ResultsReports'
import Learn from './components/Learn'

const SAMPLE_PROCESSES = [
  { id: 'A', arrivalTime: 11, burstTime: 8, priority: 4 },
  { id: 'B', arrivalTime: 13, burstTime: 9, priority: 1 },
  { id: 'C', arrivalTime: 6, burstTime: 9, priority: 2 },
  { id: 'D', arrivalTime: 1, burstTime: 6, priority: 3 }
]

const PAGE_META = {
  overview: {
    title: 'CPU Scheduling Lab',
    subtitle: 'Build a workload, run algorithms, and compare performance.'
  },
  builder: {
    title: 'Process Builder',
    subtitle: 'Define your processes or load a sample workload.'
  },
  simulation: {
    title: 'Simulation',
    subtitle: 'Watch processes execute live on the CPU timeline.'
  },
  results: {
    title: 'Results & Reports',
    subtitle: 'Charts, comparison analysis, and PDF export.'
  },
  learn: {
    title: 'Learn',
    subtitle: 'Algorithms, metrics, formulas and a worked example.'
  }
}

const THEMES = [
  { id: 'blue', label: 'Blue' },
  { id: 'emerald', label: 'Emerald' },
  { id: 'violet', label: 'Violet' },
  { id: 'slate', label: 'Slate' }
]

export default function App() {
  const [activePage, setActivePage] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [processes, setProcesses] = useState(SAMPLE_PROCESSES)
  const [algorithm, setAlgorithm] = useState('Round Robin')
  const [quantum, setQuantum] = useState(3)
  const [simulationResult, setSimulationResult] = useState(null)
  const [theme, setTheme] = useState('blue')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'blue' ? '' : theme)
  }, [theme])

  const meta = PAGE_META[activePage] || PAGE_META.overview

  return (
    <div className="app-layout">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 99
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="main-content">
        <header className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <div>
              <h1>{meta.title}</h1>
              <p>{meta.subtitle}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div className="theme-switcher" title="Colour theme">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  className={`theme-btn ${t.id} ${theme === t.id ? 'active' : ''}`}
                  onClick={() => setTheme(t.id)}
                  title={t.label}
                  aria-label={`Theme ${t.label}`}
                />
              ))}
            </div>
            <span className="badge">Local simulation</span>
          </div>
        </header>

        <main className="page-body">
          {activePage === 'overview' && (
            <Overview
              processCount={processes.length}
              algorithm={algorithm}
              quantum={quantum}
              onNavigate={setActivePage}
            />
          )}
          {activePage === 'builder' && (
            <ProcessBuilder processes={processes} setProcesses={setProcesses} />
          )}
          {activePage === 'simulation' && (
            <Simulation
              processes={processes}
              algorithm={algorithm}
              setAlgorithm={setAlgorithm}
              quantum={quantum}
              setQuantum={setQuantum}
              simulationResult={simulationResult}
              setSimulationResult={setSimulationResult}
            />
          )}
          {activePage === 'results' && (
            <ResultsReports
              processes={processes}
              algorithm={algorithm}
              quantum={quantum}
              simulationResult={simulationResult}
              onNavigate={setActivePage}
            />
          )}
          {activePage === 'learn' && <Learn />}
        </main>
      </div>
    </div>
  )
}
