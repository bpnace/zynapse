import Link from "next/link";
import { brandsWorkspaceRoutes } from "@/lib/workspace/routes";

type DashboardOverviewProps = {
  organizationName: string;
  audience: string | null;
  primaryChannels: string | null;
  openReviewCount: number;
  approvedAssetCount: number;
  onboardingCompletion: {
    completed: number;
    total: number;
    percent: number;
    isComplete: boolean;
  };
};

export function DashboardOverview({
  organizationName,
  audience,
  primaryChannels,
  openReviewCount,
  approvedAssetCount,
  onboardingCompletion,
}: DashboardOverviewProps) {
  const items = [
    {
      label: "Mandat",
      value: organizationName,
      detail: primaryChannels ?? audience ?? "Geschützter Bereich für laufende Zusammenarbeit",
    },
    {
      label: "Offen",
      value: String(openReviewCount),
      detail:
        openReviewCount === 1
          ? "Eine Freigabe wartet auf Entscheidung"
          : "Offene Freigaben warten auf Entscheidung",
    },
    {
      label: "Freigegeben",
      value: String(approvedAssetCount),
      detail:
        approvedAssetCount === 1
          ? "Eine Variante ist bereit für die Übergabe"
          : "Freigegebene Varianten sind bereit für die Übergabe",
    },
    {
      label: "Kontext",
      value: `${onboardingCompletion.percent}%`,
      detail: onboardingCompletion.isComplete
        ? "Der Markenkontext ist vollständig genug, damit Freigabe, Übergabe und Pilotanfrage auf derselben Grundlage laufen."
        : `${onboardingCompletion.completed} von ${onboardingCompletion.total} Kontextfeldern sind ausgefüllt.`,
    },
  ];

  return (
    <section className="workspace-panel px-5 py-4">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,0.9fr))]">
        {items.map((item, index) => (
          <article
            key={item.label}
            className={index === 0 ? "min-w-0" : "min-w-0 xl:border-l xl:border-[var(--workspace-line)] xl:pl-4"}
          >
            <p className="workspace-section-label">{item.label}</p>
            <p className="mt-2 text-[1.02rem] font-semibold tracking-[-0.02em] text-[var(--workspace-copy-strong)]">
              {item.value}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--workspace-copy-muted)]">
              {item.detail}
            </p>
            {item.label === "Kontext" ? (
              <div className="mt-3">
                <Link
                  href={brandsWorkspaceRoutes.onboarding()}
                  className="workspace-button workspace-button-secondary"
                >
                  {onboardingCompletion.isComplete ? "Kontext prüfen" : "Kontext vervollständigen"}
                </Link>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
