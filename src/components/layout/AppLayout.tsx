import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { ConfigBanner } from '../common/ConfigBanner'
import { ToastContainer } from '../common/ToastContainer'
import { NetworkStatusBanner } from '../common/NetworkStatusBanner'
import { ErrorBoundary } from '../common/ErrorBoundary'
import { KeyboardShortcutsModal } from '../common/KeyboardShortcutsModal'
import { useLeadModal } from '../../context/useLeadModal'
import { useGlobalShortcuts } from '../../hooks/useGlobalShortcuts'
import './layout.css'

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showConfigDrawer, setShowConfigDrawer] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const { openCreateLeadModal } = useLeadModal()

  // Register global power-user keybindings
  useGlobalShortcuts({
    onOpenShortcuts: () => setShortcutsOpen(true),
    onOpenNewLead: openCreateLeadModal,
  })

  return (
    <div className="app-shell">
      {/* WCAG Skip Navigation Link */}
      <a href="#main-content" className="skip-nav-link">
        Skip to main content
      </a>

      {/* Online / Offline status banner */}
      <NetworkStatusBanner />

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="app-main-wrapper">
        <Header 
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)} 
          onOpenConfig={() => setShowConfigDrawer((prev) => !prev)}
          onOpenShortcuts={() => setShortcutsOpen(true)}
        />
        <ConfigBanner 
          forceOpen={showConfigDrawer} 
          onClose={() => setShowConfigDrawer(false)} 
        />
        <main 
          id="main-content" 
          tabIndex={-1} 
          className="app-content" 
          role="main" 
          aria-label="Main Content"
        >
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>

      {/* Global Toast Notification System */}
      <ToastContainer />

      {/* Keyboard Shortcuts Cheatsheet Modal */}
      <KeyboardShortcutsModal 
        isOpen={shortcutsOpen} 
        onClose={() => setShortcutsOpen(false)} 
      />
    </div>
  )
}
