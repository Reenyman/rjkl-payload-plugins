'use client'

import React, { useState, useMemo } from 'react'
import { useFormFields } from '@payloadcms/ui'

/** Vorschau-URL-Feld: Zeigt eine read-only URL mit Kopier-Button */
const VorschauUrlFeld: React.FC<{ path: string }> = ({ path }) => {
  const [kopiert, setKopiert] = useState(false)

  // Pfad zum Token-Feld ableiten: vorschauLinks.0.vorschauUrl -> vorschauLinks.0.token
  const tokenPfad = useMemo(() => path.replace(/\.vorschauUrl$/, '.token'), [path])

  const tokenFeld = useFormFields(([fields]) => fields[tokenPfad])
  const token = tokenFeld?.value as string | undefined

  if (!token) {
    return (
      <div style={{ padding: '8px 12px', color: '#666', fontStyle: 'italic', fontSize: '14px' }}>
        Speichern, um den Vorschau-Link zu generieren.
      </div>
    )
  }

  const url = `${window.location.origin}/?key=${token}`

  const kopieren = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setKopiert(true)
      setTimeout(() => setKopiert(false), 2000)
    } catch {
      // Fallback ignorieren
    }
  }

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <input
        type="text"
        readOnly
        value={url}
        style={{
          flex: 1,
          padding: '8px 12px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '14px',
          fontFamily: 'monospace',
          backgroundColor: '#f5f5f5',
          color: '#333',
        }}
      />
      <button
        type="button"
        onClick={kopieren}
        style={{
          padding: '8px 16px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 500,
          whiteSpace: 'nowrap',
          backgroundColor: kopiert ? '#16a34a' : '#570f12',
          color: '#fff',
          transition: 'background-color 0.2s ease',
        }}
      >
        {kopiert ? 'Kopiert!' : 'Kopieren'}
      </button>
    </div>
  )
}

export default VorschauUrlFeld
