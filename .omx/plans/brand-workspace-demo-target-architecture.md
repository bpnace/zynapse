# Zynapse Brand Workspace Demo Target Architecture

## Ausgangslage

Das aktuelle Repo ist eine Public Marketing Site mit Public Pages, typed Intake-Flows, lokaler Draft-Persistenz und webhook-basierten Route Handlern, aber ohne Workspace, Auth Boundary oder Datenbank-Layer ([README.md:3](../README.md), [README.md:70](../README.md), [docs/plan.md:190](../docs/plan.md), [src/app/layout.tsx:14](../src/app/layout.tsx), [src/app/request/page.tsx:12](../src/app/request/page.tsx), [src/app/login/page.tsx:11](../src/app/login/page.tsx)).  
Die Roadmap erweitert genau dieses Repo um einen invite-only Buyer-Workspace mit Supabase Auth, Drizzle/Postgres, Seed-Daten, Review/Handover und Paid-Pilot-Close ([.claude/brand-workspace-demo-roadmap.md:81](../.claude/brand-workspace-demo-roadmap.md), [.claude/brand-workspace-demo-roadmap.md:142](../.claude/brand-workspace-demo-roadmap.md), [.claude/brand-workspace-demo-roadmap.md:397](../.claude/brand-workspace-demo-roadmap.md), [.claude/brand-workspace-demo-roadmap.md:766](../.claude/brand-workspace-demo-roadmap.md)).  
Das verbundene Supabase-Projekt hat aktuell keine `public`-Tabellen, daher ist die Zielarchitektur Greenfield und kann sauber an der Roadmap ausgerichtet werden.

## Architekturprinzipien

- Public Marketing Site und Buyer Workspace bleiben strikt getrennte Schichten.
- Supabase Auth liefert Identität und Session; Drizzle ist die einzige SQL-Zugriffsschicht.
- Workspace-Regeln liegen serverseitig in Domain-Modulen, nicht in Client-Komponenten.
- Seed-Daten sind kein Demo-Hack, sondern Teil des echten Workspace-Bootstraps.
- Persistente Daten sind dort Pflicht, wo Nutzerzustand, Rollenschutz oder Funnel-Wirkung entstehen.

## Route Map

```text
Public
/
├── /about
├── /brands
├── /cases
├── /contact
├── /creatives
├── /pricing
├── /request
├── /apply
└── /login
    ├── invite login entrypoint
    └── waitlist fallback for non-invited visitors

Auth
/auth/callback

Protected Workspace
/workspace
├── /workspace
├── /workspace/onboarding
├── /workspace/briefs/new
├── /workspace/briefs/[briefId]
├── /workspace/campaigns/[campaignId]
├── /workspace/campaigns/[campaignId]/review
├── /workspace/campaigns/[campaignId]/handover
├── /workspace/pilot-request
└── /workspace/admin/invites
```

Routing-Regeln:
- `/login` bleibt öffentlich, wird aber vom reinen Waitlist-Screen zur Invite-Entry-Surface umgebaut ([src/app/login/page.tsx:13](../src/app/login/page.tsx), [.claude/brand-workspace-demo-roadmap.md:189](../.claude/brand-workspace-demo-roadmap.md)).
- Alle Buyer-Routen liegen unter `src/app/(workspace)/workspace/*`.
- `/workspace/admin/invites` ist nur für `zynapse_ops` sichtbar ([.claude/brand-workspace-demo-roadmap.md:206](../.claude/brand-workspace-demo-roadmap.md)).
- Public und Workspace teilen nur globale Basiskomponenten, aber keine Feature-Komponenten.

## Domain Layer

### 1. `auth`

Verantwortung:
- Supabase SSR Clients
- Session-Lesen/Erneuern
- Membership-Auflösung
- Role Guards
- Route-Zugriff

Module:
- `src/lib/auth/server.ts`
- `src/lib/auth/client.ts`
- `src/lib/auth/session.ts`
- `src/lib/auth/guards.ts`
- `src/lib/auth/roles.ts`

### 2. `db`

Verantwortung:
- Drizzle-Schema
- Verbindung
- Migrations
- Query-Helfer

Module:
- `src/lib/db/index.ts`
- `src/lib/db/schema/*`
- `src/lib/db/queries/*`

### 3. `workspace`

Verantwortung:
- Buyer-Workspace-Orchestrierung
- Dashboard-/Campaign-/Review-/Handover-Read-Models
- Mutations für Onboarding, Brief, Review, Pilot Request
- Seed Bootstrap

Module:
- `src/lib/workspace/queries/*`
- `src/lib/workspace/actions/*`
- `src/lib/workspace/services/*`
- `src/lib/workspace/seeds/*`
- `src/lib/workspace/policies/*`

### 4. `analytics`

Verantwortung:
- erlaubte Event-Namen
- standardisierte Payloads
- Consent-respektierende gtag-Calls

Module:
- `src/lib/analytics/events.ts`
- `src/lib/analytics/payloads.ts`

### 5. `marketing`

Besteht bereits und bleibt getrennt:
- `src/components/marketing/*`
- Public Pages in `src/app/*`
- Public Intake-Flows unter `src/components/forms/*` und `src/app/api/intake/*`

