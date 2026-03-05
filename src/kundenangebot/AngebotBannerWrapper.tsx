import { getPayload } from 'payload'
import config from '@payload-config'
import { AngebotBanner } from './AngebotBanner'

export async function AngebotBannerWrapper() {
  const payload = await getPayload({ config })
  const angebot = await payload.findGlobal({ slug: 'kundenangebot' })

  if (!angebot?.aktiv) return null

  return <AngebotBanner text={angebot.bannerText || 'Hier geht es zu deinem individuellen Website-Angebot'} />
}
