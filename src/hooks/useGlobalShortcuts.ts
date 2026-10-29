import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

interface GlobalShortcutsOptions {
  onOpenShortcuts: () => void
  onOpenNewLead: () => void
}

export const useGlobalShortcuts = ({
  onOpenShortcuts,
  onOpenNewLead,
}: GlobalShortcutsOptions) => {
  const navigate = useNavigate()
  const pendingKeyRef = useRef<string | null>(null)
  const pendingTimerRef = useRef<number | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)

      // Allow Escape even in inputs
      if (e.key === 'Escape') {
        // Blur active input
        if (isInput && target && typeof target.blur === 'function') {
          target.blur()
        }
        return
      }

      // Ignore other shortcuts when user is typing in form controls
      if (isInput) return

      // Handle '?' (Shift + /)
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault()
        onOpenShortcuts()
        return
      }

      // Handle '⌘K' or 'Ctrl+K'
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault()
        const searchInput = document.querySelector<HTMLInputElement>(
          'input[type="text"][placeholder*="Search"], input[placeholder*="search"], #global-search-input'
        )
        if (searchInput) {
          searchInput.focus()
          searchInput.select()
        } else {
          navigate('/leads')
        }
        return
      }

      // Handle 'N' (New Enquiry)
      if ((e.key === 'n' || e.key === 'N') && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        onOpenNewLead()
        return
      }

      // Two-key chord navigation: G then X
      const lowerKey = e.key.toLowerCase()

      if (pendingKeyRef.current === 'g') {
        if (pendingTimerRef.current) {
          clearTimeout(pendingTimerRef.current)
          pendingTimerRef.current = null
        }
        pendingKeyRef.current = null

        if (lowerKey === 'd') {
          e.preventDefault()
          navigate('/')
        } else if (lowerKey === 'l') {
          e.preventDefault()
          navigate('/leads')
        } else if (lowerKey === 'f') {
          e.preventDefault()
          navigate('/follow-ups')
        } else if (lowerKey === 'r') {
          e.preventDefault()
          navigate('/reports')
        } else if (lowerKey === 's') {
          e.preventDefault()
          navigate('/settings')
        }
        return
      }

      if (lowerKey === 'g' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        pendingKeyRef.current = 'g'
        pendingTimerRef.current = window.setTimeout(() => {
          pendingKeyRef.current = null
        }, 1200)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (pendingTimerRef.current) {
        clearTimeout(pendingTimerRef.current)
      }
    }
  }, [navigate, onOpenShortcuts, onOpenNewLead])
}
