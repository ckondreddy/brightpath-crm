import React from 'react'
import { Menu, Search, Plus, Bell, LogOut, User as UserIcon, HelpCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { ConnectionStatusBadge } from '../common/ConnectionStatusBadge'
import { useAuth } from '../../context/useAuth'
import { useLeadModal } from '../../context/useLeadModal'

interface HeaderProps {
  onToggleSidebar: () => void
  onOpenConfig?: () => void
  onOpenShortcuts?: () => void
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onOpenConfig, onOpenShortcuts }) => {
  const { user, profile, signOut } = useAuth()
  const { openCreateLeadModal } = useLeadModal()
  const navigate = useNavigate()

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Staff'
  const displayRole = profile?.role || 'counsellor'

  const handleSearchClick = () => {
    const searchInput = document.querySelector<HTMLInputElement>(
      'input[type="text"][placeholder*="Search"], input[placeholder*="search"], #global-search-input'
    )
    if (searchInput) {
      searchInput.focus()
      searchInput.select()
    } else {
      navigate('/leads')
    }
  }

  return (
    <header className="app-header" role="banner">
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
          onClick={handleSearchClick}
          aria-label="Search student enquiries (Press ⌘K or Ctrl+K)"
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
        <button
          type="button"
          onClick={() => openCreateLeadModal()}
          className="btn btn-primary interactive-press"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', cursor: 'pointer' }}
          aria-label="Log new student enquiry (Press N)"
        >
          <Plus size={14} />
          <span>New Enquiry</span>
          <span className="kbd-shortcut" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff', borderColor: 'transparent', marginLeft: '0.25rem' }}>N</span>
        </button>

        {/* Keyboard Shortcuts Help */}
        <button
          type="button"
          onClick={onOpenShortcuts}
          className="icon-action-btn interactive-press"
          aria-label="Keyboard Shortcuts (Press ?)"
          title="Keyboard Shortcuts (Press ?)"
        >
          <HelpCircle size={17} />
        </button>

        {/* Notifications with subtle indicator */}
        <button type="button" className="icon-action-btn interactive-press" aria-label="Notifications">
          <Bell size={17} />
          <span className="unread-dot" />
        </button>

        {/* User Profile & Sign Out Action */}
        {user ? (
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              paddingLeft: '0.5rem',
              borderLeft: '1px solid var(--border-default)',
            }}
          >
            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                lineHeight: 1.15,
              }}
            >
              <span style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--slate-900)' }}>
                {displayName}
              </span>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--color-brand-600)', textTransform: 'uppercase' }}>
                {displayRole}
              </span>
            </div>

            <button
              type="button"
              className="icon-action-btn interactive-press"
              onClick={() => signOut()}
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn btn-secondary interactive-press" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
            <UserIcon size={14} />
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </header>
  )
}
