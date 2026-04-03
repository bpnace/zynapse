import { FileImage, FileVideo } from "lucide-react";
import { StatusPill } from "@/components/workspace/dashboard/status-pill";
import { formatWorkspaceAssetType } from "@/lib/workspace/formatting";

type AssetGridItem = {
  id: string;
  title: string;
  assetType: string;
  format: string | null;
  versionLabel: string | null;
  reviewStatus: string;
};

type AssetGridProps = {
  assets: AssetGridItem[];
};

export function AssetGrid({ assets }: AssetGridProps) {
  return (
    <section className="workspace-panel px-5 py-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="workspace-section-label">Neueste Deliverables</p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[var(--workspace-copy-strong)]">
            Review-bereite Assets
          </h2>
        </div>
        <p className="text-sm text-[var(--workspace-copy-muted)]">{assets.length} {assets.length === 1 ? "Eintrag" : "Einträge"}</p>
      </div>

      {assets.length === 0 ? (
        <p className="mt-4 text-sm leading-6 text-[var(--workspace-copy-body)]">
          Es sind noch keine Deliverables reviewbereit.
        </p>
      ) : (
        <div className="mt-5 workspace-split-list">
          {assets.map((asset) => (
            <article
              key={asset.id}
              className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-start gap-3">
                {asset.assetType.includes("video") ? (
                  <FileVideo className="mt-0.5 h-4 w-4 shrink-0 text-[var(--workspace-copy-muted)]" />
                ) : (
                  <FileImage className="mt-0.5 h-4 w-4 shrink-0 text-[var(--workspace-copy-muted)]" />
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--workspace-copy-strong)]">
                    {asset.title}
                  </p>
                  <p className="mt-1 text-sm text-[var(--workspace-copy-muted)]">
                    {formatWorkspaceAssetType(asset.assetType)}
                    {asset.format ? ` · ${asset.format}` : ""}
                    {asset.versionLabel ? ` · ${asset.versionLabel}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusPill value={asset.reviewStatus} />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
