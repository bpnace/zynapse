# Brand Workspace Demo Phase 1 Checklist

Basis:
- Roadmap: [brand-workspace-demo-roadmap.md](/Users/bumpinace/Documents/CodeStuff/zynapse/.claude/brand-workspace-demo-roadmap.md)
- Zielarchitektur: [brand-workspace-demo-target-architecture.md](/Users/bumpinace/Documents/CodeStuff/zynapse/.omx/plans/brand-workspace-demo-target-architecture.md)
- Feature-Plan: [brand-workspace-demo-feature-plan.md](/Users/bumpinace/Documents/CodeStuff/zynapse/.omx/plans/brand-workspace-demo-feature-plan.md)

Ziel:
- eingeladener User loggt sich ein
- Workspace-Routen sind geschützt
- nach erstem Login ist ein echter seeded Workspace sichtbar

## 1. Erste Dateien, die angelegt werden müssen

`P0` `drizzle.config.ts`
- Startpunkt für Drizzle-Migrationen; blockiert das gesamte Schema.

`P0` `src/lib/auth/server.ts`
- Server-Supabase-Client für SSR-Session und Callback-Follow-up.

`P0` `src/lib/auth/client.ts`
- Browser-Supabase-Client für Login-Flow.

`P0` `src/lib/auth/session.ts`
- zentrale Session-Auflösung für App Router.

`P0` `src/lib/auth/guards.ts`
- Auth- und Org-Guarding für Workspace.

`P0` `src/lib/auth/roles.ts`
- Rollenmodell `brand_admin`, `brand_reviewer`, `zynapse_ops`.

`P0` `src/lib/db/index.ts`
- einziger DB-Entry-Point für Drizzle.

`P0` `middleware.ts`
- Session-Refresh und Redirect auf `/login` für geschützte Routen.

`P0` `src/app/auth/callback/route.ts`
- sofort nötiger Route Handler für Supabase Auth Callback.

`P0` `src/app/(workspace)/workspace/layout.tsx`
- geschützte Shell für den gesamten Workspace.

`P0` `src/app/(workspace)/workspace/page.tsx`
- erstes Ziel nach Login; seeded Dashboard.

`P0` `src/lib/db/schema/organizations.ts`
- Root für Tenant Scoping.

`P0` `src/lib/db/schema/invites.ts`
- Invite-only Access-Modell.

`P0` `src/lib/db/schema/memberships.ts`
- Zuordnung Supabase User -> Org -> Rolle.

`P1` `src/lib/db/schema/brand-profiles.ts`
- minimaler nicht-generischer Brand-Kontext im Workspace.

`P1` `src/lib/db/schema/campaigns.ts`
- Seed-Kampagne für First Login.

`P1` `src/lib/db/schema/campaign-stages.ts`
- sichtbarer Fortschritt im Dashboard.

`P1` `src/lib/db/schema/assets.ts`
- sichtbare Deliverables beim ersten Login.

`P1` `src/lib/workspace/seeds/types.ts`
- Seed-Verträge und Template-Struktur.

`P1` `src/lib/workspace/seeds/bootstrap-workspace.ts`
- erzeugt den seeded Workspace.

`P1` `src/lib/workspace/seeds/templates/d2c-product-launch.ts`
- erstes minimales Seed-Template.

`P1` `src/lib/workspace/services/accept-invite.ts`
- Invite-Akzeptanz und Membership-Finalisierung.

`P1` `src/lib/workspace/queries/get-workspace-bootstrap.ts`
- lädt Session-, Membership- und Org-Kontext.

`P1` `src/lib/workspace/queries/get-dashboard-view.ts`
- Read Model für das erste seeded Dashboard.

## 2. Minimale Tabellenmenge für invite-only login plus tenant scoping

`P0` `organizations`
- ohne Org kein Tenant Scope.

`P0` `invites`
- ohne Invite kein Invite-only Login.

`P0` `memberships`
- ohne Membership keine Rollen- oder Org-Zuordnung nach Login.

