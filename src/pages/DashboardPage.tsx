import React from 'react'
import { LayoutDashboard, Users, CalendarClock, TrendingUp, AlertCircle } from 'lucide-react'

export const DashboardPage: React.FC = () => {
  return (
    <div className="container-fluid" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-navy-950)' }}>Academy Overview</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Welcome to BrightPath CRM. Track student enquiries, counsellor follow-ups, and admissions.
          </p>
        </div>
      </div>

      {/* KPI Cards Preview */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '1rem' 
      }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>Total Leads</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.25rem' }}>0</h3>
            </div>
            <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--status-new-bg)', color: 'var(--color-primary)' }}>
              <Users size={20} />
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>Phase 01 Shell Preview</p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>New Enquiries</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.25rem' }}>0</h3>
            </div>
            <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: '#ecfdf5', color: '#059669' }}>
              <LayoutDashboard size={20} />
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>Awaiting Supabase Connection</p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>Overdue Follow-ups</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.25rem' }}>0</h3>
            </div>
            <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--status-lost-bg)', color: 'var(--status-lost-text)' }}>
              <AlertCircle size={20} />
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>Requires immediate action</p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>Conversion Rate</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.25rem' }}>0.0%</h3>
            </div>
            <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>Admissions / Total leads</p>
        </div>
      </div>

      <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
        <CalendarClock size={40} color="var(--color-primary)" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-navy-900)' }}>Phase 01: Application Shell Active</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '520px', margin: '0.5rem auto 1.5rem', fontSize: '0.9rem' }}>
          Navigation shell, TypeScript system, and design tokens are established. In the next phase, we connect Supabase and configure the database tables.
        </p>
        <span className="status-badge new">Phase 01 Complete & Ready for Review</span>
      </div>
    </div>
  )
}
