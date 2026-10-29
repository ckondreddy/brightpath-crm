import { useEffect, useRef } from 'react'

interface UseFocusTrapOptions {
  active: boolean
  onClose?: () => void
  initialFocusSelector?: string
}

export const useFocusTrap = <T extends HTMLElement = HTMLDivElement>({
  active,
  onClose,
  initialFocusSelector,
}: UseFocusTrapOptions) => {
  const containerRef = useRef<T>(null)
  const previousActiveElementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!active) return

    // Save previously focused element
    previousActiveElementRef.current = document.activeElement as HTMLElement | null

    const container = containerRef.current
    if (!container) return

    const getFocusableElements = (): HTMLElement[] => {
      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ]
      return Array.from(
        container.querySelectorAll<HTMLElement>(focusableSelectors.join(', '))
      ).filter((el) => el.offsetParent !== null)
    }

    // Set initial focus
    const timer = setTimeout(() => {
      if (initialFocusSelector) {
        const initialEl = container.querySelector<HTMLElement>(initialFocusSelector)
        if (initialEl) {
          initialEl.focus()
          return
        }
      }

      const focusable = getFocusableElements()
      if (focusable.length > 0) {
        focusable[0].focus()
      } else {
        container.focus()
      }
    }, 20)

    // Keyboard trap handler
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        e.preventDefault()
        e.stopPropagation()
        onClose()
        return
      }

      if (e.key !== 'Tab') return

      const focusable = getFocusableElements()
      if (focusable.length === 0) {
        e.preventDefault()
        return
      }

      const firstElement = focusable[0]
      const lastElement = focusable[focusable.length - 1]

      if (e.shiftKey) {
        // Shift + Tab: if on first element, wrap to last
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab: if on last element, wrap to first
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', handleKeyDown)

      // Restore focus to previous trigger
      if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
        previousActiveElementRef.current.focus()
      }
    }
  }, [active, onClose, initialFocusSelector])

  return containerRef
}
