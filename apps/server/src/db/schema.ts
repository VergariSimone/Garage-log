import { INTERVENTION_TYPES } from "@garage/shared";
import { sql } from "drizzle-orm";
import { check, index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const nowIso = () => new Date().toISOString();

export const vehicles = sqliteTable("vehicles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  plate: text("plate"),
  makeModel: text("make_model"),
  createdAt: text("created_at").notNull().$defaultFn(nowIso),
});

// Elenco SQL dei tipi ammessi, es. 'tagliando', 'cambio_gomme', ...
// I valori sono costanti del codice (non input utente); l'escape degli apici
// è solo una cautela nel caso un domani un valore contenesse un apostrofo.
const interventionTypesSql = INTERVENTION_TYPES.map(
  (t) => `'${t.replaceAll("'", "''")}'`,
).join(", ");

export const interventions = sqliteTable(
  "interventions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    vehicleId: integer("vehicle_id")
      .notNull()
      .references(() => vehicles.id, { onDelete: "restrict" }),
    date: text("date").notNull(), // YYYY-MM-DD
    type: text("type", { enum: INTERVENTION_TYPES }).notNull(),
    odometerKm: integer("odometer_km"),
    priceCents: integer("price_cents"),
    workshop: text("workshop"),
    nextCheckDate: text("next_check_date"), // YYYY-MM-DD
    notes: text("notes"),
    createdAt: text("created_at").notNull().$defaultFn(nowIso),
    updatedAt: text("updated_at").notNull().$defaultFn(nowIso).$onUpdate(nowIso),
  },
  (t) => [
    index("interventions_vehicle_id_date_idx").on(t.vehicleId, t.date),
    check(
      "interventions_type_check",
      sql`${t.type} IN (${sql.raw(interventionTypesSql)})`,
    ),
    check(
      "interventions_price_cents_check",
      sql`${t.priceCents} IS NULL OR ${t.priceCents} >= 0`,
    ),
    check(
      "interventions_odometer_km_check",
      sql`${t.odometerKm} IS NULL OR ${t.odometerKm} >= 0`,
    ),
  ],
);

export type Vehicle = typeof vehicles.$inferSelect;
export type NewVehicle = typeof vehicles.$inferInsert;
export type Intervention = typeof interventions.$inferSelect;
export type NewIntervention = typeof interventions.$inferInsert;
