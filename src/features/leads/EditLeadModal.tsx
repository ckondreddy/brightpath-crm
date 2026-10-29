import React, { useState, useEffect } from 'react'
import { Edit3, X, AlertCircle, RefreshCw, Check } from 'lucide-react'
import { useAuth } from '../../context/useAuth'
import { useToast } from '../../context/useToast'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { Lead, LeadSource, UserProfile } from '../../types'
import { 
  updateLeadDetails, 
  validateLeadInput, 
  LeadValidationErrors 
} from '../../services/leadService'

interface EditLeadModalProps {
  isOpen: boolean
  lead: Lead
  staffList: UserProfile[]
  onClose: () => void
  onSuccess: (updatedLead: Lead) => void
}

const ACADEMY_COURSES = [
  'IIT-JEE (Advanced & Mains 2-Year)',
  'NEET Medical Intensive Batch',
  'Foundation STEM (Class 9-10)',
  'SAT & GRE Global Prep Track',
  'UPSC Civil Services Foundation',
  'Data Science & AI Bootcamp',
  'Commerce & CA Foundation',
  'General / Other Academic Track',
]

const LEAD_SOURCES: LeadSource[] = [
  'Website',
  'Walk-in',
  'Phone',
  'Social Media',
  'Referral',
  'Other',
]

