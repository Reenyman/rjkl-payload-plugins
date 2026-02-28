import React from 'react'

export const metadata = {
  title: 'Website-Vorschau — Login',
  robots: 'noindex, nofollow',
}

export default function StagingLoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
