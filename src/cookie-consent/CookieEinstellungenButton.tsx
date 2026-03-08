'use client'

import { resetConsent } from './cookie-consent'

export function CookieEinstellungenButton() {
  return (
    <button
      onClick={resetConsent}
      className="hover:text-background/60 transition-colors cursor-pointer"
    >
      Cookie-Einstellungen
    </button>
  )
}
