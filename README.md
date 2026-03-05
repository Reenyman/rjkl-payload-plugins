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

## Installation

npm install @reenyman/payload-plugins

Voraussetzung: .npmrc mit GitHub Packages Registry konfiguriert.

## Einrichtung

### 1. Plugins registrieren (payload.config.ts)
### 2. App-Router-Seiten kopieren:
  templates/angebot/         -> src/app/angebot/
  templates/angebot-anfrage/  -> src/app/api/angebot-anfrage/
  templates/staging-login/    -> src/app/staging-login/
### 3. AngebotBannerWrapper im Layout einbinden
### 4. Middleware einrichten
### 5. Env-Vars: STAGING_GATE, RESEND_API_KEY
### 6. Dependencies: npm install react-hook-form @hookform/resolvers zod resend

## Next.js-Konfiguration
transpilePackages: ["@reenyman/payload-plugins"]

## Breaking Changes (v1 -> v2)
- pakete.preis aufgeteilt in pakete.preisEinmalig und pakete.preisMonatlich
- Neues Feld monatspreis (Gruppe) in der Global-Config
- Neues Feld kontakt.empfaengerEmail
- Neue Template-Datei templates/angebot-anfrage/route.ts
