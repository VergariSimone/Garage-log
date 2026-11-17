import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { INTERVENTION_TYPES } from "@garage/shared";

const app = new Hono();

app.get("/api/health", (c) =>
  c.json({ ok: true, interventionTypes: INTERVENTION_TYPES }),
);

const port = 3000;

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Server in ascolto su http://localhost:${info.port}`);
});
