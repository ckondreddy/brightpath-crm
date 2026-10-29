import React, { useEffect, useState } from 'react'
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'
import { ToastItem } from '../../context/ToastContext'
import { useToast } from '../../context/useToast'
import './toast.css'

const ToastRow: React.FC<{ toast: ToastItem; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const duration = toast.duration ?? 3800

  useEffect(() => {
    if (duration <= 0 || isHovered) return

    const timer = setTimeout(() => {
      onDismiss(toast.id)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, isHovered, onDismiss, toast.id])

  const renderIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 size={18} className="toast-icon" />
      case 'error':
        return <AlertCircle size={18} className="toast-icon" />
      case 'warning':
        return <AlertTriangle size={18} className="toast-icon" />
      case 'info':
      default:
        return <Info size={18} className="toast-icon" />
    }
  }

  return (
    <div
      className={`toast-item type-${toast.type}`}
      role="status"
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {renderIcon()}

      <div className="toast-content">
        <div className="toast-message">{toast.message}</div>
        {toast.action && (
          <button
            type="button"
            className="toast-action-btn"
            onClick={() => {
              toast.action?.onClick()
              onDismiss(toast.id)
            }}
          >
            {toast.action.label}
          </button>
        )}
      </div>

      <button
        type="button"
        className="toast-close-btn"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
      >
        <X size={15} />
      </button>

      {duration > 0 && (
        <div className="toast-progress">
          <div
            className="toast-progress-bar"
            style={{
              animationDuration: `${duration}ms`,
              animationPlayState: isHovered ? 'paused' : 'running',
            }}
          />
        </div>
      )}
    </div>
  )
}

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <aside className="toast-container" aria-label="Notifications">
      {toasts.map((toast) => (
        <ToastRow key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </aside>
  )
}
