import { createContext } from 'react'
import { Lead } from '../types'

export interface LeadModalContextValue {
  isCreateLeadOpen: boolean
  openCreateLeadModal: (onSuccessCallback?: (newLead: Lead) => void) => void
  closeCreateLeadModal: () => void
  notifyLeadCreated: (newLead: Lead) => void
}

export const LeadModalContext = createContext<LeadModalContextValue | undefined>(undefined)
