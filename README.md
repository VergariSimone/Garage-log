# Garage Log

Web app per registrare gli interventi eseguiti sulla propria auto (tagliandi, cambio gomme, revisioni, freni, carrozzeria…).

> **Stato:** Fase 1 — impalcatura del progetto. Per ora c'è solo l'endpoint di health check e una pagina che lo mostra; database e gestione degli interventi arriveranno nelle fasi successive.

## Stack

- **Monorepo** con [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces)
- **Server:** Node.js + [Hono](https://hono.dev), eseguito in sviluppo con `tsx`
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

## Script utili

| Comando (dalla radice) | Cosa fa |
|---|---|
| `npm run dev` | Avvia server e web in modalità sviluppo |
| `npm run build -w @garage/web` | Type-check e build di produzione del web in `apps/web/dist` |
| `npm run lint -w @garage/web` | Lint del frontend con oxlint |
| `npx tsc --noEmit -p apps/server` | Type-check del server |
| `npx tsc --noEmit -p packages/shared` | Type-check del pacchetto condiviso |

Per aggiungere una dipendenza a un singolo pacchetto: `npm install <pacchetto> -w @garage/server` (o `-w @garage/web`).

## API

| Metodo | Percorso | Risposta |
|---|---|---|
| `GET` | `/api/health` | `{ "ok": true, "interventionTypes": ["tagliando", "cambio_gomme", "revisione", "freni", "carrozzeria", "altro"] }` |
