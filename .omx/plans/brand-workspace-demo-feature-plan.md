# Zynapse Brand Workspace Demo Feature Plan

## Repo-Befund

Das bestehende Repo ist aktuell eine öffentliche Marketing-Site auf `Next.js 16` mit `pnpm`, bestehenden Public Pages, typed Intake-Flows, lokalen Drafts im Browser und webhook-basierten Route-Handlern, aber ohne Auth-, Session-, Datenbank- oder Workspace-Schicht ([package.json:5](../package.json), [docs/plan.md:176](../docs/plan.md), [docs/plan.md:190](../docs/plan.md), [src/app/login/page.tsx:11](../src/app/login/page.tsx), [src/app/request/page.tsx:12](../src/app/request/page.tsx), [src/components/forms/brand-inquiry/brand-inquiry-wizard.tsx:76](../src/components/forms/brand-inquiry/brand-inquiry-wizard.tsx), [src/app/api/intake/brand/route.ts:56](../src/app/api/intake/brand/route.ts), [src/lib/env.ts:4](../src/lib/env.ts), [src/components/layout/site-analytics.tsx:25](../src/components/layout/site-analytics.tsx)).  
Die Roadmap verlangt dagegen einen invite-only Buyer-Workspace mit Supabase Auth, Postgres/Drizzle, Seed-Daten, Workflow-State, Review/Handover und Pilot-Request-Conversion ([.claude/brand-workspace-demo-roadmap.md:56](../.claude/brand-workspace-demo-roadmap.md), [.claude/brand-workspace-demo-roadmap.md:132](../.claude/brand-workspace-demo-roadmap.md), [.claude/brand-workspace-demo-roadmap.md:189](../.claude/brand-workspace-demo-roadmap.md), [.claude/brand-workspace-demo-roadmap.md:770](../.claude/brand-workspace-demo-roadmap.md)).

## Priorisierte Build-Reihenfolge

### 1. Neue Ordner und Route-Gruppen

Priorität: `P0`, weil das Repo derzeit nur Public-Flows und Public/API-Routen enthält und zuerst eine klare Produktgrenze zwischen Marketing-Site und Workspace braucht ([src/app/login/page.tsx:11](../src/app/login/page.tsx), [src/app/request/page.tsx:12](../src/app/request/page.tsx), [.claude/brand-workspace-demo-roadmap.md:673](../.claude/brand-workspace-demo-roadmap.md)).

Betroffene neue Ordner:
- `src/app/(workspace)/workspace/page.tsx`
- `src/app/(workspace)/workspace/layout.tsx`
- `src/app/(workspace)/workspace/onboarding/page.tsx`
- `src/app/(workspace)/workspace/briefs/new/page.tsx`
- `src/app/(workspace)/workspace/briefs/[briefId]/page.tsx`
- `src/app/(workspace)/workspace/campaigns/[campaignId]/page.tsx`
- `src/app/(workspace)/workspace/campaigns/[campaignId]/review/page.tsx`
- `src/app/(workspace)/workspace/campaigns/[campaignId]/handover/page.tsx`
- `src/app/(workspace)/workspace/pilot-request/page.tsx`
- `src/app/(workspace)/workspace/admin/invites/page.tsx`
- `src/app/auth/callback/route.ts`
- `src/components/workspace/`
- `src/lib/auth/`
- `src/lib/db/`
- `src/lib/workspace/`
- `src/lib/analytics/`

Betroffene bestehende Dateien:
- `src/app/login/page.tsx` von Waitlist-Einstieg zu Invite-Login mit Fallback-Waitlist umbauen ([src/app/login/page.tsx:4](../src/app/login/page.tsx)).
- `src/app/layout.tsx` nur global halten; keine Workspace-Produktlogik in Public-Layout mischen ([src/app/layout.tsx:13](../src/app/layout.tsx), [.claude/brand-workspace-demo-roadmap.md:685](../.claude/brand-workspace-demo-roadmap.md)).
- `.env.example` und `src/lib/env.ts` für Supabase-/Database-/Bucket-Variablen erweitern ([.env.example:1](../.env.example), [src/lib/env.ts:4](../src/lib/env.ts), [.claude/brand-workspace-demo-roadmap.md:163](../.claude/brand-workspace-demo-roadmap.md)).

Konkrete Reihenfolge:
1. Route Group `(workspace)` und Workspace-Layout anlegen.
2. Auth Callback Route und Login-Entrypoint anlegen.
3. Domain-Ordner `auth`, `db`, `workspace`, `analytics` anlegen.
4. Buyer-Surfaces und Ops-Surface darunter einsortieren.

