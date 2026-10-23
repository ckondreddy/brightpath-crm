import React from 'react'
import { Search, UserPlus, RotateCcw } from 'lucide-react'

interface LeadsEmptyStateProps {
  isFiltered: boolean
  onResetFilters: () => void
  onOpenCreateModal: () => void
}

export const LeadsEmptyState: React.FC<LeadsEmptyStateProps> = ({
  isFiltered,
  onResetFilters,
  onOpenCreateModal,
}) => {
  if (isFiltered) {
    return (
      <div className="leads-empty-card">
        <div className="empty-icon-box">
          <Search size={22} />
        </div>
        <h3 className="empty-title">No matching enquiries found</h3>
        <p className="empty-subtitle">
          We couldn't find any student records matching your current search criteria or active filters.
        </p>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onResetFilters}
          style={{ marginTop: '0.5rem', gap: '0.4rem', fontSize: '0.8rem' }}
        >
          <RotateCcw size={13} />
          <span>Reset All Filters</span>
        </button>
      </div>
    )
  }

  return (
    <div className="leads-empty-card">
      <div className="empty-icon-box" style={{ color: '#60a5fa', borderColor: 'rgba(59, 130, 246, 0.25)' }}>
        <UserPlus size={22} />
      </div>
      <h3 className="empty-title">No student enquiries yet</h3>
      <p className="empty-subtitle">
        Your enquiry pipeline is currently empty. Record your first prospective student to start tracking coaching admissions.
      </p>
      <button
        type="button"
        className="btn btn-primary interactive-press"
        onClick={onOpenCreateModal}
        style={{ marginTop: '0.5rem', gap: '0.4rem', fontSize: '0.82rem' }}
      >
        <UserPlus size={14} />
        <span>+ Record First Enquiry</span>
      </button>
    </div>
  )
}