const EditLeadModalInner: React.FC<Omit<EditLeadModalProps, 'isOpen'>> = ({
  lead,
  staffList,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth()
  const toast = useToast()
  const modalRef = useFocusTrap<HTMLDivElement>({
    active: true,
    onClose,
    initialFocusSelector: '#editStudentName',
  })

  // Form State initialized directly from lead props on mount
  const [fullName, setFullName] = useState(lead.full_name)
  const [phone, setPhone] = useState(lead.phone)
  const [email, setEmail] = useState(lead.email || '')
  const [courseInterest, setCourseInterest] = useState(lead.course_interest)
  const [source, setSource] = useState<LeadSource>(lead.source)
  const [assignedTo, setAssignedTo] = useState<string>(lead.assigned_to || '')
  const [notes, setNotes] = useState(lead.notes || '')

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<LeadValidationErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)

  // Focus & Escape key handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isSubmitting, onClose])



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError(null)

    const payload = {
      full_name: fullName,
      phone,
      email: email || undefined,
      course_interest: courseInterest,
      source,
      assigned_to: assignedTo || null,
      notes: notes || undefined,
    }

    const validationErrors = validateLeadInput(payload)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)

    const actorId = user?.id || ''
    const { data, error } = await updateLeadDetails(lead.id, payload, actorId)

    setIsSubmitting(false)

    if (error || !data) {
      const msg = error || 'Failed to update enquiry details.'
      setServerError(msg)
      toast.error(msg)
      return
    }

    toast.success(`Updated enquiry details for ${data.full_name}`)
    onSuccess(data)
    onClose()
  }

  return (
    <div
      className="lead-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-lead-dialog-title"
    >
      <div 
        ref={modalRef} 
        className="lead-modal-card" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="lead-modal-header">
          <div className="lead-modal-title-group">
            <div className="lead-modal-icon-badge">
              <Edit3 size={18} />
            </div>
            <div>
              <h2 id="edit-lead-dialog-title" className="lead-modal-heading">
                Edit Student Enquiry
              </h2>
              <p className="lead-modal-subheading">Update contact information or reassign counsellor</p>
            </div>
          </div>
          <button
            type="button"
            className="lead-modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
            disabled={isSubmitting}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit}>
          <div className="lead-modal-body">
            {serverError && (
              <div className="lead-modal-error-banner animate-slide-down">
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{serverError}</span>
              </div>
            )}

            {/* Row 1: Student Name & Phone */}
            <div className="lead-modal-grid-2">
              <div className="lead-field-group">
                <label className="lead-field-label" htmlFor="editStudentName">
                  <span>Student Full Name <span className="lead-field-required">*</span></span>
                </label>
                <input
                  id="editStudentName"
                  type="text"
                  className={`lead-field-input ${errors.full_name ? 'has-error' : ''}`}
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value)
                    if (errors.full_name) setErrors((prev) => ({ ...prev, full_name: undefined }))
                  }}
                  disabled={isSubmitting}
                />
                {errors.full_name && (
                  <span className="lead-field-error-hint">
                    <AlertCircle size={12} /> {errors.full_name}
                  </span>
                )}
              </div>

              <div className="lead-field-group">
                <label className="lead-field-label" htmlFor="editStudentPhone">
                  <span>Contact Phone <span className="lead-field-required">*</span></span>
                </label>
                <input
                  id="editStudentPhone"
                  type="tel"
                  className={`lead-field-input ${errors.phone ? 'has-error' : ''}`}
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value)
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }))
                  }}
                  disabled={isSubmitting}
                />
                {errors.phone && (
                  <span className="lead-field-error-hint">
                    <AlertCircle size={12} /> {errors.phone}
                  </span>
                )}
              </div>
            </div>

            {/* Row 2: Email & Course Interest */}
            <div className="lead-modal-grid-2">
              <div className="lead-field-group">
                <label className="lead-field-label" htmlFor="editStudentEmail">
                  <span>Email Address <span style={{ color: '#64748b', fontSize: '0.72rem' }}>(Optional)</span></span>
                </label>
                <input
                  id="editStudentEmail"
                  type="email"
                  className={`lead-field-input ${errors.email ? 'has-error' : ''}`}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                  }}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <span className="lead-field-error-hint">
                    <AlertCircle size={12} /> {errors.email}
                  </span>
                )}
              </div>

              <div className="lead-field-group">
                <label className="lead-field-label" htmlFor="editCourseInterest">
                  <span>Course Track <span className="lead-field-required">*</span></span>
                </label>
                <select
                  id="editCourseInterest"
                  className={`lead-field-select ${errors.course_interest ? 'has-error' : ''}`}
                  value={courseInterest}
                  onChange={(e) => {
                    setCourseInterest(e.target.value)
                    if (errors.course_interest) setErrors((prev) => ({ ...prev, course_interest: undefined }))
                  }}
                  disabled={isSubmitting}
                >
                  {ACADEMY_COURSES.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: Source & Assignee */}
            <div className="lead-modal-grid-2">
              <div className="lead-field-group">
                <label className="lead-field-label" htmlFor="editLeadSource">
                  <span>Enquiry Source <span className="lead-field-required">*</span></span>
                </label>
                <select
                  id="editLeadSource"
                  className="lead-field-select"
                  value={source}
                  onChange={(e) => setSource(e.target.value as LeadSource)}
                  disabled={isSubmitting}
                >
                  {LEAD_SOURCES.map((src) => (
                    <option key={src} value={src}>
                      {src}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lead-field-group">
                <label className="lead-field-label" htmlFor="editAssignedTo">
                  <span>Assigned Counsellor</span>
                </label>
                <select
                  id="editAssignedTo"
                  className="lead-field-select"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="">Unassigned</option>
                  {staffList.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.full_name} ({staff.role.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 4: Counsellor Notes */}
            <div className="lead-field-group">
              <label className="lead-field-label" htmlFor="editLeadNotes">
                <span>Discussion Notes</span>
              </label>
              <textarea
                id="editLeadNotes"
                className="lead-field-textarea"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="lead-modal-footer">
            <button
              type="button"
              className="lead-modal-cancel-btn"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="lead-modal-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={14} className="spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Check size={14} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const EditLeadModal: React.FC<EditLeadModalProps> = (props) => {
  if (!props.isOpen) return null

  return (
    <EditLeadModalInner
      key={`${props.lead.id}-${props.lead.updated_at || ''}`}
      lead={props.lead}
      staffList={props.staffList}
      onClose={props.onClose}
      onSuccess={props.onSuccess}
    />
  )
}
