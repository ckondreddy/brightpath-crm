import React from 'react'
import { Menu, User } from 'lucide-react'
import { useLocation } from 'react-router-dom'

interface HeaderProps {
  onToggleSidebar: () => void
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const location = useLocation()

  const getPageTitle = (pathname: string) => {
    if (pathname === '/') return 'Dashboard'
    if (pathname.startsWith('/leads')) return 'Lead Management'
    if (pathname.startsWith('/follow-ups')) return 'Follow-up Schedule'
    if (pathname.startsWith('/reports')) return 'Performance Reports'
    if (pathname.startsWith('/settings')) return 'Settings'
    return 'BrightPath CRM'
  }

  return (
    <header className="app-header">
      <div className="header-left">
        <button 
          type="button" 
          className="mobile-menu-btn" 
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>
        <h2 className="header-title">{getPageTitle(location.pathname)}</h2>
      </div>

      <div className="header-right">
        <div className="user-profile-badge">
          <div className="user-avatar">
            <User size={16} />
          </div>
          <div className="user-info">
            <span className="user-name">Staff Counsellor</span>
            <span className="user-role-tag">Demo User</span>
          </div>
        </div>
      </div>
    </header>
  )
}
