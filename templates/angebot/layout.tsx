import React from 'react'

export const metadata = {
  title: 'Angebot — Website-Entwicklung',
  robots: 'noindex, nofollow',
}

export default function AngebotLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body style={{ margin: 0, backgroundColor: '#ffffff' }}>{children}</body>
    </html>
  )
}
