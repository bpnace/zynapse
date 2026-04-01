# Brand Workspace Demo Phase 1 Foundation Plan

## Kontext

Ziel von Phase 1 ist ein minimaler, aber echter invite-only Einstieg: Ein eingeladener User soll sich über Supabase Auth im App Router anmelden können und danach sofort einen seeded Workspace mit echter Persistenz sehen. Das bestehende Repo nutzt `pnpm`, `Next.js 16` App Router und hat aktuell nur Public-Marketing-Flows ohne Auth-, DB- oder Workspace-Layer ([package.json:5](../package.json), [docs/plan.md:166](../docs/plan.md), [src/app/login/page.tsx:64](../src/app/login/page.tsx), [src/app/layout.tsx:96](../src/app/layout.tsx), [src/lib/env.ts:129](../src/lib/env.ts)).

## 1. Minimale Phase-1-Reihenfolge

### Schritt 1: Foundations für Auth und DB vorbereiten

Ziel:
- technische Basisschicht für Supabase SSR + Drizzle bereitstellen

Betroffene Dateien:
- `package.json`
- `.env.example`
- `src/lib/env.ts`
- `drizzle.config.ts`
- `src/lib/auth/*`
- `src/lib/db/*`

Abhängigkeiten:
- blockiert alle weiteren Schritte

Ergebnis:
- Supabase- und DB-Konfiguration ist im Repo vorgesehen
- Drizzle kann gegen `DATABASE_URL` arbeiten
- Auth-Clients und DB-Entry-Point sind definiert

### Schritt 2: Auth Boundary und Route Shell bauen

Ziel:
- `/login` als Invite-Login-Entrypoint
- `/auth/callback` als Supabase Callback
- `(workspace)` als geschützte Route Group

Betroffene Dateien:
- `src/app/login/page.tsx`
- `src/app/auth/callback/route.ts`
- `src/app/(workspace)/workspace/layout.tsx`
- `src/app/(workspace)/workspace/page.tsx`
- `middleware.ts` oder `src/lib/auth/middleware.ts`
- `src/lib/auth/guards.ts`

Abhängigkeiten:
- benötigt Schritt 1

Ergebnis:
- nicht authentifizierte User werden aus dem Workspace ferngehalten
- eingeladene User kommen nach erfolgreichem Callback in den Workspace-Kontext

### Schritt 3: Minimales Drizzle-Schema für Invite-Only Login migrieren

Ziel:
- die kleinste persistente Datenbasis für eingeloggten Org-Kontext schaffen

Betroffene Dateien:
- `src/lib/db/schema/organizations.ts`
- `src/lib/db/schema/invites.ts`
- `src/lib/db/schema/memberships.ts`
- `src/lib/db/schema/brand-profiles.ts`
- `src/lib/db/index.ts`
- `drizzle/*`

Abhängigkeiten:
- benötigt Schritt 1
- muss vor Workspace-Bootstrap abgeschlossen sein

Ergebnis:
- Invite, Membership und Org-Kontext sind echt persistent

### Schritt 4: Invite Acceptance und Workspace Bootstrap bauen

Ziel:
- nach Login Membership finden oder abschließen
- bei erstem gültigen Login seeded Workspace anlegen

Betroffene Dateien:
- `src/lib/workspace/seeds/bootstrap-workspace.ts`
- `src/lib/workspace/seeds/templates/*`
- `src/lib/workspace/services/accept-invite.ts`
- `src/lib/workspace/queries/get-workspace-bootstrap.ts`
- optional `src/lib/workspace/actions/create-invite.ts`

Abhängigkeiten:
- benötigt Schritte 2 und 3

Ergebnis:
- eingeloggter User landet nicht auf leerer Shell, sondern auf persisted Seed-Daten

### Schritt 5: Minimalen seeded Workspace rendern

Ziel:
- dashboardartige Startseite mit echter Seed-Persistenz und klarer Next Action

Betroffene Dateien:
- `src/app/(workspace)/workspace/page.tsx`
- `src/components/workspace/shell/*`
- `src/components/workspace/dashboard/*`
- `src/lib/workspace/queries/get-dashboard-view.ts`

Abhängigkeiten:
- benötigt Schritt 4

Ergebnis:
- erster Login zeigt seeded Campaign, Stages, Assets und CTA

## 2. Supabase Auth Flow im App Router

Empfohlener Flow:

