# Garage Log

Web app per registrare gli interventi eseguiti sulla propria auto (tagliandi, cambio gomme, revisioni, freni, carrozzeria…).

> **Stato:** Fase 2 — database. Il server crea/aggiorna il database SQLite all'avvio e garantisce un veicolo predefinito. Le API per gestire gli interventi e la relativa interfaccia arriveranno nelle fasi successive: per ora l'unico endpoint è l'health check.

## Stack

- **Monorepo** con [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces)
- **Server:** Node.js + [Hono](https://hono.dev), eseguito in sviluppo con `tsx`
- **Database:** SQLite ([better-sqlite3](https://github.com/WiseLibs/better-sqlite3)) + [Drizzle ORM](https://orm.drizzle.team), migrazioni con drizzle-kit
- **Web:** [Vite](https://vite.dev) + React + TypeScript
- **Shared:** pacchetto TypeScript condiviso tra server e web (nessuna build)

## Struttura

```
garage-log/
├── package.json          # radice: workspaces e script "dev"
├── tsconfig.base.json    # opzioni TypeScript comuni
├── packages/
│   └── shared/           # @garage/shared — costanti e tipi condivisi
│       └── src/constants/intervention-types.ts
└── apps/
    ├── server/           # @garage/server — API Hono sulla porta 3000
    │   ├── drizzle.config.ts
    │   ├── drizzle/      # migrazioni SQL generate (versionate in git)
    │   ├── data/         # file del database (ignorato da git)
    │   └── src/db/       # schema, connessione, migrazioni, seed
    └── web/              # @garage/web — frontend Vite sulla porta 5173
```

Il frontend chiama le API con percorsi relativi (`/api/...`): in sviluppo il dev server di Vite li inoltra a `http://localhost:3000` tramite proxy, quindi non serve configurare CORS.

## Requisiti

- Node.js 22 (testato con 22.14)
- npm 10

## Avvio

Tutti i comandi vanno lanciati dalla **radice** del repository: esiste un solo `node_modules` e un solo `package-lock.json`.

```bash
npm install
npm run dev
```

`npm run dev` avvia in parallelo (con [concurrently](https://github.com/open-cli-tools/concurrently)) server e web, con i log prefissati da `[server]` e `[web]`.

- Web: http://localhost:5173
- API: http://localhost:3000/api/health

## Database

Il database è un file SQLite in `apps/server/data/garage.db` (percorso modificabile con la variabile d'ambiente `DATABASE_PATH`). La cartella viene creata automaticamente.

All'avvio il server, nell'ordine:

1. apre il database con `foreign_keys = ON` e `journal_mode = WAL`;
2. applica le migrazioni non ancora eseguite da `apps/server/drizzle/`;
3. crea il veicolo "La mia auto" se non esiste ancora nessun veicolo;
4. solo a quel punto avvia il server HTTP.

Se le migrazioni o il seed falliscono, il processo termina con un messaggio d'errore e codice di uscita 1.

### Tabelle

- **vehicles** — `name`, `plate`, `make_model`, `created_at`
- **interventions** — `vehicle_id` (FK verso `vehicles`, `ON DELETE RESTRICT`), `date`, `type`, `odometer_km`, `price_cents`, `workshop`, `next_check_date`, `notes`, `created_at`, `updated_at`

Vincoli su `interventions`: `type` deve essere uno dei valori di `INTERVENTION_TYPES` (da `@garage/shared`), `price_cents` e `odometer_km` non possono essere negativi; indice su `(vehicle_id, date)`. Date in formato `YYYY-MM-DD`, timestamp in ISO 8601 (UTC), prezzi in centesimi.

### Modificare lo schema

1. Modifica `apps/server/src/db/schema.ts`.
2. Genera la migrazione: `npm run db:generate -w @garage/server`.
3. Controlla il file `.sql` creato in `apps/server/drizzle/` e committalo insieme a `drizzle/meta/`.
4. Al prossimo avvio il server la applica automaticamente.

Non modificare migrazioni già applicate: Drizzle tiene traccia di quelle eseguite nella tabella `__drizzle_migrations`. Per ripartire da zero in sviluppo basta cancellare `apps/server/data/`.

## Script utili

| Comando (dalla radice) | Cosa fa |
|---|---|
| `npm run dev` | Avvia server e web in modalità sviluppo |
| `npm run db:generate -w @garage/server` | Genera una nuova migrazione dalle modifiche allo schema |
| `npm run db:studio -w @garage/server` | Apre Drizzle Studio per esplorare il database dal browser |
| `npm run build -w @garage/web` | Type-check e build di produzione del web in `apps/web/dist` |
| `npm run lint -w @garage/web` | Lint del frontend con oxlint |
| `npx tsc --noEmit -p apps/server` | Type-check del server |
| `npx tsc --noEmit -p packages/shared` | Type-check del pacchetto condiviso |

Per aggiungere una dipendenza a un singolo pacchetto: `npm install <pacchetto> -w @garage/server` (o `-w @garage/web`).

## API

| Metodo | Percorso | Risposta |
|---|---|---|
| `GET` | `/api/health` | `{ "ok": true, "interventionTypes": ["tagliando", "cambio_gomme", "revisione", "freni", "carrozzeria", "altro"] }` |
