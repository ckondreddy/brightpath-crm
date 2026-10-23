import React, { useEffect, useState } from 'react'
import { isSupabaseConfigured, checkSupabaseHealth, HealthCheckResult } from '../../lib/supabaseClient'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ConnectionStatusBadgeProps {
  onOpenConfig?: () => void
}

export const ConnectionStatusBadge: React.FC<ConnectionStatusBadgeProps> = ({ onOpenConfig }) => {
  const [health, setHealth] = useState<HealthCheckResult | null>(null)
  const [checking, setChecking] = useState<boolean>(() => isSupabaseConfigured())

  useEffect(() => {
    let isMounted = true
    checkSupabaseHealth().then((result) => {
      if (isMounted) {
        setHealth(result)
        setChecking(false)
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

  const handleManualRecheck = async () => {
    setChecking(true)
    const result = await checkSupabaseHealth()
    setHealth(result)
    setChecking(false)
  }

  const configured = isSupabaseConfigured()

  if (checking && !health) {
    return (
      <div 
        className="interactive-press"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.25rem 0.65rem',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--slate-100)',
          border: '1px solid var(--border-default)',
          fontSize: '0.725rem',
          color: 'var(--slate-600)',
          fontWeight: 500,
        }}
      >
        <RefreshCw size={11} className="animate-spin-fast" />
        <span>Checking backend...</span>
      </div>
    )
  }

  if (configured && health?.healthy) {
    return (
      <div 
        className="interactive-press"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.25rem 0.65rem',
          borderRadius: 'var(--radius-full)',
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          fontSize: '0.725rem',
          color: '#15803d',
          fontWeight: 600,
          cursor: 'pointer',
        }}
        onClick={handleManualRecheck}
        title={`${health.message} Click to re-ping.`}
      >
        <span 
          className="animate-pulse-subtle"
          style={{
            width: '6px',
            height: '6px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: '#16a34a',
            display: 'inline-block',
          }} 
        />
        <span>Supabase Cloud</span>
        {health.latencyMs && (
          <span style={{ fontSize: '0.65rem', color: '#16a34a', opacity: 0.8, fontFamily: 'var(--font-mono)' }}>
            {health.latencyMs}ms
          </span>
        )}
      </div>
    )
  }

  return (
    <button
      type="button"
      className="interactive-press"
      onClick={onOpenConfig}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        padding: '0.25rem 0.65rem',
        borderRadius: 'var(--radius-full)',
        backgroundColor: '#fffbeb',
        border: '1px solid #fde68a',
        fontSize: '0.725rem',
        color: '#b45309',
        fontWeight: 600,
        cursor: 'pointer',
      }}
      title="Supabase is not configured yet. Click to view setup instructions."
    >
      <span 
        style={{
          width: '6px',
          height: '6px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: '#d97706',
          display: 'inline-block',
        }} 
      />
      <span>Setup Backend</span>
      <AlertTriangle size={12} />
    </button>
  )
}
