import React from 'react'
import {
  LayoutDashboard,
  ListOrdered,
  Play,
  BarChart3,
  BookOpen,
  Cpu
} from 'lucide-react'

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'builder', label: 'Process Builder', icon: ListOrdered },
  { id: 'simulation', label: 'Simulation', icon: Play },
  { id: 'results', label: 'Results & Reports', icon: BarChart3 },
  { id: 'learn', label: 'Learn', icon: BookOpen }
]

export default function Sidebar({ activePage, onNavigate, isOpen, onClose }) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Cpu size={20} color="#fff" />
          </div>
          <div className="sidebar-logo-text">
            <h1>CPU Scheduling Lab</h1>
            <p>CMPG324 – Operating Systems</p>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-item ${activePage === id ? 'active' : ''}`}
            onClick={() => {
              onNavigate(id)
              onClose?.()
            }}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div>CPU Scheduling Simulator</div>
        <div>Build 1.0.0</div>
      </div>
    </aside>
  )
}
