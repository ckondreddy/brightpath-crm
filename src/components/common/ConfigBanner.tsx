import React, { useState } from 'react'
import { isSupabaseConfigured, checkSupabaseHealth, HealthCheckResult } from '../../lib/supabaseClient'
import { 
  Database, 
  Copy, 
  Check, 
  ExternalLink, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronUp, 
  ChevronDown,
  Sparkles
} from 'lucide-react'

interface ConfigBannerProps {
  forceOpen?: boolean
  onClose?: () => void
}

export const ConfigBanner: React.FC<ConfigBannerProps> = ({ forceOpen = false, onClose }) => {
  const configured = isSupabaseConfigured()
  const [isMinimized, setIsMinimized] = useState<boolean>(configured && !forceOpen)
  const [copied, setCopied] = useState<boolean>(false)
  const [checking, setChecking] = useState<boolean>(false)
  const [testResult, setTestResult] = useState<HealthCheckResult | null>(null)

  const envTemplate = `VITE_SUPABASE_URL=https://your-project-id.supabase.co\nVITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

  const handleCopy = () => {
    navigator.clipboard.writeText(envTemplate)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleTestConnection = async () => {
    setChecking(true)
    const result = await checkSupabaseHealth()
    setTestResult(result)
    setChecking(false)
  }

  // If already configured and user did not force open, don't show unless requested
  if (configured && !forceOpen) {
    return null
  }

  if (isMinimized) {
    return (
      <div 
        className="animate-fade-in"
        style={{
          backgroundColor: '#fffbeb',
          borderBottom: '1px solid #fde68a',
          padding: '0.45rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: '#92400e',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={13} style={{ color: '#d97706' }} />
          <span><strong>Backend Demo Mode:</strong> Supabase keys not detected in <code>.env</code>.</span>
        </div>
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="interactive-press"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            color: '#b45309',
            fontWeight: 600,
            textDecoration: 'underline',
          }}
        >
          <span>Open Setup Instructions</span>
          <ChevronDown size={13} />
        </button>
      </div>
    )
  }

  return (
    <div 
      className="animate-slide-down"
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-md)',
        position: 'relative',
        zIndex: 30,
      }}
    >
      <div 
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {/* Banner Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <div 
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: '#eff6ff',
                color: 'var(--color-brand-600)',
                border: '1px solid #bfdbfe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Database size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                  Connect BrightPath CRM to Supabase
                </h3>
                <span 
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: '#fffbeb',
                    color: '#b45309',
                    border: '1px solid #fde68a',
                  }}
                >
                  Phase 02 Configuration
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--slate-600)', marginTop: '2px' }}>
                Configure your public client credentials in a local <code>.env</code> file to enable student enquiry persistence and authentication.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary interactive-press"
              onClick={() => {
                setIsMinimized(true)
                if (onClose) onClose()
              }}
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
            >
              <span>Minimize</span>
              <ChevronUp size={13} />
            </button>
          </div>
        </div>

        {/* Steps & Code Box */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1rem',
            backgroundColor: 'var(--slate-50)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)',
          }}
        >
          {/* Step Instructions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--slate-800)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Quick Setup Steps
            </span>
            <ol style={{ paddingLeft: '1.2rem', color: 'var(--slate-600)', lineHeight: '1.45', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <li>
                Create a project at <a href="https://supabase.com" target="_blank" rel="noreferrer" style={{ color: 'var(--color-brand-600)', textDecoration: 'underline' }}>supabase.com <ExternalLink size={10} style={{ display: 'inline' }} /></a>
              </li>
              <li>Navigate to <strong>Project Settings &gt; API</strong> to copy your Project URL and Anon Public Key.</li>
              <li>Create a <code>.env</code> file in your project root with the keys on the right.</li>
              <li>Restart your dev server (or trigger a new build on Vercel).</li>
            </ol>
          </div>

          {/* Template Copy Box */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                .env (Project Root)
              </span>
              <button
                type="button"
                className="interactive-press"
                onClick={handleCopy}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.725rem',
                  fontWeight: 600,
                  color: copied ? 'var(--semantic-emerald)' : 'var(--color-brand-600)',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-default)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-xs)',
                  boxShadow: 'var(--shadow-xs)',
                }}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                <span>{copied ? 'Copied!' : 'Copy Template'}</span>
              </button>
            </div>
            <pre 
              style={{
                backgroundColor: 'var(--color-obsidian-900)',
                color: '#e2e8f0',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                overflowX: 'auto',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <code>{envTemplate}</code>
            </pre>
          </div>
        </div>

        {/* Live Test Action Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              type="button"
              className="btn btn-primary interactive-press"
              onClick={handleTestConnection}
              disabled={checking}
              style={{ fontSize: '0.775rem', padding: '0.35rem 0.75rem' }}
            >
              {checking ? (
                <>
                  <RefreshCw size={13} className="animate-spin-fast" />
                  <span>Probing Supabase Endpoint...</span>
                </>
              ) : (
                <>
                  <Sparkles size={13} />
                  <span>Test Connection Probe</span>
                </>
              )}
            </button>

            {testResult && (
              <div 
                className="animate-fade-in"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: testResult.healthy ? 'var(--semantic-emerald)' : '#be123c',
                }}
              >
                {testResult.healthy ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                <span>{testResult.message}</span>
              </div>
            )}
          </div>

          <span style={{ fontSize: '0.725rem', color: 'var(--slate-400)' }}>
            Never commit <code>service_role</code> keys to frontend code.
          </span>
        </div>
      </div>
    </div>
  )
}
