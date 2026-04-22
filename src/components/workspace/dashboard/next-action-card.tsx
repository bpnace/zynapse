import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { brandsWorkspaceRoutes } from "@/lib/workspace/routes";

type NextActionCardProps = {
  campaignId?: string | null;
  builderHref?: string;
  builderLabel?: string;
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
  builderHref,
  builderLabel = "Kampagne erstellen",
  title,
  body,
  onboardingCompletion,
}: NextActionCardProps) {
  const primaryHref = campaignId
    ? brandsWorkspaceRoutes.campaigns.detail(campaignId)
    : builderHref ?? brandsWorkspaceRoutes.campaigns.new();
  const primaryLabel = campaignId ? "Kampagnenstand ansehen" : "Kampagne erstellen";

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
          <Link href={primaryHref} className="workspace-button workspace-button-primary">
            {primaryLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
          {campaignId && builderHref ? (
            <Link href={builderHref} className="workspace-button workspace-button-secondary">
              {builderLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
