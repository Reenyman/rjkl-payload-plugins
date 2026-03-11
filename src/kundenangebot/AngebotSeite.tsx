'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { angebotAnfrageSchema, type AngebotAnfrageData } from './angebot-anfrage-schema'

interface Leistung {
  titel: string
  beschreibung?: string | null
}

interface Paket {
  name: string
  preisEinmalig: string
  preisMonatlich: string
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
  monatspreis?: {
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
  investitionUeberschrift?: string | null
  paketwahlUeberschrift?: string | null
  kontaktUeberschrift?: string | null
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
    'SEO': 'Suchmaschinenoptimierung, damit Ihre Website bei Google gut gefunden wird',
    'SSL': 'Verschlüsselte Verbindung für sichere Datenübertragung',
    'CMS': 'Content-Management-System, damit Sie Inhalte selbst bearbeiten können',
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

  const [zahlungsmodell, setZahlungsmodell] = useState<'einmalig' | 'monatlich'>('einmalig')
  const [gewaehltesPaket, setGewaehltesPaket] = useState<number | null>(null)
  const [sendeStatus, setSendeStatus] = useState<'idle' | 'senden' | 'erfolg' | 'fehler'>('idle')

  // Gewählte Option als Text zusammenbauen
  const gewaehlteOptionText =
    gewaehltesPaket !== null && daten.pakete?.[gewaehltesPaket]
      ? zahlungsmodell === 'einmalig'
        ? `Einmalzahlung ${daten.einmalpreis?.betrag?.toLocaleString('de-DE') || '–'} EUR + ${daten.pakete[gewaehltesPaket].name} (${daten.pakete[gewaehltesPaket].preisEinmalig})`
        : `Monatlich ${daten.monatspreis?.betrag?.toLocaleString('de-DE') || '–'} EUR/Monat + ${daten.pakete[gewaehltesPaket].name} (${daten.pakete[gewaehltesPaket].preisMonatlich})`
      : ''

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AngebotAnfrageData>({
    resolver: zodResolver(angebotAnfrageSchema),
    defaultValues: { gewaehlteOption: '' },
  })

  // Gewählte Option im Formular aktualisieren wenn sich die Auswahl ändert
  useEffect(() => {
    if (gewaehlteOptionText) {
      setValue('gewaehlteOption', gewaehlteOptionText)
    }
  }, [gewaehlteOptionText, setValue])

  const onSubmit = async (datenFormular: AngebotAnfrageData) => {
    setSendeStatus('senden')
    try {
      const res = await fetch('/api/angebot-anfrage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datenFormular),
      })
      if (res.ok) {
        setSendeStatus('erfolg')
      } else {
        setSendeStatus('fehler')
      }
    } catch {
      setSendeStatus('fehler')
    }
  }

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
          Angebot für {daten.kundenname || 'Sie'}
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
              {daten.leistungsbeschreibung.ueberschrift || 'Was ich für Sie umsetze'}
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
              {daten.designBeschreibung.ueberschrift || 'Ihr individuelles Design'}
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

      {/* Zahlungsmodell-Wahl */}
      {(daten.einmalpreis?.betrag || daten.monatspreis?.betrag) && (
        <>
          <SektionsTrenner />
          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '32px', textAlign: 'center' }}>
              {daten.investitionUeberschrift || 'Ihre Investition'}
            </h2>

