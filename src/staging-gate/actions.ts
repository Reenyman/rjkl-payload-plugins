import { cookies } from 'next/headers'
import { createHmac } from 'crypto'
import { getPayload } from 'payload'
import type { SanitizedConfig } from 'payload'

const COOKIE_NAME = 'staging-token'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 Tage

/** Erzeugt HMAC-Token aus Benutzername und Passwort */
function erstelleToken(benutzername: string, passwort: string): string {
  const secret = process.env.PAYLOAD_SECRET || 'fallback-secret'
  return createHmac('sha256', secret).update(`${benutzername}:${passwort}`).digest('hex')
}

/** Factory: Erstellt Server Actions mit der übergebenen Payload-Config */
export function erstelleStagingActions(config: Promise<SanitizedConfig>) {
  async function stagingLogin(
    formData: FormData,
  ): Promise<{ erfolg: boolean; fehler?: string }> {
    'use server'

    const benutzername = formData.get('benutzername') as string
    const passwort = formData.get('passwort') as string

    if (!benutzername || !passwort) {
      return { erfolg: false, fehler: 'Bitte Benutzername und Passwort eingeben.' }
    }

    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'staging-gate' })

    const richtigerName = (settings as unknown as Record<string, unknown>).benutzername as string
    const richtigesPasswort = (settings as unknown as Record<string, unknown>).passwort as string

    if (benutzername !== richtigerName || passwort !== richtigesPasswort) {
      return { erfolg: false, fehler: 'Benutzername oder Passwort falsch.' }
    }

    const token = erstelleToken(richtigerName, richtigesPasswort)

    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: MAX_AGE,
      path: '/',
    })

    return { erfolg: true }
  }

  async function stagingLogout(): Promise<void> {
    'use server'

    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_NAME)
  }

  return { stagingLogin, stagingLogout }
}
