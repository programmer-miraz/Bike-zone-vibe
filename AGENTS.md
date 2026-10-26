<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project

Single-package Next.js 16.4 App Router site called **BikeZone**: React 19.3, Tailwind v4, TypeScript strict. No `src/`, no monorepo, no test runner.

Routes: homepage (`app/page.tsx` composed from `components/`), `/bikes` list page, `/bikes/[id]` detail pages, `/api/bikes` route handler, custom `not-found.tsx`. Data comes from MongoDB (`bikezone.bikes`); `lib/sample-bikes.json` is the single source of truth for sample bikes — it feeds both the seeder and the homepage featured showcase, so homepage card links must match real database ids. Bike images are vendored locally in `public/bikes` (Wikimedia Commons); do not point `next/image` at remote URLs (upstream 429 rate limits).

## Commands

- `npm run dev` — Turbopack dev server at http://localhost:3000
- `npm run build` / `npm run start` — production build / serve
- `npm run lint` — runs `eslint` directly against the flat config (`eslint.config.mjs`)
- Typecheck — `npx next typegen && npx tsc --noEmit` (there is no `typecheck` script)
- `npm run seed` — inserts sample bikes from `lib/sample-bikes.json` into MongoDB (`scripts/seed.mjs`)

`next lint` does not exist in Next 16 and `next build` no longer lints. Run `npm run lint` as a separate step.

## MongoDB setup (required for /bikes pages and /api)

- Set `MONGODB_URI` in `.env.local` (copy `.env.example`); **restart the dev server** after adding it. Optional `MONGODB_DB` overrides the default `bikezone` name.
- Missing `MONGODB_URI` → API routes return 503 via `MongoNotConfiguredError`; unreachable DB → 500. Pages show their own error. Don't crash on DB errors.
- `lib/mongodb.ts` and `lib/bikes.ts` are **server-only** — imported via `getDb()` / `listBikes()` / `getBikeById()` from API routes and server components only, never client components (`MONGODB_URI` has no `NEXT_PUBLIC_` prefix on purpose).
- Documents use the bike slug as `_id`; `toBike()` maps `_id` → `id`. Route handlers turn DB errors into JSON with `databaseErrorResponse()` from `lib/bikes.ts`.
- The seed script is insert-only (`$setOnInsert` + upsert) — re-running never modifies existing documents.

## proxy.ts (Next 16's replacement for middleware.ts)

`proxy.ts` runs before rendering with matcher `/bikes/:path*` to give real 404s for unknown slugs — note it rewrites to `/bike-not-found`, a route that does **not currently exist** in `app/` (rewrites to a missing route fall back to the global `not-found.tsx`). Gotchas baked into it: static files in `/public/bikes` match the route pattern, so ids containing a dot are passed through; DB checks are capped at 3s and failures fall through rather than blocking.

## Next 16 gotchas

- Version-matched framework docs are bundled at `node_modules/next/dist/docs/`. Read them before using framework APIs instead of trusting memory.
- App Router global types `PageProps`, `LayoutProps`, and `RouteContext` are generated into `.next/types` by `next dev`, `next build`, or `next typegen`. `tsconfig.json` includes `.next/types` and `.next/dev/types`, so on a cold checkout type checking fails until one of those has run.
- Path alias `@/*` maps to the repo root (`./*`), not `src/`.

## Caching is opt-in: `cacheComponents` + `partialPrefetching`

`next.config.ts` enables `cacheComponents: true` and `partialPrefetching: true`. These are not defaults and change caching behavior:

- Fetches are dynamic by default; cache explicitly with the `"use cache"` directive plus `cacheLife` / `cacheTag`.
- Static shell + streaming (PPR) is the default. `experimental.ppr`, `experimental_ppr`, `experimental.dynamicIO`, and `experimental.useCache` are removed — use the top-level flags.
- Node.js runtime is required; `export const runtime = 'edge'` is deprecated.
- Prerender rejects unstable values in render output: `new Date()` (or anything that changes between renders) fails the build. Use a build-time constant, a `"use cache"` function, or render the value in a client component after mount — and note `react-hooks/set-state-in-effect` forbids `setState` inside `useEffect`, so `useEffect(() => setState(new Date()...))` does not lint.
- Prerender errors print `[stream]` / `[cache]` / `[block]` fixes → wrap data access in `<Suspense>`, add `"use cache"`, or set `export const instant = false`.

## Tailwind v4

Configured entirely in `app/globals.css` (`@import "tailwindcss";`) plus the `@tailwindcss/turbopack` CSS loader in `next.config.ts`. There is no `tailwind.config.*` or PostCSS config — do not add v3-style config files.

## Generated / do not edit

`next-env.d.ts`, `.next/**`, and `node_modules/next/dist/docs/**` are generated. No test runner or CI is configured.
