# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install          # install dependencies (uses pnpm, not npm)
pnpm start:dev        # development with hot reload
pnpm build            # compile TypeScript
pnpm start:prod       # run compiled output (requires build first)

pnpm prisma:generate  # regenerate Prisma client after schema changes
pnpm prisma:migrate   # create and apply a new migration
pnpm prisma:deploy    # apply pending migrations (production)
pnpm prisma:studio    # open Prisma Studio GUI

pnpm test             # run all unit tests
pnpm test:watch       # watch mode
pnpm test:cov         # with coverage
pnpm lint             # ESLint with auto-fix
```

Run a single test file:
```bash
pnpm test -- --testPathPattern="get-ex-table-by-id"
```

After every `prisma/schema.prisma` change, run `pnpm prisma:generate` before starting the server — the Prisma client must be regenerated or TypeScript will report missing types.

## Environment Variables

Required in `.env` (see `.env.example`):
- `DATABASE_URL` + `DIRECT_URL` — PostgreSQL connection strings
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — min 16 characters
- `PORT` — defaults to 3000

Optional: `CORS_ORIGINS`, `THROTTLE_TTL_MS`, `THROTTLE_LIMIT`, `BODY_LIMIT`, `KAFKA_BROKERS`, `KAFKA_CLIENT_ID`

Env is validated at startup via Joi (`src/config/env.validation.ts`). The app will refuse to start if required vars are missing.

## Architecture

This is a **NestJS + CQRS + Clean Architecture** backend. Every domain concept (user, business-trip, banner, department, position, …) is split across four layers:

```
src/
  domain/          ← entities, repository interfaces, domain exceptions
  application/     ← CQRS command/query handlers, application modules
  infrastructure/  ← Prisma repository implementations, infra modules
  presentation/    ← HTTP controllers, DTOs, guards, presentation modules
```

### Adding a new module — the checklist

1. **Domain** — `domain/<name>/<name>.entity.ts` + `domain/<name>/<name>.repository.ts` (interface + Symbol token)
2. **Application** — `commands/` + `queries/` + `index.ts` exports + `<name>-application.module.ts`
3. **Infrastructure** — `infrastructure/prisma/repositories/<name>.repository.impl.ts` + `infrastructure/<name>/<name>-infrastructure.module.ts`
4. **Presentation** — `presentation/<name>/dto/` + controller(s) + `<name>.module.ts`
5. **Wire up** — add infra module to `InfrastructureModule`, app module to `ApplicationModule`, presentation module to `PresentationModule`
6. **Schema** — add model to `prisma/schema.prisma`, then `pnpm prisma:migrate` + `pnpm prisma:generate`

### CQRS conventions

- Commands mutate state; queries read state — never mix.
- Each handler is decorated `@CommandHandler(XCommand)` / `@QueryHandler(XQuery)` and registered in the `providers` array of its application module.
- Application modules import the **infrastructure module** (not PrismaModule directly) so the repository token is provided.
- Presentation modules import `ApplicationModule` (which re-exports everything) and also register the handlers locally in `providers`.

### Request/Response envelope

Every response is wrapped by `BaseResponseInterceptor`:
```json
{ "success": true, "data": { ... } }
{ "success": false, "error": { "code": "NOT_FOUND", "message": "..." }, "meta": { "traceId": "..." } }
```
Controllers return plain objects or DTOs — the interceptor wraps them automatically.

### Auth & access control

- All routes require a valid JWT by default (`JwtAuthGuard` is global).
- Mark public endpoints with `@Public()` decorator.
- Restrict to admin with `@Roles(UserRole.ADMIN)` on the controller class or method.
- `@CurrentUser()` parameter decorator extracts the authenticated user from the request.

### Domain exceptions

Throw these from domain/application layers — `GlobalExceptionFilter` maps them to HTTP:

| Exception | HTTP |
|---|---|
| `NotFoundDomainException` | 404 |
| `ConflictDomainException` | 409 |
| `ForbiddenDomainException` | 403 |
| `UnauthorizedDomainException` | 401 |
| `DomainValidationException` | 422 |
| `BusinessRuleViolationException` | 422 |

### Image uploads

Use `createImageUploadOptions(subdir, maxSizeMB?)` from `src/presentation/common/upload/image-upload.config.ts` to create multer options per module. Use `buildFileUrl(req, subdir, filename)` from `image-upload.util.ts` to build the public URL. Uploaded files are served as static assets under `/uploads/<subdir>/`.

### API base path

All endpoints are prefixed `api/v1/` — e.g. `POST /api/v1/admin/departments`.

Swagger is available at `http://localhost:<PORT>/docs`.
