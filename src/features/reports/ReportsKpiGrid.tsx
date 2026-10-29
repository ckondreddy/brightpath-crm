import React from 'react'
import { Target, TrendingUp, Compass, Scale, ArrowUpRight } from 'lucide-react'
import { ReportSummaryKPIs } from '../../services/reportService'

interface ReportsKpiGridProps {
  summary: ReportSummaryKPIs
}

export const ReportsKpiGrid: React.FC<ReportsKpiGridProps> = ({ summary }) => {
  const isHealthyConversion = summary.conversionRate >= 20.0

  return (
    <div className="reports-kpi-grid">
      {/* 1. Overall Conversion Rate */}
      <div className="reports-kpi-card">
        <div className="reports-kpi-label-row">
          <span className="reports-kpi-label">Admissions Conversion Rate</span>
          <Target size={15} color="#60a5fa" />
        </div>
        <div className="reports-kpi-value-row">
          <span className="reports-kpi-value">{summary.conversionRate}%</span>
          <span className={`reports-kpi-pill ${isHealthyConversion ? 'pill-success' : 'pill-info'}`}>
            <ArrowUpRight size={11} /> {isHealthyConversion ? 'Target Met' : 'Active Pipeline'}
          </span>
        </div>
        <p className="reports-kpi-subtext">
          {summary.convertedCount} enrolled from {summary.totalEnquiries} student enquiries
        </p>
      </div>

      {/* 2. Avg Counselling Cycle */}
      <div className="reports-kpi-card">
        <div className="reports-kpi-label-row">
          <span className="reports-kpi-label">Avg Counselling Velocity</span>
          <TrendingUp size={15} color="#34d399" />
        </div>
        <div className="reports-kpi-value-row">
          <span className="reports-kpi-value">{summary.avgCycleDays} Days</span>
          <span className="reports-kpi-pill pill-info">
            Lead to Decision
          </span>
        </div>
        <p className="reports-kpi-subtext">
          Average turnaround time across closed student consultations
        </p>
      </div>

      {/* 3. Top Intake Channel */}
      <div className="reports-kpi-card">
        <div className="reports-kpi-label-row">
          <span className="reports-kpi-label">Top Intake Channel</span>
          <Compass size={15} color="#fbbf24" />
        </div>
        <div className="reports-kpi-value-row">
          <span className="reports-kpi-value" style={{ fontSize: '1.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {summary.topChannel ? summary.topChannel.source : 'Walk-in Center'}
          </span>
          {summary.topChannel && (
            <span className="reports-kpi-pill pill-success">
              {summary.topChannel.conversionRate}% Conv.
            </span>
          )}
        </div>
        <p className="reports-kpi-subtext">
          Highest enrolment efficiency across student acquisition sources
        </p>
      </div>

      {/* 4. Enrolled vs Lost Ratio */}
      <div className="reports-kpi-card">
        <div className="reports-kpi-label-row">
          <span className="reports-kpi-label">Outcome Distribution</span>
          <Scale size={15} color="#a78bfa" />
        </div>
        <div className="reports-kpi-value-row">
          <span className="reports-kpi-value" style={{ fontSize: '1.35rem' }}>
            <span style={{ color: '#34d399' }}>{summary.convertedCount}</span>
            <span style={{ color: '#64748b', margin: '0 0.35rem' }}>:</span>
            <span style={{ color: '#f87171' }}>{summary.lostCount}</span>
          </span>
          <span className="reports-kpi-pill pill-warning">
            {summary.lostRate}% Lost Rate
          </span>
        </div>
        <p className="reports-kpi-subtext">
          {summary.qualifiedCount} Qualified & {summary.contactedCount} In-Touch in active progress
        </p>
      </div>
    </div>
  )
}
