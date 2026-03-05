import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Resend } from 'resend'
import { angebotAnfrageSchema } from '@reenyman/payload-plugins/kundenangebot/angebot-anfrage-schema'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const daten = angebotAnfrageSchema.parse(body)

    // Empfänger-E-Mail aus CMS holen
    const payload = await getPayload({ config })
    const angebot = await payload.findGlobal({ slug: 'kundenangebot' })
    const kontakt = angebot.kontakt as Record<string, unknown> | undefined
    const empfaengerEmail = (kontakt?.empfaengerEmail as string) || (kontakt?.email as string)

    if (!empfaengerEmail) {
      return NextResponse.json(
        { error: 'Keine Empfänger-E-Mail konfiguriert.' },
        { status: 500 }
      )
    }

    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      console.error('RESEND_API_KEY nicht gesetzt')
      return NextResponse.json(
        { error: 'E-Mail-Service nicht konfiguriert.' },
        { status: 500 }
      )
    }

    const resend = new Resend(resendApiKey)

    const adresseTeile = [daten.strasse, [daten.plz, daten.ort].filter(Boolean).join(' ')].filter(Boolean)
    const adresse = adresseTeile.length > 0 ? adresseTeile.join(', ') : 'Nicht angegeben'

    await resend.emails.send({
      from: 'Angebotsanfrage <onboarding@resend.dev>',
      to: empfaengerEmail,
      subject: `Angebotsanfrage von ${daten.vorname} ${daten.nachname}`,
      html: `
        <h2>Neue Angebotsanfrage</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px;">
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Gewählte Option</td><td style="padding:8px;border-bottom:1px solid #eee;">${daten.gewaehlteOption}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Name</td><td style="padding:8px;border-bottom:1px solid #eee;">${daten.vorname} ${daten.nachname}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Firma</td><td style="padding:8px;border-bottom:1px solid #eee;">${daten.firma || 'Nicht angegeben'}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">E-Mail</td><td style="padding:8px;border-bottom:1px solid #eee;">${daten.email}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Telefon</td><td style="padding:8px;border-bottom:1px solid #eee;">${daten.telefon}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Adresse</td><td style="padding:8px;border-bottom:1px solid #eee;">${adresse}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Nachricht</td><td style="padding:8px;border-bottom:1px solid #eee;">${daten.nachricht || 'Keine Nachricht'}</td></tr>
        </table>
      `,
    })

    return NextResponse.json({ erfolg: true })
  } catch (error) {
    console.error('Angebotsanfrage-Fehler:', error)
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Ungültige Formulardaten.' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Fehler beim Versenden.' }, { status: 500 })
  }
}
