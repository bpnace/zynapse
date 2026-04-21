import Link from "next/link";
import { redirect } from "next/navigation";
import { requireWorkspaceAccess } from "@/lib/auth/guards";
import { shouldGateBrandHome } from "@/lib/workspace/profile-completion";
import { getDashboardView } from "@/lib/workspace/queries/get-dashboard-view";
import { brandsWorkspaceRoutes } from "@/lib/workspace/routes";
import { formatWorkspaceLabel } from "@/lib/workspace/formatting";

export const dynamic = "force-dynamic";

export default async function BrandCampaignsIndexPage() {
  const bootstrap = await requireWorkspaceAccess();

  if (shouldGateBrandHome(bootstrap.brandProfile)) {
    redirect(brandsWorkspaceRoutes.onboarding());
  }

  const dashboard = await getDashboardView(bootstrap.organization.id);

  return (
    <div className="workspace-page-stack">
      <section className="workspace-topbar px-5 py-5 sm:px-6">
        <div className="space-y-3">
          <p className="workspace-section-label">Brands / Campaigns</p>
          <h1 className="font-display text-[2.15rem] leading-[1.02] font-semibold tracking-[-0.05em] text-[var(--workspace-copy-strong)]">
            Kampagnenübersicht
          </h1>
          <p className="max-w-3xl text-[0.98rem] leading-7 text-[var(--workspace-copy-body)]">
            Alle aktuellen Kampagnen, ihre Setup-Stufe und die schnellsten Wege in Review und
            Delivery an einem Ort.
          </p>
        </div>
      </section>

      {dashboard.campaigns.length > 0 ? (
        <section className="grid gap-4">
          {dashboard.campaigns.map((campaign) => (
            <article key={campaign.id} className="workspace-panel px-5 py-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="workspace-meta-row">
                    <span>{formatWorkspaceLabel(campaign.packageTier)}</span>
                    <span>{formatWorkspaceLabel(campaign.currentStage)}</span>
                  </div>
                  <h2 className="font-display text-[1.6rem] leading-[1.05] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
                    {campaign.name}
                  </h2>
                  <p className="max-w-3xl text-sm leading-6 text-[var(--workspace-copy-body)]">
                    {campaign.campaignGoal ?? "Für diese Kampagne wurde noch kein Ziel hinterlegt."}
                  </p>
                </div>

                <div className="grid gap-2 sm:grid-cols-3">
                  <Link
                    href={brandsWorkspaceRoutes.campaigns.setup(campaign.id)}
                    className="workspace-button workspace-button-secondary"
                  >
                    Setup
                  </Link>
                  <Link
                    href={brandsWorkspaceRoutes.campaigns.review(campaign.id)}
                    className="workspace-button workspace-button-secondary"
                  >
                    Review
                  </Link>
                  <Link
                    href={brandsWorkspaceRoutes.campaigns.handover(campaign.id)}
                    className="workspace-button workspace-button-primary"
                  >
                    Delivery
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="workspace-panel px-5 py-5">
          <p className="workspace-section-label">Noch keine Kampagnen</p>
          <h2 className="mt-3 font-display text-[1.6rem] leading-[1.05] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
            Die nächste Kampagne startet im Builder.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--workspace-copy-body)]">
            Sobald eine Kampagnenanfrage eingereicht wurde, erscheint sie hier mit Setup-, Review-
            und Delivery-Einstiegen.
          </p>
          <div className="mt-5">
            <Link
              href={brandsWorkspaceRoutes.campaigns.new()}
              className="workspace-button workspace-button-primary"
            >
              Kampagne anlegen
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
