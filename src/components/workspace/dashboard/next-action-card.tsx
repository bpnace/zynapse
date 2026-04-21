import { ArrowRight } from "lucide-react";
import { brandsWorkspaceRoutes } from "@/lib/workspace/routes";

type NextActionCardProps = {
  campaignId?: string | null;
  briefHref?: string;
  title: string;
  body: string;
  onboardingCompletion?: {
    completed: number;
    total: number;
    percent: number;
    isComplete: boolean;
  };
};

export function NextActionCard({
  campaignId,
  briefHref,
  title,
  body,
  onboardingCompletion,
}: NextActionCardProps) {
  return (
    <section className="workspace-panel px-5 py-5">
      <div className="space-y-2">
        <p className="workspace-section-label">Nächster sinnvoller Schritt</p>
        <div className="workspace-stat-strip">
          {onboardingCompletion ? (
            <span className="workspace-stat-chip">
              Kontext {onboardingCompletion.percent}%
            </span>
          ) : null}
        </div>
      </div>
      <h2 className="mt-4 font-display text-[1.8rem] leading-[1.05] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-7 text-[var(--workspace-copy-body)]">
        {body}
      </p>
      <div className="mt-5 border-t border-[var(--workspace-line)] pt-4">
        <div className="grid gap-3">
          <a
            href={campaignId ? brandsWorkspaceRoutes.campaigns.detail(campaignId) : "#campaign-focus"}
            className="workspace-button workspace-button-primary"
          >
            Kampagnenstand ansehen
            <ArrowRight className="h-4 w-4" />
          </a>
          {briefHref ? (
            <a href={briefHref} className="workspace-button workspace-button-secondary">
              Briefing erstellen
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
