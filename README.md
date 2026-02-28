# @reenyman/payload-plugins

Wiederverwendbare Payload CMS Plugins für RJKL-Projekte.

## Plugins

### Kundenangebot
Individuelle Angebotsseite mit Leistungen, Paketen, Preisen und Kontaktdaten. Inklusive Banner-Komponente, die ab dem zweiten Seitenaufruf erscheint.

### Staging-Gate
Passwortschutz für Staging-Umgebungen. Kunden können sich mit einfachen Zugangsdaten einloggen, um die Website-Vorschau zu sehen.

## Installation

```bash
npm install @reenyman/payload-plugins
```

> Voraussetzung: `.npmrc` mit GitHub Packages Registry konfiguriert:
> ```
> @rjkl:registry=https://npm.pkg.github.com
> //npm.pkg.github.com/:_authToken=YOUR_TOKEN
> ```

## Einrichtung

### 1. Plugins registrieren

In `payload.config.ts`:

```ts
import { kundenangebotPlugin } from '@reenyman/payload-plugins/kundenangebot'
import { stagingGatePlugin } from '@reenyman/payload-plugins/staging-gate'

export default buildConfig({
  plugins: [
    kundenangebotPlugin(),
    stagingGatePlugin(),
  ],
  // ...
})
```

### 2. App-Router-Seiten kopieren

Die Seiten können nicht direkt aus npm kommen (Next.js App Router erfordert Dateien im Projekt). Kopiere die Vorlagen aus `templates/` in dein Projekt:

```
node_modules/@reenyman/payload-plugins/templates/angebot/     → src/app/angebot/
node_modules/@reenyman/payload-plugins/templates/staging-login/ → src/app/staging-login/
```

### 3. Angebot-Banner einbinden

Im Frontend-Layout (`src/app/(frontend)/layout.tsx`):

```tsx
import config from '@payload-config'
import { AngebotBannerWrapper } from '@reenyman/payload-plugins/kundenangebot/AngebotBannerWrapper'

// Im JSX:
<AngebotBannerWrapper config={config} />
```

### 4. Middleware einrichten

In `src/middleware.ts`:

```ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { withStagingGate } from '@reenyman/payload-plugins/staging-gate/middleware'

export function middleware(request: NextRequest) {
  const blocked = withStagingGate(request)
  if (blocked) return blocked

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

### 5. Umgebungsvariable

Staging-Schutz wird nur aktiv wenn:
```
STAGING_GATE=true
```

## Konfiguration im CMS

Nach der Installation erscheinen unter **Einstellungen** im Admin-Panel:
- **Kundenangebot** — Angebotsseite konfigurieren
- **Staging-Schutz** — Login-Daten und Texte verwalten

## Next.js-Konfiguration

Da das Paket TSX direkt exportiert (kein Build-Schritt), muss Next.js das Paket transpilieren. In `next.config.mjs`:

```js
const nextConfig = {
  transpilePackages: ['@reenyman/payload-plugins'],
  // ...
}
```
