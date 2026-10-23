import React from 'react'
import { 
  Phone, 
  Calendar, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Clock,
  User
} from 'lucide-react'
import { LeadWithRelations } from '../../services/leadService'
import { LeadsSkeleton } from './LeadsSkeleton'
import { LeadsEmptyState } from './LeadsEmptyState'
import { LeadCardMobile } from './LeadCardMobile'

interface LeadsTableProps {
  leads: LeadWithRelations[]
  loading: boolean
  sortBy: 'created_at' | 'full_name' | 'status'
  sortOrder: 'asc' | 'desc'
  onSort: (column: 'created_at' | 'full_name' | 'status') => void
  onOpenCreateModal: () => void
  isFiltered: boolean
  onResetFilters: () => void
}

export const LeadsTable: React.FC<LeadsTableProps> = ({
  leads,
  loading,
  sortBy,
  sortOrder,
  onSort,
  onOpenCreateModal,
  isFiltered,
  onResetFilters,
}) => {
  const [nowMs] = React.useState(() => Date.now())
  const renderSortIcon = (column: 'created_at' | 'full_name' | 'status') => {
    if (sortBy !== column) {
      return <ArrowUpDown size={12} style={{ opacity: 0.4 }} />
    }
    return sortOrder === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
  }

  // Format date helper
  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString)
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    } catch {
      return isoString
    }
  }

  return (
    <div className="leads-table-card">
      {/* Desktop Table View */}
      <div className="leads-table-wrapper">
        <table className="leads-data-table">
          <thead>
            <tr>
              {/* Student Name */}
              <th>
                <button
                  type="button"
                  className={`sortable-th-btn ${sortBy === 'full_name' ? 'is-active' : ''}`}
                  onClick={() => onSort('full_name')}
                >
                  <span>Student</span>
                  {renderSortIcon('full_name')}
                </button>
              </th>

              {/* Course Interest */}
              <th>Program Track</th>

              {/* Source */}
              <th>Lead Source</th>

              {/* Status */}
              <th>
                <button
                  type="button"
                  className={`sortable-th-btn ${sortBy === 'status' ? 'is-active' : ''}`}
                  onClick={() => onSort('status')}
                >
                  <span>Status</span>
                  {renderSortIcon('status')}
                </button>
              </th>

              {/* Next Follow-Up */}
              <th>Next Action</th>

              {/* Counsellor */}
              <th>Counsellor</th>

              {/* Added Date */}
              <th>
                <button
                  type="button"
                  className={`sortable-th-btn ${sortBy === 'created_at' ? 'is-active' : ''}`}
                  onClick={() => onSort('created_at')}
                >
                  <span>Enquiry Date</span>
                  {renderSortIcon('created_at')}
                </button>
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <LeadsSkeleton rows={6} />
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 0 }}>
                  <LeadsEmptyState
                    isFiltered={isFiltered}
                    onResetFilters={onResetFilters}
                    onOpenCreateModal={onOpenCreateModal}
                  />
                </td>
              </tr>
            ) : (
              leads.map((lead) => {
                const initials = lead.full_name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase()

                // Next pending follow-up logic
                const pendingFollowUp = lead.follow_ups?.find((f) => f.status === 'pending')
                const isOverdue = pendingFollowUp ? new Date(pendingFollowUp.due_at).getTime() < nowMs : false

                return (
                  <tr key={lead.id}>
                    {/* Student Name & Phone/Email */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div className="student-avatar">{initials}</div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#f8fafc' }}>
                            {lead.full_name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Phone size={10} style={{ color: '#60a5fa' }} />
                            <span className="tabular-nums">{lead.phone}</span>
                            {lead.email && (
                              <>
                                <span style={{ opacity: 0.4 }}>•</span>
                                <span style={{ color: '#64748b' }}>{lead.email}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Program Track */}
                    <td>
                      <span style={{ fontWeight: 500, color: '#cbd5e1' }}>
                        {lead.course_interest}
                      </span>
                    </td>

                    {/* Source */}
                    <td>
                      <span style={{ 
                        fontSize: '0.72rem', 
                        padding: '2px 7px', 
                        borderRadius: '4px', 
                        backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                        color: '#94a3b8',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        fontWeight: 500
                      }}>
                        {lead.source}
                      </span>
                    </td>

                    {/* Status Pill */}
                    <td>
                      <span className={`status-pill status-${lead.status}`}>
                        <span className="status-pill-dot" />
                        {lead.status}
                      </span>
                    </td>

                    {/* Next Action / Follow-up */}
                    <td>
                      {pendingFollowUp ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: isOverdue ? '#f87171' : '#cbd5e1' }}>
                          <Calendar size={12} />
                          <span className="tabular-nums">{formatDate(pendingFollowUp.due_at)}</span>
                          {isOverdue && <span className="overdue-tag">Overdue</span>}
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: '#64748b' }}>
                          <Clock size={11} />
                          <span>None scheduled</span>
                        </div>
                      )}
                    </td>

                    {/* Counsellor */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#cbd5e1' }}>
                        <User size={12} style={{ color: '#64748b' }} />
                        <span>{lead.assignee?.full_name || 'Unassigned'}</span>
                      </div>
                    </td>

                    {/* Date Added */}
                    <td style={{ color: '#64748b', fontSize: '0.75rem' }}>
                      <span className="tabular-nums">{formatDate(lead.created_at)}</span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Stack View */}
      <div className="leads-mobile-container" style={{ padding: '0.75rem' }}>
        {loading ? (
          <div style={{ color: '#94a3b8', textAlign: 'center', padding: '1rem' }}>Loading enquiries...</div>
        ) : leads.length === 0 ? (
          <LeadsEmptyState
            isFiltered={isFiltered}
            onResetFilters={onResetFilters}
            onOpenCreateModal={onOpenCreateModal}
          />
        ) : (
          leads.map((lead) => <LeadCardMobile key={lead.id} lead={lead} />)
        )}
      </div>
    </div>
  )
}
