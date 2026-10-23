import React from 'react'
import { Download, TrendingUp, Users, Target, ArrowUpRight } from 'lucide-react'

export const ReportsPage: React.FC = () => {
  return (
    <div className="container-fluid" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--slate-900)', letterSpacing: '-0.02em' }}>
            Admissions & Performance Analytics
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--slate-500)' }}>
            Conversion benchmarks across intake channels and counsellor teams.
          </p>
        </div>

        <button type="button" className="btn btn-secondary">
          <Download size={14} />
          <span>Export Summary Report</span>
        </button>
      </div>

      {/* Analytics KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        <div className="card-elevated" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
              Enrolment Conversion Rate
            </span>
            <Target size={16} color="var(--slate-400)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span className="tabular-nums" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--slate-900)' }}>25.0%</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--semantic-emerald)', fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}>
              <ArrowUpRight size={12} /> +3.2%
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>Goal benchmark: 22.0%</p>
        </div>

        <div className="card-elevated" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
              Avg Counselling Cycle
            </span>
            <TrendingUp size={16} color="var(--slate-400)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span className="tabular-nums" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--slate-900)' }}>4.8 Days</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>From enquiry to fee deposit</p>
        </div>

        <div className="card-elevated" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
              Top Converting Channel
            </span>
            <Users size={16} color="var(--slate-400)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--slate-900)' }}>Walk-in Center</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--semantic-emerald)', fontWeight: 600, marginTop: '0.25rem' }}>41.8% conversion rate</p>
        </div>
      </div>

      {/* Channel Attribution Breakdown */}
      <div className="card-elevated" style={{ padding: '1.25rem' }}>
        <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '1rem' }}>
          Intake Channel Attribution & Efficiency
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-default)', backgroundColor: 'var(--slate-50)' }}>
                <th style={{ padding: '0.65rem 1rem', color: 'var(--slate-500)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Channel Source</th>
                <th style={{ padding: '0.65rem 1rem', color: 'var(--slate-500)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Total Enquiries</th>
                <th style={{ padding: '0.65rem 1rem', color: 'var(--slate-500)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Demo Classes</th>
                <th style={{ padding: '0.65rem 1rem', color: 'var(--slate-500)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Enrolled Students</th>
                <th style={{ padding: '0.65rem 1rem', color: 'var(--slate-500)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Conversion %</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Walk-in Center (Indiranagar)</td>
                <td style={{ padding: '0.75rem 1rem' }} className="tabular-nums">55</td>
                <td style={{ padding: '0.75rem 1rem' }} className="tabular-nums">34</td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }} className="tabular-nums">23</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--semantic-emerald)', fontWeight: 600 }} className="tabular-nums">41.8%</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Meta / Instagram Ads</td>
                <td style={{ padding: '0.75rem 1rem' }} className="tabular-nums">48</td>
                <td style={{ padding: '0.75rem 1rem' }} className="tabular-nums">22</td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }} className="tabular-nums">8</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--color-brand-600)', fontWeight: 600 }} className="tabular-nums">16.7%</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Website Organic SEO</td>
                <td style={{ padding: '0.75rem 1rem' }} className="tabular-nums">32</td>
                <td style={{ padding: '0.75rem 1rem' }} className="tabular-nums">14</td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }} className="tabular-nums">5</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--color-brand-600)', fontWeight: 600 }} className="tabular-nums">15.6%</td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Parent / Student Referrals</td>
                <td style={{ padding: '0.75rem 1rem' }} className="tabular-nums">13</td>
                <td style={{ padding: '0.75rem 1rem' }} className="tabular-nums">8</td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }} className="tabular-nums">5</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--semantic-emerald)', fontWeight: 600 }} className="tabular-nums">38.5%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
