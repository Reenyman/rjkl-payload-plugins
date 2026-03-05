import { z } from 'zod'

export const angebotAnfrageSchema = z.object({
  gewaehlteOption: z.string().min(1, 'Bitte wähle eine Option.'),
  vorname: z.string().min(2, 'Vorname muss mindestens 2 Zeichen lang sein.'),
  nachname: z.string().min(2, 'Nachname muss mindestens 2 Zeichen lang sein.'),
  firma: z.string().optional(),
  email: z.string().email('Bitte eine gültige E-Mail-Adresse eingeben.'),
  telefon: z.string().min(5, 'Bitte eine gültige Telefonnummer eingeben.'),
  strasse: z.string().optional(),
  plz: z.string().optional(),
  ort: z.string().optional(),
  nachricht: z.string().optional(),
})

export type AngebotAnfrageData = z.infer<typeof angebotAnfrageSchema>