Abnahme:
- Marketing-Routen bleiben unverändert erreichbar.
- Alle neuen Workspace-Seiten hängen unter einer einzigen geschützten Route Group.
- Kein Workspace-Code landet in `src/components/marketing/*`.

### 2. Auth Setup mit Supabase SSR

Priorität: `P0`, weil fast alle Roadmap-Surfaces Auth und Tenant-Isolation voraussetzen ([.claude/brand-workspace-demo-roadmap.md:56](../.claude/brand-workspace-demo-roadmap.md), [.claude/brand-workspace-demo-roadmap.md:391](../.claude/brand-workspace-demo-roadmap.md), [.claude/brand-workspace-demo-roadmap.md:770](../.claude/brand-workspace-demo-roadmap.md)).

Neue Dateien:
- `src/lib/auth/server.ts`
- `src/lib/auth/client.ts`
- `src/lib/auth/middleware.ts` oder `middleware.ts`
- `src/lib/auth/guards.ts`
- `src/lib/auth/roles.ts`
- `src/app/auth/callback/route.ts`
- optional `src/app/login/actions.ts`

Betroffene bestehende Dateien:
- `package.json` um exakt die Roadmap-Libraries ergänzen: `@supabase/supabase-js`, `@supabase/ssr`, `drizzle-orm`, `drizzle-kit`, `postgres`; Package Manager bleibt `pnpm` ([package.json:5](../package.json), [.claude/brand-workspace-demo-roadmap.md:132](../.claude/brand-workspace-demo-roadmap.md)).
- `src/app/login/page.tsx` und `src/components/forms/waitlist/login-waitlist-form.tsx` als kombinierter Invite-Login + Waitlist-Fallback refactoren ([src/app/login/page.tsx:13](../src/app/login/page.tsx), [src/components/forms/waitlist/login-waitlist-form.tsx:21](../src/components/forms/waitlist/login-waitlist-form.tsx), [.claude/brand-workspace-demo-roadmap.md:189](../.claude/brand-workspace-demo-roadmap.md)).
- `.env.example` und `src/lib/env.ts` um `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL` erweitern ([.env.example:1](../.env.example), [src/lib/env.ts:6](../src/lib/env.ts), [.claude/brand-workspace-demo-roadmap.md:167](../.claude/brand-workspace-demo-roadmap.md)).

Konkrete Reihenfolge:
1. Dependencies per `pnpm` ergänzen.
2. SSR-Clients für Server/Browser aufsetzen.
3. Cookie-/Session-Refresh über Middleware oder zentrale Guard-Layer einführen.
4. Invite-Login-Flow mit Magic Link/Invite Link anbinden.
5. Role- und Org-Guard für `(workspace)` und `/workspace/admin/invites` aktivieren.

Abnahme:
- Eingeladener User kann sich einloggen und landet im Workspace.
- Nicht-authentifizierter oder nicht eingeladener User bleibt draußen und sieht den Waitlist-Fallback.
- `brand_admin`, `brand_reviewer`, `zynapse_ops` werden serverseitig ausgewertet.

### 3. Drizzle Schema und Migration-Reihenfolge

Priorität: `P0`, weil Seeding, AuthZ, Workflow-State und UI alle auf einer stabilen Datenstruktur aufbauen ([.claude/brand-workspace-demo-roadmap.md:400](../.claude/brand-workspace-demo-roadmap.md), [.claude/brand-workspace-demo-roadmap.md:772](../.claude/brand-workspace-demo-roadmap.md)).

Neue Dateien:
- `drizzle.config.ts`
- `src/lib/db/schema/organizations.ts`
- `src/lib/db/schema/memberships.ts`
- `src/lib/db/schema/invites.ts`
- `src/lib/db/schema/brand-profiles.ts`
- `src/lib/db/schema/briefs.ts`
- `src/lib/db/schema/campaigns.ts`
- `src/lib/db/schema/campaign-stages.ts`
- `src/lib/db/schema/assets.ts`
- `src/lib/db/schema/review-threads.ts`
- `src/lib/db/schema/comments.ts`
- `src/lib/db/schema/approvals.ts`
- `src/lib/db/schema/activity-logs.ts`
- `src/lib/db/schema/pilot-requests.ts`
- `src/lib/db/index.ts`
- `drizzle/*.sql`

Empfohlene Migration-Reihenfolge:
1. `organizations`
2. `invites`
3. `memberships`
4. `brand_profiles`
5. `briefs`
6. `campaigns`
7. `campaign_stages`
8. `assets`
9. `review_threads`
10. `comments`
11. `approvals`
12. `activity_logs`
13. `pilot_requests`

