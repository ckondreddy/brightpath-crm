import React from 'react'
import { Menu, Search, Plus, Bell } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ConnectionStatusBadge } from '../common/ConnectionStatusBadge'

interface HeaderProps {
  onToggleSidebar: () => void
  onOpenConfig?: () => void
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onOpenConfig }) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <button 
          type="button" 
          className="mobile-menu-btn" 
          onClick={onToggleSidebar}
          aria-label="Toggle navigation drawer"
        >
          <Menu size={18} />
        </button>

        {/* Linear / Command-K Style Global Search */}
        <button 
          type="button" 
          className="command-search-btn"
          onClick={() => {}}
          title="Search student enquiries (Press ⌘K or Ctrl+K)"
        >
          <Search size={14} style={{ color: 'var(--slate-400)', flexShrink: 0 }} />
          <span>Search enquiries, courses, parents...</span>
          <span className="kbd-shortcut" style={{ marginLeft: 'auto' }}>⌘K</span>
        </button>
      </div>

      <div className="header-right">
        {/* Live Supabase Connection Status Pill */}
        <ConnectionStatusBadge onOpenConfig={onOpenConfig} />

        {/* Quick Action: New Enquiry Button */}
        <Link to="/leads" className="btn btn-primary interactive-press" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
          <Plus size={14} />
          <span>New Enquiry</span>
          <span className="kbd-shortcut" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff', borderColor: 'transparent', marginLeft: '0.25rem' }}>N</span>
        </Link>

        {/* Notifications with subtle indicator */}
        <button type="button" className="icon-action-btn interactive-press" aria-label="Notifications">
          <Bell size={17} />
          <span className="unread-dot" />
        </button>
      </div>
    </header>
  )
}
