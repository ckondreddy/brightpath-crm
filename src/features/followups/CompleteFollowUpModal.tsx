import React, { useState, useEffect } from 'react'
import { CheckCircle2, X, AlertCircle, RefreshCw, Check } from 'lucide-react'
import { useAuth } from '../../context/useAuth'
import { useToast } from '../../context/useToast'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { completeFollowUp } from '../../services/followupService'

interface CompleteFollowUpModalProps {
  isOpen: boolean
  followUpId: string
  leadId: string
  studentName: string
  scheduledNote: string
  onClose: () => void
  onSuccess: () => void
}

const OUTCOME_PRESETS = [
  'Confirmed Admission & Token Paid',
  'Parent Requested Campus Visit on Weekend',
  'Demo Class Scheduled — Faculty Assigned',
  'Fee Structure & Syllabus Sent via WhatsApp',
  'Requested Follow-up Callback in 3 Days',
  'Call Disconnected / Parent Busy',
]

const CompleteFollowUpModalInner: React.FC<Omit<CompleteFollowUpModalProps, 'isOpen'>> = ({
  followUpId,
  leadId,
  studentName,
  scheduledNote,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth()
  const toast = useToast()
  const modalRef = useFocusTrap<HTMLDivElement>({
    active: true,
    onClose,
  })
  const [outcomeNote, setOutcomeNote] = useState('')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setIsSubmitting(true)

    const actorId = user?.id || ''
    const result = await completeFollowUp(followUpId, outcomeNote, actorId, leadId)

    setIsSubmitting(false)

    if (result.error) {
      setErrorMessage(result.error)
      toast.error(result.error)
      return
    }

    toast.success(`Follow-up consultation marked as completed`)
    onSuccess()
    onClose()
  }

  return (
    <div
      className="lead-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="complete-modal-title"
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
            <div className="lead-modal-icon-badge" style={{ backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0' }}>
              <CheckCircle2 size={18} />
            </div>
            <div>
              <h2 id="complete-modal-title" className="lead-modal-heading">
                Complete Follow-up Call
              </h2>
              <p className="lead-modal-subheading">Record discussion outcome with {studentName}</p>
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

            {/* Scheduled note reminder */}
            <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: 6, border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Original Agenda:
              </span>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#334155' }}>
                "{scheduledNote}"
              </p>
            </div>

            {/* Outcome notes */}
            <div className="lead-field-group">
              <label className="lead-field-label" htmlFor="outcomeNoteInput">
                <span>Discussion Outcome & Next Steps</span>
              </label>
              <textarea
                id="outcomeNoteInput"
                className="lead-field-textarea"
                rows={3}
                placeholder="Briefly describe what was discussed or decided during the consultation..."
                value={outcomeNote}
                onChange={(e) => setOutcomeNote(e.target.value)}
                disabled={isSubmitting}
                autoFocus
              />

              {/* Preset buttons */}
              <div className="preset-tag-grid">
                {OUTCOME_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className="preset-tag-btn"
                    onClick={() => setOutcomeNote(preset)}
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
              style={{ backgroundColor: '#10b981' }}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={14} className="spin" />
                  <span>Saving Outcome...</span>
                </>
              ) : (
                <>
                  <Check size={14} />
                  <span>Mark as Completed</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const CompleteFollowUpModal: React.FC<CompleteFollowUpModalProps> = (props) => {
  if (!props.isOpen) return null

  return (
    <CompleteFollowUpModalInner
      key={props.followUpId}
      followUpId={props.followUpId}
      leadId={props.leadId}
      studentName={props.studentName}
      scheduledNote={props.scheduledNote}
      onClose={props.onClose}
      onSuccess={props.onSuccess}
    />
  )
}