Warum diese Reihenfolge:
- Org- und Invite-Layer zuerst, weil AuthZ und Bootstrap darauf hängen.
- Brief/Campaign/Stage/Asset danach, weil sie den ersten Login-Aha-Moment tragen.
- Review- und Approval-Tabellen erst danach, weil sie auf Asset-Identitäten aufbauen.
- Activity und Pilot Request zuletzt, weil sie auf bestehenden Workflows aufsetzen.

Betroffene bestehende Dateien:
- `src/types/intake.ts` und `src/lib/validation/*` nur als Referenzquelle für Feldnamen nutzen, nicht als finale Workspace-Domaintypen recyceln ([docs/plan.md:192](../docs/plan.md), [src/components/forms/brand-inquiry/brand-inquiry-wizard.tsx:22](../src/components/forms/brand-inquiry/brand-inquiry-wizard.tsx), [.claude/brand-workspace-demo-roadmap.md:850](../.claude/brand-workspace-demo-roadmap.md)).

Abnahme:
- Drizzle kann alle Tabellen in frischer Reihenfolge migrieren.
- Jede relationale Abhängigkeit ist über Foreign Keys und sinnvolle Indizes abgedeckt.
- Seed-Templates können eine komplette Demo-Organisation mit Kampagne, Assets und Review-State erzeugen.

### 4. Server Actions und Route Handlers

Priorität: `P1`, weil die Repo-Konvention heute auf Route-Handlern plus thin submitter-Modulen basiert, die Roadmap aber für authentifizierte Workspace-Mutationen Server Actions verlangt ([src/app/api/intake/brand/route.ts:56](../src/app/api/intake/brand/route.ts), [src/lib/intake/submit-brand.ts:99](../src/lib/intake/submit-brand.ts), [.claude/brand-workspace-demo-roadmap.md:650](../.claude/brand-workspace-demo-roadmap.md)).

Neue Dateien:
- `src/lib/workspace/actions/save-brand-profile.ts`
- `src/lib/workspace/actions/save-brief-draft.ts`
- `src/lib/workspace/actions/submit-brief.ts`
- `src/lib/workspace/actions/create-review-thread.ts`
- `src/lib/workspace/actions/add-comment.ts`
- `src/lib/workspace/actions/resolve-thread.ts`
- `src/lib/workspace/actions/approve-asset.ts`
- `src/lib/workspace/actions/request-asset-changes.ts`
- `src/lib/workspace/actions/submit-pilot-request.ts`
- `src/lib/workspace/actions/create-invite.ts`
- `src/lib/workspace/queries/*.ts`
- `src/app/auth/callback/route.ts`
- optional `src/app/api/workspace/uploads/sign/route.ts`

Betroffene bestehende Dateien:
- `src/lib/forms/storage.ts` bleibt Mustergeber für Draft-Handling, aber Workspace-Drafts müssen serverseitig persistiert werden ([src/lib/forms/storage.ts:113](../src/lib/forms/storage.ts), [.claude/brand-workspace-demo-roadmap.md:299](../.claude/brand-workspace-demo-roadmap.md)).
- `src/app/api/intake/*` bleiben Public-Marketing-Routen und werden nicht mit Workspace-Logik vermischt ([src/app/api/intake/brand/route.ts:47](../src/app/api/intake/brand/route.ts), [.claude/brand-workspace-demo-roadmap.md:685](../.claude/brand-workspace-demo-roadmap.md)).

Konkrete Reihenfolge:
1. Query-Layer für Organization, Membership, Campaign, Asset, Review, Pilot Request.
2. Server Actions für Brand Profile und Brief Draft/Submit.
3. Server Actions für Review-Aktionen und Stage-Updates.
4. Server Action für Pilot Request + Webhook-Handoff.
5. Route Handler nur für Auth Callback und gegebenenfalls Signed Upload Helpers.

Abnahme:
- Business-Logik lebt serverseitig in `src/lib/workspace/*`, nicht in Client-Komponenten.
- Brief Submit macht Draft read-only.
- Approval/Change Request aktualisiert Asset- und Campaign-Status atomar.

### 5. Seed-Strategie

Priorität: `P1`, weil der erste Login laut Roadmap nie leer sein darf und die gesamte Demo auf seeded beliefability basiert ([.claude/brand-workspace-demo-roadmap.md:576](../.claude/brand-workspace-demo-roadmap.md), [.claude/brand-workspace-demo-roadmap.md:780](../.claude/brand-workspace-demo-roadmap.md)).

