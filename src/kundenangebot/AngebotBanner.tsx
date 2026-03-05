'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { usePathname } from 'next/navigation'

interface AngebotBannerProps {
  text: string
}

// SessionStorage als externer Store
const STORAGE_KEY = 'angebot-erster-besuch'
const listeners = new Set<() => void>()

function subscribe(callback: () => void) {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

function getSnapshot(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

function getServerSnapshot(): boolean {
  return false
}

function markiereErstenBesuch() {
  try {
    if (!sessionStorage.getItem(STORAGE_KEY)) {
      sessionStorage.setItem(STORAGE_KEY, 'true')
      listeners.forEach((l) => l())
    }
  } catch {
    // sessionStorage nicht verfügbar
  }
}

const VERZÖGERUNG_MS = 8000

export function AngebotBanner({ text }: AngebotBannerProps) {
  const pathname = usePathname()
  const hatVorherBesucht = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [sichtbar, setSichtbar] = useState(false)
  const [geschlossen, setGeschlossen] = useState(false)

  useEffect(() => {
    if (!hatVorherBesucht || pathname === '/angebot') return
    const timer = setTimeout(() => setSichtbar(true), VERZÖGERUNG_MS)
    return () => clearTimeout(timer)
  }, [hatVorherBesucht, pathname])

  // Beim ersten Render den Besuch markieren
  if (!hatVorherBesucht) {
    markiereErstenBesuch()
    return null
  }

  // Auf der Angebotsseite selbst kein Banner zeigen
  if (pathname === '/angebot') return null

  const offen = sichtbar && !geschlossen

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 49,
        transition: 'transform 0.5s ease-out, opacity 0.5s ease-out',
        transform: offen ? 'translateY(0)' : 'translateY(100%)',
        opacity: offen ? 1 : 0,
        pointerEvents: offen ? 'auto' : 'none',
      }}
    >
      <a
        href="/angebot"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          padding: '18px 48px 18px 24px',
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
          textDecoration: 'none',
          fontSize: '17px',
          fontWeight: 500,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          letterSpacing: '0.02em',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#333333'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#1a1a1a'
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
        <span>{text}</span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </a>

      {/* Schließen-Button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          setGeschlossen(true)
        }}
        aria-label="Banner schließen"
        style={{
          position: 'absolute',
          top: '50%',
          right: '16px',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '28px',
          height: '28px',
          border: 'none',
          borderRadius: '50%',
          backgroundColor: 'transparent',
          color: '#999999',
          cursor: 'pointer',
          transition: 'color 0.2s, background-color 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#ffffff'
          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#999999'
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>
  )
}
