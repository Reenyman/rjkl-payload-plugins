import type { Plugin } from 'payload'
import { StagingGate } from './global'

export const stagingGatePlugin = (): Plugin => {
  return (incomingConfig) => {
    const config = { ...incomingConfig }

    config.globals = [...(config.globals || []), StagingGate]

    return config
  }
}
