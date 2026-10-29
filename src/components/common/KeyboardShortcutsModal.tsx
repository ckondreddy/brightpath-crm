import React from 'react'
import { Command, X } from 'lucide-react'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import '../../features/leads/create-lead-modal.css'

interface KeyboardShortcutsModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ShortcutItem {
  keys: string[]
  description: string
  category: 'General' | 'Navigation' | 'Actions'
}

const SHORTCUTS: ShortcutItem[] = [
  { keys: ['N'], description: 'Open new student enquiry modal', category: 'Actions' },
  { keys: ['⌘', 'K'], description: 'Focus search enquiries input', category: 'General' },
  { keys: ['?'], description: 'Open this keyboard shortcuts dialog', category: 'General' },
  { keys: ['Esc'], description: 'Close any active modal or menu', category: 'General' },
  { keys: ['G', 'D'], description: 'Navigate to Dashboard', category: 'Navigation' },
  { keys: ['G', 'L'], description: 'Navigate to Student Leads directory', category: 'Navigation' },
  { keys: ['G', 'F'], description: 'Navigate to Follow-ups queue', category: 'Navigation' },
  { keys: ['G', 'R'], description: 'Navigate to Admissions Reports', category: 'Navigation' },
  { keys: ['G', 'S'], description: 'Navigate to Academy Settings', category: 'Navigation' },
]

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useFocusTrap<HTMLDivElement>({
    active: isOpen,
    onClose,
  })

  if (!isOpen) return null

  const categories: Array<'General' | 'Actions' | 'Navigation'> = ['Actions', 'Navigation', 'General']

  return (
    <div
      className="lead-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-modal-title"
    >
      <div
        ref={modalRef}
        className="lead-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '520px' }}
      >
        {/* Header */}
        <div className="lead-modal-header">
          <div className="lead-modal-title-group">
            <div className="lead-modal-icon-badge" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <Command size={18} />
            </div>
            <div>
              <h2 id="shortcuts-modal-title" className="lead-modal-heading">
                Keyboard Shortcuts
              </h2>
              <p className="lead-modal-subheading">Power-user keybindings for BrightPath CRM</p>
            </div>
          </div>
          <button
            type="button"
            className="lead-modal-close-btn"
            onClick={onClose}
            aria-label="Close keyboard shortcuts dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="lead-modal-body" style={{ gap: '1.25rem', padding: '1.25rem 1.5rem' }}>
          {categories.map((cat) => {
            const items = SHORTCUTS.filter((s) => s.category === cat)
            return (
              <div key={cat} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#64748b',
                  }}
                >
                  {cat}
                </span>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                  }}
                >
                  {items.map((item, idx) => (
                    <div
                      key={item.description}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.6rem 0.85rem',
                        fontSize: '0.8125rem',
                        color: '#0f172a',
                        borderTop: idx > 0 ? '1px solid #e2e8f0' : 'none',
                      }}
                    >
                      <span>{item.description}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        {item.keys.map((k, kIdx) => (
                          <React.Fragment key={kIdx}>
                            {kIdx > 0 && <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>then</span>}
                            <kbd
                              className="kbd-shortcut"
                              style={{
                                padding: '0.2rem 0.45rem',
                                fontSize: '0.725rem',
                                backgroundColor: '#ffffff',
                                color: '#1e293b',
                                border: '1px solid #cbd5e1',
                                boxShadow: '0 1px 1px rgba(0,0,0,0.05)',
                              }}
                            >
                              {k}
                            </kbd>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="lead-modal-footer" style={{ justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Press <kbd className="kbd-shortcut" style={{ padding: '0.1rem 0.35rem' }}>?</kbd> anytime to open this helper
          </span>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}
