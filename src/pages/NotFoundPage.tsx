import React from 'react'
import { Link } from 'react-router-dom'
import { Home, AlertTriangle } from 'lucide-react'

export const NotFoundPage: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '70vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      textAlign: 'center',
      padding: '2rem'
    }}>
      <AlertTriangle size={56} color="var(--color-accent-amber)" style={{ marginBottom: '1rem' }} />
      <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-navy-950)' }}>404 — Page Not Found</h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0.5rem 0 1.5rem' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">
        <Home size={16} />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  )
}
