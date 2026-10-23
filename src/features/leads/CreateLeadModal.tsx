import React, { useState, useEffect, useRef } from 'react'
import { 
  UserPlus, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw,
  Sparkles
} from 'lucide-react'
import { useAuth } from '../../context/useAuth'
import { Lead, LeadSource, UserProfile } from '../../types'
import { 
  createLead, 
  fetchStaffProfiles, 
  validateLeadInput, 
  LeadValidationErrors 
} from '../../services/leadService'
import './create-lead-modal.css'

interface CreateLeadModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (newLead: Lead) => void
}

const ACADEMY_COURSES = [
  'IIT-JEE (Advanced & Mains 2-Year)',
  'NEET Medical Intensive Batch',
  'Foundation STEM (Class 9-10)',
  'SAT & GRE Global Prep Track',
  'UPSC Civil Services Foundation',
  'Data Science & AI Bootcamp',
  'Commerce & CA Foundation',
  'General / Other Academic Track'
]

const LEAD_SOURCES: LeadSource[] = [
  'Website',
  'Walk-in',
  'Phone',
  'Social Media',
  'Referral',
  'Other'
]

export const CreateLeadModal: React.FC<CreateLeadModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth()
  const nameInputRef = useRef<HTMLInputElement>(null)

  // Form State
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [courseInterest, setCourseInterest] = useState(ACADEMY_COURSES[0])
  const [source, setSource] = useState<LeadSource>('Website')
  const [assignedTo, setAssignedTo] = useState<string>('')
  const [notes, setNotes] = useState('')

  // UI State
  const [staffList, setStaffList] = useState<UserProfile[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<LeadValidationErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [successLead, setSuccessLead] = useState<Lead | null>(null)

  // Fetch staff members for the assignee dropdown
  useEffect(() => {
    if (!isOpen) return

    let isMounted = true
    fetchStaffProfiles().then(({ data }) => {
      if (isMounted && data.length > 0) {
        setStaffList(data)
        // Default to logged-in user if available and no assignee selected yet
        if (!assignedTo && user?.id) {
          const matchingStaff = data.find((s) => s.id === user.id)
          if (matchingStaff) {
            setAssignedTo(matchingStaff.id)
          } else {
            setAssignedTo(data[0].id)
          }
        }
      }
    })

    return () => {
      isMounted = false
    }
  }, [isOpen, user?.id, assignedTo])

  // Focus trap & keyboard accessibility (Esc to close)
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    // Auto-focus first input
    const timer = setTimeout(() => {
      nameInputRef.current?.focus()
    }, 100)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
      clearTimeout(timer)
    }
  }, [isOpen, isSubmitting, onClose])

  if (!isOpen) return null

  const resetForm = () => {
    setFullName('')
    setPhone('')
    setEmail('')
    setCourseInterest(ACADEMY_COURSES[0])
    setSource('Website')
    setNotes('')
    setErrors({})
    setServerError(null)
    setSuccessLead(null)
  }

  const handleClose = () => {
    if (isSubmitting) return
    resetForm()
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError(null)

    const payload = {
      full_name: fullName,
      phone,
      email: email || undefined,
      course_interest: courseInterest,
      source,
      assigned_to: assignedTo || user?.id || null,
      notes: notes || undefined
    }

    // Client-side validation check
    const validationErrors = validateLeadInput(payload)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)

    const actorId = user?.id || ''
    const { data, error } = await createLead(payload, actorId)

    setIsSubmitting(false)

    if (error || !data) {
      setServerError(error || 'Failed to register enquiry. Please check connection.')
      return
    }

    // Success state
    setSuccessLead(data)
    if (onSuccess) {
      onSuccess(data)
    }

    // Auto-close after brief confirmation
    setTimeout(() => {
      handleClose()
    }, 850)
  }

  return (
    <div 
      className="lead-modal-backdrop" 
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
    >
      <div 
        className="lead-modal-card" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="lead-modal-header">
          <div className="lead-modal-title-group">
            <div className="lead-modal-icon-badge">
              <UserPlus size={18} />
            </div>
            <div>
              <h2 id="modal-headline" className="lead-modal-heading">New Student Enquiry</h2>
              <p className="lead-modal-subheading">Record an admissions enquiry into BrightPath CRM</p>
            </div>
          </div>
          <button 
            type="button" 
            className="lead-modal-close-btn" 
            onClick={handleClose}
            aria-label="Close dialog"
            disabled={isSubmitting}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit}>
          <div className="lead-modal-body">
            {/* Server Feedback Banners */}
            {serverError && (
              <div className="lead-modal-error-banner animate-slide-down">
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{serverError}</span>
              </div>
            )}

            {successLead && (
              <div className="lead-modal-success-banner animate-slide-down">
                <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                <span>Enquiry for <strong>{successLead.full_name}</strong> created successfully!</span>
              </div>
            )}

            {/* Row 1: Student Name & Phone */}
            <div className="lead-modal-grid-2">
              <div className="lead-field-group">
                <label className="lead-field-label" htmlFor="studentName">
                  <span>Student Full Name <span className="lead-field-required">*</span></span>
                </label>
                <input
                  ref={nameInputRef}
                  id="studentName"
                  type="text"
                  placeholder="e.g. Aarav Sharma"
                  className={`lead-field-input ${errors.full_name ? 'has-error' : ''}`}
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value)
                    if (errors.full_name) setErrors((prev) => ({ ...prev, full_name: undefined }))
                  }}
                  disabled={isSubmitting || !!successLead}
                  autoComplete="name"
                />
                {errors.full_name && (
                  <span className="lead-field-error-hint">
                    <AlertCircle size={12} /> {errors.full_name}
                  </span>
                )}
              </div>

              <div className="lead-field-group">
                <label className="lead-field-label" htmlFor="studentPhone">
                  <span>Contact Phone <span className="lead-field-required">*</span></span>
                </label>
                <input
                  id="studentPhone"
                  type="tel"
                  placeholder="+91 98452 11029"
                  className={`lead-field-input ${errors.phone ? 'has-error' : ''}`}
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value)
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }))
                  }}
                  disabled={isSubmitting || !!successLead}
                  autoComplete="tel"
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
                <label className="lead-field-label" htmlFor="studentEmail">
                  <span>Email Address <span style={{ color: '#64748b', fontSize: '0.72rem' }}>(Optional)</span></span>
                </label>
                <input
                  id="studentEmail"
                  type="email"
                  placeholder="aarav.sharma@gmail.com"
                  className={`lead-field-input ${errors.email ? 'has-error' : ''}`}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                  }}
                  disabled={isSubmitting || !!successLead}
                  autoComplete="email"
                />
                {errors.email && (
                  <span className="lead-field-error-hint">
                    <AlertCircle size={12} /> {errors.email}
                  </span>
                )}
              </div>

              <div className="lead-field-group">
                <label className="lead-field-label" htmlFor="courseInterest">
                  <span>Course Track <span className="lead-field-required">*</span></span>
                </label>
                <select
                  id="courseInterest"
                  className={`lead-field-select ${errors.course_interest ? 'has-error' : ''}`}
                  value={courseInterest}
                  onChange={(e) => {
                    setCourseInterest(e.target.value)
                    if (errors.course_interest) setErrors((prev) => ({ ...prev, course_interest: undefined }))
                  }}
                  disabled={isSubmitting || !!successLead}
                >
                  {ACADEMY_COURSES.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
                {errors.course_interest && (
                  <span className="lead-field-error-hint">
                    <AlertCircle size={12} /> {errors.course_interest}
                  </span>
                )}
              </div>
            </div>

            {/* Row 3: Source & Assignee */}
            <div className="lead-modal-grid-2">
              <div className="lead-field-group">
                <label className="lead-field-label" htmlFor="leadSource">
                  <span>Enquiry Source <span className="lead-field-required">*</span></span>
                </label>
                <select
                  id="leadSource"
                  className={`lead-field-select ${errors.source ? 'has-error' : ''}`}
                  value={source}
                  onChange={(e) => {
                    setSource(e.target.value as LeadSource)
                    if (errors.source) setErrors((prev) => ({ ...prev, source: undefined }))
                  }}
                  disabled={isSubmitting || !!successLead}
                >
                  {LEAD_SOURCES.map((src) => (
                    <option key={src} value={src}>
                      {src}
                    </option>
                  ))}
                </select>
                {errors.source && (
                  <span className="lead-field-error-hint">
                    <AlertCircle size={12} /> {errors.source}
                  </span>
                )}
              </div>

              <div className="lead-field-group">
                <label className="lead-field-label" htmlFor="assignedTo">
                  <span>Assign To Counsellor</span>
                </label>
                <select
                  id="assignedTo"
                  className="lead-field-select"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  disabled={isSubmitting || !!successLead}
                >
                  {staffList.length > 0 ? (
                    staffList.map((staff) => (
                      <option key={staff.id} value={staff.id}>
                        {staff.full_name} ({staff.role.toUpperCase()})
                      </option>
                    ))
                  ) : (
                    <option value={user?.id || ''}>
                      Current Active Staff
                    </option>
                  )}
                </select>
              </div>
            </div>

            {/* Row 4: Counsellor Notes */}
            <div className="lead-field-group">
              <label className="lead-field-label" htmlFor="leadNotes">
                <span>Initial Discussion Notes <span style={{ color: '#64748b', fontSize: '0.72rem' }}>(Optional)</span></span>
              </label>
              <textarea
                id="leadNotes"
                placeholder="Parent's preferred batch timing, current academic standard, demo class interest..."
                className="lead-field-textarea"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isSubmitting || !!successLead}
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="lead-modal-footer">
            <button
              type="button"
              className="lead-modal-cancel-btn"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="lead-modal-submit-btn"
              disabled={isSubmitting || !!successLead}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={14} className="spin" />
                  <span>Saving Enquiry...</span>
                </>
              ) : successLead ? (
                <>
                  <CheckCircle2 size={14} />
                  <span>Enquiry Saved!</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>Create Enquiry</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
