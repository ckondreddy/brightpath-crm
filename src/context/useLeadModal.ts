import { useContext } from 'react'
import { LeadModalContext, LeadModalContextValue } from './lead-modal-types'

export function useLeadModal(): LeadModalContextValue {
  const context = useContext(LeadModalContext)
  if (!context) {
    throw new Error('useLeadModal must be used within a LeadModalProvider')
  }
  return context
}
