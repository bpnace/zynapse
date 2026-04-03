import Link from "next/link";

type DashboardOverviewProps = {
  organizationName: string;
  audience: string | null;
  primaryChannels: string | null;
  campaignCount: number;
  assetCount: number;
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
  campaignCount,
  assetCount,
  onboardingCompletion,
}: DashboardOverviewProps) {
  const items = [
    {
      label: "Organisation",
      value: organizationName,
      detail: primaryChannels ?? audience ?? "Privater Brand-Workspace",
    },
    {
      label: "Kampagnen",
      value: String(campaignCount),
      detail: campaignCount === 1 ? "1 aktive Kampagne im Workspace" : "Kampagnen aktuell im Workspace",
    },
    {
      label: "Assets",
      value: String(assetCount),
      detail: assetCount === 1 ? "1 Asset ist reviewbereit" : "Assets sind reviewbereit",
    },
    {
      label: "Setup-Fortschritt",
      value: `${onboardingCompletion.percent}%`,
      detail: onboardingCompletion.isComplete
        ? "Der Brand-Kontext ist vollständig genug, damit sich der Workspace spezifisch anfühlt."
        : `${onboardingCompletion.completed} von ${onboardingCompletion.total} Profilfeldern sind ausgefüllt.`,
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
            {item.label === "Setup-Fortschritt" ? (
              <div className="mt-3">
                <Link
                  href="/workspace/onboarding"
                  className="workspace-button workspace-button-secondary"
                >
                  {onboardingCompletion.isComplete ? "Setup prüfen" : "Setup fortsetzen"}
                </Link>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
