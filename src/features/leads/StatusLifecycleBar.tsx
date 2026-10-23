import React, { useState } from 'react'
import { Check, AlertTriangle, RotateCcw } from 'lucide-react'
import { LeadStatus } from '../../types'
import { LostReasonModal } from './LostReasonModal'

interface StatusLifecycleBarProps {
  currentStatus: LeadStatus
  lostReason?: string | null
  studentName: string
  onStatusChange: (newStatus: LeadStatus, lostReason?: string | null) => Promise<void>
  disabled?: boolean
}

const STAGES: { key: LeadStatus; label: string }[] = [
  { key: 'New', label: '1. New Enquiry' },
  { key: 'Contacted', label: '2. Contacted' },
  { key: 'Qualified', label: '3. Qualified' },
  { key: 'Converted', label: '4. Converted (Enrolled)' },
]

export const StatusLifecycleBar: React.FC<StatusLifecycleBarProps> = ({
  currentStatus,
  lostReason,
  studentName,
  onStatusChange,
  disabled = false,
}) => {
  const [showLostModal, setShowLostModal] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStageClick = async (targetStage: LeadStatus) => {
    if (disabled || isUpdating || targetStage === currentStatus) return

    setIsUpdating(true)
    try {
      await onStatusChange(targetStage, null)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleConfirmLost = async (reason: string) => {
    setIsUpdating(true)
    try {
      await onStatusChange('Lost', reason)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleReopen = async () => {
    if (disabled || isUpdating) return
    setIsUpdating(true)
    try {
      await onStatusChange('New', null)
    } finally {
      setIsUpdating(false)
    }
  }

  // Calculate index of current status in pipeline
  const currentStageIndex = STAGES.findIndex((s) => s.key === currentStatus)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
      <div className="status-stepper-card">
        {/* Stages Stepper */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Pipeline Stage:
          </span>

          <div className="status-stepper-track" role="tablist">
            {STAGES.map((stage, idx) => {
              const isCurrent = currentStatus === stage.key
              const isCompleted = currentStageIndex > idx

              return (
                <button
                  key={stage.key}
                  type="button"
                  className={`status-step-btn ${isCurrent ? `is-current stage-${stage.key}` : ''} ${isCompleted ? 'is-completed' : ''}`}
                  onClick={() => handleStageClick(stage.key)}
                  disabled={disabled || isUpdating}
                  title={`Move student to ${stage.label}`}
                >
                  {isCompleted ? (
                    <Check size={12} style={{ color: '#38bdf8' }} />
                  ) : isCurrent ? (
                    <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'currentColor' }} />
                  ) : null}
                  <span>{stage.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Extra Action (Mark Lost or Reopen) */}
        <div className="status-stepper-extra">
          {currentStatus === 'Lost' ? (
            <button
              type="button"
              className="btn btn-secondary interactive-press"
              onClick={handleReopen}
              disabled={disabled || isUpdating}
              style={{ fontSize: '0.78rem', gap: '0.35rem' }}
            >
              <RotateCcw size={12} />
              <span>Reactivate Enquiry</span>
            </button>
          ) : (
            <button
              type="button"
              className="mark-lost-btn interactive-press"
              onClick={() => setShowLostModal(true)}
              disabled={disabled || isUpdating}
            >
              <AlertTriangle size={13} />
              <span>Mark as Lost</span>
            </button>
          )}
        </div>
      </div>

      {/* Lost Reason Notice Banner if status is Lost */}
      {currentStatus === 'Lost' && (
        <div className="lost-reason-banner animate-slide-down">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={16} style={{ flexShrink: 0 }} />
            <span>
              <strong>Enquiry Closed as Lost:</strong> {lostReason || 'No specific reason recorded.'}
            </span>
          </div>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setShowLostModal(true)}
            style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', color: '#fca5a5' }}
          >
            Update Reason
          </button>
        </div>
      )}

      {/* Mandatory Lost Reason Modal */}
      <LostReasonModal
        isOpen={showLostModal}
        studentName={studentName}
        onClose={() => setShowLostModal(false)}
        onSubmit={handleConfirmLost}
      />
    </div>
  )
}
