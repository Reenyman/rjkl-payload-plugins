import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { erstelleStagingActions } from '@rjkl/payload-plugins/staging-gate/actions'
import { StagingLoginSeite } from '@rjkl/payload-plugins/staging-gate/StagingLoginSeite'

export const dynamic = 'force-dynamic'

const { stagingLogin } = erstelleStagingActions(config)

export default async function StagingLoginPage() {
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'staging-gate' })

  const typedSettings = settings as unknown as Record<string, unknown>

  // Wenn Staging-Schutz nicht aktiv → zur Startseite
  if (!typedSettings.aktiv) {
    redirect('/')
  }

  // Wenn bereits eingeloggt → zur Startseite
  const cookieStore = await cookies()
  const token = cookieStore.get('staging-token')
  if (token?.value) {
    redirect('/')
  }

  // Entwickler-Logo aufbereiten
  const logo = typedSettings.entwicklerLogo as { url?: string; alt?: string } | null

  return (
    <StagingLoginSeite
      settings={{
        kundenname: typedSettings.kundenname as string | undefined,
        einleitungstext: typedSettings.einleitungstext as string | undefined,
        entwicklerName: typedSettings.entwicklerName as string | undefined,
        entwicklerLogo: logo?.url ? { url: logo.url, alt: logo.alt } : null,
        entwicklerUrl: typedSettings.entwicklerUrl as string | undefined,
        impressumUrl: typedSettings.impressumUrl as string | undefined,
        datenschutzUrl: typedSettings.datenschutzUrl as string | undefined,
      }}
      loginAction={stagingLogin}
    />
  )
}
