import React, { useState, useEffect } from 'react'
import { WifiOff, Wifi, RefreshCw } from 'lucide-react'

export const NetworkStatusBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
      ? navigator.onLine
      : true
  })
  const [justReconnected, setJustReconnected] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setJustReconnected(true)
      const timer = setTimeout(() => {
        setJustReconnected(false)
      }, 3500)
      return () => clearTimeout(timer)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setJustReconnected(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleManualCheck = async () => {
    setIsChecking(true)
    try {
      // Attempt a lightweight fetch with cache buster
      await fetch(`https://httpbin.org/status/200?_t=${Date.now()}`, {
        method: 'HEAD',
        cache: 'no-store',
      })
      setIsOnline(true)
      setJustReconnected(true)
      setTimeout(() => setJustReconnected(false), 3000)
    } catch {
      setIsOnline(false)
    } finally {
      setIsChecking(false)
    }
  }

  if (isOnline && !justReconnected) {
    return null
  }

  return (
    <div
      role="status"
      aria-live="assertive"
      style={{
        position: 'fixed',
        top: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        padding: '0.5rem 1rem',
        borderRadius: '9999px',
        fontSize: '0.8125rem',
        fontWeight: 500,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.25s ease',
        backgroundColor: justReconnected ? '#ecfdf5' : '#fff1f2',
        color: justReconnected ? '#065f46' : '#9f1239',
        border: `1px solid ${justReconnected ? '#a7f3d0' : '#fecdd3'}`,
      }}
    >
      {justReconnected ? (
        <>
          <Wifi size={15} style={{ color: '#059669', flexShrink: 0 }} />
          <span>Connection restored. You are back online.</span>
        </>
      ) : (
        <>
          <WifiOff size={15} style={{ color: '#e11d48', flexShrink: 0 }} />
          <span>Offline mode — Network disconnected. Enquiries will sync when reconnected.</span>
          <button
            type="button"
            onClick={handleManualCheck}
            disabled={isChecking}
            style={{
              background: '#ffffff',
              border: '1px solid #fecdd3',
              borderRadius: '9999px',
              padding: '0.2rem 0.55rem',
              fontSize: '0.725rem',
              fontWeight: 600,
              color: '#9f1239',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <RefreshCw size={11} className={isChecking ? 'animate-spin' : ''} />
            <span>Retry</span>
          </button>
        </>
      )}
    </div>
  )
}
