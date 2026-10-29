import { createContext } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastAction {
  label: string
  onClick: () => void
}

export interface ToastItem {
  id: string
  message: string
  type: ToastType
  duration?: number
  action?: ToastAction
}

export interface ToastContextValue {
  toasts: ToastItem[]
  showToast: (message: string, type?: ToastType, duration?: number, action?: ToastAction) => string
  removeToast: (id: string) => void
  success: (message: string, duration?: number, action?: ToastAction) => string
  error: (message: string, duration?: number, action?: ToastAction) => string
  info: (message: string, duration?: number, action?: ToastAction) => string
  warning: (message: string, duration?: number, action?: ToastAction) => string
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined)