Diese drei Tabellen reichen für:
- Invite anlegen
- User einloggen
- User einer Org zuordnen
- Workspace-Zugriff serverseitig absichern

## 3. Danach direkt nötige Tabellen für den ersten seeded workspace

`P1` `brand_profiles`
- damit der Workspace nicht generisch wirkt.

`P1` `campaigns`
- eine seeded Kampagne ist Kern des Aha-Moments.

`P1` `campaign_stages`
- zeigt sichtbaren Fortschritt statt leerer Shell.

`P1` `assets`
- liefert die seeded Deliverables für den ersten Login.

Noch nicht nötig für genau dieses Phase-1-Ziel:
- `briefs`
- `review_threads`
- `comments`
- `approvals`
- `activity_logs`
- `pilot_requests`

## 4. Reihenfolge der Drizzle Migrationen

`P0` `organizations`
- Basis für alles weitere.

`P0` `invites`
- braucht `organization_id`.

`P0` `memberships`
- braucht `organization_id` und Supabase User IDs.

`P1` `brand_profiles`
- 1:1 an `organizations`.

`P1` `campaigns`
- seeded Kampagne pro Org.

`P1` `campaign_stages`
- braucht `campaign_id`.

`P1` `assets`
- braucht `campaign_id`, optional `brief_id` erst später relevant.

## 5. Supabase Auth SSR Bausteine im App Router

`P0` `/login`
- öffentlicher Entrypoint, von Waitlist zu Invite-Login mit Fallback umbauen.

`P0` `/auth/callback`
- tauscht Auth-Response gegen Session/Cookies.

`P0` `middleware.ts`
- prüft Session für `/workspace/*`, erneuert SSR-Cookies, leitet sonst auf `/login`.

`P0` `src/app/(workspace)/workspace/layout.tsx`
- lädt Session, Membership und Org-Kontext serverseitig.

`P0` `src/lib/auth/server.ts`
- SSR-Supabase-Client.

`P0` `src/lib/auth/client.ts`
- Client-Supabase-Client für Magic Link / OTP Flow.

`P0` `src/lib/auth/session.ts`
- zentrale Session-Lesung.

`P0` `src/lib/auth/guards.ts`
- Auth- und Membership-Checks.

`P0` `src/lib/auth/roles.ts`
- Capability-Mapping für Rollen.

## 6. Welche Route Handler sofort nötig sind

`P0` `src/app/auth/callback/route.ts`
- sofort nötig; ohne ihn kein sauberer Supabase Auth Return im App Router.

Nicht sofort nötig:
- `src/app/api/workspace/uploads/sign/route.ts`
- interne Webhook-Handler für Handover/Pilot Request

## 7. Welche Server Actions in Phase 1 noch nicht nötig sind

Noch nicht nötig:
- Brief Draft speichern
- Brief Submit
- Comment erstellen
- Approval / Changes Request
- Pilot Request Submit
- Upload-bezogene Actions

Für Phase 1 reicht stattdessen serverseitige Domain-Logik für:
- Invite akzeptieren/finalisieren
- Workspace bootstrap nur bei Bedarf ausführen

## 8. Welche Env Variablen sofort blockierend sind

`P0` `NEXT_PUBLIC_SUPABASE_URL`
- ohne Frontend-Supabase-Client kein Login.

