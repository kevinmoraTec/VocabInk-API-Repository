# LingoLoop Backend — Project Guidelines

## Architecture

Layered Express.js API (Node.js, ES modules) with PostgreSQL via Sequelize ORM.

```
index.js                → Express setup, middleware, CORS, Passport
src/routes/*.router.js  → Route definitions (thin controllers)
src/schemas/*.schema.js → Joi validation schemas
src/services/*.service.js → Business logic (class-based)
src/db/models/*.model.js  → Sequelize model definitions
src/libs/sequelize.js     → DB connection + model registry
src/middlewares/           → Auth (JWT), validation, error handling
src/utils/strategies/      → OAuth strategies (Google, LinkedIn)
config/config.js           → Centralized env-based configuration
```

**Key decisions:**
- Routes are thin — all business logic lives in services
- Models use a two-pass init: `init()` then `associate()` (see [src/db/models/index.js](src/db/models/index.js))
- Errors use `@hapi/boom` throughout; the global error handler in `src/middlewares/error.handler.js` formats them
- API is versioned under `/v1/`
- Auth: Google/LinkedIn OAuth → JWT stored in HTTP-only cookies

## Build and Test

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (Node `--watch`) |
| `npm start` | Production start |
| `npm run migrations:run` | Run pending DB migrations |
| `npm run migrations:undo` | Undo last migration |
| `npm run migrations:revert` | Undo all migrations |
| `npm run migrations:generate --name <name>` | Create new migration |
| `npm run seed:run` | Run all seeders |
| `npm run seed:one --seed <name>` | Run a specific seeder |

Production uses **PM2** (`ecosystem.config.cjs`).

## Conventions

### Adding a new resource

Follow the existing pattern in this order:

1. **Migration** in `src/db/migrations/` — snake_case table name, UUID primary keys with `UUIDV4` default
2. **Model** in `src/db/models/` — `<name>.model.js`, extend `Model`, implement static `init()` and `associate()`; register in `src/db/models/index.js`
3. **Schema** in `src/schemas/` — Joi validation; export named schemas (e.g., `createSchema`, `updateSchema`, `getSchema`)
4. **Service** in `src/services/` — class-based, import models from `src/libs/sequelize.js`, throw `boom.*` errors for not-found / bad-request
5. **Router** in `src/routes/` — use `validatorHandler(schema, 'body'|'params')` middleware, `checkAuth` for protected routes; register in `src/routes/index.js`

### Naming

- **Files:** `camelCase.type.js` (e.g., `postActions.router.js`, `user.service.js`)
- **DB tables:** `snake_case` (e.g., `generated_posts`, `category_vocabulary`)
- **DB columns:** `snake_case` with auto-managed `createdAt`/`updatedAt`
- **Primary keys:** UUID (`DataTypes.UUID`, `defaultValue: UUIDV4`)
- **Foreign keys:** explicit references with `CASCADE` / `NO ACTION`

### Code patterns

- Use `findOrCreate()` for idempotent creation where duplicates are undesirable
- Use `boom.notFound()` / `boom.badRequest()` instead of raw HTTP errors
- Route handlers: `try { ... } catch (error) { next(error); }`
- Import models via: `import { models } from '../libs/sequelize.js';`
- All files use ES module syntax (`import`/`export`)

### Auth

- Protect routes with `checkAuth` middleware — it reads JWT from `req.cookies.token`
- Decoded user payload available at `req.user` (`sub`, `email`, `name`, `picture`)

## Database

- ORM: Sequelize 6 with PostgreSQL
- Connection string via `DATABASE_URL` env var (pool: max 50, acquire 30s, idle 10s)
- Migrations managed by `sequelize-cli` — never modify existing migrations, create new ones
- See [README.md](../README.md#environment-variables) for required env vars
