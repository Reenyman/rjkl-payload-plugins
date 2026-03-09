import { getPayload } from 'payload'
import type { SanitizedConfig } from 'payload'
import { NextResponse } from 'next/server'

/**
 * Factory für die Staging-Tracking API-Route.
 *
 * Nutzung im Hostprojekt:
 * ```ts
 * // src/app/(frontend)/api/staging-track/route.ts
 * import { erstelleTrackingRoute } from '@reenyman/payload-plugins/staging-gate/tracking-route'
 * import config from '@payload-config'
 * export const { POST } = erstelleTrackingRoute(config)
 * ```
 */
export function erstelleTrackingRoute(config: Promise<SanitizedConfig>) {
  async function POST(request: Request): Promise<NextResponse> {
    try {
      // 1. JSON-Body parsen, Token extrahieren
      const body = await request.json()
      const { token } = body

      // 2. Token validieren
      if (!token || typeof token !== 'string') {
        return NextResponse.json(
          { fehler: 'Token fehlt oder ist ungültig.' },
          { status: 400 },
        )
      }

      // 3. Payload-Instanz holen, staging-gate Global lesen
      const payload = await getPayload({ config })
      const stagingGate = await payload.findGlobal({ slug: 'staging-gate' })

      const vorschauLinks = (stagingGate.vorschauLinks ?? []) as Array<{
        name: string
        token: string
        aktiv: boolean
        nutzungen: number
        letzterZugriff?: string
        erstelltAm?: string
        id?: string
      }>

      // 4. Link anhand des Tokens finden
      const linkIndex = vorschauLinks.findIndex((link) => link.token === token)

      // 5. 404 wenn Token nicht gefunden
      if (linkIndex === -1) {
        return NextResponse.json(
          { fehler: 'Token nicht gefunden.' },
          { status: 404 },
        )
      }

      const link = vorschauLinks[linkIndex]

      // 6. Prüfen ob Link aktiv ist
      if (!link.aktiv) {
        return NextResponse.json(
          { fehler: 'Dieser Vorschau-Link ist deaktiviert.' },
          { status: 403 },
        )
      }

      // 7. Nutzungen um 1 erhöhen
      // 8. Letzten Zugriff auf aktuelles Datum setzen
      const aktualisierteLinks = [...vorschauLinks]
      aktualisierteLinks[linkIndex] = {
        ...link,
        nutzungen: (link.nutzungen ?? 0) + 1,
        letzterZugriff: new Date().toISOString(),
      }

      // 9. Global mit aktualisierten Links speichern
      await payload.updateGlobal({
        slug: 'staging-gate',
        data: { vorschauLinks: aktualisierteLinks } as Record<string, unknown>,
      })

      // 10. Erfolg zurückgeben
      return NextResponse.json({ erfolg: true })
    } catch (error) {
      // 11. Fehlerbehandlung
      console.error('[Staging-Tracking] Fehler:', error)
      return NextResponse.json(
        { fehler: 'Interner Serverfehler.' },
        { status: 500 },
      )
    }
  }

  return { POST }
}
