import React, { useState, useEffect } from 'react'
import { Plus, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLeads } from '../hooks/useLeads'
import { useLeadModal } from '../context/useLeadModal'
import { fetchStaffProfiles } from '../services/leadService'
import { UserProfile } from '../types'
import { LeadFiltersBar } from '../features/leads/LeadFiltersBar'
import { LeadsTable } from '../features/leads/LeadsTable'
import '../features/leads/leads.css'

export const LeadsPage: React.FC = () => {
  const { openCreateLeadModal } = useLeadModal()
  const {
    leads,
    totalCount,
    statusCounts,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sourceFilter,
    setSourceFilter,
    counsellorFilter,
    setCounsellorFilter,
    sortBy,
    sortOrder,
    toggleSort,
    page,
    setPage,
    pageSize,
    totalPages,
    hasActiveFilters,
    resetFilters,
  } = useLeads(15)

  const [staffList, setStaffList] = useState<UserProfile[]>([])

  // Load staff members for counsellor filters
  useEffect(() => {
    let isMounted = true
    fetchStaffProfiles().then(({ data }) => {
      if (isMounted) {
        setStaffList(data)
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

  // Pagination bounds calculation
  const startRecord = totalCount === 0 ? 0 : (page - 1) * pageSize + 1
  const endRecord = Math.min(page * pageSize, totalCount)

  return (
    <div className="container-fluid" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--slate-900)', letterSpacing: '-0.02em' }}>
              Student Enquiries Directory
            </h1>
            <span className="nav-pill" style={{ backgroundColor: 'var(--slate-200)', color: 'var(--slate-700)', fontWeight: 600 }}>
              {loading ? 'Loading...' : `${totalCount} Enquiries`}
            </span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--slate-500)' }}>
            Track, filter, and nurture prospective coaching students across all intake channels.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button 
            type="button" 
            className="btn btn-secondary" 
            title="Export CSV (Enabled in Reports milestone)"
            onClick={() => alert('Exporting will be available with customizable reporting in Phase 11.')}
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button 
            type="button" 
            className="btn btn-primary interactive-press"
            onClick={() => openCreateLeadModal()}
          >
            <Plus size={14} />
            <span>New Student Enquiry</span>
          </button>
        </div>
      </div>

      {/* Segmented Filter Bar + Search (Linear Style) */}
      <LeadFiltersBar
        statusCounts={statusCounts}
        activeStatus={statusFilter}
        onStatusChange={setStatusFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sourceFilter={sourceFilter}
        onSourceChange={setSourceFilter}
        counsellorFilter={counsellorFilter}
        onCounsellorChange={setCounsellorFilter}
        staffList={staffList}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={resetFilters}
      />

      {/* Leads Data Grid */}
      <LeadsTable
        leads={leads}
        loading={loading}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={toggleSort}
        onOpenCreateModal={() => openCreateLeadModal()}
        isFiltered={hasActiveFilters}
        onResetFilters={resetFilters}
      />

      {/* Table Pagination Footer */}
      {!loading && totalCount > 0 && (
        <div className="leads-table-footer" style={{ borderRadius: '10px' }}>
          <span>
            Showing <strong style={{ color: '#f8fafc' }}>{startRecord}</strong> to{' '}
            <strong style={{ color: '#f8fafc' }}>{endRecord}</strong> of{' '}
            <strong style={{ color: '#f8fafc' }}>{totalCount}</strong> enquiries
          </span>

          <div className="pagination-controls">
            <span style={{ fontSize: '0.75rem', color: '#64748b', marginRight: '0.5rem' }}>
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              className="pagination-btn"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              aria-label="Previous Page"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              className="pagination-btn"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              aria-label="Next Page"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
