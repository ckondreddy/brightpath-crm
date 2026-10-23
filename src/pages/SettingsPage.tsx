import React from 'react'
import { ShieldCheck, Database } from 'lucide-react'

export const SettingsPage: React.FC = () => {
  return (
    <div className="container-fluid" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-navy-950)' }}>System Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Application configuration, user role policies, and database connection.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--status-new-bg)', color: 'var(--color-primary)' }}>
              <Database size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Supabase Backend</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Connection status & credentials</p>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Ready for configuration in Phase 02 (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`).
          </p>
          <span className="status-badge new">Phase 02 Scheduled</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: '#f0fdf4', color: '#16a34a' }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Access Control & RLS</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Administrator & Counsellor roles</p>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Row Level Security policies enforce access boundaries strictly inside PostgreSQL.
          </p>
          <span className="status-badge qualified">Phase 03 Scheduled</span>
        </div>
      </div>
    </div>
  )
}
