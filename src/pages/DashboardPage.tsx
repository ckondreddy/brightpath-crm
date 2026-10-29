import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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
  Plus,
  RefreshCw,
  Compass
} from 'lucide-react'
import { fetchDashboardMetrics, DashboardMetrics } from '../services/dashboardService'
import { useLeadModal } from '../context/useLeadModal'
import '../features/dashboard/dashboard.css'

export const DashboardPage: React.FC = () => {
  const { openCreateLeadModal } = useLeadModal()
  const [nowMs] = useState(() => Date.now())
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<'month' | '30days' | 'all'>('month')

  useEffect(() => {
    let isCancelled = false
    fetchDashboardMetrics().then((res) => {
      if (!isCancelled) {
        if (res.data) setMetrics(res.data)
        if (res.error) setError(res.error)
        setLoading(false)
      }
    })

    return () => {
      isCancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div className="container-fluid dashboard-container">
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#94a3b8' }}>
          <Clock size={28} className="spin" style={{ color: '#60a5fa', margin: '0 auto 0.75rem auto' }} />
          <div style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 600 }}>
            Reconciling Admissions Intelligence...
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
            Aggregating student pipeline, conversion ratios, and callback queues
          </div>
        </div>
      </div>
    )
  }

  if (error || !metrics) {
    return (
      <div className="container-fluid dashboard-container">
        <div className="dashboard-section-card" style={{ maxWidth: '500px', margin: '2rem auto', textAlign: 'center' }}>
          <AlertCircle size={32} style={{ color: '#f87171', margin: '0 auto' }} />
          <h2 style={{ fontSize: '1rem', color: '#f8fafc', margin: 0 }}>Metrics Reconciliation Error</h2>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
            {error || 'Failed to aggregate CRM metrics from the database.'}
          </p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => window.location.reload()}
            style={{ margin: '0.5rem auto 0 auto', width: 'fit-content' }}
          >
            <RefreshCw size={13} />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid dashboard-container">
      {/* Executive Header */}
      <div className="dashboard-header">
        <div className="dashboard-title-group">
          <div className="dashboard-campus-pill">
            <Compass size={13} />
            <span>Bangalore South Center • Spring 2026 Admissions</span>
          </div>
          <h1 className="dashboard-title">Admissions Pipeline & Conversion</h1>
        </div>

        {/* Range Selector & Action CTAs */}
        <div className="dashboard-header-actions">
          <div className="segmented-control">
            <button
              type="button"
              className={`segmented-item ${timeRange === 'month' ? 'active' : ''}`}
              onClick={() => setTimeRange('month')}
            >
              This Month
            </button>
            <button
              type="button"
              className={`segmented-item ${timeRange === '30days' ? 'active' : ''}`}
              onClick={() => setTimeRange('30days')}
            >
              Last 30 Days
            </button>
            <button
              type="button"
              className={`segmented-item ${timeRange === 'all' ? 'active' : ''}`}
              onClick={() => setTimeRange('all')}
            >
              All Time
            </button>
          </div>

          <button
            type="button"
            className="btn btn-primary interactive-press"
            onClick={() => openCreateLeadModal()}
          >
            <Plus size={14} />
            <span>New Enquiry</span>
          </button>
        </div>
      </div>

      {/* Urgent Overdue Callout Banner */}
      {metrics.overdueFollowUpsCount > 0 && (
        <div className="dashboard-alert-banner animate-slide-down">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <AlertCircle size={16} style={{ flexShrink: 0, color: '#f87171' }} />
            <span>
              <strong>Action Required:</strong> {metrics.overdueFollowUpsCount} student enquiries have overdue callback consultations waiting in the queue.
            </span>
          </div>
          <Link to="/follow-ups" className="dashboard-alert-link">
            <span>Review Queue</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      )}

      {/* 4 Executive KPI Cards */}
      <div className="dashboard-kpi-grid">
        {/* Total Active Leads */}
        <div className="dashboard-kpi-card">
          <div className="dashboard-kpi-top">
            <span className="dashboard-kpi-label">Total Enquiries</span>
            <span className="dashboard-kpi-icon"><Users size={16} /></span>
          </div>
          <div className="dashboard-kpi-value-row">
            <span className="dashboard-kpi-value">{metrics.totalLeads}</span>
            {metrics.newThisWeekCount > 0 && (
              <span className="dashboard-kpi-badge success">
                <ArrowUpRight size={12} />
                <span>+{metrics.newThisWeekCount} this week</span>
              </span>
            )}
          </div>
          <div className="dashboard-kpi-footer">
            {metrics.convertedLeadsCount} enrolled • {metrics.qualifiedLeadsCount} high intent
          </div>
        </div>

        {/* New Leads */}
        <div className="dashboard-kpi-card">
          <div className="dashboard-kpi-top">
            <span className="dashboard-kpi-label">New Untouched</span>
            <span className="dashboard-kpi-icon"><Clock size={16} /></span>
          </div>
          <div className="dashboard-kpi-value-row">
            <span className="dashboard-kpi-value">{metrics.newLeadsCount}</span>
            <span className="dashboard-kpi-badge info">
              <span>Fresh</span>
            </span>
          </div>
          <div className="dashboard-kpi-footer">
            Awaiting first counsellor outreach call
          </div>
        </div>

        {/* Overdue Follow-ups */}
        <div className="dashboard-kpi-card">
          <div className="dashboard-kpi-top">
            <span className="dashboard-kpi-label">Pending Callbacks</span>
            <span className="dashboard-kpi-icon"><CalendarClock size={16} /></span>
          </div>
          <div className="dashboard-kpi-value-row">
            <span className="dashboard-kpi-value" style={{ color: metrics.overdueFollowUpsCount > 0 ? '#f87171' : '#f8fafc' }}>
              {metrics.overdueFollowUpsCount}
            </span>
            {metrics.overdueFollowUpsCount > 0 ? (
              <span className="dashboard-kpi-badge alert">Urgent</span>
            ) : (
              <span className="dashboard-kpi-badge success">On Schedule</span>
            )}
          </div>
          <div className="dashboard-kpi-footer">
            {metrics.todayFollowUpsCount} scheduled for today
          </div>
        </div>

        {/* Enrollment Conversion Rate */}
        <div className="dashboard-kpi-card">
          <div className="dashboard-kpi-top">
            <span className="dashboard-kpi-label">Conversion Rate</span>
            <span className="dashboard-kpi-icon"><TrendingUp size={16} /></span>
          </div>
          <div className="dashboard-kpi-value-row">
            <span className="dashboard-kpi-value">{metrics.conversionRate}%</span>
            <span className="dashboard-kpi-badge success">
              <ArrowUpRight size={12} /> Verified
            </span>
          </div>
          <div className="dashboard-kpi-footer">
            {metrics.convertedLeadsCount} admissions out of {metrics.totalLeads} total leads
          </div>
        </div>
      </div>

      {/* Pipeline Stage Funnel Strip */}
      <div className="dashboard-funnel-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>
              Pipeline Stage Conversion Funnel
            </h2>
            <p style={{ fontSize: '0.725rem', color: '#64748b', margin: '2px 0 0 0' }}>
              Distribution of prospective students across admission stages
            </p>
          </div>
          <Link to="/leads" className="btn btn-ghost" style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}>
            Manage Leads →
          </Link>
        </div>

        {/* Segmented Track */}
        <div className="funnel-segments-track">
          {metrics.statusDistribution.map((item) => (
            <div
              key={item.status}
              className="funnel-segment"
              style={{
                width: `${Math.max(item.percentage, item.count > 0 ? 3 : 0)}%`,
                backgroundColor: item.color,
              }}
              title={`${item.status}: ${item.count} (${item.percentage}%)`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="funnel-legend">
          {metrics.statusDistribution.map((item) => (
            <div key={item.status} className="funnel-legend-item">
              <span className="funnel-legend-dot" style={{ backgroundColor: item.color }} />
              <span>
                <strong>{item.status}:</strong> {item.count} ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Two-Column Operational Layout */}
      <div className="dashboard-two-col">
        {/* Left: Priority Follow-up Queue */}
        <div className="dashboard-section-card">
          <div className="dashboard-section-header">
            <div>
              <h2 className="dashboard-section-title">Priority Follow-up Queue</h2>
              <p className="dashboard-section-sub">Callbacks requiring immediate counsellor action</p>
            </div>
            <Link to="/follow-ups" className="btn btn-secondary" style={{ fontSize: '0.725rem', padding: '0.25rem 0.55rem' }}>
              View Queue
            </Link>
          </div>

          {metrics.priorityFollowUps.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b', fontSize: '0.8rem' }}>
              No urgent callbacks pending! All students are currently up to date.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {metrics.priorityFollowUps.map((task) => {
                const phone = task.lead?.phone || ''
                const studentName = task.lead?.full_name || 'Prospective Student'
                const isOverdue = new Date(task.due_at).getTime() < nowMs

                return (
                  <div
                    key={task.id}
                    className={`priority-task-item ${isOverdue ? 'is-overdue' : ''}`}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <Link
                          to={`/leads/${task.lead_id}`}
                          style={{ fontSize: '0.825rem', fontWeight: 600, color: '#0f172a', textDecoration: 'none' }}
                        >
                          {studentName}
                        </Link>
                        {isOverdue && <span className="overdue-tag">Overdue</span>}
                      </div>

                      <div style={{ fontSize: '0.75rem', color: '#475569', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        "{task.note}"
                      </div>

                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        ⏰ Due: {new Date(task.due_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} • Counsellor: {task.assignee?.full_name || 'Unassigned'}
                      </div>
                    </div>

                    {phone && (
                      <a
                        href={`tel:${phone}`}
                        className="btn btn-secondary interactive-press"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.725rem', gap: '0.3rem', color: '#2563eb', textDecoration: 'none' }}
                      >
                        <PhoneCall size={12} />
                        <span>Call</span>
                      </a>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right: Academic Course Intake */}
        <div className="dashboard-section-card">
          <div className="dashboard-section-header">
            <div>
              <h2 className="dashboard-section-title">Program Intake Ratios</h2>
              <p className="dashboard-section-sub">Lead volume and admission conversions by course</p>
            </div>
            <BookOpen size={16} style={{ color: '#64748b' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {metrics.courseTrackDistribution.map((track, idx) => {
              const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899']
              const color = colors[idx % colors.length]

              return (
                <div key={track.course} className="course-track-row">
                  <div className="course-track-top">
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{track.course}</span>
                    <span className="tabular-nums" style={{ color: '#64748b', fontSize: '0.75rem' }}>
                      {track.enquiries} leads ({track.enrolled} enrolled • {track.conversionRate}%)
                    </span>
                  </div>
                  <div className="course-track-bar">
                    <div
                      className="course-track-bar-fill"
                      style={{
                        width: `${Math.max(track.conversionRate, track.enrolled > 0 ? 5 : 0)}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Bottom: Recent Student Enquiries Table */}
      <div className="dashboard-section-card">
        <div className="dashboard-section-header">
          <div>
            <h2 className="dashboard-section-title">Recent Student Enquiries</h2>
            <p className="dashboard-section-sub">Newly registered prospective students</p>
          </div>
          <Link to="/leads" className="btn btn-secondary" style={{ fontSize: '0.725rem', padding: '0.25rem 0.55rem' }}>
            All Leads ({metrics.totalLeads})
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {metrics.recentLeads.map((lead) => {
            const initials = lead.full_name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()

            return (
              <div
                key={lead.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="student-avatar" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>
                    {initials}
                  </div>
                  <div>
                    <Link
                      to={`/leads/${lead.id}`}
                      style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', textDecoration: 'none' }}
                    >
                      {lead.full_name}
                    </Link>
                    <div style={{ fontSize: '0.725rem', color: '#64748b' }}>
                      {lead.course_interest} • Source: {lead.source}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className={`status-pill status-${lead.status}`}>
                    <span className="status-pill-dot" />
                    {lead.status}
                  </span>
                  <Link
                    to={`/leads/${lead.id}`}
                    className="btn btn-ghost"
                    style={{ fontSize: '0.725rem', padding: '0.2rem 0.5rem' }}
                  >
                    View Dossier →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
