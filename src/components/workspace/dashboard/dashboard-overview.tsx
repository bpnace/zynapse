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
      detail: primaryChannels ?? audience ?? "Invite-only buyer workspace",
    },
    {
      label: "Campaigns",
      value: String(campaignCount),
      detail: campaignCount === 1 ? "Active seeded campaign" : "Campaigns in workspace",
    },
    {
      label: "Assets",
      value: String(assetCount),
      detail: assetCount === 1 ? "Reviewable output" : "Reviewable outputs",
    },
    {
      label: "Setup progress",
      value: `${onboardingCompletion.percent}%`,
      detail: onboardingCompletion.isComplete
        ? "Brand profile is complete enough for the workspace to feel tailored."
        : `${onboardingCompletion.completed} of ${onboardingCompletion.total} profile fields completed.`,
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
            {item.label === "Setup progress" ? (
              <div className="mt-3">
                <Link
                  href="/workspace/onboarding"
                  className="workspace-button workspace-button-secondary"
                >
                  {onboardingCompletion.isComplete ? "Review setup" : "Continue setup"}
                </Link>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