            {/* Pill-Toggle */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '50px',
                  padding: '4px',
                }}
              >
                <button
                  onClick={() => { setZahlungsmodell('einmalig'); setGewaehltesPaket(null) }}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '50px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: 600,
                    fontFamily: schrift,
                    transition: 'all 0.2s',
                    backgroundColor: zahlungsmodell === 'einmalig' ? akzent : 'transparent',
                    color: zahlungsmodell === 'einmalig' ? '#fff' : '#666',
                  }}
                >
                  Einmalzahlung
                </button>
                <button
                  onClick={() => { setZahlungsmodell('monatlich'); setGewaehltesPaket(null) }}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '50px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: 600,
                    fontFamily: schrift,
                    transition: 'all 0.2s',
                    backgroundColor: zahlungsmodell === 'monatlich' ? akzent : 'transparent',
                    color: zahlungsmodell === 'monatlich' ? '#fff' : '#666',
                  }}
                >
                  Monatlich zahlen
                </button>
              </div>
            </div>

            {/* Preis-Anzeige */}
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              {zahlungsmodell === 'einmalig' && daten.einmalpreis?.betrag && (
                <>
                  {daten.einmalpreis.originalpreis && daten.einmalpreis.originalpreis > daten.einmalpreis.betrag && (
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ fontSize: '24px', color: '#999', textDecoration: 'line-through' }}>
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
                </>
              )}
              {zahlungsmodell === 'monatlich' && daten.monatspreis?.betrag && (
                <>
                  {daten.monatspreis.originalpreis && daten.monatspreis.originalpreis > daten.monatspreis.betrag && (
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ fontSize: '24px', color: '#999', textDecoration: 'line-through' }}>
                        {daten.monatspreis.originalpreis.toLocaleString('de-DE')} EUR / Monat
                      </span>
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: '48px',
                      fontWeight: 700,
                      marginBottom: '12px',
                      color: daten.monatspreis.originalpreis ? '#16a34a' : undefined,
                    }}
                  >
                    {daten.monatspreis.betrag.toLocaleString('de-DE')} EUR
                    <span style={{ fontSize: '24px', fontWeight: 400, color: daten.monatspreis.originalpreis ? '#16a34a' : '#666' }}> / Monat</span>
                  </div>
                  {daten.monatspreis.originalpreis && daten.monatspreis.originalpreis > daten.monatspreis.betrag && (
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
                  <p style={{ color: '#999', fontSize: '14px', margin: '0 auto 8px', maxWidth: '500px' }}>
                    Gesamtbetrag nach 24 Monaten: <strong style={{ color: '#555' }}>{(daten.monatspreis.betrag * 24).toLocaleString('de-DE')} EUR</strong>
                  </p>
                  {daten.monatspreis.beschreibung && (
                    <p style={{ color: '#666', maxWidth: '500px', margin: '0 auto', fontSize: '15px' }}>
                      {daten.monatspreis.beschreibung}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Paket-Karten */}
            {daten.pakete && daten.pakete.length > 0 && (
              <>
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px', textAlign: 'center' }}>
                  {daten.paketwahlUeberschrift || 'Wählen Sie Ihr Servicepaket'}
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${Math.min(daten.pakete.length, 3)}, 1fr)`,
                    gap: '20px',
                  }}
                >
                  {daten.pakete.map((paket, i) => {
                    const istGewaehlt = gewaehltesPaket === i
                    return (
                      <div
                        key={i}
                        onClick={() => setGewaehltesPaket(i)}
                        style={{
                          border: istGewaehlt
                            ? `2px solid ${akzent}`
                            : paket.hervorgehoben
                              ? `2px solid ${akzent}`
                              : '1px solid #e5e5e5',
                          borderRadius: '12px',
                          padding: '28px 24px',
                          position: 'relative',
                          backgroundColor: istGewaehlt ? '#fafafa' : '#fff',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          boxShadow: istGewaehlt ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                        }}
                      >
                        {paket.hervorgehoben && (
                          <div
                            style={{
                              position: 'absolute',
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
                        {istGewaehlt && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '12px',
                              right: '12px',
                            }}
                          >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill={akzent}>
                              <circle cx="12" cy="12" r="12" />
                              <polyline
                                points="7 12 10 15 17 9"
                                fill="none"
                                stroke="#fff"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        )}
                        <h3 style={{ fontSize: '18px', fontWeight: 700, marginTop: 0, marginBottom: '8px' }}>
                          {paket.name}
                        </h3>
                        <div style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>
                          {zahlungsmodell === 'einmalig' ? paket.preisEinmalig : paket.preisMonatlich}
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
                                  alignItems: 'flex-start',
                                  gap: '8px',
                                  fontSize: '14px',
                                  marginBottom: '8px',
                                  color: '#444',
                                }}
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke={akzent}
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  style={{ flexShrink: 0, marginTop: '2px' }}
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span>{f.feature}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )
                  })}
                </div>
              </>
            )}

            {/* Anfrageformular — nur wenn Paket gewählt */}
            {gewaehltesPaket !== null && sendeStatus !== 'erfolg' && (
              <div
                style={{
                  marginTop: '48px',
                  maxWidth: '600px',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              >
                <SektionsTrenner />
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px', textAlign: 'center' }}>
                  Angebot anfordern
                </h3>

                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Gewählte Option (readonly) */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
                      Gewählte Option
                    </label>
                    <input
                      {...register('gewaehlteOption')}
                      readOnly
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1px solid #e5e5e5',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontFamily: schrift,
                        backgroundColor: '#f5f5f5',
                        color: '#333',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {/* Vorname + Nachname */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                      marginBottom: '20px',
                    }}
                  >
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
                        Vorname *
                      </label>
                      <input
                        {...register('vorname')}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: errors.vorname ? '1px solid #ef4444' : '1px solid #e5e5e5',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontFamily: schrift,
                          boxSizing: 'border-box',
                        }}
                      />
                      {errors.vorname && (
                        <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.vorname.message}</span>
                      )}
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
                        Nachname *
                      </label>
                      <input
                        {...register('nachname')}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: errors.nachname ? '1px solid #ef4444' : '1px solid #e5e5e5',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontFamily: schrift,
                          boxSizing: 'border-box',
                        }}
                      />
                      {errors.nachname && (
                        <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.nachname.message}</span>
                      )}
                    </div>
                  </div>

                  {/* Firmenname */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
                      Firmenname
                    </label>
                    <input
                      {...register('firma')}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1px solid #e5e5e5',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontFamily: schrift,
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {/* E-Mail + Telefon */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                      marginBottom: '20px',
                    }}
                  >
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
                        E-Mail *
                      </label>
                      <input
                        type="email"
                        {...register('email')}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: errors.email ? '1px solid #ef4444' : '1px solid #e5e5e5',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontFamily: schrift,
                          boxSizing: 'border-box',
                        }}
                      />
                      {errors.email && (
                        <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.email.message}</span>
                      )}
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
                        Telefon *
                      </label>
                      <input
                        type="tel"
                        {...register('telefon')}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: errors.telefon ? '1px solid #ef4444' : '1px solid #e5e5e5',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontFamily: schrift,
                          boxSizing: 'border-box',
                        }}
                      />
                      {errors.telefon && (
                        <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.telefon.message}</span>
                      )}
                    </div>
                  </div>

                  {/* Straße */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
                      Straße + Hausnummer
                    </label>
                    <input
                      {...register('strasse')}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1px solid #e5e5e5',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontFamily: schrift,
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {/* PLZ + Ort */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 2fr',
                      gap: '16px',
                      marginBottom: '20px',
                    }}
                  >
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
                        PLZ
                      </label>
                      <input
                        {...register('plz')}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: '1px solid #e5e5e5',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontFamily: schrift,
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
                        Ort
                      </label>
                      <input
                        {...register('ort')}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: '1px solid #e5e5e5',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontFamily: schrift,
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>

                  {/* Nachricht */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
                      Nachricht / Anmerkungen
                    </label>
                    <textarea
                      {...register('nachricht')}
                      rows={4}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1px solid #e5e5e5',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontFamily: schrift,
                        resize: 'vertical',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {/* Hinweis */}
                  <div
                    style={{
                      padding: '12px 16px',
                      backgroundColor: '#f0f9ff',
                      border: '1px solid #bae6fd',
                      borderRadius: '8px',
                      fontSize: '13px',
                      color: '#0369a1',
                      marginBottom: '20px',
                      textAlign: 'center',
                    }}
                  >
                    Dies ist kein Kauf, sondern eine unverbindliche Angebotsanfrage.
                  </div>

                  {/* Fehler-Meldung */}
                  {sendeStatus === 'fehler' && (
                    <div
                      style={{
                        padding: '12px 16px',
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '8px',
                        fontSize: '13px',
                        color: '#dc2626',
                        marginBottom: '20px',
                        textAlign: 'center',
                      }}
                    >
                      Beim Versenden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.
                    </div>
                  )}

                  {/* Submit-Button */}
                  <button
                    type="submit"
                    disabled={sendeStatus === 'senden'}
                    style={{
                      width: '100%',
                      padding: '14px 24px',
                      backgroundColor: sendeStatus === 'senden' ? '#999' : akzent,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: 700,
                      fontFamily: schrift,
                      cursor: sendeStatus === 'senden' ? 'wait' : 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    {sendeStatus === 'senden' ? 'Wird gesendet...' : 'Angebot anfordern'}
                  </button>
                </form>
              </div>
            )}

            {/* Erfolgs-Meldung */}
            {sendeStatus === 'erfolg' && (
              <div
                style={{
                  marginTop: '48px',
                  maxWidth: '600px',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  padding: '32px',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '12px',
                  textAlign: 'center',
                }}
              >
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ marginBottom: '16px' }}
                >
                  <circle cx="12" cy="12" r="12" fill="#16a34a" />
                  <polyline
                    points="7 12 10 15 17 9"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: '#166534' }}>
                  Anfrage erfolgreich gesendet!
                </h3>
                <p style={{ color: '#166534', fontSize: '15px', margin: 0 }}>
                  Vielen Dank für Ihr Interesse. Ich melde mich in Kürze bei Ihnen.
                </p>
              </div>
            )}

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
              {daten.kontaktUeberschrift || 'Fragen? Melden Sie sich bei mir'}
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
