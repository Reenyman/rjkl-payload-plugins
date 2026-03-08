// Cookie-Consent-Hilfsfunktionen
// Granulares Kategorie-System (funktional / statistik / marketing)
// Notwendige Cookies sind immer aktiv und werden nicht gespeichert

export type CookieKategorie = 'funktional' | 'statistik' | 'marketing'

export type ConsentDaten = {
  kategorien: Record<CookieKategorie, boolean>
  timestamp: number
}

// Abwärtskompatibilität
export type ConsentWert = 'accepted' | 'necessary'

const CONSENT_KEY = 'cookie-consent'
const TIMESTAMP_KEY = 'cookie-consent-timestamp'

// Consent-Ablauf: 12 Monate in Millisekunden
const CONSENT_ABLAUF_MS = 365 * 24 * 60 * 60 * 1000

export const COOKIE_KATEGORIEN: CookieKategorie[] = ['funktional', 'statistik', 'marketing']

export const KATEGORIE_LABELS: Record<CookieKategorie, string> = {
  funktional: 'Funktional',
  statistik: 'Statistik',
  marketing: 'Marketing',
}

export const KATEGORIE_BESCHREIBUNGEN: Record<CookieKategorie, string> = {
  funktional: 'Ermöglicht erweiterte Funktionen wie Karten oder eingebettete Inhalte.',
  statistik: 'Hilft uns zu verstehen, wie Besucher die Website nutzen.',
  marketing: 'Wird für personalisierte Werbung und Analyse verwendet.',
}

/**
 * Migriert das alte String-Format ("accepted" / "necessary") zum neuen JSON-Format.
 */
function migriereLegacyFormat(): ConsentDaten | null {
  if (typeof window === 'undefined') return null

  const altWert = localStorage.getItem(CONSENT_KEY)
  if (!altWert || altWert.startsWith('{')) return null

  const timestamp = localStorage.getItem(TIMESTAMP_KEY)
  const ts = timestamp ? Number(timestamp) : Date.now()

  // Prüfe Ablauf
  if (Date.now() - ts > CONSENT_ABLAUF_MS) {
    localStorage.removeItem(CONSENT_KEY)
    localStorage.removeItem(TIMESTAMP_KEY)
    return null
  }

  // "accepted" → alle Kategorien an, "necessary" → alle aus
  const alleAn = altWert === 'accepted'
  const daten: ConsentDaten = {
    kategorien: {
      funktional: alleAn,
      statistik: alleAn,
      marketing: alleAn,
    },
    timestamp: ts,
  }

  // Speichere im neuen Format
  localStorage.setItem(CONSENT_KEY, JSON.stringify(daten))
  localStorage.removeItem(TIMESTAMP_KEY)

  return daten
}

/**
 * Liest die aktuellen Consent-Daten aus dem localStorage.
 * Migriert automatisch das alte String-Format.
 * Gibt `null` zurück wenn kein Consent gesetzt oder abgelaufen.
 */
export function getConsentDaten(): ConsentDaten | null {
  if (typeof window === 'undefined') return null

  const raw = localStorage.getItem(CONSENT_KEY)
  if (!raw) return null

  // Legacy-Format migrieren
  if (!raw.startsWith('{')) {
    return migriereLegacyFormat()
  }

  try {
    const daten = JSON.parse(raw) as ConsentDaten
    if (Date.now() - daten.timestamp > CONSENT_ABLAUF_MS) {
      localStorage.removeItem(CONSENT_KEY)
      return null
    }
    return daten
  } catch {
    localStorage.removeItem(CONSENT_KEY)
    return null
  }
}

/**
 * Speichert Consent-Daten als JSON und feuert ein Custom-Event.
 */
export function setConsentDaten(kategorien: Record<CookieKategorie, boolean>): void {
  if (typeof window === 'undefined') return

  const daten: ConsentDaten = {
    kategorien,
    timestamp: Date.now(),
  }
  localStorage.setItem(CONSENT_KEY, JSON.stringify(daten))

  window.dispatchEvent(
    new CustomEvent('cookie-consent-geaendert', { detail: { kategorien } }),
  )
}

/**
 * Prüft ob eine bestimmte Kategorie Consent hat.
 */
export function hatKategorieConsent(kategorie: CookieKategorie): boolean {
  const daten = getConsentDaten()
  if (!daten) return false
  return daten.kategorien[kategorie] === true
}

/**
 * Löscht den Consent und feuert das Zurücksetzen-Event.
 */
export function resetConsent(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(CONSENT_KEY)
  localStorage.removeItem(TIMESTAMP_KEY)
  window.dispatchEvent(new CustomEvent('cookie-consent-zuruecksetzen'))
}

// ============================================================
// Abwärtskompatible Wrapper
// ============================================================

/**
 * @deprecated Nutze getConsentDaten() stattdessen
 */
export function getCookieConsent(): ConsentWert | null {
  const daten = getConsentDaten()
  if (!daten) return null
  const alleAn = COOKIE_KATEGORIEN.every((k) => daten.kategorien[k])
  return alleAn ? 'accepted' : 'necessary'
}

/**
 * @deprecated Nutze setConsentDaten() stattdessen
 */
export function setCookieConsent(wert: ConsentWert): void {
  const alleAn = wert === 'accepted'
  setConsentDaten({
    funktional: alleAn,
    statistik: alleAn,
    marketing: alleAn,
  })
}

/**
 * @deprecated Nutze hatKategorieConsent('statistik') stattdessen
 */
export function hatAnalyticsConsent(): boolean {
  return hatKategorieConsent('statistik')
}

/**
 * @deprecated Nutze hatKategorieConsent('marketing') stattdessen
 */
export function hatMarketingConsent(): boolean {
  return hatKategorieConsent('marketing')
}
