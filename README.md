# @reenyman/payload-plugins

Wiederverwendbare Payload CMS Plugins fuer RJKL-Projekte.

## Plugins

### Kundenangebot
Individuelle Angebotsseite mit Leistungen, Paketen, Zahlungsmodell-Wahl (Einmalzahlung/Monatlich), Anfrageformular und Kontaktdaten. Inklusive Banner-Komponente, die ab dem zweiten Seitenaufruf erscheint.

**Neue Features in v2.0:**
- Zahlungsmodell-Toggle (Einmalzahlung / Monatlich zahlen)
- Pakete mit separaten Preisen je Zahlungsmodell
- Monatspreis-Feld mit Originalpreis und Gesamtberechnung
- Integriertes Anfrageformular (react-hook-form + Zod-Validierung)
- E-Mail-Versand via Resend API
- Empfaenger-E-Mail fuer Anfragen konfigurierbar

### Staging-Gate
Passwortschutz fuer Staging-Umgebungen.

### Cookie-Consent (NEU in v3.0)
DSGVO-konformes Cookie-Management mit granularem Kategorie-System.

**Features:**
- **Cookies Collection** — Verwaltung aller Cookies/Dienste im CMS (Name, Anbieter, Kategorie, Beschreibung, Speicherdauer)
- **CookieBanner** — Client-Komponente mit 3 Modi: Einfach, Erweitert (Kategorie-Toggles), Nach Reset
- **CookieListeBlock** — Server-Komponente: Gruppierte Tabelle aller aktiven Cookies (fuer Datenschutzseite)
- **CookieEinstellungenButton** — Button zum Neustarten des Banners (fuer Footer)
- **cookie-consent Utility** — localStorage-basiert, Custom Events, automatische Legacy-Migration
- **4 Kategorien**: Notwendig (immer aktiv), Funktional, Statistik, Marketing
- **Consent-Ablauf**: 12 Monate
- **Consent-Gating**: `hatKategorieConsent('funktional')` fuer bedingte Inhalte (Maps, Iframes etc.)

## Installation

npm install @reenyman/payload-plugins

Voraussetzung: .npmrc mit GitHub Packages Registry konfiguriert.

## Einrichtung

### 1. Plugins registrieren (payload.config.ts)

```typescript
import { cookieConsentPlugin } from '@reenyman/payload-plugins/cookie-consent'

export default buildConfig({
  plugins: [
    cookieConsentPlugin(),
    // ... weitere Plugins
  ],
})
```

### 2. App-Router-Seiten kopieren:
  templates/angebot/         -> src/app/angebot/
  templates/angebot-anfrage/  -> src/app/api/angebot-anfrage/
  templates/staging-login/    -> src/app/staging-login/

### 3. Cookie-Banner im Layout einbinden

```typescript
// src/app/(frontend)/layout.tsx
import { CookieBanner } from '@reenyman/payload-plugins/cookie-consent/CookieBanner'

// Im <html> Tag: data-cookie-banner={String(cookieBannerAktiv)}
// Im Body:
{cookieBannerAktiv && <CookieBanner />}
```

### 4. CookieEinstellungenButton im Footer

```typescript
import { CookieEinstellungenButton } from '@reenyman/payload-plugins/cookie-consent/CookieEinstellungenButton'

// Im Footer-Bereich:
<CookieEinstellungenButton />
```

### 5. CookieListe-Block registrieren

```typescript
// src/blocks/ oder direkt in Pages.ts:
import { CookieListe } from '@reenyman/payload-plugins/cookie-consent/block'

// In der Pages-Collection unter blocks:
blocks: [CookieListe, /* ... */]

// Im BlockRenderer:
import { CookieListeBlock } from '@reenyman/payload-plugins/cookie-consent/CookieListeBlock'
blockComponents['cookieListe'] = CookieListeBlock
```

### 6. Consent-Gating in eigenen Komponenten

```typescript
import { hatKategorieConsent } from '@reenyman/payload-plugins/cookie-consent/cookie-consent'

// Pruefen ob funktionale Cookies erlaubt sind
if (hatKategorieConsent('funktional')) {
  // Google Maps, Iframes etc. laden
}
```

### 7. AngebotBannerWrapper im Layout einbinden
### 8. Middleware einrichten
### 9. Env-Vars: STAGING_GATE, RESEND_API_KEY
### 10. Dependencies: npm install react-hook-form @hookform/resolvers zod resend clsx tailwind-merge lucide-react

## Next.js-Konfiguration
transpilePackages: ["@reenyman/payload-plugins"]

## Breaking Changes (v2 -> v3)
- Neues Plugin: cookie-consent
- Neue peerDependencies: clsx, tailwind-merge, lucide-react

## Breaking Changes (v1 -> v2)
- pakete.preis aufgeteilt in pakete.preisEinmalig und pakete.preisMonatlich
- Neues Feld monatspreis (Gruppe) in der Global-Config
- Neues Feld kontakt.empfaengerEmail
- Neue Template-Datei templates/angebot-anfrage/route.ts
