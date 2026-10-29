import React, { useState, useEffect, useCallback } from 'react'
import { 
  Download, 
  RefreshCw, 
  Calendar, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Compass, 
  Users, 
  BookOpen, 
  AlertOctagon, 
  LayoutDashboard 
} from 'lucide-react'
import { 
  fetchReportAnalytics, 
  downloadLeadsCsv, 
  ReportData, 
  ReportDateRange, 
  ReportFilterOptions 
} from '../services/reportService'
import { fetchStaffProfiles } from '../services/leadService'
import { UserProfile, LeadSource } from '../types'
import { ReportsKpiGrid } from '../features/reports/ReportsKpiGrid'
import { ChannelAttributionTable } from '../features/reports/ChannelAttributionTable'
import { CounsellorLeaderboard } from '../features/reports/CounsellorLeaderboard'
import { ProgramDemandTable } from '../features/reports/ProgramDemandTable'
import { LostReasonBreakdown } from '../features/reports/LostReasonBreakdown'
import { ReportsSkeleton } from '../features/reports/ReportsSkeleton'
import { useToast } from '../context/useToast'
import '../features/reports/reports.css'

type ReportTab = 'overview' | 'channels' | 'counsellors' | 'programs' | 'lost'

const SOURCES_LIST: LeadSource[] = ['Website', 'Walk-in', 'Phone', 'Social Media', 'Referral', 'Other']

