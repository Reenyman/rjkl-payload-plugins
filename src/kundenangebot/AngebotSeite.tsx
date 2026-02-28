'use client'

interface Leistung {
  titel: string
  beschreibung?: string | null
}

interface Paket {
  name: string
  preis: string
  beschreibung?: string | null
  features?: { feature: string }[]
  hervorgehoben?: boolean
}

interface Schritt {
  titel: string
  beschreibung?: string | null
}

interface AngebotDaten {
  kundenname?: string | null
  logoUrl?: string | null
  persoenlicheAnsprache?: {
    profilbildUrl?: string | null
    text?: string | null
  }
  leistungsbeschreibung?: {
    ueberschrift?: string | null
    einleitung?: string | null
    leistungen?: Leistung[]
  }
  designBeschreibung?: {
    ueberschrift?: string | null
    text?: string | null
  }
  naechsteSchritte?: {
    ueberschrift?: string | null
    einleitung?: string | null
    schritte?: Schritt[]
  }
  einmalpreis?: {
    betrag?: number | null
    originalpreis?: number | null
    beschreibung?: string | null
  }
  pakete?: Paket[]
  kontakt?: {
    name?: string | null
    email?: string | null
    telefon?: string | null
    website?: string | null
    abschlussText?: string | null
  }
  akzentfarbe?: string | null
}

// Gemeinsame Styles als Konstanten
const schrift = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'

function SektionsTrenner() {
  return (
    <hr
      style={{
        border: 'none',
        borderTop: '1px solid #e5e5e5',
        margin: '64px 0',
      }}
    />
  )
}

// CSS-only Tooltip für Fachbegriffe — wrapped erkannte Begriffe in einen Span mit title-Attribut
function TextMitTooltips({ text }: { text: string }) {
  const fachbegriffe: Record<string, string> = {
    'SEO': 'Suchmaschinenoptimierung — damit deine Website bei Google gut gefunden wird',
    'SSL': 'Verschlüsselte Verbindung — das grüne Schloss im Browser',
    'CMS': 'Content-Management-System — damit du Inhalte selbst bearbeiten kannst',
    'Responsive': 'Die Website passt sich automatisch an Handy, Tablet und PC an',
  }

  // Regulären Ausdruck aus allen Fachbegriffen bauen
  const pattern = Object.keys(fachbegriffe).join('|')
  const regex = new RegExp(`(${pattern})`, 'g')
  const teile = text.split(regex)

  return (
    <>
      {teile.map((teil, i) =>
        fachbegriffe[teil] ? (
          <span
            key={i}
            title={fachbegriffe[teil]}
            style={{
              borderBottom: '1px dotted #999',
              cursor: 'help',
            }}
          >
            {teil}
          </span>
        ) : (
          <span key={i}>{teil}</span>
        ),
      )}
    </>
  )
}

