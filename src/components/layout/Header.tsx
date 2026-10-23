import React from 'react'
import { Menu, Search, Plus, Bell, LogOut, User as UserIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ConnectionStatusBadge } from '../common/ConnectionStatusBadge'
import { useAuth } from '../../context/useAuth'
import { useLeadModal } from '../../context/useLeadModal'

interface HeaderProps {
  onToggleSidebar: () => void
  onOpenConfig?: () => void
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onOpenConfig }) => {
  const { user, profile, signOut } = useAuth()
  const { openCreateLeadModal } = useLeadModal()

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Staff'
  const displayRole = profile?.role || 'counsellor'

  // Global keyboard shortcut: Press 'N' to open New Enquiry modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const isInput = target && (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      )

      if (isInput) return

      if ((e.key === 'n' || e.key === 'N') && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        openCreateLeadModal()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [openCreateLeadModal])

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
        <button
          type="button"
          onClick={() => openCreateLeadModal()}
          className="btn btn-primary interactive-press"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', cursor: 'pointer' }}
        >
          <Plus size={14} />
          <span>New Enquiry</span>
          <span className="kbd-shortcut" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff', borderColor: 'transparent', marginLeft: '0.25rem' }}>N</span>
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
