import type { Plugin } from 'payload'
import { Kundenangebot } from './global'

export const kundenangebotPlugin = (): Plugin => {
  return (incomingConfig) => {
    const config = { ...incomingConfig }

    config.globals = [...(config.globals || []), Kundenangebot]

    return config
  }
}