Neue Dateien:
- `src/lib/workspace/seeds/templates/d2c-product-launch.ts`
- `src/lib/workspace/seeds/templates/performance-refresh.ts`
- `src/lib/workspace/seeds/templates/review-sprint.ts`
- `src/lib/workspace/seeds/bootstrap-workspace.ts`
- `src/lib/workspace/seeds/types.ts`
- `src/lib/workspace/seeds/demo-assets-manifest.ts`
- optional `scripts/seed-brand-workspace-demo.ts`

Empfohlene Seed-Reihenfolge:
1. Organization anlegen.
2. Invite und Membership anlegen.
3. Brand Profile Shell anlegen.
4. Campaign plus Campaign Stages seed-en.
5. Assets plus Thumbnail-/Storage-Metadaten seed-en.
6. Beispiel-Threads, Comments und Approvals seed-en.
7. Activity Logs und Next Action seed-en.

Empfohlene Asset-Quelle:
- Seed-Metadaten im Repo versionieren.
- Demo-Dateien initial aus `public/` oder einem dedizierten Seed-Ordner hochladen.
- Laufzeit-Surfaces nur über Supabase Storage lesen, damit Handover/Downloads wie echtes Produktverhalten wirken ([.claude/brand-workspace-demo-roadmap.md:148](../.claude/brand-workspace-demo-roadmap.md), [.claude/brand-workspace-demo-roadmap.md:596](../.claude/brand-workspace-demo-roadmap.md)).

Abnahme:
- Jeder Invite kann genau ein Seed Template wählen.
- Jeder First Login zeigt 1 Kampagne, 6-12 Assets, vorhandene Review-Spuren und einen klaren nächsten CTA.

### 6. UI Surfaces in sinnvoller Bau-Reihenfolge

Priorität: `P1`, aber innerhalb der UI strikt sequentiell bauen, damit jede neue Surface auf echtem State statt auf Platzhaltern aufliegt.

Empfohlene Bau-Reihenfolge:
1. `Login / Invite Acceptance`
2. `Ops Invite Console`
3. `Workspace Layout + Dashboard`
4. `Brand Onboarding`
5. `Brief Creation`
6. `Campaign Detail`
7. `Review Room`
8. `Handover Center`
9. `Pilot Request Flow`

Begründung:
- Ohne Login und Invite Console gibt es keine echte Eintrittskante.
- Das Dashboard muss vor Onboarding/Brief stehen, weil die Roadmap zuerst Wert zeigen und erst danach Setup-Aufwand verlangen will ([.claude/brand-workspace-demo-roadmap.md:694](../.claude/brand-workspace-demo-roadmap.md)).
- Review und Handover kommen nach Campaign Detail, weil sie auf seeded Assets und Workflow-State aufbauen.
- Pilot Request zuletzt, weil er Context Prefill aus Organization + Campaign braucht ([.claude/brand-workspace-demo-roadmap.md:371](../.claude/brand-workspace-demo-roadmap.md)).

Betroffene neue Komponenten:
- `src/components/workspace/login/*`
- `src/components/workspace/admin/invite-console.tsx`
- `src/components/workspace/dashboard/*`
- `src/components/workspace/onboarding/*`
- `src/components/workspace/briefs/*`
- `src/components/workspace/campaigns/*`
- `src/components/workspace/review/*`
- `src/components/workspace/handover/*`
- `src/components/workspace/pilot-request/*`

Wiederverwendung aus dem Repo:
- Form primitives aus `src/components/forms/form-primitives.tsx`
- Button/UI primitives aus `src/components/ui/*`
- Motion/visual language aus `src/components/animation/*`
- Pricing copy aus `src/lib/content/pricing.ts` für `Starter`/`Growth` CTAs ([src/lib/content/pricing.ts:5](../src/lib/content/pricing.ts), [src/lib/content/pricing.ts:27](../src/lib/content/pricing.ts), [.claude/brand-workspace-demo-roadmap.md:698](../.claude/brand-workspace-demo-roadmap.md))

Abnahme:
- Jede Primärseite hat genau eine klare nächste Aktion.
- Für jede große Surface existieren Loading-, Empty-, Error- und Success-States ([.claude/brand-workspace-demo-roadmap.md:763](../.claude/brand-workspace-demo-roadmap.md)).

### 7. Analytics Events

