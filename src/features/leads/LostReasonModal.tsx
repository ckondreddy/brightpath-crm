import React, { useState, useEffect } from 'react'
import { AlertTriangle, X, Check } from 'lucide-react'

interface LostReasonModalProps {
  isOpen: boolean
  studentName: string
  onClose: () => void
  onSubmit: (reason: string) => Promise<void>
}

const LOST_REASONS = [
  'Fee structure exceeds family budget',
  'Enrolled in competitor academy (Allen / Aakash / FIITJEE)',
  'Batch timing / schedule clash with school classes',
  'Distance / transport inconvenience to center',
  'Parent postponed coaching to next academic year',
  'Unreachable / phone disconnected / invalid contact',
  'Student decided against competitive examination',
  'Other specific reason (provide details)',
]

export const LostReasonModal: React.FC<LostReasonModalProps> = ({
  isOpen,
  studentName,
  onClose,
  onSubmit,
}) => {
  const [selectedReason, setSelectedReason] = useState(LOST_REASONS[0])
  const [customDetail, setCustomDetail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, submitting, onClose])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (selectedReason.includes('Other') && !customDetail.trim()) {
      setError('Please provide specific details in the notes box below.')
      return
    }

    const finalReason = selectedReason.includes('Other')
      ? `Other: ${customDetail.trim()}`
      : customDetail.trim()
      ? `${selectedReason} (${customDetail.trim()})`
      : selectedReason

    setSubmitting(true)
    try {
      await onSubmit(finalReason)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update lost status.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="lead-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lost-dialog-title"
    >
      <div
        className="lead-modal-card"
        style={{ maxWidth: '520px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="lead-modal-header" style={{ borderBottomColor: 'rgba(239, 68, 68, 0.2)' }}>
          <div className="lead-modal-title-group">
            <div
              className="lead-modal-icon-badge"
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                borderColor: 'rgba(239, 68, 68, 0.3)',
                color: '#f87171',
              }}
            >
              <AlertTriangle size={18} />
            </div>
            <div>
              <h2 id="lost-dialog-title" className="lead-modal-heading">
                Mark Enquiry as Lost
              </h2>
              <p className="lead-modal-subheading">
                Specify why <strong>{studentName}</strong> was not admitted
              </p>
            </div>
          </div>
          <button
            type="button"
            className="lead-modal-close-btn"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="lead-modal-body">
            {error && (
              <div className="lead-modal-error-banner animate-slide-down">
                <span>{error}</span>
              </div>
            )}

            <div className="lead-field-group">
              <label className="lead-field-label" htmlFor="lostReasonSelect">
                <span>Primary Reason for Loss <span className="lead-field-required">*</span></span>
              </label>
              <select
                id="lostReasonSelect"
                className="lead-field-select"
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                disabled={submitting}
              >
                {LOST_REASONS.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>

            <div className="lead-field-group">
              <label className="lead-field-label" htmlFor="customLostDetail">
                <span>Additional Context / Notes</span>
              </label>
              <textarea
                id="customLostDetail"
                placeholder="Parent's feedback, competitor fee quote, or specific objection..."
                className="lead-field-textarea"
                rows={3}
                value={customDetail}
                onChange={(e) => setCustomDetail(e.target.value)}
                disabled={submitting}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="lead-modal-footer">
            <button
              type="button"
              className="lead-modal-cancel-btn"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="lead-modal-submit-btn"
              style={{
                background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                borderColor: 'rgba(239, 68, 68, 0.4)',
              }}
              disabled={submitting}
            >
              {submitting ? (
                <span>Recording...</span>
              ) : (
                <>
                  <Check size={14} />
                  <span>Confirm Lost Status</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
