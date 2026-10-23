import React, { useState } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  Phone, 
  Calendar,
  Sparkles
} from 'lucide-react'

export const LeadsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'high_intent' | 'demo' | 'enrolled'>('all')

  const sampleLeads = [
    {
      id: 'L-1048',
      name: 'Aarav Sharma',
      initials: 'AS',
      phone: '+91 98452 11029',
      email: 'aarav.sharma@gmail.com',
      course: 'IIT-JEE 2-Year Intensive',
      source: 'Walk-in Center',
      status: 'qualified',
      statusLabel: 'Qualified',
      nextFollowUp: 'Today, 2:00 PM',
      isOverdue: true,
      counsellor: 'Priya Sharma'
    },
    {
      id: 'L-1049',
      name: 'Diya Patel',
      initials: 'DP',
      phone: '+91 97120 44581',
      email: 'diya.patel@outlook.com',
      course: 'NEET Repeater Batch',
      source: 'Meta Ads',
      status: 'contacted',
      statusLabel: 'Contacted',
      nextFollowUp: 'Today, 3:30 PM',
      isOverdue: false,
      counsellor: 'Priya Sharma'
    },
    {
      id: 'L-1050',
      name: 'Rohan Mehta',
      initials: 'RM',
      phone: '+91 94481 99230',
      email: 'rohan.mehta@yahoo.com',
      course: 'SAT & GRE Global Track',
      source: 'Website Form',
      status: 'new',
      statusLabel: 'New Enquiry',
      nextFollowUp: 'Tomorrow, 11:00 AM',
      isOverdue: false,
      counsellor: 'Karan Rao'
    },
    {
      id: 'L-1051',
      name: 'Ananya Deshmukh',
      initials: 'AD',
      phone: '+91 98220 56712',
      email: 'ananya.d@gmail.com',
      course: 'Class 11-12 Integrated CBSE',
      source: 'Parent Referral',
      status: 'converted',
      statusLabel: 'Enrolled',
      nextFollowUp: 'Enrolled • Fees Paid',
      isOverdue: false,
      counsellor: 'Priya Sharma'
    },
    {
      id: 'L-1052',
      name: 'Vikramaditya Nair',
      initials: 'VN',
      phone: '+91 99450 78219',
      email: 'vikram.nair@icloud.com',
      course: 'IIT-JEE 1-Year Fastrack',
      source: 'School Seminar',
      status: 'lost',
      statusLabel: 'Lost (Chose Competitor)',
      nextFollowUp: 'Archived',
      isOverdue: false,
      counsellor: 'Karan Rao'
    }
  ]

  return (
    <div className="container-fluid" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--slate-900)', letterSpacing: '-0.02em' }}>
              Student Enquiries Directory
            </h1>
            <span className="nav-pill" style={{ backgroundColor: 'var(--slate-200)', color: 'var(--slate-700)', fontWeight: 600 }}>148 Active</span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--slate-500)' }}>
            Track and nurture prospective coaching students across all intake channels.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button type="button" className="btn btn-secondary" title="Export Enquiries CSV">
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button type="button" className="btn btn-primary">
            <Plus size={14} />
            <span>New Student Enquiry</span>
          </button>
        </div>
      </div>

      {/* Segmented Filter Bar (Linear Style) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div className="segmented-control">
          <button 
            type="button" 
            className={`segmented-item ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Enquiries (148)
          </button>
          <button 
            type="button" 
            className={`segmented-item ${activeTab === 'high_intent' ? 'active' : ''}`}
            onClick={() => setActiveTab('high_intent')}
          >
            High Intent (32)
          </button>
          <button 
            type="button" 
            className={`segmented-item ${activeTab === 'demo' ? 'active' : ''}`}
            onClick={() => setActiveTab('demo')}
          >
            Demo Booked (19)
          </button>
          <button 
            type="button" 
            className={`segmented-item ${activeTab === 'enrolled' ? 'active' : ''}`}
            onClick={() => setActiveTab('enrolled')}
          >
            Enrolled (37)
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            padding: '0.35rem 0.65rem', 
            backgroundColor: '#ffffff', 
            border: '1px solid var(--border-default)', 
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-xs)',
            minWidth: '240px'
          }}>
            <Search size={14} style={{ color: 'var(--slate-400)' }} />
            <input 
              type="text" 
              placeholder="Filter by student, phone, course..." 
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.8125rem', background: 'transparent' }}
            />
          </div>
          <button type="button" className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem' }}>
            <Filter size={14} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* High-End Startup Table */}
      <div className="card-elevated" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--slate-50)', borderBottom: '1px solid var(--border-default)' }}>
                <th style={{ padding: '0.65rem 1rem', fontWeight: 600, color: 'var(--slate-500)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Student</th>
                <th style={{ padding: '0.65rem 1rem', fontWeight: 600, color: 'var(--slate-500)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Program Track</th>
                <th style={{ padding: '0.65rem 1rem', fontWeight: 600, color: 'var(--slate-500)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Lead Source</th>
                <th style={{ padding: '0.65rem 1rem', fontWeight: 600, color: 'var(--slate-500)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status</th>
                <th style={{ padding: '0.65rem 1rem', fontWeight: 600, color: 'var(--slate-500)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Next Follow-Up</th>
                <th style={{ padding: '0.65rem 1rem', fontWeight: 600, color: 'var(--slate-500)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Counsellor</th>
                <th style={{ padding: '0.65rem 1rem', width: '40px' }} />
              </tr>
            </thead>
            <tbody>
              {sampleLeads.map((lead) => (
                <tr 
                  key={lead.id} 
                  style={{ 
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'background-color var(--transition-fast)',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--slate-50)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  {/* Student Name & Meta */}
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{ 
                        width: '28px', 
                        height: '28px', 
                        borderRadius: 'var(--radius-full)', 
                        backgroundColor: '#eff6ff', 
                        color: 'var(--color-brand-600)',
                        border: '1px solid #bfdbfe',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        flexShrink: 0
                      }}>
                        {lead.initials}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{lead.name}</div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--slate-500)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span><Phone size={11} style={{ display: 'inline', verticalAlign: '-1px' }} /> {lead.phone}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Course */}
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ fontWeight: 500, color: 'var(--slate-800)' }}>{lead.course}</span>
                  </td>

                  {/* Source */}
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ 
                      fontSize: '0.725rem', 
                      padding: '2px 7px', 
                      borderRadius: 'var(--radius-sm)', 
                      backgroundColor: 'var(--slate-100)', 
                      color: 'var(--slate-700)',
                      fontWeight: 500
                    }}>
                      {lead.source}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span className={`badge-dot ${lead.status}`}>
                      <span className="dot" />
                      {lead.statusLabel}
                    </span>
                  </td>

                  {/* Next Follow-Up */}
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: lead.isOverdue ? '#be123c' : 'var(--slate-700)', fontWeight: lead.isOverdue ? 600 : 400 }}>
                      <Calendar size={13} style={{ flexShrink: 0 }} />
                      <span>{lead.nextFollowUp}</span>
                      {lead.isOverdue && (
                        <span style={{ fontSize: '0.65rem', backgroundColor: '#fff1f2', color: '#be123c', padding: '1px 4px', borderRadius: 'var(--radius-xs)', border: '1px solid #fecdd3' }}>Overdue</span>
                      )}
                    </div>
                  </td>

                  {/* Counsellor */}
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--slate-600)', fontSize: '0.775rem' }}>
                    {lead.counsellor}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                    <button type="button" className="btn btn-ghost" style={{ padding: '0.25rem' }}>
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '0.65rem 1rem', 
          backgroundColor: 'var(--slate-50)', 
          borderTop: '1px solid var(--border-default)',
          fontSize: '0.75rem',
          color: 'var(--slate-500)'
        }}>
          <span>Showing 5 of 148 enquiries</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-brand-600)', fontWeight: 500 }}>
              <Sparkles size={12} /> Supabase live query hooks configured in Phase 05 & 06
            </span>
          </div>
        </div>
      </div>

    </div>
  )
}
