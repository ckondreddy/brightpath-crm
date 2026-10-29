import React from 'react'
import { Users, Award, Clock } from 'lucide-react'
import { CounsellorPerformanceItem } from '../../services/reportService'

interface CounsellorLeaderboardProps {
  counsellors: CounsellorPerformanceItem[]
}

export const CounsellorLeaderboard: React.FC<CounsellorLeaderboardProps> = ({ counsellors }) => {
  if (counsellors.length === 0) {
    return (
      <div className="reports-section-card">
        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8' }}>
          No counsellor performance data logged for this period.
        </div>
      </div>
    )
  }

  return (
    <div className="reports-section-card">
      <div className="reports-section-header">
        <div>
          <h2 className="reports-section-title">
            <Users size={16} color="#60a5fa" />
            <span>Admissions Counsellor Performance & Velocity</span>
          </h2>
          <p className="reports-section-desc">
            Enrolment success rates, pipeline load, and average turnaround cycle per staff member.
          </p>
        </div>
      </div>

      <div className="reports-table-wrapper">
        <table className="reports-table">
          <thead>
            <tr>
              <th>Counsellor</th>
              <th>Assigned Leads</th>
              <th>Enrolled (Converted)</th>
              <th>In-Progress Active</th>
              <th>Lost Leads</th>
              <th>Conversion Rate</th>
              <th>Avg Turnaround</th>
              <th>Performance Tag</th>
            </tr>
          </thead>
          <tbody>
            {counsellors.map((c, idx) => {
              const initials = c.counsellorName
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()

              const isTop = idx === 0 && c.converted > 0

              return (
                <tr key={c.counsellorId}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span className="counsellor-avatar-chip">{initials}</span>
                      <div>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>
                          {c.counsellorName}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                          {c.role}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="tabular-nums" style={{ fontWeight: 600, color: '#0f172a' }}>
                    {c.assignedLeads}
                  </td>
                  <td className="tabular-nums" style={{ fontWeight: 700, color: '#059669' }}>
                    {c.converted}
                  </td>
                  <td className="tabular-nums" style={{ color: '#2563eb', fontWeight: 600 }}>
                    {c.active}
                  </td>
                  <td className="tabular-nums" style={{ color: '#dc2626', fontWeight: 600 }}>
                    {c.lost}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div className="reports-progress-track">
                        <div
                          className="reports-progress-fill fill-emerald"
                          style={{ width: `${Math.min(100, c.conversionRate)}%` }}
                        />
                      </div>
                      <span className="tabular-nums" style={{ fontWeight: 600, color: '#059669', fontSize: '0.75rem' }}>
                        {c.conversionRate}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="tabular-nums" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#475569' }}>
                      <Clock size={12} /> {c.avgCycleDays}d
                    </span>
                  </td>
                  <td>
                    {isTop ? (
                      <span className="reports-kpi-pill pill-success" style={{ gap: '0.25rem' }}>
                        <Award size={11} /> Top Enroller
                      </span>
                    ) : c.conversionRate >= 20.0 ? (
                      <span className="reports-kpi-pill pill-info">
                        High Closer
                      </span>
                    ) : (
                      <span className="reports-kpi-pill pill-warning">
                        Active Roster
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
