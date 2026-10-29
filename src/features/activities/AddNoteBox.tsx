import React, { useState } from 'react'
import { Send, RefreshCw, AlertCircle, MessageSquare } from 'lucide-react'
import { useAuth } from '../../context/useAuth'
import { addLeadNote } from '../../services/activityService'

interface AddNoteBoxProps {
  leadId: string
  onNoteAdded: () => void
}

const QUICK_NOTE_CHIPS = [
  'Parent requested fee installment breakdown',
  'Attended demo class — high interest in batch',
  'Sent syllabus & scholarship details via WhatsApp',
  'Student requested callback after coaching test',
  'Walk-in campus visit scheduled for weekend',
]

export const AddNoteBox: React.FC<AddNoteBoxProps> = ({ leadId, onNoteAdded }) => {
  const { user } = useAuth()
  const [noteText, setNoteText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!noteText.trim()) {
      setErrorMessage('Please enter a note before saving.')
      return
    }

    setIsSubmitting(true)
    const actorId = user?.id || ''
    const { error } = await addLeadNote(leadId, noteText, actorId)
    setIsSubmitting(false)

    if (error) {
      setErrorMessage(error)
      return
    }

    setNoteText('')
    setIsExpanded(false)
    onNoteAdded()
  }

  return (
    <div className="add-note-box">
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>
            <MessageSquare size={13} style={{ color: '#f59e0b' }} />
            <span>Quick Log Counsellor Note</span>
          </div>

          <textarea
            className="lead-field-textarea"
            rows={isExpanded ? 3 : 2}
            placeholder="Log call summary, parent feedback, or student enquiry updates..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            disabled={isSubmitting}
            style={{ fontSize: '0.8rem', padding: '0.5rem 0.65rem', backgroundColor: '#ffffff', color: '#0f172a', borderColor: '#cbd5e1' }}
          />

          {errorMessage && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f87171', fontSize: '0.72rem' }}>
              <AlertCircle size={12} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick preset suggestions */}
          {isExpanded && (
            <div className="preset-tag-grid" style={{ marginTop: '0.15rem' }}>
              {QUICK_NOTE_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  className="preset-tag-btn"
                  onClick={() => setNoteText(chip)}
                  disabled={isSubmitting}
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem', marginTop: '0.2rem' }}>
            {isExpanded && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setNoteText('')
                  setIsExpanded(false)
                }}
                disabled={isSubmitting}
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              className="btn btn-primary interactive-press"
              disabled={isSubmitting || !noteText.trim()}
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.7rem', gap: '0.35rem' }}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={12} className="spin" />
                  <span>Logging...</span>
                </>
              ) : (
                <>
                  <Send size={12} />
                  <span>Log Note</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
