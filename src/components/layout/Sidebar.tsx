import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  CalendarClock, 
  BarChart3, 
  Settings, 
  GraduationCap,
  ChevronDown,
  X 
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Workspace Switcher */}
        <div className="workspace-switcher" title="Switch Campus Branch">
          <div className="workspace-icon">
            <GraduationCap size={18} />
          </div>
          <div className="workspace-meta">
            <span className="workspace-name">BrightPath Academy</span>
            <span className="workspace-sub">Bangalore South Center</span>
          </div>
          <ChevronDown size={14} className="workspace-chevron" />
          <button 
            type="button"
            className="mobile-menu-btn" 
            style={{ marginLeft: 'auto', color: '#94a3b8' }}
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Grouped Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-group">
            <div className="nav-group-title">Main Pipeline</div>
            <div className="nav-group-items">
              <NavLink
                to="/"
                end
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <div className="nav-link-left">
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </div>
              </NavLink>

              <NavLink
                to="/leads"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <div className="nav-link-left">
                  <Users size={16} />
                  <span>Student Leads</span>
                </div>
                <span className="nav-pill">148</span>
              </NavLink>

              <NavLink
                to="/follow-ups"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <div className="nav-link-left">
                  <CalendarClock size={16} />
                  <span>Follow-ups</span>
                </div>
                <span className="nav-pill alert">4 due</span>
              </NavLink>
            </div>
          </div>

          <div className="nav-group">
            <div className="nav-group-title">Intelligence & Growth</div>
            <div className="nav-group-items">
              <NavLink
                to="/reports"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <div className="nav-link-left">
                  <BarChart3 size={16} />
                  <span>Admissions Analytics</span>
                </div>
              </NavLink>
            </div>
          </div>

          <div className="nav-group" style={{ marginTop: 'auto' }}>
            <div className="nav-group-title">Configuration</div>
            <div className="nav-group-items">
              <NavLink
                to="/settings"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <div className="nav-link-left">
                  <Settings size={16} />
                  <span>Academy Settings</span>
                </div>
              </NavLink>
            </div>
          </div>
        </nav>

        {/* Counsellor Shift Presence Footer */}
        <div className="sidebar-footer">
          <div className="user-presence">
            <div className="presence-avatar">
              PS
              <span className="presence-dot" title="Active on Duty" />
            </div>
            <div className="presence-info">
              <span className="presence-name">Priya Sharma</span>
              <span className="presence-role">Senior Counsellor</span>
            </div>
          </div>
          <span style={{ fontSize: '0.65rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>v1.0</span>
        </div>
      </aside>
    </>
  )
}
