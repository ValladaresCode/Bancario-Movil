# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

pnpm workspace (`pnpm-workspace.yaml`) with three independent packages. There is no root `package.json`; run commands inside each package.

| Package | Stack | DB | Port | API base path |
|---|---|---|---|---|
| `AuthService-GestionBancaria` | Express 5 (ESM) | PostgreSQL (Sequelize) | 4000 | `/api/v1` |
| `Gestor_Bancario_Backend` | Express 5 (ESM) | MongoDB (Mongoose) | 3000 | `/gestionBancaria/api/v1` |
| `Bancario-Movil` | Expo 55 / React Native 0.83 / React 19 | — | Expo dev server | — |

The mobile app is the client for both backends, selected via env vars (`EXPO_PUBLIC_AUTH_URL` → AuthService, `EXPO_PUBLIC_BANKING_URL` → Gestor backend). The two backends do not call each other; they are linked only through JWTs minted by AuthService and validated by the Gestor backend's `validate-JWT` / `validate-UserJWT` middleware.

## Commands

Install everything from the repo root: `pnpm install`.

Backends (run inside `AuthService-GestionBancaria/` or `Gestor_Bancario_Backend/`):
- `pnpm dev` — nodemon hot reload
- `pnpm start` — production start
- AuthService only: `pnpm lint` / `pnpm lint:fix` (ESLint), `pnpm format` / `pnpm format:check` (Prettier)
- AuthService Postgres for local dev: `docker compose up` (postgres:16, exposed on host port **5435**)

Mobile (run inside `Bancario-Movil/`):
- `pnpm start` — Expo dev server; `pnpm android` / `pnpm ios` / `pnpm web` for a target
- `pnpm lint` — `expo lint`
- `pnpm reset-project` — scaffolds a blank app (destructive; moves current `src` aside)

No automated test suites exist — the `test` scripts in both backends are stubs that exit 1.

## Backend module convention

Both backends use the same feature-folder layout. Each feature under `src/<feature>/` contains `*.model.js`, `*.controller.js`, `*.routes.js` (and sometimes a `*-request.model.js` for admin-approval workflows like signup / account / profile-update requests). Cross-cutting code lives in:
- `configs/` — `app.js` (Express assembly: middleware order, route mounting, error handlers), `db.js` (connection + graceful shutdown on SIGINT/SIGTERM/SIGUSR2), `swagger.js`, `cors-configuration.js`, `helmet-configuration.js`
- `middlewares/` — JWT validation, role/eligibility guards, file upload, request validation
- `helpers/` — business logic, seeders, external services (Cloudinary, email)

To add a feature: create the `src/<feature>/` triplet, then mount its router in `configs/app.js` under the package's base path.

AuthService modules: `auth` (login, roles, signup requests), `users` (profile, update requests). Gestor backend modules: `accounts`, `transactions`, `currencies`, `favorites`, `services`, `promotions`, `chatbot`.

### Notable behaviors
- **AuthService** seeds roles on boot (`helpers/role-seed.js`) and, in `NODE_ENV=development`, runs `sequelize.sync({ alter: true })` to auto-migrate the schema. Sequelize is configured `underscored` + `freezeTableName` (snake_case columns, exact table names, `created_at`/`updated_at`). Config is centralized in `configs/config.js` (JWT, SMTP, Cloudinary, rate limits, security) and read from env. `index.js` registers models before `sequelize.sync`.
- **Gestor backend** starts a cron job (`helpers/promotion-status-cron.js`) after DB connect to maintain promotion active/expired state. Mongo URI comes from `URI_MONGO` (falls back to `mongodb://localhost:27017/gestorBancarioDb`).

## Mobile app

Expo Router (file-based routing) with `typedRoutes` and React Compiler enabled (`app.json`). Routes live in `src/app/`. TypeScript is `strict`; path aliases `@/*` → `src/*` and `@/assets/*` → `assets/*`. Backend base URLs are injected through `EXPO_PUBLIC_*` env vars (see `README.md`); set them to your machine's LAN IP, not `localhost`, so a physical device can reach the backends.

**Expo 55 is a recent major release** — APIs have changed. Per `Bancario-Movil/AGENTS.md`, consult the versioned docs at https://docs.expo.dev/versions/v55.0.0/ before writing mobile code rather than relying on older Expo knowledge.

## Postman collections

API contracts are documented as Postman collections at each backend root (`AuthService-GestorBancario.postman_collection.json`, `Gestor_Bancario_Completo.postman_collection.json`) and via Swagger UI at `/api-docs` on each running backend.
