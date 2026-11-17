import { db, type Db } from "./client";
import { vehicles, type Vehicle } from "./schema";

export const DEFAULT_VEHICLE_NAME = "La mia auto";

/**
 * Idempotente: inserisce il veicolo predefinito solo se la tabella è vuota.
 * Restituisce il veicolo creato, oppure null se ce n'era già almeno uno.
 */
export function ensureDefaultVehicle(database: Db = db): Vehicle | null {
  return database.transaction((tx) => {
    const existing = tx.select({ id: vehicles.id }).from(vehicles).limit(1).get();
    if (existing) return null;
    return tx.insert(vehicles).values({ name: DEFAULT_VEHICLE_NAME }).returning().get();
  });
}