## DB Tabellen mit Beziehungen

```text
organizations (1) ──< memberships >── (n) auth.users
organizations (1) ──< invites
organizations (1) ── (1) brand_profiles
organizations (1) ──< briefs
organizations (1) ──< campaigns
briefs (1) ──< campaigns
campaigns (1) ──< campaign_stages
campaigns (1) ──< assets
briefs (1) ──< assets
assets (1) ──< review_threads
review_threads (1) ──< comments
assets (1) ──< approvals
organizations (1) ──< activity_logs
campaigns (1) ──< pilot_requests
organizations (1) ──< pilot_requests
```

Tabellen:
- `organizations`
- `memberships`
- `invites`
- `brand_profiles`
- `briefs`
- `campaigns`
- `campaign_stages`
- `assets`
- `review_threads`
- `comments`
- `approvals`
- `activity_logs`
- `pilot_requests`

Wichtige Beziehungen:
- `memberships.user_id` referenziert Supabase Auth User ID.
- `brand_profiles.organization_id` ist `1:1` zu `organizations`.
- `campaigns.brief_id` ist nullable nur dann, wenn ein Seed-Campaign zunächst ohne echten Brief erzeugt wird.
- `assets.campaign_id` ist Pflicht; `assets.brief_id` ist optional für seeded Output, aber sinnvoll für spätere Rückverfolgbarkeit.
- `review_threads.asset_id`, `comments.thread_id` und `approvals.asset_id` bilden die Review-Kette.
- `activity_logs.organization_id` ist Pflicht; `actor_id` darf bei systemischen Seed-Events auf `null` oder System-ID gehen.

## Auth Boundary

### Boundary außen

Public:
- `/`
- `/pricing`
- `/request`
- `/apply`
- `/contact`
- `/login`

Protected:
- Alles unter `/workspace/*`
- `/auth/callback` als technischer Übergang

### Boundary innen

AuthN:
- Supabase Auth Session via SSR und Cookie-basierter Session-Lesung

AuthZ:
- Membership-Lookup pro Request
- Org-gebundene Query-Filtration
- Role Guards serverseitig vor jeder Mutation

Empfohlenes Modell:
- Middleware aktualisiert/liest Session und leitet an `/login` weiter, wenn keine gültige Session vorliegt.
- Workspace-Layout lädt `session + membership + organization context`.
- Server Actions validieren zusätzlich `role + org membership`, auch wenn UI bereits gegated ist.

## Rollen und Zugriffskontrolle

Rollen laut Roadmap:
- `brand_admin`
- `brand_reviewer`
- `zynapse_ops`

Capability Matrix:

```text
brand_admin
- view workspace
- edit brand profile
- create/save/submit brief
- comment
- approve/request changes
- submit pilot request

brand_reviewer
- view workspace
- comment
- approve/request changes
- no invite admin
- no org/profile admin

zynapse_ops
- create invites
- inspect all orgs
- seed workspaces
- manage internal status
- no public exposure
```

Guard-Ebenen:
- SQL/RLS oder Query-Level Org-Isolation
- Domain-Guard für Role Capability
- UI-Guard nur als DX-Schicht, nicht als Sicherheitsgrenze

## Seed Pipeline

### Ziel

Jeder Invite erzeugt einen nicht-leeren Workspace mit glaubwürdigem Kampagnenzustand ([.claude/brand-workspace-demo-roadmap.md:576](../.claude/brand-workspace-demo-roadmap.md)).

### Pipeline

1. Ops erstellt Invite mit `seed_template_key`.
2. Invite Acceptance erstellt oder finalisiert Membership.
3. `bootstrapWorkspaceForInvite()` prüft, ob die Org bereits seeded ist.
4. Seed-Service erstellt:
   - `organization`
   - `brand_profile` shell
   - `campaign`
   - `campaign_stages`
   - `assets`
   - `review_threads`
   - `comments`
   - `approvals`
   - `activity_logs`
5. Dashboard liest das resultierende Read Model.

### Seed Templates

- `d2c_product_launch`
- `performance_refresh`
- `review_sprint`

### Seed Artefakte

Im Repo:
- Template-Metadaten
- Textbausteine
- Review-State
- Asset-Manifeste

In Supabase Storage:
- Thumbnails
- Demo Deliverables
- Mock Download Files

## Dateistruktur

### `src/app`

```text
src/app
├── (workspace)
│   └── workspace
│       ├── layout.tsx
│       ├── page.tsx
│       ├── onboarding/page.tsx
│       ├── briefs
│       │   ├── new/page.tsx
│       │   └── [briefId]/page.tsx
│       ├── campaigns
│       │   └── [campaignId]
│       │       ├── page.tsx
│       │       ├── review/page.tsx
│       │       └── handover/page.tsx
│       ├── pilot-request/page.tsx
│       └── admin/invites/page.tsx
├── auth/callback/route.ts
├── api
│   ├── intake/*
│   └── waitlist/route.ts
├── login/page.tsx
└── existing public pages...
```

### `src/lib`

