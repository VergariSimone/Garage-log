import { z } from "zod";
import { INTERVENTION_TYPES } from "../constants/intervention-types";

/**
 * Testo opzionale: trim, limite di lunghezza, e "" (anche solo spazi) -> null.
 * Il trim avviene prima del controllo su max, quindi "   " diventa null.
 */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional();

/** Data opzionale YYYY-MM-DD: "" (campo data lasciato vuoto nel form) -> null. */
const optionalDate = z
  .union([z.literal("").transform(() => null), z.iso.date()])
  .nullable()
  .optional();

const optionalNonNegativeInt = z.number().int().nonnegative().nullable().optional();

export const createInterventionSchema = z.object({
  vehicleId: z.number().int().positive(),
  date: z.iso.date(),
  type: z.enum(INTERVENTION_TYPES),
  odometerKm: optionalNonNegativeInt,
  priceCents: optionalNonNegativeInt,
  workshop: optionalText(120),
  nextCheckDate: optionalDate,
  notes: optionalText(2000),
});

/** Ciò che il client invia (prima delle trasformazioni): workshop può essere "". */
export type CreateInterventionFormValues = z.input<typeof createInterventionSchema>;

/** Ciò che il server riceve dopo la validazione: "" è già diventato null. */
export type CreateInterventionInput = z.output<typeof createInterventionSchema>;
