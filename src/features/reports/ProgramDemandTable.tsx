import React from 'react'
import { BookOpen } from 'lucide-react'
import { ProgramDemandItem } from '../../services/reportService'

interface ProgramDemandTableProps {
  programs: ProgramDemandItem[]
}

export const ProgramDemandTable: React.FC<ProgramDemandTableProps> = ({ programs }) => {
  if (programs.length === 0) {
    return (
      <div className="reports-section-card">
        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8' }}>
          No academic program data logged for this period.
        </div>
      </div>
    )
  }

  return (
    <div className="reports-section-card">
      <div className="reports-section-header">
        <div>
          <h2 className="reports-section-title">
            <BookOpen size={16} color="#60a5fa" />
            <span>Academic Program Demand & Batch Enrolment</span>
          </h2>
          <p className="reports-section-desc">
            Enquiry volume and admission conversion across courses and test prep batches.
          </p>
        </div>
      </div>

      <div className="reports-table-wrapper">
        <table className="reports-table">
          <thead>
            <tr>
              <th>Course Program</th>
              <th>Total Enquiries</th>
              <th>Enrolled Admissions</th>
              <th>Conversion Rate</th>
              <th>Share of Academic Pipeline</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((p) => {
              const isHigh = p.conversionRate >= 25.0
              const isModerate = p.conversionRate >= 15.0

              return (
                <tr key={p.course}>
                  <td style={{ fontWeight: 600, color: '#0f172a' }}>
                    {p.course}
                  </td>
                  <td className="tabular-nums" style={{ fontWeight: 600, color: '#0f172a' }}>
                    {p.enquiries}
                  </td>
                  <td className="tabular-nums" style={{ fontWeight: 700, color: '#059669' }}>
                    {p.converted}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div className="reports-progress-track">
                        <div
                          className={`reports-progress-fill ${isHigh ? 'fill-emerald' : isModerate ? 'fill-blue' : 'fill-amber'}`}
                          style={{ width: `${Math.min(100, p.conversionRate)}%` }}
                        />
                      </div>
                      <span
                        className="tabular-nums"
                        style={{
                          fontWeight: 600,
                          color: isHigh ? '#059669' : isModerate ? '#1d4ed8' : '#d97706',
                          fontSize: '0.75rem',
                        }}
                      >
                        {p.conversionRate}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <span
                      className="tabular-nums"
                      style={{
                        fontSize: '0.75rem',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      {p.shareOfPipeline}%
                    </span>
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