1. Ops erzeugt Invite-Datensatz in `invites` mit `email`, `role`, `organization_id`, `seed_template_key`, `expires_at`.
2. User öffnet Invite-Link und landet auf `/login`.
3. `/login` startet Magic-Link- oder OTP-basierten Sign-in gegen Supabase Auth, bleibt aber öffentlich und behält den Waitlist-Fallback ([src/app/login/page.tsx:64](../src/app/login/page.tsx)).
4. Supabase sendet den User auf `/auth/callback`.
5. `/auth/callback` tauscht Session/Cookies aus und leitet serverseitig weiter.
6. Middleware oder Workspace-Layout prüft Session.
7. Server-Layer löst Membership für den eingeloggten User.
8. Falls Membership/Invite akzeptiert werden muss, passiert das serverseitig im Invite-Accept-Service.
9. Danach lädt `/workspace` den Org-Kontext und stößt, falls nötig, einmalig den Seed-Bootstrap an.

Boundary-Regeln:
- Public: `/login`, `/auth/callback`, bestehende Marketing-Routen
- Protected: alles unter `/workspace/*`
- AuthZ nicht im Client, sondern über Membership + Role Guard im Server-Layer

Betroffene Dateien:
- `src/app/login/page.tsx`
- `src/app/auth/callback/route.ts`
- `src/app/(workspace)/workspace/layout.tsx`
- `middleware.ts`
- `src/lib/auth/server.ts`
- `src/lib/auth/client.ts`
- `src/lib/auth/session.ts`
- `src/lib/auth/guards.ts`
- `src/lib/auth/roles.ts`

## 3. Drizzle Schema Reihenfolge für die ersten Tabellen

Minimale Migrationsreihenfolge für Phase 1:

1. `organizations`
2. `invites`
3. `memberships`
4. `brand_profiles`
5. `campaigns`
6. `campaign_stages`
7. `assets`

Begründung:
- `organizations` ist Root für Tenant-Isolation.
- `invites` muss vor Membership existieren, weil Invite-only der Eintrittspfad ist.
- `memberships` bindet Supabase User IDs an Org und Rollen.
- `brand_profiles` gibt dem Dashboard einen nicht-leeren Brand-Kontext.
- `campaigns`, `campaign_stages`, `assets` sind das minimale Seed-Modell für den ersten sichtbaren Workspace.

Noch nicht nötig für Phase 1:
- `briefs`
- `review_threads`
- `comments`
- `approvals`
- `activity_logs`
- `pilot_requests`

Diese können direkt danach kommen, aber blockieren den ersten Login mit seeded Dashboard nicht.

## 4. Tabellen für den ersten invite only Login zwingend nötig

Zwingend nötig:
- `organizations`
- `invites`
- `memberships`

Warum:
- ohne `organizations` kein Tenant-Kontext
- ohne `invites` kein Invite-only Access-Modell
- ohne `memberships` keine serverseitige Rollen- und Org-Zuordnung zum eingeloggten Supabase-User

Optional, aber stark empfohlen in derselben Welle:
- `brand_profiles`

Warum:
- damit der eingeloggte User nicht in einen generischen, unpersonaliserten Workspace fällt

## 5. Tabellen, die direkt für den seeded workspace mitgebaut werden müssen

Für den ersten echten seeded Workspace direkt mitbauen:
- `brand_profiles`
- `campaigns`
- `campaign_stages`
- `assets`

Minimaler Seed-Datensatz pro Org:
- 1 `brand_profile`
- 1 `campaign`
- mehrere `campaign_stages`
- mehrere `assets`

Noch nicht zwingend in derselben Welle:
- `review_threads`
- `comments`
- `approvals`

Wenn der erste Workspace nur sichtbar und glaubwürdig sein soll, reichen seeded Assets plus Stages.  
Wenn Phase 1 schon konkrete Review-Actions enthalten soll, müssen `review_threads`, `comments` und `approvals` in dieselbe Migrationswelle gezogen werden.

## 6. Welche Dateien zuerst angelegt werden sollten

### Welle A: technische Eintrittspunkte

- `drizzle.config.ts`
- `src/lib/auth/server.ts`
- `src/lib/auth/client.ts`
- `src/lib/auth/session.ts`
- `src/lib/auth/guards.ts`
- `src/lib/auth/roles.ts`
- `src/lib/db/index.ts`
- `middleware.ts`

### Welle B: App-Router-Shell

- `src/app/auth/callback/route.ts`
- `src/app/(workspace)/workspace/layout.tsx`
- `src/app/(workspace)/workspace/page.tsx`

### Welle C: minimales Schema

- `src/lib/db/schema/organizations.ts`
- `src/lib/db/schema/invites.ts`
- `src/lib/db/schema/memberships.ts`
- `src/lib/db/schema/brand-profiles.ts`
- `src/lib/db/schema/campaigns.ts`
- `src/lib/db/schema/campaign-stages.ts`
- `src/lib/db/schema/assets.ts`

### Welle D: Bootstrap und Read Model

