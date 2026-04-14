import Link from "next/link";

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
      label: "Engagement",
      value: organizationName,
      detail: primaryChannels ?? audience ?? "Managed delivery workspace",
    },
    {
      label: "Needs input",
      value: String(openReviewCount),
      detail:
        openReviewCount === 1
          ? "1 open review decision is waiting"
          : "Open review decisions are waiting",
    },
    {
      label: "Ready",
      value: String(approvedAssetCount),
      detail:
        approvedAssetCount === 1
          ? "1 approved output is ready for delivery"
          : "Approved outputs are ready for delivery",
    },
    {
      label: "Context",
      value: `${onboardingCompletion.percent}%`,
      detail: onboardingCompletion.isComplete
        ? "Brand context is complete enough for review, delivery, and commercial handoff."
        : `${onboardingCompletion.completed} of ${onboardingCompletion.total} context fields are filled.`,
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
            {item.label === "Context" ? (
              <div className="mt-3">
                <Link
                  href="/workspace/onboarding"
                  className="workspace-button workspace-button-secondary"
                >
                  {onboardingCompletion.isComplete ? "Review context" : "Complete context"}
                </Link>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