export const ReportsPage: React.FC = () => {
  const toast = useToast()
  const [data, setData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters State
  const [dateRange, setDateRange] = useState<ReportDateRange>('this_month')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')
  const [showCustomPicker, setShowCustomPicker] = useState(false)
  const [selectedSource, setSelectedSource] = useState<string>('all')
  const [selectedCounsellor, setSelectedCounsellor] = useState<string>('all')
  const [staffList, setStaffList] = useState<UserProfile[]>([])

  // View Tab
  const [activeTab, setActiveTab] = useState<ReportTab>('overview')

  // CSV Export State
  const [exporting, setExporting] = useState(false)
  const [exportSuccessMsg, setExportSuccessMsg] = useState<string | null>(null)

  // Load staff profiles for filter dropdown
  useEffect(() => {
    fetchStaffProfiles().then(({ data: staff }) => {
      if (staff) setStaffList(staff)
    })
  }, [])

  // Load report analytics on filter changes
  useEffect(() => {
    let isCancelled = false

    const filters: ReportFilterOptions = {
      dateRange,
      startDate: customStart || undefined,
      endDate: customEnd || undefined,
      source: selectedSource !== 'all' ? selectedSource : undefined,
      counsellorId: selectedCounsellor !== 'all' ? selectedCounsellor : undefined,
    }

    fetchReportAnalytics(filters).then((res) => {
      if (!isCancelled) {
        if (res.error) {
          setError(res.error)
        } else {
          setData(res.data)
        }
        setLoading(false)
      }
    })

    return () => {
      isCancelled = true
    }
  }, [dateRange, customStart, customEnd, selectedSource, selectedCounsellor])

  // Manual refresh handler
  const handleRefresh = useCallback(() => {
    setLoading(true)
    setError(null)
    const filters: ReportFilterOptions = {
      dateRange,
      startDate: customStart || undefined,
      endDate: customEnd || undefined,
      source: selectedSource !== 'all' ? selectedSource : undefined,
      counsellorId: selectedCounsellor !== 'all' ? selectedCounsellor : undefined,
    }

    fetchReportAnalytics(filters).then((res) => {
      if (res.error) {
        setError(res.error)
      } else {
        setData(res.data)
      }
      setLoading(false)
    })
  }, [dateRange, customStart, customEnd, selectedSource, selectedCounsellor])

  // Handle CSV Export
  const handleExportCsv = async () => {
    setExporting(true)
    setExportSuccessMsg(null)
    try {
      const filters: ReportFilterOptions = {
        dateRange,
        startDate: customStart || undefined,
        endDate: customEnd || undefined,
        source: selectedSource !== 'all' ? selectedSource : undefined,
        counsellorId: selectedCounsellor !== 'all' ? selectedCounsellor : undefined,
      }

      const result = await downloadLeadsCsv(filters)
      if (result.success) {
        setExportSuccessMsg(`Successfully exported ${result.count} sanitized student records.`)
        toast.success(`Exported ${result.count} student enquiry records to CSV`)
        setTimeout(() => setExportSuccessMsg(null), 5000)
      } else {
        const msg = result.error || 'Failed to export CSV.'
        setError(msg)
        toast.error(msg)
      }
    } catch {
      setError('Unexpected error during CSV generation.')
      toast.error('Unexpected error during CSV generation.')
    } finally {
      setExporting(false)
    }
  }

  const handleDateRangeChange = (range: ReportDateRange) => {
    setDateRange(range)
    if (range === 'custom') {
      setShowCustomPicker(true)
    } else {
      setShowCustomPicker(false)
    }
  }

  return (
    <div className="container-fluid reports-container">
      {/* Header & Controls */}
      <div className="reports-header">
        <div className="reports-title-group">
          <div className="reports-badge">
            <Compass size={13} />
            <span>BrightPath Academy • Admissions Intelligence & Velocity</span>
          </div>
          <h1 className="reports-title">Admissions & Performance Analytics</h1>
          <p className="reports-subtitle">
            Conversion benchmarks across intake channels, counsellor velocity, and academic programs.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="reports-toolbar">
          {/* Segmented Date Range Controls */}
          <div className="reports-date-segments">
            <button
              type="button"
              className={`reports-date-btn ${dateRange === '7d' ? 'active' : ''}`}
              onClick={() => handleDateRangeChange('7d')}
            >
              7 Days
            </button>
            <button
              type="button"
              className={`reports-date-btn ${dateRange === '30d' ? 'active' : ''}`}
              onClick={() => handleDateRangeChange('30d')}
            >
              30 Days
            </button>
            <button
              type="button"
              className={`reports-date-btn ${dateRange === 'this_month' ? 'active' : ''}`}
              onClick={() => handleDateRangeChange('this_month')}
            >
              This Month
            </button>
            <button
              type="button"
              className={`reports-date-btn ${dateRange === 'this_quarter' ? 'active' : ''}`}
              onClick={() => handleDateRangeChange('this_quarter')}
            >
              This Quarter
            </button>
            <button
              type="button"
              className={`reports-date-btn ${dateRange === 'all' ? 'active' : ''}`}
              onClick={() => handleDateRangeChange('all')}
            >
              All Time
            </button>
            <button
              type="button"
              className={`reports-date-btn ${dateRange === 'custom' ? 'active' : ''}`}
              onClick={() => handleDateRangeChange('custom')}
            >
              Custom
            </button>
          </div>

          {/* Refresh Action */}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleRefresh}
            disabled={loading}
            title="Refresh analytics data"
            style={{ padding: '0.45rem 0.65rem' }}
          >
            <RefreshCw size={13} className={loading ? 'spin' : ''} />
          </button>

          {/* Sanitized CSV Export Action */}
          <button
            type="button"
            className="btn-export-csv"
            onClick={handleExportCsv}
            disabled={exporting}
            title="Download sanitized RFC 4180 CSV export of student leads"
          >
            {exporting ? (
              <>
                <RefreshCw size={14} className="spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download size={14} />
                <span>Export CSV Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Custom Date Range Picker Drawer */}
      {showCustomPicker && (
        <div className="reports-custom-date-row">
          <Calendar size={14} color="#60a5fa" />
          <span>Select Range:</span>
          <input
            type="date"
            className="reports-date-input"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            aria-label="Start date"
          />
          <span>to</span>
          <input
            type="date"
            className="reports-date-input"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            aria-label="End date"
          />
          <button
            type="button"
            className="btn btn-primary"
            style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
            onClick={handleRefresh}
          >
            Apply Range
          </button>
        </div>
      )}

      {/* Secondary Filter Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          flexWrap: 'wrap',
          fontSize: '0.8rem',
          color: '#475569',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <Filter size={13} color="#2563eb" />
          <span>Filters:</span>
        </span>

        {/* Source Filter */}
        <select
          className="reports-date-input"
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
          aria-label="Filter by intake source"
        >
          <option value="all">All Intake Channels</option>
          {SOURCES_LIST.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Counsellor Filter */}
        <select
          className="reports-date-input"
          value={selectedCounsellor}
          onChange={(e) => setSelectedCounsellor(e.target.value)}
          aria-label="Filter by assigned counsellor"
        >
          <option value="all">All Counsellors</option>
          {staffList.map((st) => (
            <option key={st.id} value={st.id}>
              {st.full_name} ({st.role})
            </option>
          ))}
        </select>

        {/* Active scope pill */}
        {data && (
          <span
            style={{
              fontSize: '0.725rem',
              color: '#334155',
              backgroundColor: '#f1f5f9',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              border: '1px solid #e2e8f0',
            }}
          >
            Active Window: <strong>{data.dateRangeLabel}</strong> • {data.leadCount} Enquiries Included
          </span>
        )}
      </div>

      {/* CSV Export Success Feedback */}
      {exportSuccessMsg && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1rem',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px',
            fontSize: '0.8rem',
            color: '#34d399',
          }}
        >
          <CheckCircle2 size={15} />
          <span>{exportSuccessMsg}</span>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1rem',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            fontSize: '0.8rem',
            color: '#f87171',
          }}
        >
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && <ReportsSkeleton />}

      {/* Main Analytics Content */}
      {!loading && data && (
        <>
          {/* Executive KPI Cards */}
          <ReportsKpiGrid summary={data.summary} />

          {/* Navigation Tabs */}
          <div className="reports-nav-tabs">
            <button
              type="button"
              className={`reports-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <LayoutDashboard size={14} />
              <span>Full Analytics Overview</span>
            </button>
            <button
              type="button"
              className={`reports-tab-btn ${activeTab === 'channels' ? 'active' : ''}`}
              onClick={() => setActiveTab('channels')}
            >
              <Compass size={14} />
              <span>Intake Channels ({data.channels.length})</span>
            </button>
            <button
              type="button"
              className={`reports-tab-btn ${activeTab === 'counsellors' ? 'active' : ''}`}
              onClick={() => setActiveTab('counsellors')}
            >
              <Users size={14} />
              <span>Counsellor Velocity ({data.counsellors.length})</span>
            </button>
            <button
              type="button"
              className={`reports-tab-btn ${activeTab === 'programs' ? 'active' : ''}`}
              onClick={() => setActiveTab('programs')}
            >
              <BookOpen size={14} />
              <span>Academic Programs ({data.programs.length})</span>
            </button>
            <button
              type="button"
              className={`reports-tab-btn ${activeTab === 'lost' ? 'active' : ''}`}
              onClick={() => setActiveTab('lost')}
            >
              <AlertOctagon size={14} />
              <span>Drop-off & Lost Reasons ({data.lostReasons.length})</span>
            </button>
          </div>

          {/* Tab Content Display */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <ChannelAttributionTable channels={data.channels} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.25rem' }}>
                <CounsellorLeaderboard counsellors={data.counsellors} />
                <LostReasonBreakdown
                  lostReasons={data.lostReasons}
                  totalLostCount={data.summary.lostCount}
                />
              </div>
              <ProgramDemandTable programs={data.programs} />
            </div>
          )}

          {activeTab === 'channels' && (
            <ChannelAttributionTable channels={data.channels} />
          )}

          {activeTab === 'counsellors' && (
            <CounsellorLeaderboard counsellors={data.counsellors} />
          )}

          {activeTab === 'programs' && (
            <ProgramDemandTable programs={data.programs} />
          )}

          {activeTab === 'lost' && (
            <LostReasonBreakdown
              lostReasons={data.lostReasons}
              totalLostCount={data.summary.lostCount}
            />
          )}
        </>
      )}
    </div>
  )
}
export default ReportsPage
