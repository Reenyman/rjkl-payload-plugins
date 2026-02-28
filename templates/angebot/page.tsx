import { getPayload } from 'payload'
import config from '@payload-config'
import { redirect } from 'next/navigation'
import { AngebotSeite } from '@rjkl/payload-plugins/kundenangebot/AngebotSeite'

export const dynamic = 'force-dynamic'

export default async function AngebotPage() {
  const payload = await getPayload({ config })
  const angebot = await payload.findGlobal({ slug: 'kundenangebot' })

  if (!angebot?.aktiv) {
    redirect('/')
  }

  // Logo-URL auflösen
  let logoUrl: string | null = null
  if (angebot.logo && typeof angebot.logo === 'object' && 'url' in angebot.logo) {
    logoUrl = angebot.logo.url || null
  }

  // Profilbild-URL auflösen
  let profilbildUrl: string | null = null
  const anspracheRaw = angebot.persoenlicheAnsprache as Record<string, unknown> | undefined
  if (anspracheRaw?.profilbild && typeof anspracheRaw.profilbild === 'object' && anspracheRaw.profilbild !== null && 'url' in (anspracheRaw.profilbild as Record<string, unknown>)) {
    profilbildUrl = (anspracheRaw.profilbild as Record<string, unknown>).url as string || null
  }

  // Leistungen aufbereiten
  const leistungen = (angebot.leistungsbeschreibung as Record<string, unknown>)?.leistungen as
    | { titel: string; beschreibung?: string | null }[]
    | undefined

  // Pakete aufbereiten
  const pakete = (angebot.pakete as {
    name: string
    preis: string
    beschreibung?: string | null
    features?: { feature: string }[]
    hervorgehoben?: boolean
  }[]) || []

  // Nächste Schritte aufbereiten
  const naechsteSchritteRaw = angebot.naechsteSchritte as Record<string, unknown> | undefined
  const naechsteSchritte = naechsteSchritteRaw ? {
    ueberschrift: naechsteSchritteRaw.ueberschrift as string | null,
    einleitung: naechsteSchritteRaw.einleitung as string | null,
    schritte: (naechsteSchritteRaw.schritte as { titel: string; beschreibung?: string | null }[]) || [],
  } : undefined

  // Kontakt aufbereiten
  const kontaktRaw = angebot.kontakt as Record<string, unknown> | undefined

  const daten = {
    kundenname: angebot.kundenname,
    logoUrl,
    persoenlicheAnsprache: {
      profilbildUrl,
      text: anspracheRaw?.text as string | null,
    },
    leistungsbeschreibung: {
      ueberschrift: (angebot.leistungsbeschreibung as Record<string, unknown>)?.ueberschrift as string | null,
      einleitung: (angebot.leistungsbeschreibung as Record<string, unknown>)?.einleitung as string | null,
      leistungen: leistungen || [],
    },
    designBeschreibung: {
      ueberschrift: (angebot.designBeschreibung as Record<string, unknown>)?.ueberschrift as string | null,
      text: (angebot.designBeschreibung as Record<string, unknown>)?.text as string | null,
    },
    naechsteSchritte,
    einmalpreis: {
      betrag: (angebot.einmalpreis as Record<string, unknown>)?.betrag as number | null,
      originalpreis: (angebot.einmalpreis as Record<string, unknown>)?.originalpreis as number | null,
      beschreibung: (angebot.einmalpreis as Record<string, unknown>)?.beschreibung as string | null,
    },
    pakete,
    kontakt: kontaktRaw ? {
      name: kontaktRaw.name as string | null,
      email: kontaktRaw.email as string | null,
      telefon: kontaktRaw.telefon as string | null,
      website: kontaktRaw.website as string | null,
      abschlussText: kontaktRaw.abschlussText as string | null,
    } : undefined,
    akzentfarbe: angebot.akzentfarbe,
  }

  return <AngebotSeite daten={daten} />
}
