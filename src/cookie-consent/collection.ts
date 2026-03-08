import type { CollectionConfig } from 'payload'

export const CookiesCollection: CollectionConfig = {
  slug: 'cookies',
  labels: {
    singular: 'Cookie',
    plural: 'Cookies',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'kategorie', 'anbieter', 'aktiv'],
    group: 'Einstellungen',
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name',
      admin: { description: 'z.B. "Google Maps", "Cookie-Consent"' },
    },
    {
      name: 'anbieter',
      type: 'text',
      label: 'Anbieter',
      admin: { description: 'z.B. "Google LLC", "Eigene Website"' },
    },
    {
      name: 'kategorie',
      type: 'select',
      required: true,
      label: 'Kategorie',
      options: [
        { label: 'Notwendig', value: 'notwendig' },
        { label: 'Funktional', value: 'funktional' },
        { label: 'Statistik', value: 'statistik' },
        { label: 'Marketing', value: 'marketing' },
      ],
      defaultValue: 'notwendig',
    },
    {
      name: 'beschreibung',
      type: 'textarea',
      label: 'Beschreibung',
      admin: { description: 'Zweck des Cookies / Dienstes' },
    },
    {
      name: 'speicherdauer',
      type: 'text',
      label: 'Speicherdauer',
      admin: { description: 'z.B. "12 Monate", "Session", "Permanent"' },
    },
    {
      name: 'aktiv',
      type: 'checkbox',
      label: 'Aktiv',
      defaultValue: true,
      admin: { description: 'Ob dieser Cookie/Dienst aktuell eingesetzt wird' },
    },
  ],
}
