import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { GraduationCap, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight, RefreshCw, UserCheck } from 'lucide-react'
import './auth.css'

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!email.trim() || !password) {
      setErrorMessage('Please fill in both email and password.')
      return
    }

    if (mode === 'signup' && !fullName.trim()) {
      setErrorMessage('Please enter your full name.')
      return
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.')
      return
    }

    setLoading(true)

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password)
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setErrorMessage('Invalid email or password. Please check your credentials.')
          } else {
            setErrorMessage(error.message)
          }
          setLoading(false)
          return
        }
        navigate(from, { replace: true })
      } else {
        const { error, user } = await signUp(email, password, fullName)
        if (error) {
          setErrorMessage(error.message)
          setLoading(false)
          return
        }

        if (user && !user.confirmed_at && user.identities?.length) {
          setSuccessMessage('Account created! You can now sign in with your credentials.')
          setMode('signin')
        } else {
          setSuccessMessage('Account created! Welcome to BrightPath Academy.')
          setTimeout(() => {
            navigate(from, { replace: true })
          }, 800)
        }
        setLoading(false)
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred.')
      setLoading(false)
    }
  }

  const fillDemoAccount = () => {
    setEmail('counsellor@brightpath.edu')
    setPassword('Counsellor@2026')
    setFullName('Priya Sharma')
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card animate-slide-down">
        {/* Brand Header */}
        <div className="auth-header">
          <div className="auth-brand-icon">
            <GraduationCap size={24} />
          </div>
          <h1 className="auth-title">BrightPath CRM</h1>
          <p className="auth-subtitle">Admissions & Student Enquiry Portal</p>
        </div>

        {/* Tab Toggle (Sign In vs Register) */}
        <div className="auth-segmented">
          <button
            type="button"
            className={`auth-segmented-btn ${mode === 'signin' ? 'active' : ''}`}
            onClick={() => {
              setMode('signin')
              setErrorMessage(null)
              setSuccessMessage(null)
            }}
          >
            Staff Sign In
          </button>
          <button
            type="button"
            className={`auth-segmented-btn ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => {
              setMode('signup')
              setErrorMessage(null)
              setSuccessMessage(null)
            }}
          >
            Create Staff Account
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="auth-error-banner animate-slide-down">
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="auth-success-banner animate-slide-down">
            <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <div className="form-group animate-slide-down">
              <label className="form-label" htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                placeholder="e.g. Priya Sharma"
                className="form-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                disabled={loading}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="email">Academy Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="name@brightpath.edu"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="form-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                disabled={loading}
              />
              <button
                type="button"
                className="input-icon-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary interactive-press"
            disabled={loading}
            style={{ width: '100%', padding: '0.65rem', marginTop: '0.25rem' }}
          >
            {loading ? (
              <>
                <RefreshCw size={14} className="animate-spin-fast" />
                <span>{mode === 'signin' ? 'Authenticating...' : 'Creating Profile...'}</span>
              </>
            ) : (
              <>
                <span>{mode === 'signin' ? 'Sign In to Workspace' : 'Register Counsellor Account'}</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Demo Quick-Fill Helper for Testing */}
        <div className="demo-quickfill-box">
          <div className="demo-quickfill-title">Quick Demo Test Fill</div>
          <button
            type="button"
            className="demo-chip-btn interactive-press"
            onClick={fillDemoAccount}
          >
            <UserCheck size={13} style={{ color: 'var(--color-brand-500)' }} />
            <span>Pre-fill Sample Credentials (counsellor@brightpath.edu)</span>
          </button>
        </div>
      </div>
    </div>
  )
}