- `src/lib/workspace/seeds/types.ts`
- `src/lib/workspace/seeds/templates/d2c-product-launch.ts`
- `src/lib/workspace/seeds/bootstrap-workspace.ts`
- `src/lib/workspace/services/accept-invite.ts`
- `src/lib/workspace/queries/get-workspace-bootstrap.ts`
- `src/lib/workspace/queries/get-dashboard-view.ts`

### Welle E: UI für ersten Seed-Workspace

- `src/components/workspace/shell/workspace-shell.tsx`
- `src/components/workspace/dashboard/dashboard-overview.tsx`
- `src/components/workspace/dashboard/stage-tracker.tsx`
- `src/components/workspace/dashboard/asset-grid.tsx`
- `src/components/workspace/dashboard/next-action-card.tsx`

## 7. Welche Env Variablen sofort gebraucht werden

Sofort nötig für Phase 1:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`

Direkt danach sinnvoll, wenn Seed-Assets über Storage laufen:
- `SUPABASE_DEMO_ASSETS_BUCKET`

Noch nicht nötig für den ersten invite-only Login mit Seed-Dashboard:
- `SUPABASE_BRAND_INPUTS_BUCKET`
- `PILOT_REQUEST_WEBHOOK_URL`

Bereits vorhanden und weiterhin relevant:
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_ANALYTICS_ID`
- `INTAKE_WEBHOOK_URL`
- `NOTIFY_EMAIL`

Betroffene bestehende Dateien:
- `.env.example`
- `src/lib/env.ts`

## 8. Welche Teile als Server Actions und welche als Route Handler gebaut werden sollen

### Route Handler

Route Handler nur für technische HTTP-/Auth-Grenzen:
- `src/app/auth/callback/route.ts`
- optional später: `src/app/api/workspace/uploads/sign/route.ts`

Begründung:
- Callback-Handling ist ein klarer HTTP-Einstiegspunkt
- Signed Uploads wären ebenfalls transportnah

### Server Actions

Server Actions für authentifizierte, rollenabhängige Workspace-Mutationen:
- Invite anlegen
- Invite akzeptieren oder finalisieren
- Workspace Bootstrap triggern, falls noch nicht erfolgt
- Brand Profile initialisieren oder aktualisieren

Für das reine Phase-1-Ziel reicht minimal:
- `createInvite`
- `acceptInviteMembership`
- `bootstrapWorkspaceIfMissing`

Noch nicht nötig in Phase 1:
- Brief Draft/Submit
- Comment/Approval Actions
- Pilot Request

Begründung:
- diese Flows sind erst relevant, wenn über den seeded Workspace hinaus interaktive Buyer-Workflows gebaut werden

## Priorisierte Build-Reihenfolge mit Abhängigkeiten

1. `pnpm`-basierte Dependency-/Env-Vorbereitung
   - Dateien: `package.json`, `.env.example`, `src/lib/env.ts`
   - blockiert alles Weitere

2. Supabase SSR Auth-Grundlage
   - Dateien: `src/lib/auth/*`, `middleware.ts`
   - blockiert Route-Schutz und Callback

3. App-Router Auth Entry + Workspace Shell
   - Dateien: `src/app/auth/callback/route.ts`, `src/app/(workspace)/workspace/*`, `src/app/login/page.tsx`
   - benötigt Schritt 2

4. Minimales Drizzle-Schema migrieren
   - Dateien: `drizzle.config.ts`, `src/lib/db/*`, `src/lib/db/schema/*`
   - benötigt Schritt 1
   - blockiert Invite Acceptance und Seed Bootstrap

5. Invite Acceptance + Membership-Auflösung
   - Dateien: `src/lib/workspace/services/accept-invite.ts`, `src/lib/workspace/queries/get-workspace-bootstrap.ts`
   - benötigt Schritte 2 bis 4

6. Seed Bootstrap für ersten Workspace
   - Dateien: `src/lib/workspace/seeds/*`, `src/lib/workspace/queries/get-dashboard-view.ts`
   - benötigt Schritt 5

7. Minimalen seeded Workspace rendern
   - Dateien: `src/components/workspace/dashboard/*`, `src/app/(workspace)/workspace/page.tsx`
   - benötigt Schritt 6

## Abnahmekriterien für dieses Fundament

- eingeladener User kann sich über `/login` anmelden
- Supabase Callback erzeugt eine nutzbare Session
- Workspace-Routen sind geschützt
- Membership und Org-Kontext werden serverseitig aufgelöst
- erster erfolgreicher Login zeigt persisted Seed-Daten aus der DB
- der Workspace ist nicht leer und zeigt mindestens Brand-Kontext, Kampagne, Stages und Assets
