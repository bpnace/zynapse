# Zynapse

Zynapse v1 ist eine conversion-orientierte Marketing-Site mit zwei klaren Onramps:

- Brand Inquiry Wizard für Kampagnenanfragen
- Application Flow für Kreative mit AI-Fokus

Die v1 verkauft ein Ergebnis, nicht eine Plattform: Aus einer Anfrage wird in kurzer Zeit eine fertige Video-Kampagne mit klarer Rollenlogik zwischen Brand, Kreativen und Studio.

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

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_ANALYTICS_ID`
- `INTAKE_WEBHOOK_URL`
- `NOTIFY_EMAIL`
- `TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`

If `INTAKE_WEBHOOK_URL` is not set, intake submissions are accepted and logged server-side as a safe fallback for local and preview verification.

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
- `docs/*`: launch and operating notes
