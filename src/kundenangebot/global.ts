import type { GlobalConfig } from 'payload'

export const Kundenangebot: GlobalConfig = {
  slug: 'kundenangebot',
  label: 'Kundenangebot',
  admin: {
    group: 'Einstellungen',
  },
  fields: [
    {
      name: 'aktiv',
      type: 'checkbox',
      label: 'Angebot aktiv',
      defaultValue: false,
      admin: {
        description: 'Wenn aktiv, wird das Angebotsbanner auf der Website angezeigt.',
      },
    },
    {
      name: 'kundenname',
      type: 'text',
      label: 'Kundenname',
      admin: {
        description: 'Z.B. "Mo\'s Frisiersalon" — wird auf der Angebotsseite angezeigt.',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Entwickler-Logo',
      admin: {
        description: 'Logo des Entwicklers. Wird im Header der Angebotsseite angezeigt.',
      },
    },
    {
      name: 'persoenlicheAnsprache',
      type: 'group',
      label: 'Persönliche Ansprache',
      admin: {
        description: 'Profilbild und kurzer Begrüßungstext — wird direkt unter dem Titel angezeigt.',
      },
      fields: [
        {
          name: 'profilbild',
          type: 'upload',
          relationTo: 'media',
          label: 'Profilbild',
          admin: {
            description: 'Wird als rundes Bild angezeigt.',
          },
        },
        {
          name: 'text',
          type: 'textarea',
          label: 'Begrüßungstext',
          admin: {
            description: 'Persönliche Ansprache an den Kunden.',
          },
        },
      ],
    },
    {
      name: 'bannerText',
      type: 'text',
      label: 'Banner-Text',
      defaultValue: 'Hier geht es zu Ihrem individuellen Website-Angebot',
      admin: {
        description: 'Text, der im Angebotsbanner oben auf der Website angezeigt wird.',
      },
    },
    {
      name: 'leistungsbeschreibung',
      type: 'group',
      label: 'Leistungsbeschreibung',
      fields: [
        {
          name: 'ueberschrift',
          type: 'text',
          label: 'Ueberschrift',
          defaultValue: 'Was ich für Sie umsetze',
        },
        {
          name: 'einleitung',
          type: 'textarea',
          label: 'Einleitung',
        },
        {
          name: 'leistungen',
          type: 'array',
          label: 'Leistungen',
          fields: [
            {
              name: 'titel',
              type: 'text',
              label: 'Titel',
              required: true,
            },
            {
              name: 'beschreibung',
              type: 'textarea',
              label: 'Beschreibung',
            },
          ],
        },
      ],
    },
    {
      name: 'designBeschreibung',
      type: 'group',
      label: 'Design-Beschreibung',
      fields: [
        {
          name: 'ueberschrift',
          type: 'text',
          label: 'Ueberschrift',
          defaultValue: 'Ihr individuelles Design',
        },
        {
          name: 'text',
          type: 'textarea',
          label: 'Beschreibung',
        },
      ],
    },
    {
      name: 'naechsteSchritte',
      type: 'group',
      label: 'Nächste Schritte',
      fields: [
        {
          name: 'ueberschrift',
          type: 'text',
          label: 'Überschrift',
          defaultValue: 'Die nächsten Schritte',
        },
        {
          name: 'einleitung',
          type: 'textarea',
          label: 'Einleitung',
        },
        {
          name: 'schritte',
          type: 'array',
          label: 'Schritte',
          fields: [
            {
              name: 'titel',
              type: 'text',
              label: 'Titel',
              required: true,
            },
            {
              name: 'beschreibung',
              type: 'textarea',
              label: 'Beschreibung',
            },
          ],
        },
      ],
    },
    {
      name: 'einmalpreis',
      type: 'group',
      label: 'Einmalpreis',
      fields: [
        {
          name: 'betrag',
          type: 'number',
          label: 'Betrag (EUR)',
          admin: {
            description: 'Einmaliger Preis in Euro.',
          },
        },
        {
          name: 'originalpreis',
          type: 'number',
          label: 'Originalpreis (EUR)',
          admin: {
            description: 'Ursprünglicher Preis für Streichpreis-Darstellung. Leer lassen, wenn kein Rabatt.',
          },
        },
        {
          name: 'beschreibung',
          type: 'textarea',
          label: 'Beschreibung',
          admin: {
            description: 'Erklärung, was im Einmalpreis enthalten ist.',
          },
        },
      ],
    },
    {
      name: 'monatspreis',
      type: 'group',
      label: 'Monatlicher Website-Preis',
      admin: {
        description: 'Alternative zum Einmalpreis — der Kunde zahlt die Website monatlich ab.',
      },
      fields: [
        {
          name: 'betrag',
          type: 'number',
          label: 'Betrag (EUR/Monat)',
          admin: {
            description: 'Monatlicher Preis für die Website (z.B. 92).',
          },
        },
        {
          name: 'originalpreis',
          type: 'number',
          label: 'Originalpreis (EUR/Monat)',
          admin: {
            description: 'Ursprünglicher Monatspreis für Streichpreis-Darstellung. Leer lassen, wenn kein Rabatt.',
          },
        },
        {
          name: 'beschreibung',
          type: 'textarea',
          label: 'Beschreibung',
          admin: {
            description: 'Erklärung zum Monatsmodell.',
          },
        },
      ],
    },
    {
      name: 'pakete',
      type: 'array',
      label: 'Pakete',
      minRows: 1,
      maxRows: 5,
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Paketname',
          required: true,
        },
        {
          name: 'preisEinmalig',
          type: 'text',
          label: 'Preis (bei Einmalzahlung)',
          required: true,
          admin: {
            description: 'Paketpreis wenn der Kunde die Website einmalig bezahlt. Z.B. "19 EUR/Monat"',
          },
        },
        {
          name: 'preisMonatlich',
          type: 'text',
          label: 'Preis (bei monatlicher Zahlung)',
          required: true,
          admin: {
            description: 'Paketpreis wenn der Kunde die Website monatlich bezahlt. Z.B. "49 EUR/Monat"',
          },
        },
        {
          name: 'beschreibung',
          type: 'textarea',
          label: 'Beschreibung',
        },
        {
          name: 'features',
          type: 'array',
          label: 'Features',
          fields: [
            {
              name: 'feature',
              type: 'text',
              label: 'Feature',
              required: true,
            },
          ],
        },
        {
          name: 'hervorgehoben',
          type: 'checkbox',
          label: 'Hervorgehoben (Empfehlung)',
          defaultValue: false,
          admin: {
            description: 'Wenn aktiv, wird dieses Paket visuell hervorgehoben.',
          },
        },
      ],
    },
    {
      name: 'kontakt',
      type: 'group',
      label: 'Kontakt',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Name',
        },
        {
          name: 'email',
          type: 'email',
          label: 'E-Mail',
        },
        {
          name: 'telefon',
          type: 'text',
          label: 'Telefon',
        },
        {
          name: 'website',
          type: 'text',
          label: 'Website',
        },
        {
          name: 'empfaengerEmail',
          type: 'email',
          label: 'Empfänger-E-Mail für Anfragen',
          admin: {
            description: 'An diese Adresse werden Angebotsanfragen gesendet. Wird NICHT auf der Seite angezeigt.',
          },
        },
        {
          name: 'abschlussText',
          type: 'textarea',
          label: 'Abschlusstext',
          admin: {
            description: 'Text unter der Kontakt-Überschrift, z.B. Aufforderung zur Kontaktaufnahme.',
          },
        },
      ],
    },
    {
      name: 'investitionUeberschrift',
      type: 'text',
      label: 'Überschrift Investition',
      defaultValue: 'Ihre Investition',
      admin: {
        description: 'Überschrift über dem Preisbereich.',
      },
    },
    {
      name: 'paketwahlUeberschrift',
      type: 'text',
      label: 'Überschrift Paketwahl',
      defaultValue: 'Wählen Sie Ihr Servicepaket',
      admin: {
        description: 'Überschrift über den Paketen.',
      },
    },
    {
      name: 'kontaktUeberschrift',
      type: 'text',
      label: 'Überschrift Kontakt',
      defaultValue: 'Fragen? Melden Sie sich bei mir',
      admin: {
        description: 'Überschrift über dem Kontaktbereich.',
      },
    },
    {
      name: 'akzentfarbe',
      type: 'text',
      label: 'Akzentfarbe',
      defaultValue: '#000000',
      admin: {
        description: 'Farbe für Hervorhebungen (z.B. #000000 für Schwarz).',
      },
    },
  ],
}
