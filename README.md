# Zynapse

<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-19-20232A?style=flat-square&logo=react&logoColor=61DAFB" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=0B1220" />
  <img alt="Playwright" src="https://img.shields.io/badge/Playwright-E2E-2EAD33?style=flat-square&logo=playwright&logoColor=white" />
</p>

AI campaign platform prototype connecting brand intake, creative applications,
typed workflows, Supabase-backed data, and production-oriented frontend
engineering.

## What this shows

- Product-facing Next.js app architecture with App Router, React 19, and Tailwind CSS 4
- Typed brand inquiry and creator application flows with `react-hook-form` and `zod`
- Supabase and Drizzle foundation for authenticated workspace and campaign data
- SEO, sitemap, metadata, and intake route handling for a public marketing surface
- Test coverage across Vitest and Playwright for critical user paths

## Product shape

Zynapse v1 is a brands-first marketing site for AI campaign work with two direct
onramps:

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
