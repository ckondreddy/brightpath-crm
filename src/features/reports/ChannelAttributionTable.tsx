import React from 'react'
import { Compass } from 'lucide-react'
import { ChannelAttributionItem } from '../../services/reportService'

interface ChannelAttributionTableProps {
  channels: ChannelAttributionItem[]
}

export const ChannelAttributionTable: React.FC<ChannelAttributionTableProps> = ({ channels }) => {
  if (channels.length === 0) {
    return (
      <div className="reports-section-card">
        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8' }}>
          No channel attribution records found for this period.
        </div>
      </div>
    )
  }

  return (
    <div className="reports-section-card">
      <div className="reports-section-header">
        <div>
          <h2 className="reports-section-title">
            <Compass size={16} color="#60a5fa" />
            <span>Intake Channel Attribution & Conversion Efficiency</span>
          </h2>
          <p className="reports-section-desc">
            Performance of marketing channels, organic inquiries, and student referral programs.
          </p>
        </div>
      </div>

      <div className="reports-table-wrapper">
        <table className="reports-table">
          <thead>
            <tr>
              <th>Channel Source</th>
              <th>Total Enquiries</th>
              <th>Contacted</th>
              <th>Qualified</th>
              <th>Enrolled Students</th>
              <th>Conversion Rate</th>
              <th>Share of Pipeline</th>
            </tr>
          </thead>
          <tbody>
            {channels.map((c) => {
              const isHigh = c.conversionRate >= 25.0
              const isModerate = c.conversionRate >= 15.0

              return (
                <tr key={c.source}>
                  <td style={{ fontWeight: 600, color: '#f8fafc' }}>
                    {c.source}
                  </td>
                  <td className="tabular-nums" style={{ fontWeight: 600 }}>
                    {c.total}
                  </td>
                  <td className="tabular-nums" style={{ color: '#94a3b8' }}>
                    {c.contacted}
                  </td>
                  <td className="tabular-nums" style={{ color: '#c084fc' }}>
                    {c.qualified}
                  </td>
                  <td className="tabular-nums" style={{ fontWeight: 700, color: '#34d399' }}>
                    {c.converted}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div className="reports-progress-track">
                        <div
                          className={`reports-progress-fill ${isHigh ? 'fill-emerald' : isModerate ? 'fill-blue' : 'fill-amber'}`}
                          style={{ width: `${Math.min(100, c.conversionRate)}%` }}
                        />
                      </div>
                      <span
                        className="tabular-nums"
                        style={{
                          fontWeight: 600,
                          color: isHigh ? '#34d399' : isModerate ? '#60a5fa' : '#fbbf24',
                          fontSize: '0.75rem',
                        }}
                      >
                        {c.conversionRate}%
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
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        color: '#94a3b8',
                      }}
                    >
                      {c.shareOfTotal}%
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