`P0` `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ohne Browser-Auth kein Invite-Login-Flow.

`P0` `SUPABASE_SERVICE_ROLE_KEY`
- nötig für Bootstrap-/Invite-/Seed-Aktionen auf Server-Seite.

`P0` `DATABASE_URL`
- ohne Drizzle-Migrationen und typed DB access kein Persistenz-Layer.

`P1` `SUPABASE_DEMO_ASSETS_BUCKET`
- nötig, sobald seeded Assets nicht nur als DB-Metadaten, sondern als echte Storage-Dateien geladen werden.

Noch nicht blockierend für Phase 1:
- `SUPABASE_BRAND_INPUTS_BUCKET`
- `PILOT_REQUEST_WEBHOOK_URL`

## 9. Konkrete Abhängigkeiten und Risiken

`P0` Abhängigkeit: Auth vor Workspace
- ohne Supabase SSR Auth sind `/workspace/*` und `(workspace)`-Layout sinnlos.

`P0` Abhängigkeit: Schema vor Bootstrap
- ohne `organizations`, `invites`, `memberships`, `brand_profiles`, `campaigns`, `campaign_stages`, `assets` kann kein seeded Workspace entstehen.

`P1` Abhängigkeit: Bootstrap vor UI
- Dashboard sollte erst gebaut werden, wenn Read Model und Seed-Daten wirklich existieren.

`P0` Risiko: Invite-Modell zu eng an Supabase koppeln
- Empfehlung: eigene `invites`-Tabelle behalten, weil `seed_template_key`, Rolle und Ablaufdaten Roadmap-Pflicht sind.

`P0` Risiko: Session nur im Layout statt zusätzlich in Middleware
- Empfehlung: Middleware für Redirect/Refresh, Layout für serverseitige Membership-Auflösung.

`P1` Risiko: Seed-Assets zu spät auf Storage heben
- Empfehlung: DB-Metadaten sofort, Storage-Bucket direkt mit vorbereiten, damit der erste Workspace nicht später umgebaut werden muss.

`P1` Risiko: zu viele Tabellen in Phase 1
- Empfehlung: `briefs`, `review_threads`, `comments`, `approvals`, `activity_logs`, `pilot_requests` bewusst in die nächste Welle schieben, solange das Phase-1-Ziel nur Login + seeded Workspace ist.

## Priorisierte Build-Reihenfolge

`P0` Dependencies und Env vorbereiten
- Dateien: [package.json](/Users/bumpinace/Documents/CodeStuff/zynapse/package.json), [.env.example](/Users/bumpinace/Documents/CodeStuff/zynapse/.env.example), [src/lib/env.ts](/Users/bumpinace/Documents/CodeStuff/zynapse/src/lib/env.ts)
- Begründung: Repo bleibt bei `pnpm`; Supabase/Drizzle sind laut Roadmap die einzige neue Basis.

`P0` Auth SSR Bausteine anlegen
- Dateien: `src/lib/auth/*`, `middleware.ts`, `src/app/auth/callback/route.ts`
- Begründung: schützt den Workspace und ermöglicht Invite Login.

`P0` Workspace Route Shell anlegen
- Dateien: `src/app/(workspace)/workspace/layout.tsx`, `src/app/(workspace)/workspace/page.tsx`, [src/app/login/page.tsx](/Users/bumpinace/Documents/CodeStuff/zynapse/src/app/login/page.tsx)
- Begründung: definiert den Eintritt und die geschützte Ziel-Surface.

`P0` Minimales Schema migrieren
- Dateien: `drizzle.config.ts`, `src/lib/db/index.ts`, `src/lib/db/schema/{organizations,invites,memberships}.ts`
- Begründung: minimaler invite-only Login plus Tenant Scope.

`P1` Seed-Workspace-Schema ergänzen
- Dateien: `src/lib/db/schema/{brand-profiles,campaigns,campaign-stages,assets}.ts`
- Begründung: erster Login soll nicht leer sein.

`P1` Invite Acceptance und Bootstrap bauen
- Dateien: `src/lib/workspace/services/accept-invite.ts`, `src/lib/workspace/seeds/*`, `src/lib/workspace/queries/*`
- Begründung: erzeugt persisted Seed-Zustand pro eingeladenem User.

`P1` Seeded Dashboard rendern
- Dateien: `src/components/workspace/dashboard/*`, `src/components/workspace/shell/*`, `src/app/(workspace)/workspace/page.tsx`
- Begründung: erfüllt das Phase-1-Ziel sichtbar im Produkt.
