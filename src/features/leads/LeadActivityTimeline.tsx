import React, { useState } from 'react'
import { 
  UserPlus, 
  ArrowRight, 
  Edit3, 
  MessageSquare, 
  Calendar, 
  CheckCircle2, 
  Clock,
  AlertTriangle
} from 'lucide-react'
import { ActivityWithActor } from '../../services/leadService'
import { AddNoteBox } from '../activities/AddNoteBox'

interface LeadActivityTimelineProps {
  leadId: string
  activities: ActivityWithActor[]
  onActivityAdded: () => void
}

type TimelineFilter = 'all' | 'notes' | 'status' | 'followups'

function formatRelativeTime(isoString: string, nowMs: number): string {
  try {
    const actTime = new Date(isoString).getTime()
    const diffSec = Math.floor((nowMs - actTime) / 1000)

    if (diffSec < 60) return 'Just now'
    const diffMin = Math.floor(diffSec / 60)
    if (diffMin < 60) return `${diffMin}m ago`
    const diffHour = Math.floor(diffMin / 60)
    if (diffHour < 24) return `${diffHour}h ago`

    const date = new Date(isoString)
    const now = new Date(nowMs)
    const isYesterday =
      now.getFullYear() === date.getFullYear() &&
      now.getMonth() === date.getMonth() &&
      now.getDate() - 1 === date.getDate()

    if (isYesterday) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    }

    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return isoString
  }
}

export const LeadActivityTimeline: React.FC<LeadActivityTimelineProps> = ({
  leadId,
  activities,
  onActivityAdded,
}) => {
  const [filter, setFilter] = useState<TimelineFilter>('all')
  const [nowMs] = useState(() => Date.now())

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

  // Filter activities
  const filteredActivities = activities.filter((act) => {
    if (filter === 'notes') return act.activity_type === 'note_added'
    if (filter === 'status') return act.activity_type === 'status_updated'
    if (filter === 'followups') {
      return (
        act.activity_type === 'follow_up_scheduled' ||
        act.activity_type === 'follow_up_completed'
      )
    }
    return true
  })

  const notesCount = activities.filter((a) => a.activity_type === 'note_added').length
  const statusCount = activities.filter((a) => a.activity_type === 'status_updated').length
  const followupsCount = activities.filter(
    (a) => a.activity_type === 'follow_up_scheduled' || a.activity_type === 'follow_up_completed'
  ).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Quick Add Note Box */}
      <AddNoteBox leadId={leadId} onNoteAdded={onActivityAdded} />

      {/* Filter Tabs */}
      <div className="timeline-filter-tabs">
        <button
          type="button"
          className={`timeline-filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({activities.length})
        </button>
        <button
          type="button"
          className={`timeline-filter-btn ${filter === 'notes' ? 'active' : ''}`}
          onClick={() => setFilter('notes')}
        >
          Notes ({notesCount})
        </button>
        <button
          type="button"
          className={`timeline-filter-btn ${filter === 'status' ? 'active' : ''}`}
          onClick={() => setFilter('status')}
        >
          Status ({statusCount})
        </button>
        <button
          type="button"
          className={`timeline-filter-btn ${filter === 'followups' ? 'active' : ''}`}
          onClick={() => setFilter('followups')}
        >
          Follow-ups ({followupsCount})
        </button>
      </div>

      {/* Feed list */}
      {filteredActivities.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.78rem', padding: '1.25rem 0' }}>
          No {filter === 'all' ? 'activity' : filter} records found for this student.
        </div>
      ) : (
        <div className="timeline-feed">
          {filteredActivities.map((act) => {
            const isNote = act.activity_type === 'note_added'
            const isLostStatus =
              act.activity_type === 'status_updated' &&
              act.metadata?.status === 'Lost' &&
              act.metadata?.lost_reason

            return (
              <div key={act.id} className="timeline-item">
                <div className={`timeline-node ${act.activity_type}`}>
                  {getIcon(act.activity_type)}
                </div>

                <div className="timeline-desc">{act.description}</div>

                {/* If note, display dedicated callout box */}
                {isNote && Boolean(act.metadata?.note) && (
                  <div className="timeline-note-callout">
                    "{String(act.metadata?.note)}"
                  </div>
                )}

                {/* If marked lost, display lost reason alert */}
                {Boolean(isLostStatus) && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.75rem',
                      color: '#f87171',
                      marginTop: '0.2rem',
                    }}
                  >
                    <AlertTriangle size={12} />
                    <span>Reason: {String(act.metadata?.lost_reason)}</span>
                  </div>
                )}

                <div className="timeline-meta">
                  <span style={{ fontWeight: 500, color: '#94a3b8' }}>
                    {act.actor?.full_name || 'Staff Member'}
                    {act.actor?.role ? ` (${act.actor.role.toUpperCase()})` : ''}
                  </span>
                  <span>•</span>
                  <span className="tabular-nums">{formatRelativeTime(act.created_at, nowMs)}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
