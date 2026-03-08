'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import {
  getConsentDaten,
  setConsentDaten,
  COOKIE_KATEGORIEN,
  KATEGORIE_LABELS,
  KATEGORIE_BESCHREIBUNGEN,
  type CookieKategorie,
} from './cookie-consent'
import { cn } from './utils'

export function CookieBanner() {
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

  const btnPrimary =
    'w-full rounded-md px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer'
  const btnOutline =
    'w-full rounded-md px-4 py-2 text-sm font-medium border border-background/30 text-background hover:bg-background/10 transition-colors cursor-pointer'

  return (
    <div
      className={cn(
        'fixed z-50',
        'bottom-0 left-0 right-0',
        'sm:bottom-4 sm:right-4 sm:left-auto sm:max-w-sm',
      )}
      role="dialog"
      aria-label="Cookie-Einstellungen"
      aria-live="polite"
    >
      <div
        className={cn(
          'bg-foreground text-background',
          'p-5 shadow-lg',
          'rounded-t-lg',
          'sm:rounded-lg',
        )}
      >
        {/* Schließen-Button */}
        <button
          onClick={nurNotwendige}
          className="absolute top-3 right-3 text-background/60 hover:text-background transition-colors cursor-pointer"
          aria-label="Schließen"
        >
          <X className="h-4 w-4" />
        </button>

        <h3 className="text-base font-bold mb-2 pr-6">
          Diese Website verwendet Cookies
        </h3>

        <p className="text-xs text-background/80 mb-4 leading-relaxed">
          Wir nutzen Cookies, um dir das beste Erlebnis zu bieten. Einige Cookies
          sind notwendig für den Betrieb der Website. Du kannst selbst wählen,
          welche optionalen Cookies du zulassen möchtest.{' '}
          <Link
            href="/datenschutz"
            className="underline hover:text-background transition-colors"
          >
            Datenschutz
          </Link>
        </p>

        {/* Erweiterte Ansicht mit Kategorie-Toggles */}
        {erweitert && (
          <div className="mb-4 space-y-2">
            {/* Notwendig — immer aktiv */}
            <label className="flex items-start gap-3 py-2">
              <input
                type="checkbox"
                checked
                disabled
                className="mt-0.5 h-4 w-4 rounded accent-primary opacity-60"
              />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold">Notwendig</span>
                <p className="text-xs text-background/60 leading-snug">
                  Für den Betrieb der Website erforderlich. Immer aktiv.
                </p>
              </div>
            </label>

            {COOKIE_KATEGORIEN.map((kategorie) => (
              <label
                key={kategorie}
                className="flex items-start gap-3 py-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={kategorien[kategorie]}
                  onChange={() => toggleKategorie(kategorie)}
                  className="mt-0.5 h-4 w-4 rounded accent-primary"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold">
                    {KATEGORIE_LABELS[kategorie]}
                  </span>
                  <p className="text-xs text-background/60 leading-snug">
                    {KATEGORIE_BESCHREIBUNGEN[kategorie]}
                  </p>
                </div>
              </label>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2">
          {erweitert ? (
            <>
              <button onClick={auswahlSpeichern} className={btnPrimary}>
                Auswahl speichern
              </button>
              <button onClick={alleAkzeptieren} className={btnOutline}>
                Alle akzeptieren
              </button>
            </>
          ) : (
            <>
              <button onClick={alleAkzeptieren} className={btnPrimary}>
                Alle akzeptieren
              </button>
              <button onClick={() => setErweitert(true)} className={btnOutline}>
                Anpassen
              </button>
              <button
                onClick={nurNotwendige}
                className="text-xs text-background/60 hover:text-background transition-colors py-1 cursor-pointer"
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
