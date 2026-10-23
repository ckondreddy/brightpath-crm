import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { ConfigBanner } from '../common/ConfigBanner'
import './layout.css'

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showConfigDrawer, setShowConfigDrawer] = useState(false)

  return (
    <div className="app-shell">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-main-wrapper">
        <Header 
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)} 
          onOpenConfig={() => setShowConfigDrawer((prev) => !prev)}
        />
        <ConfigBanner 
          forceOpen={showConfigDrawer} 
          onClose={() => setShowConfigDrawer(false)} 
        />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
