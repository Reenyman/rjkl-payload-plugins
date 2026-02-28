'use client'

import { useActionState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface StagingSettings {
  kundenname?: string
  einleitungstext?: string
  entwicklerName?: string
  entwicklerLogo?: { url: string; alt?: string } | null
  entwicklerUrl?: string
  impressumUrl?: string
  datenschutzUrl?: string
}

export function StagingLoginSeite({
  settings,
  loginAction,
}: {
  settings: StagingSettings
  loginAction: (formData: FormData) => Promise<{ erfolg: boolean; fehler?: string }>
}) {
  async function action(
    _vorher: { erfolg: boolean; fehler?: string },
    formData: FormData,
  ): Promise<{ erfolg: boolean; fehler?: string }> {
    return loginAction(formData)
  }

  const [zustand, formAction, istPending] = useActionState(action, {
    erfolg: false,
  })

  const router = useRouter()

  useEffect(() => {
    if (zustand.erfolg) {
      router.push('/')
    }
  }, [zustand.erfolg, router])

  const entwicklerName = settings.entwicklerName || 'RJKL'

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '1rem',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
          padding: '2.5rem 2rem',
          maxWidth: '420px',
          width: '100%',
        }}
      >
        {/* Entwickler-Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          {settings.entwicklerLogo?.url ? (
            <Image
              src={settings.entwicklerLogo.url}
              alt={settings.entwicklerLogo.alt || 'Entwickler-Logo'}
              width={280}
              height={90}
              style={{ objectFit: 'contain', height: '90px', width: 'auto' }}
            />
          ) : (
            <span
              style={{
                fontSize: '0.75rem',
                color: '#999',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              Website-Vorschau
            </span>
          )}
        </div>

        {/* Kundenname */}
        {settings.kundenname && (
          <h1
            style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              textAlign: 'center',
              margin: '0 0 0.5rem',
              color: '#111',
            }}
          >
            {settings.kundenname}
          </h1>
        )}

        {/* Einleitungstext */}
        {settings.einleitungstext && (
          <p
            style={{
              fontSize: '0.9rem',
              color: '#555',
              textAlign: 'center',
              margin: '0 0 1.5rem',
              lineHeight: 1.5,
            }}
          >
            {settings.einleitungstext}
          </p>
        )}

        {/* Formular */}
        <form action={formAction}>
          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="benutzername"
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 500,
                color: '#333',
                marginBottom: '0.25rem',
              }}
            >
              Benutzername
            </label>
            <input
              id="benutzername"
              name="benutzername"
              type="text"
              required
              autoComplete="username"
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '0.95rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label
              htmlFor="passwort"
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 500,
                color: '#333',
                marginBottom: '0.25rem',
              }}
            >
              Passwort
            </label>
            <input
              id="passwort"
              name="passwort"
              type="password"
              required
              autoComplete="current-password"
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '0.95rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Fehlermeldung */}
          {zustand.fehler && (
            <p
              style={{
                color: '#dc2626',
                fontSize: '0.85rem',
                margin: '0 0 1rem',
                textAlign: 'center',
              }}
            >
              {zustand.fehler}
            </p>
          )}

          <button
            type="submit"
            disabled={istPending}
            style={{
              width: '100%',
              padding: '0.7rem',
              background: istPending ? '#999' : '#111',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.95rem',
              fontWeight: 500,
              cursor: istPending ? 'not-allowed' : 'pointer',
            }}
          >
            {istPending ? 'Wird geprüft...' : 'Einloggen'}
          </button>
        </form>
      </div>

      {/* Footer */}
      <footer
        style={{
          marginTop: '2rem',
          fontSize: '0.8rem',
          color: '#999',
          textAlign: 'center',
        }}
      >
        {settings.entwicklerUrl && (
          <>
            Entwickelt von{' '}
            <a
              href={settings.entwicklerUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#666', textDecoration: 'underline' }}
            >
              {entwicklerName}
            </a>
          </>
        )}
        {settings.impressumUrl && (
          <>
            {' · '}
            <a
              href={settings.impressumUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#666', textDecoration: 'underline' }}
            >
              Impressum
            </a>
          </>
        )}
        {settings.datenschutzUrl && (
          <>
            {' · '}
            <a
              href={settings.datenschutzUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#666', textDecoration: 'underline' }}
            >
              Datenschutz
            </a>
          </>
        )}
      </footer>
    </div>
  )
}
