import React from 'react'
import { Users, Plus, Filter, Search } from 'lucide-react'

export const LeadsPage: React.FC = () => {
  return (
    <div className="container-fluid" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-navy-950)' }}>Student Leads</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Manage enquiry lifecycle from first contact to enrollment.
          </p>
        </div>
        <button type="button" className="btn btn-primary">
          <Plus size={16} />
          <span>Add New Lead</span>
        </button>
      </div>

      {/* Filter and Search Bar Shell */}
      <div className="card" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          padding: '0.5rem 0.85rem', 
          border: '1px solid var(--border-light)', 
          borderRadius: 'var(--radius-sm)',
          flex: '1',
          minWidth: '220px'
        }}>
          <Search size={18} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search leads by name, phone, course..." 
            style={{ border: 'none', outline: 'none', width: '100%', background: 'transparent' }}
            disabled
          />
        </div>
        <button type="button" className="btn btn-secondary" disabled>
          <Filter size={16} />
          <span>Filters (Status / Source)</span>
        </button>
      </div>

      {/* Empty State / Roadmap Notice */}
      <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
        <Users size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-navy-900)' }}>No Leads Loaded</h3>
        <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0.5rem auto 1rem', fontSize: '0.875rem' }}>
          Lead management CRUD, multi-criteria filters, and real-time database queries are scheduled for Phase 05 & Phase 06.
        </p>
      </div>
    </div>
  )
}
