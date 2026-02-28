import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Staging-Gate Middleware-Wrapper.
 * Gibt eine NextResponse zurück, wenn der Request geblockt werden soll,
 * oder null wenn der Request durchgelassen wird.
 *
 * Nutzung im Hostprojekt:
 * ```ts
 * import { withStagingGate } from '@rjkl/payload-plugins/staging-gate/middleware'
 *
 * export function middleware(request: NextRequest) {
 *   const blocked = withStagingGate(request)
 *   if (blocked) return blocked
 *   return NextResponse.next()
 * }
 * ```
 */
export function withStagingGate(request: NextRequest): NextResponse | null {
  // Nur aktiv wenn STAGING_GATE=true
  if (process.env.STAGING_GATE !== 'true') {
    return null
  }

  const { pathname } = request.nextUrl

  // Ausnahmen: Admin, API, Next.js-Internals, statische Assets, Login-Seite
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/staging-login') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|gif|css|js|woff|woff2|ttf)$/)
  ) {
    return null
  }

  // Cookie prüfen
  const token = request.cookies.get('staging-token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/staging-login', request.url))
  }

  // HMAC-Validierung: Token-Format prüfen (64 Hex-Zeichen = SHA-256)
  if (!/^[a-f0-9]{64}$/.test(token)) {
    const response = NextResponse.redirect(new URL('/staging-login', request.url))
    response.cookies.delete('staging-token')
    return response
  }

  return null
}
