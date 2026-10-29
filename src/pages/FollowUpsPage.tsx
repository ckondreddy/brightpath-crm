import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { 
  CalendarClock, 
  Plus, 
  Search, 
  CheckCircle2, 
  PhoneCall, 
  Calendar, 
  Clock, 
  AlertTriangle,
  User
} from 'lucide-react'
import { 
  fetchFollowUps, 
  fetchFollowUpCounts, 
  FollowUpWithLead, 
  FollowUpTab, 
  FollowUpCounts 
} from '../services/followupService'
import { fetchStaffProfiles } from '../services/leadService'
import { UserProfile } from '../types'
import { ScheduleFollowUpModal } from '../features/followups/ScheduleFollowUpModal'
import { CompleteFollowUpModal } from '../features/followups/CompleteFollowUpModal'
import { RescheduleFollowUpModal } from '../features/followups/RescheduleFollowUpModal'
import '../features/followups/followups.css'

function formatDueDisplay(dueAtIso: string, status: string, nowMs: number) {
  const dueTime = new Date(dueAtIso).getTime()
  const diffHours = Math.round((dueTime - nowMs) / (1000 * 60 * 60))

  if (status === 'completed') {
    return {
      text: `Completed on ${new Date(dueAtIso).toLocaleDateString()}`,
      className: 'text-completed',
    }
  }

  if (dueTime < nowMs) {
    const overdueHrs = Math.abs(diffHours)
    if (overdueHrs < 1) return { text: 'Overdue by a few minutes', className: 'text-overdue' }
    if (overdueHrs < 24) return { text: `Overdue by ${overdueHrs}h`, className: 'text-overdue' }
    const overdueDays = Math.round(overdueHrs / 24)
    return { text: `Overdue by ${overdueDays}d`, className: 'text-overdue' }
  }

  // Future
  const today = new Date(nowMs)
  const dueDate = new Date(dueAtIso)
  const isSameDay =
    today.getFullYear() === dueDate.getFullYear() &&
    today.getMonth() === dueDate.getMonth() &&
    today.getDate() === dueDate.getDate()

  if (isSameDay) {
    return {
      text: `Today at ${dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      className: 'text-today',
    }
  }

  const tomorrowDate = today.getDate() + 1
  const isTomorrow =
    today.getFullYear() === dueDate.getFullYear() &&
    today.getMonth() === dueDate.getMonth() &&
    tomorrowDate === dueDate.getDate()

  if (isTomorrow) {
    return {
      text: `Tomorrow at ${dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      className: 'text-upcoming',
    }
  }

  return {
    text: dueDate.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    className: 'text-upcoming',
  }
}

export const FollowUpsPage: React.FC = () => {
  const [nowMs] = useState(() => Date.now())
  const [activeTab, setActiveTab] = useState<FollowUpTab>('overdue')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCounsellor, setSelectedCounsellor] = useState('all')

  const [followUps, setFollowUps] = useState<FollowUpWithLead[]>([])
  const [counts, setCounts] = useState<FollowUpCounts>({
    overdue: 0,
    today: 0,
    upcoming: 0,
    completed: 0,
    totalPending: 0,
  })
  const [staffList, setStaffList] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)

  // Modals state
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [selectedForComplete, setSelectedForComplete] = useState<FollowUpWithLead | null>(null)
  const [selectedForReschedule, setSelectedForReschedule] = useState<FollowUpWithLead | null>(null)

  // Load staff profiles once
  useEffect(() => {
    fetchStaffProfiles().then(({ data }) => setStaffList(data))
  }, [])

  // Refresh counts on demand
  const refreshCounts = useCallback(async () => {
    const { data } = await fetchFollowUpCounts(selectedCounsellor)
    setCounts(data)
  }, [selectedCounsellor])

  // Refresh follow-ups on demand
  const refreshFollowUps = useCallback(async () => {
    setLoading(true)
    const { data } = await fetchFollowUps({
      tab: activeTab,
      counsellorId: selectedCounsellor,
      searchQuery,
    })
    setFollowUps(data)
    setLoading(false)
  }, [activeTab, selectedCounsellor, searchQuery])

  // Initial load and sync on tab / filter change
  useEffect(() => {
    let isCancelled = false

    fetchFollowUps({
      tab: activeTab,
      counsellorId: selectedCounsellor,
      searchQuery,
    }).then(({ data }) => {
      if (!isCancelled) {
        setFollowUps(data)
        setLoading(false)
      }
    })

    fetchFollowUpCounts(selectedCounsellor).then(({ data }) => {
      if (!isCancelled) {
        setCounts(data)
      }
    })

    return () => {
      isCancelled = true
    }
  }, [activeTab, selectedCounsellor, searchQuery])

  const handleActionSuccess = async () => {
    await Promise.all([refreshFollowUps(), refreshCounts()])
  }

  return (
    <div className="container-fluid followups-container">
      {/* Top Header */}
      <div className="followups-header">
        <div className="followups-header-left">
          <div className="followups-title-row">
            <h1 className="followups-title">Follow-Up & Consultation Schedule</h1>
            {counts.overdue > 0 ? (
              <span className="overdue-counter-badge animate-pulse">
                <AlertTriangle size={12} />
                <span>{counts.overdue} Action Required</span>
              </span>
            ) : (
              <span className="nav-pill" style={{ color: '#34d399', backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                ✓ Schedule Synchronized
              </span>
            )}
          </div>
          <p className="followups-subtitle">
            Never miss a callback. Stay synchronized with prospective students and parents.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary interactive-press"
          onClick={() => setShowScheduleModal(true)}
        >
          <Plus size={14} />
          <span>Schedule Follow-up</span>
        </button>
      </div>

      {/* Segmented Filter Controls & Search */}
      <div className="followups-controls-bar">
        {/* Tab Switcher */}
        <div className="followup-tabs" role="tablist">
          <button
            type="button"
            className={`followup-tab-btn ${activeTab === 'overdue' ? 'active' : ''}`}
            onClick={() => setActiveTab('overdue')}
          >
            <span>Overdue</span>
            <span className={`followup-tab-count ${counts.overdue > 0 ? 'alert' : ''}`}>
              {counts.overdue}
            </span>
          </button>

          <button
            type="button"
            className={`followup-tab-btn ${activeTab === 'today' ? 'active' : ''}`}
            onClick={() => setActiveTab('today')}
          >
            <span>Today</span>
            <span className="followup-tab-count">{counts.today}</span>
          </button>

          <button
            type="button"
            className={`followup-tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            <span>Upcoming</span>
            <span className="followup-tab-count">{counts.upcoming}</span>
          </button>

          <button
            type="button"
            className={`followup-tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            <span>Completed</span>
            <span className="followup-tab-count">{counts.completed}</span>
          </button>

          <button
            type="button"
            className={`followup-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <span>All Tasks</span>
          </button>
        </div>

        {/* Right Search & Counsellor Filter */}
        <div className="followup-actions-right">
          {/* Search Box */}
          <div className="followup-search-box">
            <Search size={13} className="followup-search-icon" />
            <input
              type="text"
              className="followup-search-input"
              placeholder="Search student or note..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Counsellor Filter */}
          <select
            className="lead-field-select"
            value={selectedCounsellor}
            onChange={(e) => setSelectedCounsellor(e.target.value)}
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', width: 'auto' }}
          >
            <option value="all">Staff: All Members</option>
            {staffList.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.full_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task Queue Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
          <Clock size={24} className="spin" style={{ color: '#60a5fa', margin: '0 auto 0.5rem auto' }} />
          <div>Loading follow-up queue...</div>
        </div>
      ) : followUps.length === 0 ? (
        <div className="followups-empty-card">
          <CalendarClock size={36} style={{ color: '#64748b' }} />
          <h3 style={{ fontSize: '1rem', color: '#0f172a', margin: 0 }}>
            {activeTab === 'overdue'
              ? 'No overdue callbacks!'
              : activeTab === 'today'
              ? 'No follow-ups scheduled for today'
              : 'No follow-up records found'}
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0, maxWidth: '400px' }}>
            {activeTab === 'overdue'
              ? 'Excellent work! All student enquiries and callbacks are up to date.'
              : 'Schedule callbacks with prospective students to maintain high conversion momentum.'}
          </p>
          <button
            type="button"
            className="btn btn-secondary interactive-press"
            onClick={() => setShowScheduleModal(true)}
            style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}
          >
            <Plus size={13} />
            <span>Schedule New Follow-up</span>
          </button>
        </div>
      ) : (
        <div className="followup-list">
          {followUps.map((task) => {
            const studentName = task.lead?.full_name || 'Prospective Student'
            const courseInterest = task.lead?.course_interest || 'General Track'
            const phone = task.lead?.phone || ''
            const leadId = task.lead_id
            const isCompleted = task.status === 'completed'
            const dueInfo = formatDueDisplay(task.due_at, task.status, nowMs)

            const initials = studentName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()

            const cardClass = isCompleted
              ? 'is-completed'
              : dueInfo.className === 'text-overdue'
              ? 'is-overdue'
              : dueInfo.className === 'text-today'
              ? 'is-today'
              : 'is-upcoming'

            return (
              <div key={task.id} className={`followup-card ${cardClass}`}>
                {/* Left: Info */}
                <div className="followup-main-info">
                  <div className="followup-avatar">{initials}</div>
                  <div className="followup-details">
                    <div className="followup-name-row">
                      <Link to={`/leads/${leadId}`} className="followup-student-link">
                        {studentName}
                      </Link>
                      <span className="followup-course-tag">• {courseInterest}</span>
                      {cardClass === 'is-overdue' && (
                        <span className="overdue-tag">Overdue</span>
                      )}
                    </div>

                    <div className="followup-note-text">
                      "{task.note}"
                    </div>

                    <div className="followup-meta-row">
                      <span className={`followup-time-pill ${dueInfo.className}`}>
                        <CalendarClock size={12} />
                        <span>{dueInfo.text}</span>
                      </span>

                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <User size={12} />
                        <span>{task.assignee?.full_name || 'Unassigned'}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="followup-actions">
                  {!isCompleted ? (
                    <>
                      <button
                        type="button"
                        className="followup-btn-done interactive-press"
                        onClick={() => setSelectedForComplete(task)}
                        title="Mark callback completed"
                      >
                        <CheckCircle2 size={13} />
                        <span>Done</span>
                      </button>

                      <button
                        type="button"
                        className="followup-btn-reschedule interactive-press"
                        onClick={() => setSelectedForReschedule(task)}
                        title="Reschedule callback"
                      >
                        <Calendar size={13} />
                        <span>Reschedule</span>
                      </button>

                      {phone && (
                        <a
                          href={`tel:${phone}`}
                          className="followup-call-link interactive-press"
                          title="Call student"
                        >
                          <PhoneCall size={13} />
                          <span>Call</span>
                        </a>
                      )}
                    </>
                  ) : (
                    <Link
                      to={`/leads/${leadId}`}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', textDecoration: 'none' }}
                    >
                      <span>View Enquiry</span>
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <ScheduleFollowUpModal
          isOpen={showScheduleModal}
          staffList={staffList}
          onClose={() => setShowScheduleModal(false)}
          onSuccess={handleActionSuccess}
        />
      )}

      {/* Complete Modal */}
      {selectedForComplete && (
        <CompleteFollowUpModal
          isOpen={Boolean(selectedForComplete)}
          followUpId={selectedForComplete.id}
          leadId={selectedForComplete.lead_id}
          studentName={selectedForComplete.lead?.full_name || 'Student'}
          scheduledNote={selectedForComplete.note}
          onClose={() => setSelectedForComplete(null)}
          onSuccess={handleActionSuccess}
        />
      )}

      {/* Reschedule Modal */}
      {selectedForReschedule && (
        <RescheduleFollowUpModal
          isOpen={Boolean(selectedForReschedule)}
          followUpId={selectedForReschedule.id}
          leadId={selectedForReschedule.lead_id}
          studentName={selectedForReschedule.lead?.full_name || 'Student'}
          currentDueAt={selectedForReschedule.due_at}
          onClose={() => setSelectedForReschedule(null)}
          onSuccess={handleActionSuccess}
        />
      )}
    </div>
  )
}