```text
src/lib
├── auth
│   ├── client.ts
│   ├── server.ts
│   ├── session.ts
│   ├── guards.ts
│   └── roles.ts
├── db
│   ├── index.ts
│   ├── schema/*
│   ├── queries/*
│   └── migrations/*
├── workspace
│   ├── actions/*
│   ├── queries/*
│   ├── services/*
│   ├── seeds/*
│   ├── policies/*
│   └── view-models/*
├── analytics
│   ├── events.ts
│   └── payloads.ts
├── intake/*
├── content/*
├── forms/*
└── existing seo/utils/env modules
```

### `src/components`

```text
src/components
├── workspace
│   ├── shell/*
│   ├── dashboard/*
│   ├── onboarding/*
│   ├── briefs/*
│   ├── campaigns/*
│   ├── review/*
│   ├── handover/*
│   ├── pilot-request/*
│   └── admin/*
├── marketing/*
├── layout/*
├── forms/*
├── ui/*
└── animation/*
```

## Klare Trennung zwischen Marketing Site und Workspace

### Was geteilt werden darf

- `src/components/ui/*`
- `src/components/animation/*`
- `src/lib/utils.ts`
- `src/lib/seo.ts`
- globale Styles

### Was getrennt bleiben muss

- Marketing-Sections vs Workspace-Feature-Komponenten
- Public Intake vs Authenticated Workspace-Mutationen
- Pricing-/Positioning-Content vs Workspace-State
- Public Header/Footer Shell vs Workspace Shell

### Praktische Regel

Wenn ein Modul `organization`, `membership`, `campaign`, `review`, `handover` oder `pilot_request` kennt, gehört es nicht in `marketing` und nicht in Public Pages.

## Was als erstes gebaut werden muss

1. Dependency- und Env-Shell mit `pnpm` + Supabase/Drizzle Variablen.
2. Auth Boundary inklusive `/login`, `/auth/callback`, Session Guard und Workspace-Layout.
3. Drizzle Schema + erste Migrationen.
4. Invite + Membership + Workspace Bootstrap.
5. Seed Dashboard, damit der erste Login nicht leer ist.

Warum zuerst:
- Ohne Auth Boundary gibt es keinen sicheren Produktzugang.
- Ohne Schema gibt es keine Seed-Pipeline.
- Ohne Seed Dashboard ist das Buyer-Aha-Moment nicht erreichbar.

## Blockierende Abhängigkeiten

- `Auth Setup` blockiert alle `/workspace/*`-Routen.
- `organizations + memberships + invites` blockieren Role Guards und Org-Isolation.
- `campaigns + assets + stages` blockieren Dashboard, Review und Handover.
- `seed pipeline` blockiert den First-Login-Flow.
- `pricing language mapping` blockiert belastbare CTA-Texte für Pilot/Growth ([src/lib/content/pricing.ts:5](../src/lib/content/pricing.ts), [src/lib/content/pricing.ts:27](../src/lib/content/pricing.ts)).

## Welche Teile mockbar sind

Mockbar in v1:
- Seeded Asset-Inhalte selbst
- Download-Dateien
- Review-Deadline Copy
- Package Recommendation Copy
- Growth-Upsell-Heuristik
- Handover-Rights-Summary als statisch generierte Textblöcke

Nicht mockbar:
- Auth Session
- Membership/Role-Auflösung
- Org-gebundene Queries
- Brief-, Comment-, Approval- und Pilot-Request-State
- Seed Bootstrap Trigger

## Welche Teile echte Persistenz sofort brauchen

Sofort persistent:
- `invites`
- `memberships`
- `organizations`
- `brand_profiles`
- `briefs`
- `campaigns`
- `campaign_stages`
- `assets`
- `review_threads`
- `comments`
- `approvals`
- `activity_logs`
- `pilot_requests`

Begründung:
- Alles davon verändert Buyer-Sichtbarkeit, Rechte oder Funnel-Fortschritt.
- Lokale Browser-Persistenz wie im bestehenden Public Inquiry Wizard reicht nur für öffentliche Pre-Auth-Flows ([src/components/forms/brand-inquiry/brand-inquiry-wizard.tsx:82](../src/components/forms/brand-inquiry/brand-inquiry-wizard.tsx)).

## Empfohlene Implementierungswellen

### Welle 1: Foundation
- Dependencies
- Env
- Auth
- Workspace Route Group
- DB Schema

### Welle 2: Bootstrap
- Invite Console
- Seed Pipeline
- Dashboard

### Welle 3: Buyer Workflow
- Onboarding
- Brief
- Campaign Detail
- Review

### Welle 4: Commercial Close
- Handover
- Pilot Request
- Analytics

## Kurzfazit

Die Zielarchitektur ist ein separater Buyer-Workspace im selben Next.js-Repo, mit Supabase als Identity/Storage-Layer, Drizzle als einzigem DB-Zugriffspfad und einem strikt serverseitigen Workspace-Domain-Layer.  
Die zentrale technische Wahrheit ist: Public Marketing bleibt stateless-orientiert, Workspace wird session-, org- und workflow-state-getrieben.
