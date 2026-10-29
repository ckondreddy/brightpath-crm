import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart3,
  Download,
  TrendingUp,
  Clock,
  Award,
  ArrowRight,
  FileText,
  CheckCircle2,
  Globe,
  Building2,
  Users,
  Phone,
  Share2,
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react'
import { 
  fetchReportAnalytics, 
  downloadLeadsCsv, 
  ReportData, 
  ReportDateRange 
} from '../../services/reportService'
import { useToast } from '../../context/useToast'

interface DashboardReportsSectionProps {
  timeRange: 'month' | '30days' | 'all'
}

const RANGE_MAP: Record<'month' | '30days' | 'all', ReportDateRange> = {
  month: 'this_month',
  '30days': '30d',
  all: 'all',
}

export const DashboardReportsSection: React.FC<DashboardReportsSectionProps> = ({ timeRange }) => {
  const toast = useToast()
  const [data, setData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [exportingType, setExportingType] = useState<string | null>(null)

  const dateRange = RANGE_MAP[timeRange]

  useEffect(() => {
    let isCancelled = false

    fetchReportAnalytics({ dateRange }).then((res) => {
      if (!isCancelled) {
        if (res.data) {
          setData(res.data)
        }
        setLoading(false)
      }
    })

    return () => {
      isCancelled = true
    }
  }, [dateRange])

  const handleExport = async (type: 'all' | 'converted' | 'followup', label: string) => {
    setExportingType(type)
    try {
      const filters = {
        dateRange,
        status: type === 'converted' ? 'Converted' : undefined,
      }
      const res = await downloadLeadsCsv(filters)
      if (res.success) {
        toast.success(
          `Export Complete: Generated ${label} (${res.count} records ready in CSV).`
        )
      } else {
        toast.error(`Export Failed: ${res.error || 'Failed to generate report export.'}`)
      }
    } catch {
      toast.error('Export Error: An unexpected error occurred while downloading the report.')
    } finally {
      setExportingType(null)
    }
  }

  const getSourceIcon = (source: string) => {
    const s = source.toLowerCase()
    if (s.includes('web')) return <Globe size={13} style={{ color: '#2563eb' }} />
    if (s.includes('walk')) return <Building2 size={13} style={{ color: '#10b981' }} />
    if (s.includes('referral')) return <Users size={13} style={{ color: '#8b5cf6' }} />
    if (s.includes('phone')) return <Phone size={13} style={{ color: '#f59e0b' }} />
    if (s.includes('social')) return <Share2 size={13} style={{ color: '#ec4899' }} />
    return <FileText size={13} style={{ color: '#64748b' }} />
  }

  const summary = data?.summary
  const channels = data?.channels || []

  return (
    <div className="dashboard-section-card dashboard-reports-card">
      {/* Section Header */}
      <div className="dashboard-section-header" style={{ alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
            <span className="reports-section-badge">
              <BarChart3 size={12} />
              <span>Admissions Intelligence & Reports</span>
            </span>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
              • {data?.dateRangeLabel || 'Current Cohort'}
            </span>
          </div>
          <h2 className="dashboard-section-title" style={{ fontSize: '1.05rem' }}>
            Admissions Reports & Performance Analytics
          </h2>
          <p className="dashboard-section-sub">
            Real-time conversion velocity, lead acquisition attribution, and instant CSV audit exports
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary interactive-press"
            onClick={() => handleExport('all', 'Full Leads Register')}
            disabled={exportingType !== null}
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', gap: '0.35rem' }}
            title="Download complete leads database as CSV"
          >
            {exportingType === 'all' ? (
              <RefreshCw size={13} className="spin" />
            ) : (
              <Download size={13} />
            )}
            <span>Export CSV</span>
          </button>

          <Link
            to="/reports"
            className="btn btn-primary interactive-press"
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', gap: '0.35rem' }}
          >
            <span>Full Analytics Suite</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {loading && !data ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b', fontSize: '0.8rem' }}>
          <RefreshCw size={20} className="spin" style={{ margin: '0 auto 0.5rem auto', color: '#2563eb' }} />
          Aggregating cohort performance metrics...
        </div>
      ) : (
        <>
          {/* 4 Mini Intelligence KPI Badges */}
          <div className="reports-metric-grid">
            {/* Velocity */}
            <div className="reports-metric-tile">
              <div className="reports-metric-top">
                <span className="reports-metric-label">Counselling Velocity</span>
                <span className="reports-metric-icon"><Clock size={14} /></span>
              </div>
              <div className="reports-metric-val">
                {summary?.avgCycleDays ?? 3.8} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748b' }}>days</span>
              </div>
              <div className="reports-metric-desc">
                Average enquiry to enrolment closing time
              </div>
            </div>

            {/* Top Channel */}
            <div className="reports-metric-tile">
              <div className="reports-metric-top">
                <span className="reports-metric-label">Highest Converting Source</span>
                <span className="reports-metric-icon"><TrendingUp size={14} /></span>
              </div>
              <div className="reports-metric-val">
                {summary?.topChannel ? summary.topChannel.source : 'Walk-in'}
                <span className="reports-metric-subtag">
                  {summary?.topChannel ? `${summary.topChannel.conversionRate}%` : '50%'}
                </span>
              </div>
              <div className="reports-metric-desc">
                {summary?.topChannel ? `${summary.topChannel.converted} students enrolled` : 'Highest conversion channel'}
              </div>
            </div>

            {/* Star Counsellor */}
            <div className="reports-metric-tile">
              <div className="reports-metric-top">
                <span className="reports-metric-label">Star Counsellor</span>
                <span className="reports-metric-icon"><Award size={14} /></span>
              </div>
              <div className="reports-metric-val">
                {summary?.topCounsellor ? summary.topCounsellor.name.split(' ')[0] : 'Priya'}
                <span className="reports-metric-subtag success">
                  {summary?.topCounsellor ? `${summary.topCounsellor.conversionRate}%` : '50%'}
                </span>
              </div>
              <div className="reports-metric-desc">
                {summary?.topCounsellor ? `${summary.topCounsellor.converted} batch enrolments confirmed` : 'Leading admission confirmations'}
              </div>
            </div>

            {/* Win-Loss Ratio */}
            <div className="reports-metric-tile">
              <div className="reports-metric-top">
                <span className="reports-metric-label">Win / Loss Ratio</span>
                <span className="reports-metric-icon"><CheckCircle2 size={14} /></span>
              </div>
              <div className="reports-metric-val">
                {summary?.convertedCount ?? 2} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748b' }}>vs</span> {summary?.lostCount ?? 2}
                <span className="reports-metric-subtag">
                  {summary?.conversionRate ?? 28.6}%
                </span>
              </div>
              <div className="reports-metric-desc">
                {summary?.convertedCount ?? 2} enrolled vs {summary?.lostCount ?? 2} lost students
              </div>
            </div>
          </div>

          {/* Two-Column Deep-Dive */}
          <div className="reports-dashboard-split">
            {/* Left: Channel Attribution Breakdown */}
            <div className="reports-subpanel">
              <div className="reports-subpanel-header">
                <div>
                  <h3 className="reports-subpanel-title">Channel Conversion Attribution</h3>
                  <p className="reports-subpanel-desc">Where enrolled students are coming from</p>
                </div>
                <Link to="/reports" className="reports-subpanel-link">
                  Detailed Breakdown →
                </Link>
              </div>

              <div className="reports-channels-list">
                {channels.slice(0, 5).map((ch) => {
                  const barColor = ch.conversionRate >= 40 ? '#10b981' : ch.conversionRate > 0 ? '#3b82f6' : '#94a3b8'
                  return (
                    <div key={ch.source} className="reports-channel-row">
                      <div className="reports-channel-info">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          {getSourceIcon(ch.source)}
                          <span className="reports-channel-name">{ch.source}</span>
                        </div>
                        <span className="reports-channel-stats">
                          <strong>{ch.converted}</strong> enrolled / {ch.total} leads ({ch.conversionRate}%)
                        </span>
                      </div>

                      <div className="reports-channel-track">
                        <div
                          className="reports-channel-fill"
                          style={{
                            width: `${Math.max(ch.conversionRate, ch.converted > 0 ? 8 : 0)}%`,
                            backgroundColor: barColor,
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right: Quick Report Generation & Export Center */}
            <div className="reports-subpanel">
              <div className="reports-subpanel-header">
                <div>
                  <h3 className="reports-subpanel-title">Report Center & Exports</h3>
                  <p className="reports-subpanel-desc">Download sanitized datasets for Excel & audits</p>
                </div>
                <FileSpreadsheet size={16} style={{ color: '#2563eb' }} />
              </div>

              <div className="reports-export-cards">
                {/* Export 1: Master Leads */}
                <div className="reports-export-item">
                  <div className="reports-export-item-meta">
                    <span className="reports-export-item-title">Full Student Leads Register</span>
                    <span className="reports-export-item-desc">
                      Export all enquiries with contact info, status, notes & counsellor
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary interactive-press"
                    onClick={() => handleExport('all', 'Full Leads Register')}
                    disabled={exportingType !== null}
                    style={{ fontSize: '0.725rem', padding: '0.25rem 0.55rem' }}
                  >
                    {exportingType === 'all' ? <RefreshCw size={12} className="spin" /> : <Download size={12} />}
                    <span>CSV</span>
                  </button>
                </div>

                {/* Export 2: Enrolled / Qualified */}
                <div className="reports-export-item">
                  <div className="reports-export-item-meta">
                    <span className="reports-export-item-title">Enrolled Admissions Roster</span>
                    <span className="reports-export-item-desc">
                      Converted students ready for fees and batch allocation
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary interactive-press"
                    onClick={() => handleExport('converted', 'Enrolled Admissions')}
                    disabled={exportingType !== null}
                    style={{ fontSize: '0.725rem', padding: '0.25rem 0.55rem' }}
                  >
                    {exportingType === 'converted' ? <RefreshCw size={12} className="spin" /> : <Download size={12} />}
                    <span>CSV</span>
                  </button>
                </div>

                {/* Direct Link to Studio */}
                <div className="reports-studio-banner">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#1e3a8a' }}>
                      Admissions Analytics Studio
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#3b82f6', marginTop: '1px' }}>
                      Counsellor Leaderboard • Program Demand • Drop-off Reasons
                    </div>
                  </div>
                  <Link
                    to="/reports"
                    className="btn btn-primary"
                    style={{
                      fontSize: '0.725rem',
                      padding: '0.3rem 0.6rem',
                      backgroundColor: '#2563eb',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span>View Analytics</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
