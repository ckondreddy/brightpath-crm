import React, { useState, useCallback } from 'react'
import { ToastContext, ToastItem, ToastType, ToastAction } from './toast-types'

export { ToastContext } from './toast-types'
export type { ToastItem, ToastType, ToastAction } from './toast-types'

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration: number = 3800, action?: ToastAction) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      const newToast: ToastItem = { id, message, type, duration, action }

      setToasts((prev) => {
        // Keep at most 4 simultaneous toasts to avoid cluttering screen
        const next = [...prev, newToast]
        if (next.length > 4) {
          return next.slice(next.length - 4)
        }
        return next
      })

      return id
    },
    []
  )

  const success = useCallback(
    (message: string, duration?: number, action?: ToastAction) => showToast(message, 'success', duration, action),
    [showToast]
  )
  const error = useCallback(
    (message: string, duration?: number, action?: ToastAction) => showToast(message, 'error', duration, action),
    [showToast]
  )
  const info = useCallback(
    (message: string, duration?: number, action?: ToastAction) => showToast(message, 'info', duration, action),
    [showToast]
  )
  const warning = useCallback(
    (message: string, duration?: number, action?: ToastAction) => showToast(message, 'warning', duration, action),
    [showToast]
  )

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        removeToast,
        success,
        error,
        info,
        warning,
      }}
    >
      {children}
    </ToastContext.Provider>
  )
}
