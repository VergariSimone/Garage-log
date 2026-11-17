import { resolve } from "node:path";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db, type Db } from "./client";

// apps/server/drizzle, indipendente dalla cartella di lancio.
export const MIGRATIONS_FOLDER = resolve(import.meta.dirname, "../../drizzle");

/** Applica le migrazioni non ancora eseguite. Lancia un errore se una fallisce. */
export function runMigrations(database: Db = db): void {
  migrate(database, { migrationsFolder: MIGRATIONS_FOLDER });
}
