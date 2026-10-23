import React, { useState, useCallback, useRef } from 'react'
import { LeadModalContext } from './lead-modal-types'
import { Lead } from '../types'
import { CreateLeadModal } from '../features/leads/CreateLeadModal'

export const LeadModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [lastCreatedLead, setLastCreatedLead] = useState<Lead | null>(null)
  const callbackRef = useRef<((lead: Lead) => void) | undefined>(undefined)

  const openCreateLeadModal = useCallback((callback?: (lead: Lead) => void) => {
    callbackRef.current = callback
    setIsOpen(true)
  }, [])

  const closeCreateLeadModal = useCallback(() => {
    setIsOpen(false)
    callbackRef.current = undefined
  }, [])

  const notifyLeadCreated = useCallback((newLead: Lead) => {
    setLastCreatedLead(newLead)
    if (callbackRef.current) {
      callbackRef.current(newLead)
    }
  }, [])

  return (
    <LeadModalContext.Provider
      value={{
        isCreateLeadOpen: isOpen,
        openCreateLeadModal,
        closeCreateLeadModal,
        notifyLeadCreated,
        lastCreatedLead,
      }}
    >
      {children}
      <CreateLeadModal
        isOpen={isOpen}
        onClose={closeCreateLeadModal}
        onSuccess={(lead) => {
          notifyLeadCreated(lead)
        }}
      />
    </LeadModalContext.Provider>
  )
}
