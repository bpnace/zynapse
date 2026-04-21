import Link from "next/link";
import { redirect } from "next/navigation";
import { requireWorkspaceAccess } from "@/lib/auth/guards";
import { shouldGateBrandHome } from "@/lib/workspace/profile-completion";
import { getDashboardView } from "@/lib/workspace/queries/get-dashboard-view";
import { brandsWorkspaceRoutes } from "@/lib/workspace/routes";

export const dynamic = "force-dynamic";

export default async function BrandDeliveriesPage() {
  const bootstrap = await requireWorkspaceAccess();

  if (shouldGateBrandHome(bootstrap.brandProfile)) {
    redirect(brandsWorkspaceRoutes.onboarding());
  }

  const dashboard = await getDashboardView(bootstrap.organization.id);
  const latestCampaign = dashboard.latestCampaign;
  const approvedAssets = dashboard.latestAssets.filter((asset) => asset.reviewStatus === "approved");

  return (
    <div className="workspace-page-stack">
      <section className="workspace-topbar px-5 py-5 sm:px-6">
        <div className="space-y-3">
          <p className="workspace-section-label">Brands / Deliveries</p>
          <h1 className="font-display text-[2.15rem] leading-[1.02] font-semibold tracking-[-0.05em] text-[var(--workspace-copy-strong)]">
            Delivery Packs
          </h1>
          <p className="max-w-3xl text-[0.98rem] leading-7 text-[var(--workspace-copy-body)]">
            Die freigegebenen Outputs und der direkte Weg in den aktuellen Delivery-Pack.
          </p>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <article className="workspace-panel px-5 py-5">
          <p className="workspace-section-label">Freigegebene Outputs</p>
          {approvedAssets.length > 0 ? (
            <div className="mt-4 workspace-split-list">
              {approvedAssets.map((asset) => (
                <div key={asset.id} className="py-4">
                  <p className="text-sm font-semibold text-[var(--workspace-copy-strong)]">
                    {asset.title}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[var(--workspace-copy-muted)]">
                    {asset.format ?? "Format folgt"} · {asset.versionLabel ?? "Aktuelle Version"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-[var(--workspace-copy-body)]">
              Sobald Varianten freigegeben wurden, erscheinen sie hier gesammelt als Delivery-Pack.
            </p>
          )}
        </article>

        <article className="workspace-panel px-5 py-5">
          <p className="workspace-section-label">Aktiver Pack</p>
          <h2 className="mt-3 font-display text-[1.6rem] leading-[1.05] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
            {latestCampaign?.name ?? "Noch keine Delivery bereit"}
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--workspace-copy-body)]">
            {latestCampaign
              ? "Öffne den Delivery-Bereich, um die aktuell freigegebenen Outputs und Übergabehinweise zu sehen."
              : "Sobald eine Kampagne Outputs freigibt, erscheint hier der direkte Einstieg in den Delivery-Bereich."}
          </p>
          <div className="mt-5">
            <Link
              href={
                latestCampaign
                  ? brandsWorkspaceRoutes.campaigns.handover(latestCampaign.id)
                  : brandsWorkspaceRoutes.campaigns.new()
              }
              className="workspace-button workspace-button-primary"
            >
              {latestCampaign ? "Delivery öffnen" : "Kampagne anlegen"}
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
}