Priorität: `P2`, weil das Produkt ohne Funnel-Lesbarkeit seinen Demo-Zweck verfehlt, aber die Event-Schicht auf Auth, Org, Campaign und CTA-Flows aufbauen muss ([src/components/layout/site-analytics.tsx:25](../src/components/layout/site-analytics.tsx), [.claude/brand-workspace-demo-roadmap.md:720](../.claude/brand-workspace-demo-roadmap.md)).

Neue Dateien:
- `src/lib/analytics/events.ts`
- `src/lib/analytics/workspace-event-payload.ts`
- optional `src/components/workspace/analytics/workspace-analytics.tsx`

Betroffene bestehende Dateien:
- `src/components/layout/site-analytics.tsx` bleibt das gtag-Bootstrap-Skript.
- Workspace-Komponenten feuern Events nur nach Consent und nur mit den erlaubten Properties ([src/components/layout/site-analytics.tsx:36](../src/components/layout/site-analytics.tsx), [.claude/brand-workspace-demo-roadmap.md:736](../.claude/brand-workspace-demo-roadmap.md)).

Event-Einführungsreihenfolge:
1. `invite_accepted`
2. `workspace_opened`
3. `demo_campaign_viewed`
4. `brief_started`
5. `brief_submitted`
6. `asset_commented`
7. `asset_approved`
8. `pilot_request_started`
9. `pilot_request_submitted`

Abnahme:
- Keine PII und kein Freitext in Events.
- Alle Events enthalten nur die erlaubten Standard-Properties.
- Seed-Template-Performance kann später im Funnel ausgewertet werden.

### 8. Risiken und offene Architekturentscheidungen

Priorität: `vor Implementierung finalisieren`, weil diese Punkte die Datei- und API-Struktur verändern, wenn sie zu spät geklärt werden.

Risiko 1: Session-Refresh nur per Layout Guard oder zusätzlich per Middleware.  
Empfehlung: Middleware für SSR-Session-Erneuerung plus serverseitige Role-Guards im Workspace-Layout.  
Entscheidung nötig vor Auth-Implementierung.

Risiko 2: Invite Acceptance über Supabase-native Invite-Mechanik oder eigenes Invite-Table-Token als Business-Layer.  
Empfehlung: Supabase für Identity, eigene `invites`-Tabelle für `seed_template_key`, Rolle und Ablaufdaten, weil die Roadmap explizite Invite-Metadaten braucht ([.claude/brand-workspace-demo-roadmap.md:420](../.claude/brand-workspace-demo-roadmap.md)).

Risiko 3: Seed-Assets sofort in Supabase Storage oder anfangs aus `public/` referenzieren.  
Empfehlung: Asset-Dateien einmalig in Supabase Storage hochladen und nur Seed-Manifeste im Repo halten, damit Review/Handover und Download-Center dasselbe Verhalten nutzen.

Risiko 4: Comments/Approvals als fein granularer Thread-State oder als vereinfachte Asset-Level Actions.  
Empfehlung: Tabellen wie in der Roadmap anlegen, aber v1-UI nur Asset-Level Anchors plus einfache Thread-Liste rendern; komplexe Inline-Kommentare erst später.

Risiko 5: Uploads im Brief v1 direkt live oder erst nach Dashboard/Review.  
Empfehlung: v1-Phase 1 ohne Buyer-Uploads starten, nur Referenz-Links/Freitext im Brief; Signed Upload Route erst aktivieren, wenn Seed- und Handover-Flows stabil laufen.

Risiko 6: RLS-Policy-Komplexität mit Drizzle-Migrations plus Supabase Auth.  
Empfehlung: Erst minimale Org-/Membership-Policies aufsetzen, dann Review/Pilot-Request-Mutationen ergänzen; Policies als eigene Migrationseinheiten behandeln.

## Empfohlene Gesamt-Reihenfolge

1. Route- und Domain-Shell anlegen.
2. Supabase SSR Auth + Guarding implementierbar machen.
3. Drizzle Schema + erste Migrationskette definieren.
4. Invite Bootstrap und Seed-System aufbauen.
5. Dashboard und Ops Invite Console bauen.
6. Onboarding und Brief Workflow anschließen.
7. Campaign Detail, Review Room und Handover ergänzen.
8. Pilot Request Flow und Webhook-Handoff anschließen.
9. Analytics Events und abschließende Testabdeckung ergänzen.

## Verification

- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm test:e2e`
- Zusätzliche neue Tests einplanen für Auth Guarding, Seed Bootstrap, Review-State und Pilot Request entsprechend Roadmap-Testplan ([.claude/brand-workspace-demo-roadmap.md:812](../.claude/brand-workspace-demo-roadmap.md)).
