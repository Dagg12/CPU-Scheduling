import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('CPU Scheduling Lab failed to render:', error, info)
  }

  render() {
    if (this.state.error) {
      const message = this.state.error?.message || String(this.state.error)
      return (
        <main style={{ minHeight: '100vh', padding: '2rem', background: '#f8fafc', color: '#0f172a', fontFamily: 'system-ui, sans-serif' }}>
          <section style={{ maxWidth: 760, margin: '3rem auto', padding: '2rem', background: '#fff', border: '1px solid #fecaca', borderRadius: 16, boxShadow: '0 10px 30px rgba(15,23,42,.08)' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '.75rem' }}>CPU Scheduling Lab could not start</h1>
            <p style={{ marginBottom: '1rem', color: '#475569' }}>The page loaded, but the interface encountered a JavaScript error. This diagnostic replaces the blank screen so the cause can be identified.</p>
            <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', padding: '1rem', borderRadius: 8, background: '#fff1f2', color: '#9f1239' }}>{message}</pre>
            <button onClick={() => window.location.reload()} style={{ marginTop: '1rem', padding: '.7rem 1rem', border: 0, borderRadius: 8, background: '#1d4ed8', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Reload application</button>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Missing #root element in index.html')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </React.StrictMode>
)
