import React from 'react'
import { CalendarClock, Plus } from 'lucide-react'

export const FollowUpsPage: React.FC = () => {
  return (
    <div className="container-fluid" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-navy-950)' }}>Follow-up Schedule</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Stay on top of scheduled calls, walk-ins, and pending consultations.
          </p>
        </div>
        <button type="button" className="btn btn-primary" disabled>
          <Plus size={16} />
          <span>Schedule Follow-up</span>
        </button>
      </div>

      <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
        <CalendarClock size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-navy-900)' }}>Follow-up Engine Coming Soon</h3>
        <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0.5rem auto 1rem', fontSize: '0.875rem' }}>
          Scheduling engine, automatic overdue calculation, and completion tracking will be implemented in Phase 08.
        </p>
      </div>
    </div>
  )
}
