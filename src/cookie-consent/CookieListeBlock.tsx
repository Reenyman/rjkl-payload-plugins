import { getPayload } from 'payload'
import type { SanitizedConfig } from 'payload'
import { cn } from './utils'

type Cookie = {
  id: number | string
  name: string
  anbieter?: string | null
  kategorie: 'notwendig' | 'funktional' | 'statistik' | 'marketing'
  beschreibung?: string | null
  speicherdauer?: string | null
}

type CookieListeBlockProps = {
  config: SanitizedConfig | Promise<SanitizedConfig>
  block: {
    blockType: string
    ueberschrift?: string
    beschreibungstext?: string
    [key: string]: unknown
  }
}

const KATEGORIE_REIHENFOLGE = ['notwendig', 'funktional', 'statistik', 'marketing'] as const

const KATEGORIE_LABELS: Record<string, string> = {
  notwendig: 'Notwendig',
  funktional: 'Funktional',
  statistik: 'Statistik',
  marketing: 'Marketing',
}

const KATEGORIE_FARBEN: Record<string, string> = {
  notwendig: 'bg-green-100 text-green-800',
  funktional: 'bg-blue-100 text-blue-800',
  statistik: 'bg-amber-100 text-amber-800',
  marketing: 'bg-purple-100 text-purple-800',
}

export async function CookieListeBlock({ config, block }: CookieListeBlockProps) {
  const payload = await getPayload({ config })
  const ergebnis = await payload.find({
    collection: 'cookies',
    where: { aktiv: { equals: true } },
    limit: 100,
    sort: 'name',
  })

  const cookies = ergebnis.docs as Cookie[]

  // Nach Kategorie gruppieren
  const gruppiert = KATEGORIE_REIHENFOLGE.reduce(
    (acc, kat) => {
      const items = cookies.filter((c) => c.kategorie === kat)
      if (items.length > 0) acc[kat] = items
      return acc
    },
    {} as Record<string, Cookie[]>,
  )

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {block.ueberschrift && (
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-foreground mb-4">
            {block.ueberschrift}
          </h2>
        )}

        {block.beschreibungstext && (
          <p className="text-muted-foreground mb-8 leading-relaxed max-w-2xl">
            {block.beschreibungstext}
          </p>
        )}

        {cookies.length === 0 ? (
          <p className="text-muted-foreground">
            Aktuell sind keine Cookies konfiguriert.
          </p>
        ) : (
          <div className="space-y-8">
            {Object.entries(gruppiert).map(([kategorie, items]) => (
              <div key={kategorie}>
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span
                    className={cn(
                      'inline-block text-xs font-medium px-2 py-0.5 rounded-full',
                      KATEGORIE_FARBEN[kategorie],
                    )}
                  >
                    {KATEGORIE_LABELS[kategorie]}
                  </span>
                  {kategorie === 'notwendig' && (
                    <span className="text-xs font-normal text-muted-foreground">
                      — immer aktiv
                    </span>
                  )}
                </h3>

                {/* Desktop: Tabelle */}
                <div className="hidden md:block border border-border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left font-semibold px-4 py-2.5 text-foreground">Name</th>
                        <th className="text-left font-semibold px-4 py-2.5 text-foreground">Anbieter</th>
                        <th className="text-left font-semibold px-4 py-2.5 text-foreground">Beschreibung</th>
                        <th className="text-left font-semibold px-4 py-2.5 text-foreground">Speicherdauer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((cookie, i) => (
                        <tr
                          key={cookie.id}
                          className={cn(
                            'border-t border-border',
                            i % 2 === 1 && 'bg-muted/20',
                          )}
                        >
                          <td className="px-4 py-2.5 font-medium text-foreground">{cookie.name}</td>
                          <td className="px-4 py-2.5 text-muted-foreground">{cookie.anbieter || '—'}</td>
                          <td className="px-4 py-2.5 text-muted-foreground">{cookie.beschreibung || '—'}</td>
                          <td className="px-4 py-2.5 text-muted-foreground whitespace-nowrap">{cookie.speicherdauer || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile: Cards */}
                <div className="md:hidden space-y-3">
                  {items.map((cookie) => (
                    <div
                      key={cookie.id}
                      className="border border-border rounded-lg p-4 bg-background"
                    >
                      <p className="font-semibold text-foreground text-sm mb-1">{cookie.name}</p>
                      {cookie.anbieter && (
                        <p className="text-xs text-muted-foreground mb-2">{cookie.anbieter}</p>
                      )}
                      {cookie.beschreibung && (
                        <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                          {cookie.beschreibung}
                        </p>
                      )}
                      {cookie.speicherdauer && (
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium">Speicherdauer:</span> {cookie.speicherdauer}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
