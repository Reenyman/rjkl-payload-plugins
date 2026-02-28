import type { GlobalConfig } from 'payload'

export const StagingGate: GlobalConfig = {
  slug: 'staging-gate',
  label: 'Staging-Schutz',
  admin: {
    group: 'Einstellungen',
  },
  fields: [
    {
      name: 'aktiv',
      type: 'checkbox',
      label: 'Passwortschutz aktiv',
      defaultValue: false,
      admin: {
        description: 'Wenn aktiv, muss man sich einloggen, um die Website zu sehen.',
      },
    },
    {
      name: 'benutzername',
      type: 'text',
      label: 'Benutzername',
      required: true,
      defaultValue: 'kunde',
    },
    {
      name: 'passwort',
      type: 'text',
      label: 'Passwort',
      required: true,
      defaultValue: 'vorschau',
      admin: {
        description: 'Klartext-Passwort für den Kunden-Zugang.',
      },
    },
    {
      name: 'kundenname',
      type: 'text',
      label: 'Kundenname',
      admin: {
        description: 'Z.B. "Mo\'s Frisiersalon" — wird als Überschrift auf der Login-Seite angezeigt.',
      },
    },
    {
      name: 'einleitungstext',
      type: 'textarea',
      label: 'Einleitungstext',
      defaultValue:
        'Hier kannst du dir deine neue Website in Ruhe anschauen. Bitte logge dich mit den Zugangsdaten ein, die du von uns erhalten hast.',
      admin: {
        description: 'Wird auf der Login-Seite unter dem Kundennamen angezeigt.',
      },
    },
    {
      name: 'entwicklerName',
      type: 'text',
      label: 'Entwicklername',
      defaultValue: 'RJKL',
      admin: {
        description: 'Name des Entwicklers, z.B. "RJKL". Wird im Footer der Login-Seite angezeigt.',
      },
    },
    {
      name: 'entwicklerLogo',
      type: 'upload',
      relationTo: 'media',
      label: 'Entwickler-Logo',
      admin: {
        description: 'Logo des Entwicklers (z.B. RJKL). Wird oben auf der Login-Seite angezeigt.',
      },
    },
    {
      name: 'entwicklerUrl',
      type: 'text',
      label: 'Entwickler-Website',
      defaultValue: 'https://www.rjkl.de',
    },
    {
      name: 'impressumUrl',
      type: 'text',
      label: 'Impressum-URL',
      defaultValue: 'https://www.rjkl.de/impressum',
    },
    {
      name: 'datenschutzUrl',
      type: 'text',
      label: 'Datenschutz-URL',
      defaultValue: 'https://www.rjkl.de/datenschutz',
    },
  ],
}
