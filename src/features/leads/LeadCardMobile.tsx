import React from 'react'
import { Phone, Calendar, Mail, User } from 'lucide-react'
import { LeadWithRelations } from '../../services/leadService'

interface LeadCardMobileProps {
  lead: LeadWithRelations
}

export const LeadCardMobile: React.FC<LeadCardMobileProps> = ({ lead }) => {
  const [nowMs] = React.useState(() => Date.now())
  const initials = lead.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  // Find next pending follow-up if available
  const nextFollowUp = lead.follow_ups?.find((f) => f.status === 'pending')
  const isOverdue = nextFollowUp ? new Date(nextFollowUp.due_at).getTime() < nowMs : false

  return (
    <div className="lead-mobile-card">
      <div className="lead-mobile-top">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div className="student-avatar">{initials}</div>
          <div>
            <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.875rem' }}>
              {lead.full_name}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              {lead.course_interest}
            </div>
          </div>
        </div>

        <span className={`status-pill status-${lead.status}`}>
          <span className="status-pill-dot" />
          {lead.status}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.75rem', color: '#94a3b8' }}>
        <a 
          href={`tel:${lead.phone}`} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#60a5fa', textDecoration: 'none' }}
        >
          <Phone size={12} />
          <span>{lead.phone}</span>
        </a>

        {lead.email && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#cbd5e1' }}>
            <Mail size={12} />
            <span>{lead.email}</span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#cbd5e1' }}>
          <User size={12} />
          <span>Counsellor: {lead.assignee?.full_name || 'Unassigned'}</span>
        </div>

        {nextFollowUp && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: isOverdue ? '#f87171' : '#cbd5e1' }}>
            <Calendar size={12} />
            <span>Due: {new Date(nextFollowUp.due_at).toLocaleDateString()}</span>
            {isOverdue && <span className="overdue-tag">Overdue</span>}
          </div>
        )}
      </div>
    </div>
  )
}
