import React from 'react'
import { ShieldCheck, Database, Key, Server, CheckCircle2 } from 'lucide-react'

export const SettingsPage: React.FC = () => {
  return (
    <div className="container-fluid" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--slate-900)', letterSpacing: '-0.02em' }}>
          Academy & System Preferences
        </h1>
        <p style={{ fontSize: '0.8125rem', color: 'var(--slate-500)' }}>
          Manage your cloud backend configuration, staff permissions, and campus properties.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        
        {/* Card 1: Supabase Configuration */}
        <div className="card-elevated" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ padding: '0.45rem', borderRadius: 'var(--radius-sm)', backgroundColor: '#eff6ff', color: 'var(--color-brand-600)' }}>
              <Database size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--slate-900)' }}>Supabase PostgreSQL Client</h2>
              <p style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>Cloud database connectivity</p>
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--slate-600)', marginBottom: '1rem', lineHeight: 1.4 }}>
            Direct typed data-access layer via <code>@supabase/supabase-js</code>. Client singleton initialized with fail-soft diagnostic probe and environment validation.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--slate-500)' }}>
            <Key size={14} />
            <span>Environment keys: <code>VITE_SUPABASE_URL</code> & <code>VITE_SUPABASE_ANON_KEY</code></span>
          </div>
        </div>

        {/* Card 2: Row Level Security */}
        <div className="card-elevated" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ padding: '0.45rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--semantic-emerald-bg)', color: 'var(--semantic-emerald)' }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--slate-900)' }}>Row-Level Security (RLS)</h2>
              <p style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>Database boundary authorization</p>
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--slate-600)', marginBottom: '1rem', lineHeight: 1.4 }}>
            Multi-role policies for <strong>Admin</strong>, <strong>Manager</strong>, and <strong>Counsellor</strong>. All queries are scoped at the PostgreSQL engine level.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--semantic-emerald)', fontWeight: 600 }}>
            <CheckCircle2 size={14} />
            <span>Schema migration ready for execution in Phase 03</span>
          </div>
        </div>

        {/* Card 3: Vercel Deployment */}
        <div className="card-elevated" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ padding: '0.45rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--slate-100)', color: 'var(--slate-700)' }}>
              <Server size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--slate-900)' }}>Vercel Continuous Delivery</h2>
              <p style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>Edge hosting pipeline</p>
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--slate-600)', marginBottom: '1rem', lineHeight: 1.4 }}>
            Synchronized with GitHub <code>origin/main</code>. Every phase passes automated lint and bundle builds before deployment.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--slate-500)' }}>
            <span>Repository: <code>ckondreddy/brightpath-crm</code></span>
          </div>
        </div>

      </div>

    </div>
  )
}
