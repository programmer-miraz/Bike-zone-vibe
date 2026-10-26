<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project

Single-package Next.js 16.4 App Router homepage called **BikeZone**: React 19.3, Tailwind v4, TypeScript strict. UI lives in `components/` + `lib/data.ts` and is composed by `app/page.tsx`. No `src/`, no monorepo, no test runner.

## Commands

- `npm run dev` — Turbopack dev server at http://localhost:3000
- `npm run build` / `npm run start` — production build / serve
- `npm run lint` — runs `eslint` directly against the flat config (`eslint.config.mjs`)
- Typecheck — `npx next typegen && npx tsc --noEmit` (there is no `typecheck` script)

`next lint` does not exist in Next 16 and `next build` no longer lints. Run `npm run lint` as a separate step.

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