export function AngebotSeite({ daten }: { daten: AngebotDaten }) {
  const akzent = daten.akzentfarbe || '#000000'

  return (
    <div
      style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '40px 24px 80px',
        fontFamily: schrift,
        color: '#1a1a1a',
        lineHeight: 1.7,
      }}
    >
      {/* Header — Entwickler-Logo */}
      {daten.logoUrl && (
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <img
            src={daten.logoUrl}
            alt="Logo"
            style={{ height: '48px' }}
          />
        </div>
      )}

      {/* Titel */}
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <p
          style={{
            fontSize: '13px',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.15em',
            color: '#999',
            marginBottom: '16px',
          }}
        >
          Individuelles Website-Angebot
        </p>
        <h1
          style={{
            fontSize: '36px',
            fontWeight: 700,
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          Angebot für {daten.kundenname || 'dich'}
        </h1>
      </div>

      {/* Persönliche Ansprache */}
      {daten.persoenlicheAnsprache?.text && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            maxWidth: '600px',
            margin: '-32px auto 48px',
            padding: '24px',
            backgroundColor: '#fafafa',
            borderRadius: '12px',
            border: '1px solid #e5e5e5',
          }}
        >
          {daten.persoenlicheAnsprache.profilbildUrl && (
            <img
              src={daten.persoenlicheAnsprache.profilbildUrl}
              alt="Profilbild"
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                objectFit: 'cover',
                flexShrink: 0,
              }}
            />
          )}
          <p
            style={{
              margin: 0,
              fontSize: '15px',
              color: '#555',
              fontStyle: 'italic',
              lineHeight: 1.6,
            }}
          >
            &ldquo;{daten.persoenlicheAnsprache.text}&rdquo;
          </p>
        </div>
      )}

      {/* Leistungsübersicht */}
      {daten.leistungsbeschreibung && (
        <>
          <SektionsTrenner />
          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>
              {daten.leistungsbeschreibung.ueberschrift || 'Was ich für dich umsetze'}
            </h2>
            {daten.leistungsbeschreibung.einleitung && (
              <p style={{ color: '#555', marginBottom: '32px' }}>
                {daten.leistungsbeschreibung.einleitung}
              </p>
            )}
            {daten.leistungsbeschreibung.leistungen && daten.leistungsbeschreibung.leistungen.length > 0 && (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {daten.leistungsbeschreibung.leistungen.map((l, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      marginBottom: '20px',
                      alignItems: 'flex-start',
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={akzent}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ flexShrink: 0, marginTop: '3px' }}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <div>
                      <strong style={{ display: 'block' }}>
                        <TextMitTooltips text={l.titel} />
                      </strong>
                      {l.beschreibung && (
                        <span style={{ color: '#666', fontSize: '14px' }}>
                          <TextMitTooltips text={l.beschreibung} />
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}

      {/* Design-Beschreibung */}
      {daten.designBeschreibung?.text && (
        <>
          <SektionsTrenner />
          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>
              {daten.designBeschreibung.ueberschrift || 'Dein individuelles Design'}
            </h2>
            <p style={{ color: '#555', whiteSpace: 'pre-line' }}>
              {daten.designBeschreibung.text}
            </p>
          </section>
        </>
      )}

      {/* Nächste Schritte */}
      {daten.naechsteSchritte?.schritte && daten.naechsteSchritte.schritte.length > 0 && (
        <>
          <SektionsTrenner />
          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>
              {daten.naechsteSchritte.ueberschrift || 'Die nächsten Schritte'}
            </h2>
            {daten.naechsteSchritte.einleitung && (
              <p style={{ color: '#555', marginBottom: '32px' }}>
                {daten.naechsteSchritte.einleitung}
              </p>
            )}
            <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {daten.naechsteSchritte.schritte.map((schritt, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    marginBottom: '24px',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: akzent,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '15px',
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div style={{ paddingTop: '6px' }}>
                    <strong style={{ display: 'block' }}>{schritt.titel}</strong>
                    {schritt.beschreibung && (
                      <span style={{ color: '#666', fontSize: '14px' }}>
                        {schritt.beschreibung}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </>
      )}

      {/* Einmalpreis mit Streichpreis */}
      {daten.einmalpreis?.betrag && (
        <>
          <SektionsTrenner />
          <section style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>
              Einmaliger Preis
            </h2>
            {daten.einmalpreis.originalpreis && daten.einmalpreis.originalpreis > daten.einmalpreis.betrag && (
              <div style={{ marginBottom: '8px' }}>
                <span
                  style={{
                    fontSize: '24px',
                    color: '#999',
                    textDecoration: 'line-through',
                  }}
                >
                  {daten.einmalpreis.originalpreis.toLocaleString('de-DE')} EUR
                </span>
              </div>
            )}
            <div
              style={{
                fontSize: '48px',
                fontWeight: 700,
                marginBottom: '12px',
                color: daten.einmalpreis.originalpreis ? '#16a34a' : undefined,
              }}
            >
              {daten.einmalpreis.betrag.toLocaleString('de-DE')} EUR
            </div>
            {daten.einmalpreis.originalpreis && daten.einmalpreis.originalpreis > daten.einmalpreis.betrag && (
              <div
                style={{
                  display: 'inline-block',
                  backgroundColor: '#dcfce7',
                  color: '#16a34a',
                  fontSize: '13px',
                  fontWeight: 600,
                  padding: '4px 14px',
                  borderRadius: '20px',
                  marginBottom: '16px',
                }}
              >
                Gründungsrabatt
              </div>
            )}
            {daten.einmalpreis.beschreibung && (
              <p style={{ color: '#666', maxWidth: '500px', margin: '0 auto', fontSize: '15px' }}>
                {daten.einmalpreis.beschreibung}
              </p>
            )}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                maxWidth: '500px',
                margin: '20px auto 0',
                padding: '12px 16px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                textAlign: 'left',
                fontSize: '14px',
                color: '#555',
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                style={{ flexShrink: 0 }}
              >
                <circle cx="12" cy="12" r="12" fill="#16a34a" />
                <line x1="7" y1="12" x2="17" y2="12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="12" y1="7" x2="12" y2="17" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <span>
                2 Stunden Einarbeitung in dein CMS (Content-Management-System) — vor Ort oder per Videocall — sind im Preis inklusive.
              </span>
            </div>
          </section>
        </>
      )}

      {/* Pakete */}
      {daten.pakete && daten.pakete.length > 0 && (
        <>
          <SektionsTrenner />
          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '32px', textAlign: 'center' }}>
              Wähle dein Paket
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${Math.min(daten.pakete.length, 3)}, 1fr)`,
                gap: '20px',
              }}
            >
              {daten.pakete.map((paket, i) => (
                <div
                  key={i}
                  style={{
                    border: paket.hervorgehoben ? `2px solid ${akzent}` : '1px solid #e5e5e5',
                    borderRadius: '12px',
                    padding: '28px 24px',
                    position: 'relative' as const,
                    backgroundColor: paket.hervorgehoben ? '#fafafa' : '#fff',
                  }}
                >
                  {paket.hervorgehoben && (
                    <div
                      style={{
                        position: 'absolute' as const,
                        top: '-12px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: akzent,
                        color: '#fff',
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '3px 14px',
                        borderRadius: '20px',
                        textTransform: 'uppercase' as const,
                        letterSpacing: '0.08em',
                      }}
                    >
                      Empfehlung
                    </div>
                  )}
                  <h3 style={{ fontSize: '18px', fontWeight: 700, marginTop: 0, marginBottom: '8px' }}>
                    {paket.name}
                  </h3>
                  <div style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>
                    {paket.preis}
                  </div>
                  {paket.beschreibung && (
                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>
                      {paket.beschreibung}
                    </p>
                  )}
                  {paket.features && paket.features.length > 0 && (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {paket.features.map((f, j) => (
                        <li
                          key={j}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '14px',
                            marginBottom: '8px',
                            color: '#444',
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={akzent}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          {f.feature}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
            {/* Responsive Fallback für kleine Bildschirme */}
            <style>{`
              @media (max-width: 640px) {
                div[style*="grid-template-columns"] {
                  grid-template-columns: 1fr !important;
                }
              }
            `}</style>
          </section>
        </>
      )}

      {/* Kontakt */}
      {daten.kontakt && (daten.kontakt.name || daten.kontakt.email || daten.kontakt.telefon) && (
        <>
          <SektionsTrenner />
          <section style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>
              Fragen? Melde dich bei mir
            </h2>
            {daten.kontakt.abschlussText && (
              <p style={{ color: '#555', maxWidth: '600px', margin: '0 auto 24px', whiteSpace: 'pre-line' }}>
                {daten.kontakt.abschlussText}
              </p>
            )}
            <div style={{ color: '#555', fontSize: '15px', lineHeight: 2 }}>
              {daten.kontakt.name && <div>{daten.kontakt.name}</div>}
              {daten.kontakt.email && (
                <div>
                  <a href={`mailto:${daten.kontakt.email}`} style={{ color: akzent }}>
                    {daten.kontakt.email}
                  </a>
                </div>
              )}
              {daten.kontakt.telefon && (
                <div>
                  <a href={`tel:${daten.kontakt.telefon.replace(/\s/g, '')}`} style={{ color: akzent }}>
                    {daten.kontakt.telefon}
                  </a>
                </div>
              )}
              {daten.kontakt.website && (
                <div>
                  <a
                    href={daten.kontakt.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: akzent }}
                  >
                    {daten.kontakt.website}
                  </a>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
