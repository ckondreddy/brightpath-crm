import React from 'react'
import { 
  UserPlus, 
  ArrowRight, 
  Edit3, 
  MessageSquare, 
  Calendar, 
  CheckCircle2, 
  Clock 
} from 'lucide-react'
import { ActivityWithActor } from '../../services/leadService'

interface LeadActivityTimelineProps {
  activities: ActivityWithActor[]
}

export const LeadActivityTimeline: React.FC<LeadActivityTimelineProps> = ({ activities }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'lead_created':
        return <UserPlus size={11} />
      case 'status_updated':
        return <ArrowRight size={11} />
      case 'lead_edited':
        return <Edit3 size={11} />
      case 'note_added':
        return <MessageSquare size={11} />
      case 'follow_up_scheduled':
        return <Calendar size={11} />
      case 'follow_up_completed':
        return <CheckCircle2 size={11} />
      default:
        return <Clock size={11} />
    }
  }

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString)
      return date.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    } catch {
      return isoString
    }
  }

  if (activities.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.78rem', padding: '1rem 0' }}>
        No activity history recorded yet.
      </div>
    )
  }

  return (
    <div className="timeline-feed">
      {activities.map((act) => (
        <div key={act.id} className="timeline-item">
          <div className={`timeline-node ${act.activity_type}`}>
            {getIcon(act.activity_type)}
          </div>
          <div className="timeline-desc">{act.description}</div>
          <div className="timeline-meta">
            <span>By {act.actor?.full_name || 'Staff Member'}</span>
            <span>•</span>
            <span className="tabular-nums">{formatTimestamp(act.created_at)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
