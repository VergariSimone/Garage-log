import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

// Cartella di questo file: apps/server/src/db → il default diventa
// apps/server/data/garage.db, qualunque sia la cartella da cui si lancia.
const DEFAULT_DATABASE_PATH = resolve(import.meta.dirname, "../../data/garage.db");

export const databasePath = process.env.DATABASE_PATH
  ? resolve(process.env.DATABASE_PATH)
  : DEFAULT_DATABASE_PATH;

mkdirSync(dirname(databasePath), { recursive: true });

export const sqlite = new Database(databasePath);

// SQLite non applica le foreign key se non vengono attivate su OGNI connessione.
sqlite.pragma("foreign_keys = ON");
// WAL: letture e scritture concorrenti, scritture più veloci.
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema });

export type Db = typeof db;
