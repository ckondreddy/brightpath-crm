import React, { useState, useRef, useEffect } from 'react'
import { Search, Filter, X, RotateCcw } from 'lucide-react'
import { LeadStatus, LeadSource, UserProfile } from '../../types'
import { LeadStatusCounts } from '../../services/leadService'

interface LeadFiltersBarProps {
  statusCounts: LeadStatusCounts
  activeStatus: LeadStatus | 'all'
  onStatusChange: (status: LeadStatus | 'all') => void
  searchQuery: string
  onSearchChange: (val: string) => void
  sourceFilter: LeadSource | 'all'
  onSourceChange: (source: LeadSource | 'all') => void
  counsellorFilter: string | 'all'
  onCounsellorChange: (id: string | 'all') => void
  staffList: UserProfile[]
  hasActiveFilters: boolean
  onResetFilters: () => void
}

const STATUS_TABS: { key: LeadStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All Enquiries' },
  { key: 'New', label: 'New' },
  { key: 'Contacted', label: 'Contacted' },
  { key: 'Qualified', label: 'Qualified' },
  { key: 'Converted', label: 'Converted' },
  { key: 'Lost', label: 'Lost' },
]

const SOURCES: LeadSource[] = [
  'Website',
  'Walk-in',
  'Phone',
  'Social Media',
  'Referral',
  'Other',
]

export const LeadFiltersBar: React.FC<LeadFiltersBarProps> = ({
  statusCounts,
  activeStatus,
  onStatusChange,
  searchQuery,
  onSearchChange,
  sourceFilter,
  onSourceChange,
  counsellorFilter,
  onCounsellorChange,
  staffList,
  hasActiveFilters,
  onResetFilters,
}) => {
  const [showFilterPopover, setShowFilterPopover] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  // Count active secondary filters
  const activeSecondaryCount = (sourceFilter !== 'all' ? 1 : 0) + (counsellorFilter !== 'all' ? 1 : 0)

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowFilterPopover(false)
      }
    }

    if (showFilterPopover) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showFilterPopover])

  return (
    <div className="lead-toolbar">
      <div className="lead-toolbar-top">
        {/* Status Segmented Tabs */}
        <div className="status-segmented-control" role="tablist">
          {STATUS_TABS.map((tab) => {
            const count = tab.key === 'all' ? statusCounts.all : statusCounts[tab.key] || 0
            const isActive = activeStatus === tab.key

            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`status-segmented-btn ${isActive ? 'active' : ''}`}
                onClick={() => onStatusChange(tab.key)}
              >
                <span>{tab.label}</span>
                <span className="status-count-pill">{count}</span>
              </button>
            )
          })}
        </div>

        {/* Search & Secondary Filter Buttons */}
        <div className="lead-search-actions">
          {/* Debounced Search Box */}
          <div className="lead-search-input-box">
            <Search size={14} style={{ color: '#64748b', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search student, phone, course..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="lead-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="lead-search-clear-btn"
                onClick={() => onSearchChange('')}
                aria-label="Clear search query"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Secondary Filters Popover Toggle */}
          <div className="filter-dropdown-wrapper" ref={popoverRef}>
            <button
              type="button"
              className={`filter-toggle-btn ${activeSecondaryCount > 0 ? 'has-filters' : ''}`}
              onClick={() => setShowFilterPopover((prev) => !prev)}
            >
              <Filter size={13} />
              <span>Filters</span>
              {activeSecondaryCount > 0 && (
                <span className="filter-active-count">{activeSecondaryCount}</span>
              )}
            </button>

            {/* Popover Sheet */}
            {showFilterPopover && (
              <div className="filter-popover-card">
                <div className="filter-popover-header">
                  <h4 className="filter-popover-title">Enquiry Filters</h4>
                  <button
                    type="button"
                    className="filter-popover-reset"
                    onClick={() => {
                      onSourceChange('all')
                      onCounsellorChange('all')
                    }}
                  >
                    Reset facets
                  </button>
                </div>

                {/* Filter by Lead Source */}
                <div className="filter-popover-field">
                  <label className="filter-popover-label" htmlFor="filterSourceSelect">
                    Lead Source
                  </label>
                  <select
                    id="filterSourceSelect"
                    className="filter-popover-select"
                    value={sourceFilter}
                    onChange={(e) => onSourceChange(e.target.value as LeadSource | 'all')}
                  >
                    <option value="all">All Sources</option>
                    {SOURCES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filter by Assigned Counsellor */}
                <div className="filter-popover-field">
                  <label className="filter-popover-label" htmlFor="filterStaffSelect">
                    Assigned Counsellor
                  </label>
                  <select
                    id="filterStaffSelect"
                    className="filter-popover-select"
                    value={counsellorFilter}
                    onChange={(e) => onCounsellorChange(e.target.value)}
                  >
                    <option value="all">All Staff Members</option>
                    {staffList.map((staff) => (
                      <option key={staff.id} value={staff.id}>
                        {staff.full_name} ({staff.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Reset All Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              className="btn btn-ghost"
              style={{ padding: '0.4rem 0.6rem', fontSize: '0.78rem', gap: '0.3rem' }}
              onClick={onResetFilters}
              title="Reset all active filters"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeSecondaryCount > 0 && (
        <div className="active-filters-row">
          <span style={{ color: '#64748b', fontSize: '0.72rem' }}>Filtered by:</span>
          {sourceFilter !== 'all' && (
            <span className="active-filter-chip">
              Source: {sourceFilter}
              <button
                type="button"
                onClick={() => onSourceChange('all')}
                aria-label={`Remove ${sourceFilter} filter`}
              >
                <X size={11} />
              </button>
            </span>
          )}
          {counsellorFilter !== 'all' && (
            <span className="active-filter-chip">
              Counsellor: {staffList.find((s) => s.id === counsellorFilter)?.full_name || 'Selected'}
              <button
                type="button"
                onClick={() => onCounsellorChange('all')}
                aria-label="Remove counsellor filter"
              >
                <X size={11} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
