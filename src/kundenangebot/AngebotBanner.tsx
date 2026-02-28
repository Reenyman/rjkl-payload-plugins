'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface AngebotBannerProps {
  text: string
}

export function AngebotBanner({ text }: AngebotBannerProps) {
  const pathname = usePathname()
  const [sichtbar, setSichtbar] = useState(false)

  useEffect(() => {
    // Auf der Angebotsseite selbst kein Banner zeigen
    if (pathname === '/angebot') return

    const ersterBesuch = sessionStorage.getItem('angebot-erster-besuch')

    if (!ersterBesuch) {
      // Erster Seitenaufruf: merken, aber kein Banner
      sessionStorage.setItem('angebot-erster-besuch', 'true')
      return
    }

    // Ab dem zweiten Seitenaufruf: Banner anzeigen
    setSichtbar(true)
  }, [pathname])

  if (!sichtbar) return null

  return (
    <a
      href="/angebot"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '10px 16px',
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        textDecoration: 'none',
        fontSize: '14px',
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
      <span>{text}</span>
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
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    </a>
  )
}
