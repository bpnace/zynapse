# Zynapse

Zynapse v1 ist eine brands-first Marketing-Site für AI-Marketingkampagnen mit
zwei klaren Onramps:

- Brand Inquiry Wizard für Brands mit Kampagnenbedarf
- Application Flow für AI-Kreative und Spezialist:innen im kuratierten Netzwerk

Die v1 verkauft kein Tool und keinen offenen Creator-Marktplatz, sondern ein
koordiniertes Ergebnis:

- Brands kommen mit Briefing, Ziel, Offer und Budget
- Zynapse kuratiert das passende Spezialist:innen-Setup
- Daraus entstehen lean koordinierte Kampagnen-Setups mit Varianten, Review und
  Handover

## Current positioning

- Nicht: generische AI-Video-Plattform
- Nicht: offener Creator-Marktplatz
- Nicht: klassischer Agentur-Overhead
- Sondern: kuratiertes Netzwerk plus orchestrierter Kampagnenfluss

## Stack

- `pnpm`
- `Next.js 16` App Router
- `React 19`
- `Tailwind CSS 4`
- `react-hook-form` + `zod`
- `Vitest` + `Playwright`

## Local setup

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Environment

Create `.env.local` and set only the values you actually need.

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_ANALYTICS_ID`
- `WAITLIST_WEBHOOK_URL_DEV`
- `WAITLIST_WEBHOOK_URL_PROD`
- `INTAKE_WEBHOOK_URL`
- `NOTIFY_EMAIL`
- `TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`

If the waitlist webhook vars are not set, waitlist-bound submissions are accepted and logged server-side as a safe fallback for local and preview verification.

For server-side workspace data access, configure either:

- `DATABASE_URL`
- or a pooled runtime URL such as `DATABASE_POOL_URL` / `POSTGRES_URL`

## Commands

```bash
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
pnpm demo:reset -- --email team@brand.com --password "demo-password"
```

## Closed Demo Workspace

The protected workspace demo is invite-only and currently optimized around the
flagship `d2c_product_launch` seed template.

For a repeatable customer or e2e demo flow:

1. Configure:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DEMO_WORKSPACE_LOGIN_ENABLED=true`
   - `DEMO_WORKSPACE_EMAIL` (defaults to `demo@zynapse.eu`)
   - `DEMO_WORKSPACE_ORGANIZATION_SLUG` (optional, defaults to `zynapse-closed-demo`)
   - `E2E_WORKSPACE_EMAIL` (optional override for browser automation)
   - `E2E_WORKSPACE_PASSWORD`
2. Create or confirm the auth user in Supabase Auth. The reset command will
   attach that user to the canonical closed demo workspace and refresh the
   seeded campaign state.
3. Reset and reseed the demo workspace:

```bash
pnpm demo:reset -- --email "${E2E_WORKSPACE_EMAIL:-$DEMO_WORKSPACE_EMAIL}" --password "$E2E_WORKSPACE_PASSWORD"
```

4. Log in through `/demo-login` with the canonical demo credentials. The route
   is only exposed when `DEMO_WORKSPACE_LOGIN_ENABLED=true`.
5. Walk the flow: `/workspace` -> review -> handover.
6. After a prospect demo, rerun `pnpm demo:reset` to restore the canonical
   seeded state before the next session.

The current demo reuses public videos from `public/videos/*` and placeholder
images from `public/hero/*` / `public/brand/*`. These can be swapped later
without changing the workspace UI contract as long as the seeded asset paths
and `assets.source` values remain aligned.

### Demo safety contract

- The closed demo is intentionally read-only in the product UI.
- Review decisions, brand setup changes, briefs, and pilot-request handoffs are
  blocked for the demo user and should be treated as showcase-only.
- The shell visibly labels the workspace as a closed demo and explains that
  content is reset for demos.

## Structure

- `src/app/*`: pages, route handlers, metadata routes
- `src/components/*`: layout, UI primitives, marketing sections, form flows
- `src/lib/*`: content, validation, intake adapters, SEO helpers, utilities
- `src/types/*`: public types for site content and intake payloads
- `tests/e2e/*`: browser coverage for key user paths
- `docs/*`: aktive Messaging-, Launch- und Operating-Notes
