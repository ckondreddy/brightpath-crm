import React, { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  Edit3, 
  BookOpen, 
  User, 
  Clock, 
  Calendar, 
  AlertCircle,
  FileText,
  Plus,
  CheckCircle2
} from 'lucide-react'
import { useAuth } from '../context/useAuth'
import { 
  fetchLeadById, 
  fetchStaffProfiles, 
  updateLeadStatus, 
  LeadDetailWithRelations 
} from '../services/leadService'
import { UserProfile, LeadStatus } from '../types'
import { StatusLifecycleBar } from '../features/leads/StatusLifecycleBar'
import { EditLeadModal } from '../features/leads/EditLeadModal'
import { LeadActivityTimeline } from '../features/leads/LeadActivityTimeline'
import { ScheduleFollowUpModal } from '../features/followups/ScheduleFollowUpModal'
import { CompleteFollowUpModal } from '../features/followups/CompleteFollowUpModal'
import { RescheduleFollowUpModal } from '../features/followups/RescheduleFollowUpModal'
import '../features/leads/lead-detail.css'

export const LeadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [lead, setLead] = useState<LeadDetailWithRelations | null>(null)
  const [staffList, setStaffList] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showScheduleFollowUp, setShowScheduleFollowUp] = useState(false)
  const [showCompleteFollowUp, setShowCompleteFollowUp] = useState(false)
  const [showRescheduleFollowUp, setShowRescheduleFollowUp] = useState(false)

  const [nowMs] = useState(() => Date.now())

  // Load staff profiles for assignment choices
  useEffect(() => {
    fetchStaffProfiles().then(({ data }) => setStaffList(data))
  }, [])

  // Refresh lead dossier after mutations
  const refreshLead = useCallback(async () => {
    if (!id) return
    const result = await fetchLeadById(id)
    if (result.error || !result.data) {
      setError(result.error || 'Student enquiry not found.')
    } else {
      setLead(result.data)
    }
  }, [id])

  // Initial load
  useEffect(() => {
    let isCancelled = false
    if (!id) return

    fetchLeadById(id).then((result) => {
      if (isCancelled) return
      if (result.error || !result.data) {
        setError(result.error || 'Student enquiry not found.')
      } else {
        setLead(result.data)
      }
      setLoading(false)
    })

    return () => {
      isCancelled = true
    }
  }, [id])

  // Handle stage change from the lifecycle stepper
  const handleStatusChange = async (newStatus: LeadStatus, lostReason?: string | null) => {
    if (!lead || !user?.id) return

    const result = await updateLeadStatus(
      lead.id,
      newStatus,
      lostReason || null,
      user.id,
      lead.status
    )

    if (result.error) {
      alert(`Status update failed: ${result.error}`)
    } else {
      // Refresh lead and audit trail
      await refreshLead()
    }
  }

  // Handle lead edit success
  const handleEditSuccess = async () => {
    await refreshLead()
  }

  if (loading) {
    return (
      <div className="container-fluid" style={{ padding: '3rem 1rem', textAlign: 'center', color: '#94a3b8' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <Clock size={24} className="spin" style={{ color: '#60a5fa' }} />
          <span>Loading enquiry profile...</span>
        </div>
      </div>
    )
  }

  if (error || !lead) {
    return (
      <div className="container-fluid" style={{ padding: '3rem 1rem' }}>
        <div className="lead-section-card" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center', alignItems: 'center' }}>
          <AlertCircle size={32} style={{ color: '#f87171' }} />
          <h2 style={{ fontSize: '1.1rem', color: '#f8fafc', margin: 0 }}>Enquiry Not Found</h2>
          <p style={{ fontSize: '0.8125rem', color: '#94a3b8', margin: 0 }}>
            {error || 'This student enquiry may have been removed or you do not have permission to access it.'}
          </p>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => navigate('/leads')}
            style={{ marginTop: '0.5rem' }}
          >
            ← Return to Enquiries Directory
          </button>
        </div>
      </div>
    )
  }

  const initials = lead.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  const pendingFollowUp = lead.follow_ups?.find((f) => f.status === 'pending')
  const isOverdue = pendingFollowUp ? new Date(pendingFollowUp.due_at).getTime() < nowMs : false

  return (
    <div className="container-fluid lead-detail-layout">
      {/* Breadcrumb Navigation */}
      <nav className="lead-detail-breadcrumb" aria-label="Breadcrumb">
        <Link to="/leads" className="breadcrumb-back-link">
          <ArrowLeft size={14} />
          <span>Enquiries Directory</span>
        </Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{lead.full_name}</span>
      </nav>

      {/* Hero Dossier Card */}
      <div className="lead-hero-card">
        <div className="lead-hero-profile">
          <div className="lead-hero-avatar">{initials}</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h1 className="lead-hero-title">{lead.full_name}</h1>
              <span className={`status-pill status-${lead.status}`}>
                <span className="status-pill-dot" />
                {lead.status}
              </span>
            </div>
            <div className="lead-hero-meta">
              <span style={{ color: '#60a5fa', fontWeight: 500 }}>{lead.course_interest}</span>
              <span>•</span>
              <span>Source: {lead.source}</span>
              <span>•</span>
              <span>Registered on {new Date(lead.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="lead-hero-actions">
          <a
            href={`tel:${lead.phone}`}
            className="btn btn-secondary interactive-press"
            style={{ textDecoration: 'none', gap: '0.4rem', fontSize: '0.8rem' }}
          >
            <Phone size={13} style={{ color: '#60a5fa' }} />
            <span>Call Student</span>
          </a>

          {lead.email && (
            <a
              href={`mailto:${lead.email}`}
              className="btn btn-secondary interactive-press"
              style={{ textDecoration: 'none', gap: '0.4rem', fontSize: '0.8rem' }}
            >
              <Mail size={13} />
              <span>Email</span>
            </a>
          )}

          <button
            type="button"
            className="btn btn-primary interactive-press"
            onClick={() => setShowEditModal(true)}
            style={{ gap: '0.4rem', fontSize: '0.8rem' }}
          >
            <Edit3 size={13} />
            <span>Edit Details</span>
          </button>
        </div>
      </div>

      {/* Pipeline Stage Stepper */}
      <StatusLifecycleBar
        currentStatus={lead.status}
        lostReason={lead.lost_reason}
        studentName={lead.full_name}
        onStatusChange={handleStatusChange}
      />

      {/* 2-Column Content Grid */}
      <div className="lead-detail-grid">
        {/* Left Column: Student Dossier & Information */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Contact Details Card */}
          <div className="lead-section-card">
            <div className="lead-section-header">
              <h3 className="lead-section-title">
                <Phone size={14} style={{ color: '#60a5fa' }} />
                <span>Contact & Communication</span>
              </h3>
            </div>
            <div className="lead-kv-grid">
              <div className="lead-kv-item">
                <span className="lead-kv-label">Phone Number</span>
                <span className="lead-kv-value">
                  <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                </span>
              </div>
              <div className="lead-kv-item">
                <span className="lead-kv-label">Email Address</span>
                <span className="lead-kv-value">
                  {lead.email ? <a href={`mailto:${lead.email}`}>{lead.email}</a> : 'Not provided'}
                </span>
              </div>
              <div className="lead-kv-item">
                <span className="lead-kv-label">Lead Source</span>
                <span className="lead-kv-value">{lead.source}</span>
              </div>
              <div className="lead-kv-item">
                <span className="lead-kv-label">Registered By</span>
                <span className="lead-kv-value">{lead.creator?.full_name || 'System Staff'}</span>
              </div>
            </div>
          </div>

          {/* Academic Track Card */}
          <div className="lead-section-card">
            <div className="lead-section-header">
              <h3 className="lead-section-title">
                <BookOpen size={14} style={{ color: '#a855f7' }} />
                <span>Academic Track & Program</span>
              </h3>
            </div>
            <div className="lead-kv-grid">
              <div className="lead-kv-item">
                <span className="lead-kv-label">Selected Course Track</span>
                <span className="lead-kv-value" style={{ fontWeight: 600, color: '#f8fafc' }}>
                  {lead.course_interest}
                </span>
              </div>
              <div className="lead-kv-item">
                <span className="lead-kv-label">Current Pipeline Stage</span>
                <span className="lead-kv-value">{lead.status}</span>
              </div>
            </div>
          </div>

          {/* Counsellor Assignment Card */}
          <div className="lead-section-card">
            <div className="lead-section-header">
              <h3 className="lead-section-title">
                <User size={14} style={{ color: '#38bdf8' }} />
                <span>Counsellor Assignment</span>
              </h3>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowEditModal(true)}
                style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
              >
                Reassign
              </button>
            </div>
            <div className="lead-kv-grid">
              <div className="lead-kv-item">
                <span className="lead-kv-label">Assigned Staff</span>
                <span className="lead-kv-value" style={{ color: '#f8fafc' }}>
                  {lead.assignee?.full_name || 'Unassigned'}
                </span>
              </div>
              <div className="lead-kv-item">
                <span className="lead-kv-label">Staff Role</span>
                <span className="lead-kv-value">
                  {lead.assignee?.role ? lead.assignee.role.toUpperCase() : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Counsellor Notes Card */}
          <div className="lead-section-card">
            <div className="lead-section-header">
              <h3 className="lead-section-title">
                <FileText size={14} style={{ color: '#f59e0b' }} />
                <span>Counsellor Notes</span>
              </h3>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowEditModal(true)}
                style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
              >
                Edit Notes
              </button>
            </div>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: '#cbd5e1', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
              {lead.notes || 'No preliminary notes recorded for this enquiry.'}
            </p>
          </div>
        </div>

        {/* Right Column: Next Follow-Up & Activity Audit Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Scheduled Follow-up Card */}
          <div className="lead-section-card">
            <div className="lead-section-header">
              <h3 className="lead-section-title">
                <Calendar size={14} style={{ color: '#60a5fa' }} />
                <span>Next Scheduled Follow-up</span>
              </h3>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowScheduleFollowUp(true)}
                style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', gap: '0.25rem' }}
              >
                <Plus size={12} />
                <span>Schedule New</span>
              </button>
            </div>

            {pendingFollowUp ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: isOverdue ? '#f87171' : '#f8fafc' }}>
                      {new Date(pendingFollowUp.due_at).toLocaleString()}
                    </span>
                    {isOverdue && <span className="overdue-tag">Overdue</span>}
                  </div>
                </div>

                <div style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                  padding: '0.5rem 0.75rem', 
                  borderRadius: '6px',
                  borderLeft: isOverdue ? '3px solid #ef4444' : '3px solid #3b82f6'
                }}>
                  <p style={{ margin: 0, fontSize: '0.8125rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                    "{pendingFollowUp.note}"
                  </p>
                </div>

                {/* Follow-up Quick Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.25rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary interactive-press"
                    onClick={() => setShowCompleteFollowUp(true)}
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                  >
                    <CheckCircle2 size={13} />
                    <span>Mark Completed</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary interactive-press"
                    onClick={() => setShowRescheduleFollowUp(true)}
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                  >
                    <Calendar size={13} />
                    <span>Reschedule</span>
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                  No active callback scheduled for this student.
                </p>
                <button
                  type="button"
                  className="btn btn-secondary interactive-press"
                  onClick={() => setShowScheduleFollowUp(true)}
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', gap: '0.3rem' }}
                >
                  <Plus size={12} />
                  <span>Schedule Callback</span>
                </button>
              </div>
            )}
          </div>

          {/* Activity Timeline Audit Feed */}
          <div className="lead-section-card">
            <div className="lead-section-header">
              <h3 className="lead-section-title">
                <Clock size={14} style={{ color: '#10b981' }} />
                <span>Enquiry Activity Timeline</span>
              </h3>
            </div>
            <LeadActivityTimeline
              leadId={lead.id}
              activities={lead.activities || []}
              onActivityAdded={refreshLead}
            />
          </div>
        </div>
      </div>

      {/* Edit Details Modal */}
      {showEditModal && (
        <EditLeadModal
          isOpen={showEditModal}
          lead={lead}
          staffList={staffList}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Schedule Follow-up Modal */}
      {showScheduleFollowUp && (
        <ScheduleFollowUpModal
          isOpen={showScheduleFollowUp}
          preselectedLeadId={lead.id}
          preselectedLeadName={lead.full_name}
          staffList={staffList}
          onClose={() => setShowScheduleFollowUp(false)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Complete Follow-up Modal */}
      {showCompleteFollowUp && pendingFollowUp && (
        <CompleteFollowUpModal
          isOpen={showCompleteFollowUp}
          followUpId={pendingFollowUp.id}
          leadId={lead.id}
          studentName={lead.full_name}
          scheduledNote={pendingFollowUp.note}
          onClose={() => setShowCompleteFollowUp(false)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Reschedule Follow-up Modal */}
      {showRescheduleFollowUp && pendingFollowUp && (
        <RescheduleFollowUpModal
          isOpen={showRescheduleFollowUp}
          followUpId={pendingFollowUp.id}
          leadId={lead.id}
          studentName={lead.full_name}
          currentDueAt={pendingFollowUp.due_at}
          onClose={() => setShowRescheduleFollowUp(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  )
}
