import { defineConfig } from "drizzle-kit";

// I percorsi relativi sono risolti dalla cartella di lancio di drizzle-kit:
// gli script npm del workspace partono sempre da apps/server, quindi
// ./data/garage.db coincide con il default usato da src/db/client.ts.
export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_PATH ?? "./data/garage.db",
  },
});
