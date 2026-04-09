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

Copy `.env.example` to `.env.local` and set the values you actually need.

Example:

```bash
cp .env.example .env.local
```

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_ANALYTICS_ID`
- `WAITLIST_WEBHOOK_URL_DEV`
- `WAITLIST_WEBHOOK_URL_PROD`
- `INTAKE_WEBHOOK_URL`
- `NOTIFY_EMAIL`
- `TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`

If the waitlist webhook vars are not set, waitlist-bound submissions are accepted and logged server-side as a safe fallback for local and preview verification.

## Commands

```bash
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

## Structure

- `src/app/*`: pages, route handlers, metadata routes
- `src/components/*`: layout, UI primitives, marketing sections, form flows
- `src/lib/*`: content, validation, intake adapters, SEO helpers, utilities
- `src/types/*`: public types for site content and intake payloads
- `tests/e2e/*`: browser coverage for key user paths
- `docs/*`: aktive Messaging-, Launch- und Operating-Notes
