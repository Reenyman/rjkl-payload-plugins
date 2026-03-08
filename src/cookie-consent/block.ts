import type { Block } from 'payload'

export const CookieListe: Block = {
  slug: 'cookieListe',
  labels: {
    singular: 'Cookie-Liste',
    plural: 'Cookie-Listen',
  },
  fields: [
    {
      name: 'ueberschrift',
      type: 'text',
      label: 'Überschrift',
      defaultValue: 'Eingesetzte Cookies & Dienste',
    },
    {
      name: 'beschreibungstext',
      type: 'textarea',
      label: 'Beschreibungstext',
      admin: {
        description: 'Optionaler Text über der Cookie-Tabelle',
      },
    },
  ],
}
