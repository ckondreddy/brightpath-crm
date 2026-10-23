import React from 'react'
import { Navigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { isSupabaseConfigured } from '../../lib/supabaseClient'
import { GraduationCap, ShieldAlert, Home } from 'lucide-react'
import { UserRole } from '../../types'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, profile, loading } = useAuth()
  const location = useLocation()
  const configured = isSupabaseConfigured()

  // 1. Sleek hydration loader
  if (loading) {
    return (
      <div 
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--color-obsidian-950)',
          color: '#ffffff',
          gap: '1rem',
        }}
      >
        <div 
          className="animate-pulse-subtle"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(37, 99, 235, 0.4)',
          }}
        >
          <GraduationCap size={26} color="#ffffff" />
        </div>
        <div style={{ fontSize: '0.8125rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
          Authenticating session...
        </div>
      </div>
    )
  }

  // 2. If Supabase is configured and user is not signed in -> redirect to /login
  if (configured && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 3. Role-based permission restriction
  if (requiredRole && profile?.role !== requiredRole && profile?.role !== 'admin') {
    return (
      <div 
        style={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <div 
          style={{
            width: '56px',
            height: '56px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: '#fff1f2',
            color: '#be123c',
            border: '1px solid #fecdd3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}
        >
          <ShieldAlert size={28} />
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-900)' }}>
          Access Restricted
        </h2>
        <p style={{ color: 'var(--slate-600)', maxWidth: '440px', margin: '0.5rem 0 1.5rem', fontSize: '0.85rem' }}>
          This section requires <strong>{requiredRole}</strong> privileges. Your current assigned role is <strong>{profile?.role ?? 'counsellor'}</strong>.
        </p>
        <Link to="/" className="btn btn-secondary">
          <Home size={14} />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    )
  }

  return <>{children}</>
}
