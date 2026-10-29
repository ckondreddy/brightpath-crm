import React, { useState, useEffect } from 'react'
import { Calendar, X, AlertCircle, RefreshCw, Check } from 'lucide-react'
import { useAuth } from '../../context/useAuth'
import { useToast } from '../../context/useToast'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { rescheduleFollowUp } from '../../services/followupService'

interface RescheduleFollowUpModalProps {
  isOpen: boolean
  followUpId: string
  leadId: string
  studentName: string
  currentDueAt: string
  onClose: () => void
  onSuccess: () => void
}

const RESCHEDULE_REASONS = [
  'Student / Parent requested callback later',
  'Parent busy / currently at work',
  'Student has school exams this week',
  'Awaiting faculty demo slot confirmation',
  'Phone unreachable / out of coverage',
]

const RescheduleFollowUpModalInner: React.FC<Omit<RescheduleFollowUpModalProps, 'isOpen'>> = ({
  followUpId,
  leadId,
  studentName,
  currentDueAt,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth()
  const toast = useToast()
  const modalRef = useFocusTrap<HTMLDivElement>({
    active: true,
    onClose,
  })

  // Default to tomorrow 10 AM
  const [newDueAt, setNewDueAt] = useState<string>(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    d.setHours(10, 0, 0, 0)
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  })

  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Escape key handling
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

  const setQuickDate = (daysAhead: number, hour: number) => {
    const d = new Date()
    d.setDate(d.getDate() + daysAhead)
    d.setHours(hour, 0, 0, 0)
    const pad = (n: number) => n.toString().padStart(2, '0')
    setNewDueAt(
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!newDueAt) {
      setErrorMessage('Please select a new callback date and time.')
      return
    }

    setIsSubmitting(true)
    const actorId = user?.id || ''

    const result = await rescheduleFollowUp(
      followUpId,
      new Date(newDueAt).toISOString(),
      reason,
      actorId,
      leadId
    )

    setIsSubmitting(false)

    if (result.error) {
      setErrorMessage(result.error)
      toast.error(result.error)
      return
    }

    toast.success(`Callback rescheduled for ${studentName}`)
    onSuccess()
    onClose()
  }

  return (
    <div
      className="lead-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reschedule-modal-title"
    >
      <div 
        ref={modalRef}
        className="lead-modal-card" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '480px' }}
      >
        {/* Header */}
        <div className="lead-modal-header">
          <div className="lead-modal-title-group">
            <div className="lead-modal-icon-badge" style={{ backgroundColor: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' }}>
              <Calendar size={18} />
            </div>
            <div>
              <h2 id="reschedule-modal-title" className="lead-modal-heading">
                Reschedule Callback
              </h2>
              <p className="lead-modal-subheading">Update consultation time for {studentName}</p>
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

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="lead-modal-body">
            {errorMessage && (
              <div className="lead-modal-error-banner animate-slide-down">
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Current schedule info */}
            <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: 6, border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Currently Scheduled For:
              </span>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.825rem', color: '#0f172a', fontWeight: 600 }}>
                {new Date(currentDueAt).toLocaleString()}
              </p>
            </div>

            {/* New Date & Time */}
            <div className="lead-field-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="lead-field-label" htmlFor="rescheduleDueAt">
                  <span>New Callback Date & Time <span className="lead-field-required">*</span></span>
                </label>

                {/* Quick Presets */}
                <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.35rem' }}>
                  <button
                    type="button"
                    className="preset-tag-btn"
                    onClick={() => setQuickDate(1, 10)}
                  >
                    Tomorrow 10 AM
                  </button>
                  <button
                    type="button"
                    className="preset-tag-btn"
                    onClick={() => setQuickDate(2, 11)}
                  >
                    In 2 Days
                  </button>
                </div>
              </div>

              <input
                id="rescheduleDueAt"
                type="datetime-local"
                className="lead-field-input"
                value={newDueAt}
                onChange={(e) => setNewDueAt(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {/* Reschedule Reason */}
            <div className="lead-field-group">
              <label className="lead-field-label" htmlFor="rescheduleReason">
                <span>Reason for Rescheduling</span>
              </label>
              <input
                id="rescheduleReason"
                type="text"
                className="lead-field-input"
                placeholder="e.g. Parent requested callback after 6 PM"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={isSubmitting}
              />

              {/* Preset buttons */}
              <div className="preset-tag-grid">
                {RESCHEDULE_REASONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    className="preset-tag-btn"
                    onClick={() => setReason(r)}
                  >
                    {r}
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
                  <span>Rescheduling...</span>
                </>
              ) : (
                <>
                  <Check size={14} />
                  <span>Update Callback Time</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const RescheduleFollowUpModal: React.FC<RescheduleFollowUpModalProps> = (props) => {
  if (!props.isOpen) return null

  return (
    <RescheduleFollowUpModalInner
      key={props.followUpId}
      followUpId={props.followUpId}
      leadId={props.leadId}
      studentName={props.studentName}
      currentDueAt={props.currentDueAt}
      onClose={props.onClose}
      onSuccess={props.onSuccess}
    />
  )
}
