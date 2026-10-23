import React, { useState, useEffect } from 'react'
import { CalendarClock, X, AlertCircle, RefreshCw, Check } from 'lucide-react'
import { useAuth } from '../../context/useAuth'
import { UserProfile } from '../../types'
import { scheduleFollowUp } from '../../services/followupService'
import { fetchLeadsForSelect, LeadSelectItem } from '../../services/leadService'
import './followups.css'

interface ScheduleFollowUpModalProps {
  isOpen: boolean
  preselectedLeadId?: string
  preselectedLeadName?: string
  staffList?: UserProfile[]
  onClose: () => void
  onSuccess: () => void
}

const PRESET_OBJECTIVES = [
  'Demo Class Schedule & Faculty Meeting',
  'Parent Fee Concession & Installment Query',
  'Scholarship Test Result & Batch Placement',
  'Campus Visit & Hostel Facility Walkthrough',
  'Pending Admission Documents Collection',
  'Follow-up Call After Study Material Dispatch',
]

const ScheduleFollowUpModalInner: React.FC<Omit<ScheduleFollowUpModalProps, 'isOpen'>> = ({
  preselectedLeadId,
  preselectedLeadName,
  staffList = [],
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth()

  // State
  const [leadId, setLeadId] = useState<string>(preselectedLeadId || '')
  const [leadsList, setLeadsList] = useState<LeadSelectItem[]>([])
  const [loadingLeads, setLoadingLeads] = useState(!preselectedLeadId)

  // Default to tomorrow at 10:00 AM
  const [dueAt, setDueAt] = useState<string>(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(10, 0, 0, 0)
    // Format to YYYY-MM-DDTHH:mm for datetime-local
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}T${pad(tomorrow.getHours())}:${pad(tomorrow.getMinutes())}`
  })

  const [note, setNote] = useState('')
  const [assignedTo, setAssignedTo] = useState<string>(user?.id || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Load leads if not preselected
  useEffect(() => {
    let isCancelled = false
    if (!preselectedLeadId) {
      fetchLeadsForSelect().then(({ data }) => {
        if (!isCancelled) {
          setLeadsList(data)
          if (data.length > 0 && !leadId) {
            setLeadId(data[0].id)
          }
          setLoadingLeads(false)
        }
      })
    }
    return () => {
      isCancelled = true
    }
  }, [preselectedLeadId, leadId])

  // Focus & Escape key handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isSubmitting, onClose])

  // Date helper for quick presets
  const setQuickTime = (hoursFromNow: number, setMorningTomorrow?: boolean) => {
    const d = new Date()
    const pad = (n: number) => n.toString().padStart(2, '0')

    if (setMorningTomorrow) {
      d.setDate(d.getDate() + 1)
      d.setHours(10, 0, 0, 0)
    } else {
      d.setHours(d.getHours() + hoursFromNow)
    }

    setDueAt(
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!leadId) {
      setErrorMessage('Please select a student enquiry.')
      return
    }

    if (!dueAt) {
      setErrorMessage('Please choose a callback date and time.')
      return
    }

    if (!note.trim() || note.trim().length < 2) {
      setErrorMessage('Please provide an agenda or note for the follow-up.')
      return
    }

    setIsSubmitting(true)
    const actorId = user?.id || ''

    const result = await scheduleFollowUp(
      {
        lead_id: leadId,
        due_at: new Date(dueAt).toISOString(),
        note: note.trim(),
        assigned_to: assignedTo || null,
      },
      actorId
    )

    setIsSubmitting(false)

    if (result.error) {
      setErrorMessage(result.error)
      return
    }

    onSuccess()
    onClose()
  }

  return (
    <div
      className="lead-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="schedule-modal-title"
    >
      <div className="lead-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="lead-modal-header">
          <div className="lead-modal-title-group">
            <div className="lead-modal-icon-badge" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
              <CalendarClock size={18} />
            </div>
            <div>
              <h2 id="schedule-modal-title" className="lead-modal-heading">
                Schedule Student Follow-up
              </h2>
              <p className="lead-modal-subheading">Set a reminder to reconnect with prospective student</p>
            </div>
          </div>
          <button
            type="button"
            className="lead-modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
            disabled={isSubmitting}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="lead-modal-body">
            {errorMessage && (
              <div className="lead-modal-error-banner animate-slide-down">
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Target Enquiry */}
            <div className="lead-field-group">
              <label className="lead-field-label" htmlFor="followUpLeadSelect">
                <span>Student Enquiry <span className="lead-field-required">*</span></span>
              </label>

              {preselectedLeadId ? (
                <input
                  id="followUpLeadSelect"
                  type="text"
                  className="lead-field-input"
                  value={preselectedLeadName || 'Current Student Lead'}
                  disabled
                  style={{ backgroundColor: '#090d16', color: '#93c5fd' }}
                />
              ) : loadingLeads ? (
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Loading student enquiries...</div>
              ) : (
                <select
                  id="followUpLeadSelect"
                  className="lead-field-select"
                  value={leadId}
                  onChange={(e) => setLeadId(e.target.value)}
                  disabled={isSubmitting}
                >
                  {leadsList.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.full_name} — {l.course_interest} ({l.phone})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Callback Date & Time */}
            <div className="lead-field-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="lead-field-label" htmlFor="followUpDueAt">
                  <span>Callback Date & Time <span className="lead-field-required">*</span></span>
                </label>

                {/* Quick Presets */}
                <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.35rem' }}>
                  <button
                    type="button"
                    className="preset-tag-btn"
                    onClick={() => setQuickTime(2)}
                  >
                    +2 Hours
                  </button>
                  <button
                    type="button"
                    className="preset-tag-btn"
                    onClick={() => setQuickTime(0, true)}
                  >
                    Tomorrow 10 AM
                  </button>
                </div>
              </div>

              <input
                id="followUpDueAt"
                type="datetime-local"
                className="lead-field-input"
                value={dueAt}
                onChange={(e) => setDueAt(e.target.value)}
                disabled={isSubmitting}
                style={{ colorScheme: 'dark' }}
              />
            </div>

            {/* Counsellor Assigned */}
            <div className="lead-field-group">
              <label className="lead-field-label" htmlFor="followUpAssignedTo">
                <span>Assigned Staff Member</span>
              </label>
              <select
                id="followUpAssignedTo"
                className="lead-field-select"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="">Unassigned</option>
                {staffList.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.full_name} ({staff.role.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            {/* Objective / Notes */}
            <div className="lead-field-group">
              <label className="lead-field-label" htmlFor="followUpNote">
                <span>Follow-up Objective & Agenda <span className="lead-field-required">*</span></span>
              </label>
              <textarea
                id="followUpNote"
                className="lead-field-textarea"
                rows={2}
                placeholder="e.g. Call parent to explain fee payment installments and scholarship exam syllabus"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                disabled={isSubmitting}
              />

              {/* Preset suggestion pills */}
              <div className="preset-tag-grid">
                {PRESET_OBJECTIVES.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className="preset-tag-btn"
                    onClick={() => setNote(preset)}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="lead-modal-footer">
            <button
              type="button"
              className="lead-modal-cancel-btn"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="lead-modal-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={14} className="spin" />
                  <span>Scheduling...</span>
                </>
              ) : (
                <>
                  <Check size={14} />
                  <span>Confirm Schedule</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const ScheduleFollowUpModal: React.FC<ScheduleFollowUpModalProps> = (props) => {
  if (!props.isOpen) return null

  return (
    <ScheduleFollowUpModalInner
      key={props.preselectedLeadId || 'global-schedule-modal'}
      preselectedLeadId={props.preselectedLeadId}
      preselectedLeadName={props.preselectedLeadName}
      staffList={props.staffList}
      onClose={props.onClose}
      onSuccess={props.onSuccess}
    />
  )
}
