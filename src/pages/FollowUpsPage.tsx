import React, { useState } from 'react'
import { CalendarClock, Plus, Filter, CheckCircle2, PhoneCall } from 'lucide-react'

export const FollowUpsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overdue' | 'today' | 'upcoming' | 'completed'>('overdue')

  const sampleTasks = [
    {
      id: 'F-201',
      studentName: 'Aarav Sharma',
      course: 'IIT-JEE 2-Year Intensive',
      dueTime: 'Today at 2:00 PM',
      note: 'Parent requested 10% sibling fee concession details for admission confirmation.',
      counsellor: 'Priya Sharma',
      status: 'overdue',
      phone: '+91 98452 11029'
    },
    {
      id: 'F-202',
      studentName: 'Diya Patel',
      course: 'NEET Repeater Batch',
      dueTime: 'Today at 3:30 PM',
      note: 'Send physics demo class video link and faculty schedule.',
      counsellor: 'Priya Sharma',
      status: 'overdue',
      phone: '+91 97120 44581'
    },
    {
      id: 'F-203',
      studentName: 'Rohan Mehta',
      course: 'SAT & GRE Global Track',
      dueTime: 'Today at 4:45 PM',
      note: 'Discuss US/UK intake batch calendar with student and father.',
      counsellor: 'Karan Rao',
      status: 'pending',
      phone: '+91 94481 99230'
    }
  ]

  return (
    <div className="container-fluid" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--slate-900)', letterSpacing: '-0.02em' }}>
              Follow-Up & Consultation Schedule
            </h1>
            <span className="nav-pill alert" style={{ fontWeight: 600 }}>4 Action Required</span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--slate-500)' }}>
            Never miss a callback. Stay synchronized with prospective students and parents.
          </p>
        </div>

        <button type="button" className="btn btn-primary">
          <Plus size={14} />
          <span>Schedule Follow-up</span>
        </button>
      </div>

      {/* Segmented Filter Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div className="segmented-control">
          <button 
            type="button" 
            className={`segmented-item ${activeTab === 'overdue' ? 'active' : ''}`}
            onClick={() => setActiveTab('overdue')}
          >
            Overdue (4)
          </button>
          <button 
            type="button" 
            className={`segmented-item ${activeTab === 'today' ? 'active' : ''}`}
            onClick={() => setActiveTab('today')}
          >
            Scheduled Today (8)
          </button>
          <button 
            type="button" 
            className={`segmented-item ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            This Week (18)
          </button>
          <button 
            type="button" 
            className={`segmented-item ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed (62)
          </button>
        </div>

        <button type="button" className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem' }}>
          <Filter size={14} />
          <span>Counsellor: All Staff</span>
        </button>
      </div>

      {/* Follow-up Queue Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {sampleTasks.map((task) => (
          <div 
            key={task.id}
            className="card-elevated" 
            style={{ 
              padding: '1rem 1.25rem', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              borderLeft: task.status === 'overdue' ? '3px solid #e11d48' : '1px solid var(--border-default)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
              <div style={{ 
                padding: '0.45rem', 
                borderRadius: 'var(--radius-sm)', 
                backgroundColor: task.status === 'overdue' ? '#fff1f2' : '#eff6ff',
                color: task.status === 'overdue' ? '#be123c' : '#2563eb',
                marginTop: '2px'
              }}>
                <CalendarClock size={16} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--slate-900)' }}>{task.studentName}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>• {task.course}</span>
                  {task.status === 'overdue' && (
                    <span style={{ 
                      fontSize: '0.65rem', 
                      fontWeight: 600, 
                      backgroundColor: '#fff1f2', 
                      color: '#be123c', 
                      border: '1px solid #fecdd3',
                      padding: '1px 5px',
                      borderRadius: 'var(--radius-xs)'
                    }}>
                      Overdue
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--slate-600)', margin: '0.25rem 0' }}>
                  "{task.note}"
                </p>
                <div style={{ fontSize: '0.725rem', color: 'var(--slate-400)', display: 'flex', gap: '0.75rem' }}>
                  <span>⏰ Due: <strong>{task.dueTime}</strong></span>
                  <span>👤 Assigned: {task.counsellor}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button type="button" className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.775rem' }}>
                <CheckCircle2 size={13} style={{ color: 'var(--semantic-emerald)' }} />
                <span>Mark Done</span>
              </button>
              <button type="button" className="btn btn-primary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.775rem' }}>
                <PhoneCall size={13} />
                <span>Call Student</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
