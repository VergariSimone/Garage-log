import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { INTERVENTION_TYPES } from "@garage/shared";
import { databasePath } from "./db/client";
import { runMigrations } from "./db/migrate";
import { ensureDefaultVehicle } from "./db/seed";

function fail(step: string, err: unknown): never {
  console.error(`\n[avvio] ERRORE durante ${step} (database: ${databasePath})`);
  console.error(err);
  process.exit(1);
}

// 1. Migrazioni
try {
  runMigrations();
  console.log(`[avvio] Migrazioni applicate (${databasePath})`);
} catch (err) {
  fail("le migrazioni", err);
}

// 2. Seed
try {
  const created = ensureDefaultVehicle();
  console.log(
    created
      ? `[avvio] Creato veicolo predefinito "${created.name}" (id ${created.id})`
      : "[avvio] Veicolo già presente, seed non necessario",
  );
} catch (err) {
  fail("il seed", err);
}

// 3. Server HTTP (solo se i passi precedenti sono riusciti)
const app = new Hono();

app.get("/api/health", (c) =>
  c.json({ ok: true, interventionTypes: INTERVENTION_TYPES }),
);

const port = 3000;

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Server in ascolto su http://localhost:${info.port}`);
});
