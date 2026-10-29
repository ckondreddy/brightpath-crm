import React from 'react'
import { AlertOctagon, HelpCircle } from 'lucide-react'
import { LostReasonItem } from '../../services/reportService'

interface LostReasonBreakdownProps {
  lostReasons: LostReasonItem[]
  totalLostCount: number
}

export const LostReasonBreakdown: React.FC<LostReasonBreakdownProps> = ({
  lostReasons,
  totalLostCount,
}) => {
  if (lostReasons.length === 0 || totalLostCount === 0) {
    return (
      <div className="reports-section-card">
        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8' }}>
          <p style={{ margin: 0, fontWeight: 600, color: '#34d399' }}>Zero Lost Leads In This Period</p>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>
            All enquiries are either actively in consultation or successfully converted.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="reports-section-card">
      <div className="reports-section-header">
        <div>
          <h2 className="reports-section-title">
            <AlertOctagon size={16} color="#f87171" />
            <span>Drop-off & Lost Reason Analysis</span>
          </h2>
          <p className="reports-section-desc">
            Primary objections, competitor pressure, and friction points recorded during student counselling.
          </p>
        </div>
        <span className="reports-kpi-pill pill-danger">
          {totalLostCount} Lost Enquiries Recorded
        </span>
      </div>

      <div className="lost-reason-list">
        {lostReasons.map((item) => (
          <div key={item.reason} className="lost-reason-row">
            <div className="lost-reason-info">
              <span className="lost-reason-name">{item.reason}</span>
              <span className="lost-reason-metric">
                {item.count} leads ({item.percentage}%)
              </span>
            </div>
            <div className="lost-reason-track">
              <div
                className="lost-reason-bar"
                style={{ width: `${Math.min(100, item.percentage)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: '0.5rem',
          padding: '0.75rem 1rem',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.75rem',
          color: '#475569',
        }}
      >
        <HelpCircle size={14} color="#2563eb" style={{ flexShrink: 0 }} />
        <span>
          <strong>Academy Leadership Note:</strong> Mandatory lost reason tracking was activated in Phase 07. Counsellors cannot archive a lead as 'Lost' without capturing the root objection.
        </span>
      </div>
    </div>
  )
}
