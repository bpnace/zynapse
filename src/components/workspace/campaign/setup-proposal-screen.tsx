import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { approveCampaignSetup } from "@/lib/workspace/actions/approve-campaign-setup";
import { brandsWorkspaceRoutes } from "@/lib/workspace/routes";
import { formatWorkspaceLabel } from "@/lib/workspace/formatting";

type SetupProposalScreenProps = {
  campaign: {
    id: string;
    name: string;
    campaignGoal: string | null;
    packageTier: string;
    currentStage: string;
  };
  brief: {
    offer: string;
    audience: string;
    channels: string;
    hooks: string;
    creativeReferences: string;
    budgetRange: string;
    timeline: string;
    approvalNotes: string;
  } | null;
  proposal: {
    heading: string;
    body: string;
  };
  canApproveSetup: boolean;
  stageItems: Array<{
    stageKey: string;
    status: string;
  }>;
};

export function SetupProposalScreen({
  campaign,
  brief,
  proposal,
  canApproveSetup,
  stageItems,
}: SetupProposalScreenProps) {
  const approveSetupAction = approveCampaignSetup.bind(null, campaign.id);
  const showApproveSetup = canApproveSetup && campaign.currentStage === "setup_planned";

  return (
    <div className="workspace-page-stack">
      <section className="workspace-topbar px-5 py-5 sm:px-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="workspace-section-label">Setup Proposal</span>
            <span className="workspace-kicker">{formatWorkspaceLabel(campaign.packageTier)}</span>
          </div>
          <h1 className="font-display text-[2.15rem] leading-[1.02] font-semibold tracking-[-0.05em] text-[var(--workspace-copy-strong)]">
            Setup-Vorschlag für {campaign.name}
          </h1>
          <p className="max-w-3xl text-[0.98rem] leading-7 text-[var(--workspace-copy-body)]">
            Diese Seite verdichtet die eingereichte Kampagnenanfrage in einen ersten Vorschlag für
            Route, Prioritäten und den nächsten Produktionsschritt.
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
          <div className="workspace-panel-muted px-4 py-4">
            <p className="workspace-section-label">Ziel</p>
            <p className="mt-2 text-sm leading-6 text-[var(--workspace-copy-body)]">
              {campaign.campaignGoal ?? "Noch kein Kampagnenziel hinterlegt."}
            </p>
          </div>
          <div className="workspace-panel-muted px-4 py-4">
            <p className="workspace-section-label">Aktueller Stand</p>
            <p className="mt-2 text-sm leading-6 text-[var(--workspace-copy-body)]">
              {formatWorkspaceLabel(campaign.currentStage)}
            </p>
          </div>
          <div className="flex items-center">
            <Link
              href={brandsWorkspaceRoutes.campaigns.detail(campaign.id)}
              className="workspace-button workspace-button-primary w-full sm:w-auto"
            >
              Kampagnenraum öffnen
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <section className="workspace-panel px-5 py-5">
          <div className="space-y-2">
            <p className="workspace-section-label">Vorgeschlagene Richtung</p>
            <h2 className="font-display text-[1.8rem] leading-[1.05] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
              {proposal.heading}
            </h2>
            <p className="text-sm leading-6 text-[var(--workspace-copy-body)]">{proposal.body}</p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="workspace-panel-muted px-4 py-4">
              <p className="workspace-section-label">Offer</p>
              <p className="mt-2 text-sm leading-6 text-[var(--workspace-copy-body)]">
                {brief?.offer ?? "Noch keine Angebotsdetails erfasst."}
              </p>
            </article>
            <article className="workspace-panel-muted px-4 py-4">
              <p className="workspace-section-label">Zielgruppe</p>
              <p className="mt-2 text-sm leading-6 text-[var(--workspace-copy-body)]">
                {brief?.audience ?? "Noch keine Zielgruppe erfasst."}
              </p>
            </article>
            <article className="workspace-panel-muted px-4 py-4">
              <p className="workspace-section-label">Kanäle</p>
              <p className="mt-2 text-sm leading-6 text-[var(--workspace-copy-body)]">
                {brief?.channels ?? "Noch keine Kanalprioritäten erfasst."}
              </p>
            </article>
            <article className="workspace-panel-muted px-4 py-4">
              <p className="workspace-section-label">Budget und Timing</p>
              <p className="mt-2 text-sm leading-6 text-[var(--workspace-copy-body)]">
                {brief ? `${brief.budgetRange} · ${brief.timeline}` : "Noch kein Budget oder Timing erfasst."}
              </p>
            </article>
          </div>

          <div className="mt-5 grid gap-4">
            <article className="workspace-panel-muted px-4 py-4">
              <p className="workspace-section-label">Führende Hooks / Angles</p>
              <p className="mt-2 text-sm leading-6 text-[var(--workspace-copy-body)]">
                {brief?.hooks ?? "Noch keine Hooks oder Richtungen dokumentiert."}
              </p>
            </article>
            <article className="workspace-panel-muted px-4 py-4">
              <p className="workspace-section-label">Referenzen und Freigaben</p>
              <p className="mt-2 text-sm leading-6 text-[var(--workspace-copy-body)]">
                {brief?.creativeReferences ?? "Noch keine Referenzen ergänzt."}
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--workspace-copy-muted)]">
                {brief?.approvalNotes ?? "Noch keine zusätzlichen Freigabehinweise hinterlegt."}
              </p>
            </article>
          </div>
        </section>

        <section className="workspace-panel px-5 py-5">
          <div className="space-y-2">
            <p className="workspace-section-label">Nächste Schritte</p>
            <h2 className="font-display text-[1.7rem] leading-[1.05] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
              Setup-Freigabe und Übergabe
            </h2>
          </div>

          <div className="mt-5 workspace-split-list">
            {stageItems.map((stage) => (
              <div key={stage.stageKey} className="flex items-start gap-3 py-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--workspace-accent)]" />
                <div>
                  <p className="text-sm font-semibold text-[var(--workspace-copy-strong)]">
                    {formatWorkspaceLabel(stage.stageKey)}
                  </p>
                  <p className="mt-1 text-sm text-[var(--workspace-copy-muted)]">
                    Status: {formatWorkspaceLabel(stage.status)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 border-t border-[var(--workspace-line)] pt-4">
            <div className="flex items-start gap-3 rounded-[18px] border border-[var(--workspace-line)] bg-[rgba(255,255,255,0.72)] px-4 py-4">
              <Sparkles className="mt-0.5 h-4 w-4 text-[var(--workspace-accent)]" />
              <div>
                <p className="text-sm font-semibold text-[var(--workspace-copy-strong)]">
                  Dieser Vorschlag ist der Übergang in die Phase-2-Brand-Logik.
                </p>
                <p className="mt-1 text-sm leading-6 text-[var(--workspace-copy-muted)]">
                  Die Seite ist bewusst schlank: Brands sehen den Setup-Vorschlag, nicht die
                  dahinterliegenden Ops-Mechaniken.
                </p>
              </div>
            </div>

            {showApproveSetup ? (
              <div className="mt-4 rounded-[18px] border border-[var(--workspace-line)] bg-[var(--workspace-surface)] px-4 py-4">
                <p className="text-sm font-semibold text-[var(--workspace-copy-strong)]">
                  Passt die Richtung, kann das Setup jetzt freigegeben werden.
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--workspace-copy-muted)]">
                  Der Schritt schiebt die Kampagne in <strong>Production Ready</strong> und hält
                  den Brand-Flow ohne Ops-Oberfläche in Bewegung.
                </p>
                <form action={approveSetupAction} className="mt-4">
                  <button
                    type="submit"
                    className="workspace-button workspace-button-primary w-full sm:w-auto"
                  >
                    Setup freigeben
                  </button>
                </form>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
