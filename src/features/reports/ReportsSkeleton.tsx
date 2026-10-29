import React from 'react'

export const ReportsSkeleton: React.FC = () => {
  return (
    <div className="reports-container">
      {/* Header Skeleton */}
      <div className="reports-skeleton-card" style={{ height: '70px', justifyContent: 'center' }}>
        <div className="reports-skeleton-line" style={{ width: '220px', height: '24px' }} />
        <div className="reports-skeleton-line" style={{ width: '380px', height: '14px' }} />
      </div>

      {/* KPI Grid Skeleton */}
      <div className="reports-kpi-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="reports-skeleton-card">
            <div className="reports-skeleton-line" style={{ width: '40%', height: '12px' }} />
            <div className="reports-skeleton-line" style={{ width: '60%', height: '32px', margin: '0.25rem 0' }} />
            <div className="reports-skeleton-line" style={{ width: '70%', height: '12px' }} />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="reports-skeleton-card" style={{ height: '280px' }}>
        <div className="reports-skeleton-line" style={{ width: '30%', height: '20px', marginBottom: '1rem' }} />
        {[1, 2, 3, 4, 5].map((row) => (
          <div key={row} className="reports-skeleton-line" style={{ width: '100%', height: '28px', marginBottom: '0.5rem' }} />
        ))}
      </div>
    </div>
  )
}
