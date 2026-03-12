'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  getConsentDaten,
  setConsentDaten,
  COOKIE_KATEGORIEN,
  KATEGORIE_LABELS,
  KATEGORIE_BESCHREIBUNGEN,
  type CookieKategorie,
} from './cookie-consent'

export type CookieBannerTheme = {
  /** Hintergrundfarbe des Banners */
  bg?: string
  /** Textfarbe */
  text?: string
  /** Gedämpfte Textfarbe (Beschreibungen, sekundäre Texte) */
  textMuted?: string
  /** Primäre Button-Hintergrundfarbe (Alle akzeptieren) */
  primaryBg?: string
  /** Primäre Button-Textfarbe */
  primaryText?: string
  /** Rahmenfarbe für Outline-Buttons */
  borderColor?: string
  /** Akzentfarbe für Checkboxen */
  accentColor?: string
}

const DEFAULT_THEME: Required<CookieBannerTheme> = {
  bg: '#1a1a1a',
  text: '#ffffff',
  textMuted: 'rgba(255,255,255,0.65)',
  primaryBg: '#ffffff',
  primaryText: '#1a1a1a',
  borderColor: 'rgba(255,255,255,0.25)',
  accentColor: '#ffffff',
}

type CookieBannerProps = {
  /** Farbschema anpassen */
  theme?: CookieBannerTheme
  /** Link zur Datenschutzseite (Standard: /datenschutz) */
  datenschutzLink?: string
}

