import React from 'react'
import { BarChart3, Download } from 'lucide-react'

export const ReportsPage: React.FC = () => {
  return (
    <div className="container-fluid" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-navy-950)' }}>Academy Reports & Analytics</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Enquiry source conversion breakdowns and counsellor performance metrics.
          </p>
        </div>
        <button type="button" className="btn btn-secondary" disabled>
          <Download size={16} />
          <span>Export Data</span>
        </button>
      </div>

      <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
        <BarChart3 size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-navy-900)' }}>Reports & Aggregates</h3>
        <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0.5rem auto 1rem', fontSize: '0.875rem' }}>
          Detailed conversion breakdown and CSV exports will be activated in Phase 11.
        </p>
      </div>
    </div>
  )
}
