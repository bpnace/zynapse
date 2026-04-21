import Link from "next/link";
import { redirect } from "next/navigation";
import { requireWorkspaceAccess } from "@/lib/auth/guards";
import { shouldGateBrandHome } from "@/lib/workspace/profile-completion";
import { getDashboardView } from "@/lib/workspace/queries/get-dashboard-view";
import { brandsWorkspaceRoutes } from "@/lib/workspace/routes";

export const dynamic = "force-dynamic";

export default async function BrandReviewsPage() {
  const bootstrap = await requireWorkspaceAccess();

  if (shouldGateBrandHome(bootstrap.brandProfile)) {
    redirect(brandsWorkspaceRoutes.onboarding());
  }

  const dashboard = await getDashboardView(bootstrap.organization.id);
  const latestCampaign = dashboard.latestCampaign;

  return (
    <div className="workspace-page-stack">
      <section className="workspace-topbar px-5 py-5 sm:px-6">
        <div className="space-y-3">
          <p className="workspace-section-label">Brands / Reviews</p>
          <h1 className="font-display text-[2.15rem] leading-[1.02] font-semibold tracking-[-0.05em] text-[var(--workspace-copy-strong)]">
            Review-Übersicht
          </h1>
          <p className="max-w-3xl text-[0.98rem] leading-7 text-[var(--workspace-copy-body)]">
            Die wichtigsten offenen Diskussionen und der direkte Einstieg in die aktive Review-
            Runde.
          </p>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <article className="workspace-panel px-5 py-5">
          <p className="workspace-section-label">Offene Threads</p>
          {dashboard.reviewThreads.length > 0 ? (
            <div className="mt-4 workspace-split-list">
              {dashboard.reviewThreads.map((thread) => (
                <div key={thread.threadId} className="py-4">
                  <p className="text-sm font-semibold text-[var(--workspace-copy-strong)]">
                    {thread.assetTitle}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[var(--workspace-copy-muted)]">
                    {thread.comments[0]?.body ?? "Keine Kommentarvorschau verfügbar."}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-[var(--workspace-copy-body)]">
              Aktuell liegen keine offenen Review-Diskussionen vor.
            </p>
          )}
        </article>

        <article className="workspace-panel px-5 py-5">
          <p className="workspace-section-label">Aktive Review-Runde</p>
          <h2 className="mt-3 font-display text-[1.6rem] leading-[1.05] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
            {latestCampaign?.name ?? "Noch keine aktive Kampagne"}
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--workspace-copy-body)]">
            {latestCampaign
              ? "Öffne die aktive Review-Runde, um Entscheidungen zu treffen oder Änderungen anzustoßen."
              : "Sobald eine Kampagne angelegt ist, erscheint hier der schnellste Einstieg in den Freigabeprozess."}
          </p>
          <div className="mt-5">
            <Link
              href={
                latestCampaign
                  ? brandsWorkspaceRoutes.campaigns.review(latestCampaign.id)
                  : brandsWorkspaceRoutes.campaigns.new()
              }
              className="workspace-button workspace-button-primary"
            >
              {latestCampaign ? "Review öffnen" : "Kampagne anlegen"}
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
}