export function CookieBanner({ theme: themeOverrides, datenschutzLink = '/datenschutz' }: CookieBannerProps = {}) {
  const theme = { ...DEFAULT_THEME, ...themeOverrides }

  const [sichtbar, setSichtbar] = useState(false)
  const [gemountet, setGemountet] = useState(false)
  const [erweitert, setErweitert] = useState(false)
  const [kategorien, setKategorien] = useState<Record<CookieKategorie, boolean>>({
    funktional: false,
    statistik: false,
    marketing: false,
  })

  useEffect(() => {
    const bannerAktiv = document.documentElement.dataset.cookieBanner !== 'false'
    if (!bannerAktiv) return

    setGemountet(true)
    const daten = getConsentDaten()
    if (!daten) {
      setSichtbar(true)
    } else {
      setKategorien({ ...daten.kategorien })
    }

    function onZuruecksetzen() {
      setSichtbar(true)
      setErweitert(false)
      const aktuell = getConsentDaten()
      if (aktuell) {
        setKategorien({ ...aktuell.kategorien })
      } else {
        setKategorien({ funktional: false, statistik: false, marketing: false })
      }
    }
    window.addEventListener('cookie-consent-zuruecksetzen', onZuruecksetzen)
    return () => window.removeEventListener('cookie-consent-zuruecksetzen', onZuruecksetzen)
  }, [])

  function alleAkzeptieren() {
    setConsentDaten({ funktional: true, statistik: true, marketing: true })
    setSichtbar(false)
    setErweitert(false)
  }

  function nurNotwendige() {
    setConsentDaten({ funktional: false, statistik: false, marketing: false })
    setSichtbar(false)
    setErweitert(false)
  }

  function auswahlSpeichern() {
    setConsentDaten(kategorien)
    setSichtbar(false)
    setErweitert(false)
  }

  function toggleKategorie(kategorie: CookieKategorie) {
    setKategorien((prev) => ({ ...prev, [kategorie]: !prev[kategorie] }))
  }

  if (!gemountet || !sichtbar) return null

  return (
    <div
      data-cookie-banner-wrapper
      style={{
        position: 'fixed',
        zIndex: 50,
        bottom: 0,
        left: 0,
        right: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
      role="dialog"
      aria-label="Cookie-Einstellungen"
      aria-live="polite"
    >
      <style>{`
        @media (min-width: 640px) {
          [data-cookie-banner-wrapper] {
            bottom: 20px !important;
            right: 20px !important;
            left: auto !important;
            max-width: 384px !important;
          }
          [data-cookie-banner-container] {
            border-radius: 12px !important;
          }
        }
      `}</style>
      <div
        data-cookie-banner-container
        style={{
          background: theme.bg,
          color: theme.text,
          padding: '20px',
          boxShadow: '0 -4px 24px rgba(0,0,0,0.2)',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
          position: 'relative',
        }}
      >
        {/* Schließen-Button */}
        <button
          onClick={nurNotwendige}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            color: theme.textMuted,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            lineHeight: 1,
            fontSize: '18px',
          }}
          aria-label="Schließen"
          onMouseOver={(e) => (e.currentTarget.style.color = theme.text)}
          onMouseOut={(e) => (e.currentTarget.style.color = theme.textMuted)}
        >
          ✕
        </button>

        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', paddingRight: '24px' }}>
          Diese Website verwendet Cookies
        </h3>

        <p style={{ fontSize: '12px', color: theme.textMuted, marginBottom: '16px', lineHeight: 1.6 }}>
          Wir nutzen Cookies, um dir das beste Erlebnis zu bieten. Einige Cookies
          sind notwendig für den Betrieb der Website. Du kannst selbst wählen,
          welche optionalen Cookies du zulassen möchtest.{' '}
          <Link
            href={datenschutzLink}
            style={{ color: theme.textMuted, textDecoration: 'underline' }}
          >
            Datenschutz
          </Link>
        </p>

        {/* Erweiterte Ansicht mit Kategorie-Toggles */}
        {erweitert && (
          <div style={{ marginBottom: '16px' }}>
            {/* Notwendig — immer aktiv */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '8px 0' }}>
              <input
                type="checkbox"
                checked
                disabled
                style={{ marginTop: '2px', width: '16px', height: '16px', accentColor: theme.accentColor, opacity: 0.6 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>Notwendig</span>
                <p style={{ fontSize: '12px', color: theme.textMuted, lineHeight: 1.4, marginTop: '2px' }}>
                  Für den Betrieb der Website erforderlich. Immer aktiv.
                </p>
              </div>
            </label>

            {COOKIE_KATEGORIEN.map((kategorie) => (
              <label
                key={kategorie}
                style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '8px 0', cursor: 'pointer' }}
              >
                <input
                  type="checkbox"
                  checked={kategorien[kategorie]}
                  onChange={() => toggleKategorie(kategorie)}
                  style={{ marginTop: '2px', width: '16px', height: '16px', accentColor: theme.accentColor }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>
                    {KATEGORIE_LABELS[kategorie]}
                  </span>
                  <p style={{ fontSize: '12px', color: theme.textMuted, lineHeight: 1.4, marginTop: '2px' }}>
                    {KATEGORIE_BESCHREIBUNGEN[kategorie]}
                  </p>
                </div>
              </label>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {erweitert ? (
            <>
              <button
                onClick={auswahlSpeichern}
                style={{
                  width: '100%', borderRadius: '6px', padding: '8px 16px',
                  fontSize: '14px', fontWeight: 500, cursor: 'pointer',
                  background: theme.primaryBg, color: theme.primaryText, border: 'none',
                }}
              >
                Auswahl speichern
              </button>
              <button
                onClick={alleAkzeptieren}
                style={{
                  width: '100%', borderRadius: '6px', padding: '8px 16px',
                  fontSize: '14px', fontWeight: 500, cursor: 'pointer',
                  background: 'transparent', color: theme.text,
                  border: `1px solid ${theme.borderColor}`,
                }}
              >
                Alle akzeptieren
              </button>
            </>
          ) : (
            <>
              <button
                onClick={alleAkzeptieren}
                style={{
                  width: '100%', borderRadius: '6px', padding: '8px 16px',
                  fontSize: '14px', fontWeight: 500, cursor: 'pointer',
                  background: theme.primaryBg, color: theme.primaryText, border: 'none',
                }}
              >
                Alle akzeptieren
              </button>
              <button
                onClick={() => setErweitert(true)}
                style={{
                  width: '100%', borderRadius: '6px', padding: '8px 16px',
                  fontSize: '14px', fontWeight: 500, cursor: 'pointer',
                  background: 'transparent', color: theme.text,
                  border: `1px solid ${theme.borderColor}`,
                }}
              >
                Anpassen
              </button>
              <button
                onClick={nurNotwendige}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '12px', color: theme.textMuted, padding: '4px 0',
                }}
              >
                Nur notwendige
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
