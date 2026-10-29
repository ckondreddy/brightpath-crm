import React from 'react'
import { 
  ShieldCheck, 
  Database, 
  Key, 
  Server, 
  CheckCircle2, 
  UserCheck, 
  Building2, 
  Lock, 
  Command, 
  FileSpreadsheet
} from 'lucide-react'
import { useAuth } from '../context/useAuth'
import { isSupabaseConfigured } from '../lib/supabaseClient'

export const SettingsPage: React.FC = () => {
  const { user, profile } = useAuth()
  const isCloudActive = isSupabaseConfigured()

  const currentRole = profile?.role || 'counsellor'
  const currentName = profile?.full_name || user?.email?.split('@')[0] || 'Academy Staff'
  const currentEmail = user?.email || 'staff@brightpath.edu.in'

  return (
    <div className="container-fluid" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem' }}>
          <span style={{ 
            fontSize: '0.7rem', 
            fontWeight: 700, 
            color: '#2563eb', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em',
            backgroundColor: '#eff6ff',
            padding: '0.15rem 0.5rem',
            borderRadius: '4px',
            border: '1px solid #bfdbfe'
          }}>
            Academy Governance
          </span>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>• Phase 13 Production Audit</span>
        </div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
          Academy & System Preferences
        </h1>
        <p style={{ fontSize: '0.825rem', color: '#64748b', margin: '4px 0 0 0' }}>
          Production architecture, role-based access control (RBAC), and cloud infrastructure telemetry.
        </p>
      </div>

      {/* Active User Dossier & Campus Details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {/* Profile Card */}
        <div className="card-elevated" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              width: 44, 
              height: 44, 
              borderRadius: '50%', 
              backgroundColor: '#2563eb', 
              color: '#ffffff',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1rem'
            }}>
              {currentName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  {currentName}
                </h2>
                <span style={{ 
                  fontSize: '0.65rem', 
                  fontWeight: 700, 
                  textTransform: 'uppercase', 
                  padding: '2px 6px', 
                  borderRadius: '4px',
                  backgroundColor: currentRole === 'admin' ? '#fef3c7' : '#eff6ff',
                  color: currentRole === 'admin' ? '#b45309' : '#1d4ed8',
                  border: `1px solid ${currentRole === 'admin' ? '#fde68a' : '#bfdbfe'}`
                }}>
                  {currentRole.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{currentEmail}</div>
            </div>
          </div>

          <div style={{ 
            fontSize: '0.75rem', 
            color: '#475569', 
            backgroundColor: '#f8fafc', 
            padding: '0.75rem', 
            borderRadius: '6px', 
            border: '1px solid #e2e8f0',
            lineHeight: 1.5 
          }}>
            Authenticated session role governs Row-Level Security (RLS) enforcement at the PostgreSQL database level.
          </div>
        </div>

        {/* Campus & Admissions Workspace */}
        <div className="card-elevated" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '6px', backgroundColor: '#f0fdf4', color: '#16a34a' }}>
              <Building2 size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                BrightPath Academy
              </h2>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Bangalore South Center • Spring 2026 Cohort</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem' }}>
            <div style={{ padding: '0.5rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <span style={{ color: '#64748b' }}>Active Programs:</span>
              <div style={{ fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>IIT-JEE, NEET, SAT</div>
            </div>
            <div style={{ padding: '0.5rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <span style={{ color: '#64748b' }}>Timezone & Currency:</span>
              <div style={{ fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>IST (UTC+5:30) • INR (₹)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Role-Based Access Control (RBAC) Matrix */}
      <div className="card-elevated" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
          <UserCheck size={18} style={{ color: '#2563eb' }} />
          <div>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Role-Based Access Control (RBAC) Permission Matrix
            </h2>
            <p style={{ fontSize: '0.725rem', color: '#64748b', margin: '2px 0 0 0' }}>
              Operational privileges enforced across client UI, RPC handlers, and Supabase database policies
            </p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.775rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '0.65rem 0.75rem', color: '#475569', fontWeight: 600 }}>Operational Domain</th>
                <th style={{ padding: '0.65rem 0.75rem', color: '#166534', fontWeight: 600 }}>Admin</th>
                <th style={{ padding: '0.65rem 0.75rem', color: '#1d4ed8', fontWeight: 600 }}>Manager</th>
                <th style={{ padding: '0.65rem 0.75rem', color: '#475569', fontWeight: 600 }}>Counsellor</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.6rem 0.75rem', fontWeight: 600, color: '#0f172a' }}>Student Enquiries & Directory</td>
                <td style={{ padding: '0.6rem 0.75rem', color: '#16a34a' }}>Full Create, Read, Update, Delete</td>
                <td style={{ padding: '0.6rem 0.75rem', color: '#16a34a' }}>Full Create, Read, Update</td>
                <td style={{ padding: '0.6rem 0.75rem', color: '#64748b' }}>Assigned & Created Leads</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.6rem 0.75rem', fontWeight: 600, color: '#0f172a' }}>Lead Assignment & Re-allocation</td>
                <td style={{ padding: '0.6rem 0.75rem', color: '#16a34a' }}>Assign any staff member</td>
                <td style={{ padding: '0.6rem 0.75rem', color: '#16a34a' }}>Assign team counsellors</td>
                <td style={{ padding: '0.6rem 0.75rem', color: '#94a3b8' }}>Read-only assignee view</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.6rem 0.75rem', fontWeight: 600, color: '#0f172a' }}>Follow-ups & Callback Queues</td>
                <td style={{ padding: '0.6rem 0.75rem', color: '#16a34a' }}>Manage campus queue</td>
                <td style={{ padding: '0.6rem 0.75rem', color: '#16a34a' }}>Manage team queue</td>
                <td style={{ padding: '0.6rem 0.75rem', color: '#16a34a' }}>Schedule & complete own tasks</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.6rem 0.75rem', fontWeight: 600, color: '#0f172a' }}>Admissions Reports & CSV Exports</td>
                <td style={{ padding: '0.6rem 0.75rem', color: '#16a34a' }}>Full sanitized CSV & audits</td>
                <td style={{ padding: '0.6rem 0.75rem', color: '#16a34a' }}>Cohort & Counsellor audits</td>
                <td style={{ padding: '0.6rem 0.75rem', color: '#16a34a' }}>Personal cohort export</td>
              </tr>
              <tr>
                <td style={{ padding: '0.6rem 0.75rem', fontWeight: 600, color: '#0f172a' }}>Academy System Settings</td>
                <td style={{ padding: '0.6rem 0.75rem', color: '#16a34a' }}>Full administrative access</td>
                <td style={{ padding: '0.6rem 0.75rem', color: '#94a3b8' }}>Read-only view</td>
                <td style={{ padding: '0.6rem 0.75rem', color: '#94a3b8' }}>Read-only view</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Architecture & Infrastructure Status */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        
        {/* Card 1: Supabase Configuration */}
        <div className="card-elevated" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ padding: '0.45rem', borderRadius: '6px', backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <Database size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Supabase PostgreSQL Client
              </h2>
              <p style={{ fontSize: '0.725rem', color: '#64748b', margin: '2px 0 0 0' }}>
                {isCloudActive ? 'Cloud Database Connected' : 'Local Fallback Engine Active'}
              </p>
            </div>
          </div>
          <p style={{ fontSize: '0.775rem', color: '#475569', marginBottom: '0.75rem', lineHeight: 1.5 }}>
            Direct typed data-access layer via <code>@supabase/supabase-js</code>. Initialized with fail-soft diagnostic probe and automatic fallback to verified academy benchmark records.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.725rem', color: '#64748b' }}>
            <Key size={13} />
            <span>Keys: <code>VITE_SUPABASE_URL</code> & <code>VITE_SUPABASE_ANON_KEY</code></span>
          </div>
        </div>

        {/* Card 2: Row Level Security */}
        <div className="card-elevated" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ padding: '0.45rem', borderRadius: '6px', backgroundColor: '#f0fdf4', color: '#16a34a' }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Row-Level Security (RLS)
              </h2>
              <p style={{ fontSize: '0.725rem', color: '#64748b', margin: '2px 0 0 0' }}>PostgreSQL boundary authorization</p>
            </div>
          </div>
          <p style={{ fontSize: '0.775rem', color: '#475569', marginBottom: '0.75rem', lineHeight: 1.5 }}>
            4 core relational tables secured: <code>profiles</code>, <code>leads</code>, <code>follow_ups</code>, <code>activities</code>. Users cannot alter their own <code>profiles.role</code> column.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.725rem', color: '#16a34a', fontWeight: 600 }}>
            <CheckCircle2 size={13} />
            <span>RLS schema & policies active in production</span>
          </div>
        </div>

        {/* Card 3: Export Engine & RFC 4180 Security */}
        <div className="card-elevated" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ padding: '0.45rem', borderRadius: '6px', backgroundColor: '#faf5ff', color: '#9333ea' }}>
              <FileSpreadsheet size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                RFC 4180 Sanitized Export
              </h2>
              <p style={{ fontSize: '0.725rem', color: '#64748b', margin: '2px 0 0 0' }}>Formula injection defense</p>
            </div>
          </div>
          <p style={{ fontSize: '0.775rem', color: '#475569', marginBottom: '0.75rem', lineHeight: 1.5 }}>
            Sanitizes CSV cells starting with <code>=</code>, <code>+</code>, <code>-</code>, <code>@</code>, <code>\t</code>, <code>\r</code>. Embedded quotes are doubled; files prefixed with UTF-8 BOM (<code>\uFEFF</code>) for Microsoft Excel.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.725rem', color: '#16a34a', fontWeight: 600 }}>
            <Lock size={13} />
            <span>Spreadsheet code injection guarded</span>
          </div>
        </div>

        {/* Card 4: Vercel Continuous Delivery */}
        <div className="card-elevated" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ padding: '0.45rem', borderRadius: '6px', backgroundColor: '#f1f5f9', color: '#334155' }}>
              <Server size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Continuous Edge Delivery
              </h2>
              <p style={{ fontSize: '0.725rem', color: '#64748b', margin: '2px 0 0 0' }}>Vercel Cloud Pipeline</p>
            </div>
          </div>
          <p style={{ fontSize: '0.775rem', color: '#475569', marginBottom: '0.75rem', lineHeight: 1.5 }}>
            Synchronized with GitHub <code>origin/main</code>. Every release passes strict TypeScript type checks and Oxlint validation before deployment.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.725rem', color: '#64748b' }}>
            <span>Deployment: <code>brightpath-crm-zeta.vercel.app</code></span>
          </div>
        </div>

      </div>

      {/* Global Shortcuts Reference */}
      <div className="card-elevated" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ padding: '0.5rem', borderRadius: '6px', backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <Command size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a' }}>
              Power-User Keyboard Shortcuts
            </div>
            <div style={{ fontSize: '0.725rem', color: '#64748b' }}>
              Press <kbd style={{ padding: '1px 5px', borderRadius: '4px', background: '#f1f5f9', border: '1px solid #cbd5e1' }}>?</kbd> anytime to open the dialog, or use <kbd style={{ padding: '1px 5px', borderRadius: '4px', background: '#f1f5f9', border: '1px solid #cbd5e1' }}>N</kbd> for new enquiries, <kbd style={{ padding: '1px 5px', borderRadius: '4px', background: '#f1f5f9', border: '1px solid #cbd5e1' }}>⌘K</kbd> to search.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
            <strong>G + D</strong>: Dashboard
          </span>
          <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
            <strong>G + L</strong>: Leads
          </span>
          <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
            <strong>G + F</strong>: Follow-ups
          </span>
          <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
            <strong>G + R</strong>: Reports
          </span>
        </div>
      </div>

    </div>
  )
}
