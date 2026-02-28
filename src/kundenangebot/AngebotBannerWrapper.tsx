import { getPayload } from 'payload'
import type { SanitizedConfig } from 'payload'
import { AngebotBanner } from './AngebotBanner'

/** Server Component — Config wird vom Hostprojekt als Prop übergeben */
export async function AngebotBannerWrapper({ config }: { config: Promise<SanitizedConfig> }) {
  const payload = await getPayload({ config })
  const angebot = await payload.findGlobal({ slug: 'kundenangebot' })

  if (!angebot?.aktiv) return null

  return <AngebotBanner text={angebot.bannerText || 'Hier geht es zu deinem individuellen Website-Angebot'} />
}
