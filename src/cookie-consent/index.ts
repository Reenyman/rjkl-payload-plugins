import type { Plugin } from 'payload'
import { CookiesCollection } from './collection'

export const cookieConsentPlugin = (): Plugin => {
  return (incomingConfig) => {
    const config = { ...incomingConfig }

    config.collections = [...(config.collections || []), CookiesCollection]

    return config
  }
}
