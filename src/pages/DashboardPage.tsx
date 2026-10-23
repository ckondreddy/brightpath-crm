import React from 'react'
import { 
  Users, 
  CalendarClock, 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowRight,
  PhoneCall, 
  BookOpen,
  Filter
} from 'lucide-react'
import { Link } from 'react-router-dom'

export const DashboardPage: React.FC = () => {
  return (
    <div className="container-fluid" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Executive Header with Campus Context */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-brand-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Spring 2026 Admissions
            </span>
            <span style={{ color: 'var(--slate-300)' }}>•</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Updated 2 mins ago</span>
          </div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--slate-900)', letterSpacing: '-0.02em' }}>
            Admissions Pipeline & Conversion
          </h1>
        </div>

        {/* Segmented Controls for Range */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="segmented-control">
            <button type="button" className="segmented-item active">This Month</button>
            <button type="button" className="segmented-item">Last 30 Days</button>
            <button type="button" className="segmented-item">All Time</button>
          </div>
          <button type="button" className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem' }}>
            <Filter size={14} />
            <span>Bangalore South</span>
          </button>
        </div>
      </div>

      {/* Urgent Overdue Callout (Subtle, sleek, non-AI) */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '0.75rem 1rem', 
        backgroundColor: '#fff1f2', 
        border: '1px solid #fecdd3', 
        borderRadius: 'var(--radius-md)',
        fontSize: '0.8125rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#9f1239' }}>
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>
            <strong>Attention:</strong> 4 high-intent student enquiries have overdue follow-up calls scheduled for today.
          </span>
        </div>
        <Link to="/follow-ups" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#be123c', fontWeight: 600, textDecoration: 'underline' }}>
          Review Queue <ArrowRight size={13} />
        </Link>
      </div>

      {/* High-End Linear-style KPI Metric Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1rem' 
      }}>
        {/* Card 1 */}
        <div className="card-elevated" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Active Enquiries
            </span>
            <span style={{ color: 'var(--slate-400)' }}><Users size={16} /></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <span className="tabular-nums" style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--slate-900)' }}>148</span>
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              fontSize: '0.75rem', 
              fontWeight: 600, 
              color: 'var(--semantic-emerald)',
              backgroundColor: 'var(--semantic-emerald-bg)',
              padding: '1px 5px',
              borderRadius: 'var(--radius-xs)'
            }}>
              <ArrowUpRight size={12} /> 14.2%
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
            86 walk-in, 62 digital enquiries
          </p>
        </div>

        {/* Card 2 */}
        <div className="card-elevated" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              New Today
            </span>
            <span style={{ color: 'var(--slate-400)' }}><Clock size={16} /></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <span className="tabular-nums" style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--slate-900)' }}>12</span>
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              fontSize: '0.75rem', 
              fontWeight: 600, 
              color: 'var(--color-brand-600)',
              backgroundColor: '#eff6ff',
              padding: '1px 5px',
              borderRadius: 'var(--radius-xs)'
            }}>
              +4 this morning
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
            Awaiting initial counselling call
          </p>
        </div>

        {/* Card 3 */}
        <div className="card-elevated" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Overdue Follow-ups
            </span>
            <span style={{ color: 'var(--slate-400)' }}><CalendarClock size={16} /></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <span className="tabular-nums" style={{ fontSize: '1.85rem', fontWeight: 700, color: '#be123c' }}>4</span>
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              fontSize: '0.75rem', 
              fontWeight: 600, 
              color: '#be123c',
              backgroundColor: '#fff1f2',
              padding: '1px 5px',
              borderRadius: 'var(--radius-xs)'
            }}>
              Urgent
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
            Average delay: 1.8 hrs
          </p>
        </div>

        {/* Card 4 */}
        <div className="card-elevated" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Enrollment Rate
            </span>
            <span style={{ color: 'var(--slate-400)' }}><TrendingUp size={16} /></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <span className="tabular-nums" style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--slate-900)' }}>25.0%</span>
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              fontSize: '0.75rem', 
              fontWeight: 600, 
              color: 'var(--semantic-emerald)',
              backgroundColor: 'var(--semantic-emerald-bg)',
              padding: '1px 5px',
              borderRadius: 'var(--radius-xs)'
            }}>
              <ArrowUpRight size={12} /> +3.2%
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
            37 enrolled out of 148 qualified
          </p>
        </div>
      </div>

      {/* Two-Column Operational Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
        
        {/* Left: Urgent Student Action Queue */}
        <div className="card-elevated" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--slate-900)' }}>Priority Follow-up Queue</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Urgent calls assigned to your shift</p>
            </div>
            <Link to="/follow-ups" className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
              View All (4)
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1 }}>
            {/* Student 1 */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              padding: '0.65rem 0.75rem', 
              backgroundColor: 'var(--slate-50)', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-900)' }}>Aarav Sharma</span>
                  <span className="badge-dot qualified"><span className="dot" />Qualified</span>
                </div>
                <div style={{ fontSize: '0.725rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                  IIT-JEE 2-Yr Intensive • Parent requested fee concession
                </div>
              </div>
              <button type="button" className="btn btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.725rem' }}>
                <PhoneCall size={12} /> Call
              </button>
            </div>

            {/* Student 2 */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              padding: '0.65rem 0.75rem', 
              backgroundColor: 'var(--slate-50)', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-900)' }}>Diya Patel</span>
                  <span className="badge-dot contacted"><span className="dot" />Contacted</span>
                </div>
                <div style={{ fontSize: '0.725rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                  NEET Medical Repeater • Wants Saturday Physics demo link
                </div>
              </div>
              <button type="button" className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.725rem' }}>
                <Clock size={12} /> Reschedule
              </button>
            </div>

            {/* Student 3 */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              padding: '0.65rem 0.75rem', 
              backgroundColor: 'var(--slate-50)', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-900)' }}>Rohan Mehta</span>
                  <span className="badge-dot new"><span className="dot" />New Enquiry</span>
                </div>
                <div style={{ fontSize: '0.725rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                  SAT & GRE Global Track • Walk-in consultation enquiry
                </div>
              </div>
              <button type="button" className="btn btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.725rem' }}>
                <PhoneCall size={12} /> Call
              </button>
            </div>
          </div>
        </div>

        {/* Right: Academic Course Conversion Funnel */}
        <div className="card-elevated" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--slate-900)' }}>Course Program Intake</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Active lead volume by academic stream</p>
            </div>
            <span style={{ color: 'var(--slate-400)' }}><BookOpen size={16} /></span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* Track 1 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600, color: 'var(--slate-800)' }}>IIT-JEE Engineering (2-Year)</span>
                <span className="tabular-nums" style={{ color: 'var(--slate-600)', fontSize: '0.75rem' }}>46 enquiries (16 enrolled • 34%)</span>
              </div>
              <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--slate-100)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: '34%', height: '100%', backgroundColor: 'var(--color-brand-600)', borderRadius: 'var(--radius-full)' }} />
              </div>
            </div>

            {/* Track 2 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600, color: 'var(--slate-800)' }}>NEET Medical Foundation</span>
                <span className="tabular-nums" style={{ color: 'var(--slate-600)', fontSize: '0.75rem' }}>42 enquiries (12 enrolled • 28%)</span>
              </div>
              <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--slate-100)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: '28%', height: '100%', backgroundColor: '#059669', borderRadius: 'var(--radius-full)' }} />
              </div>
            </div>

            {/* Track 3 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600, color: 'var(--slate-800)' }}>SAT & GRE Global Admissions</span>
                <span className="tabular-nums" style={{ color: 'var(--slate-600)', fontSize: '0.75rem' }}>36 enquiries (8 enrolled • 22%)</span>
              </div>
              <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--slate-100)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: '22%', height: '100%', backgroundColor: '#7c3aed', borderRadius: 'var(--radius-full)' }} />
              </div>
            </div>

            {/* Track 4 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600, color: 'var(--slate-800)' }}>Class 11-12 Integrated CBSE</span>
                <span className="tabular-nums" style={{ color: 'var(--slate-600)', fontSize: '0.75rem' }}>24 enquiries (1 enrolled • 4%)</span>
              </div>
              <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--slate-100)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: '4%', height: '100%', backgroundColor: '#d97706', borderRadius: 'var(--radius-full)' }} />
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
