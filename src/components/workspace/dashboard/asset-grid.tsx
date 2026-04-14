import { FileImage, FileVideo } from "lucide-react";
import { StatusPill } from "@/components/workspace/dashboard/status-pill";
import { WorkspaceAssetPreview } from "@/components/workspace/shared/workspace-asset-preview";
import { formatWorkspaceAssetType } from "@/lib/workspace/formatting";

type AssetGridItem = {
  id: string;
  title: string;
  assetType: string;
  format: string | null;
  versionLabel: string | null;
  reviewStatus: string;
  previewUrl: string | null;
  posterUrl: string | null;
};

type AssetGridProps = {
  assets: AssetGridItem[];
};

export function AssetGrid({ assets }: AssetGridProps) {
  return (
    <section className="workspace-panel px-5 py-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="workspace-section-label">Recent outputs</p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[var(--workspace-copy-strong)]">
            Outputs in motion
          </h2>
        </div>
        <p className="text-sm text-[var(--workspace-copy-muted)]">{assets.length} {assets.length === 1 ? "entry" : "entries"}</p>
      </div>

      {assets.length === 0 ? (
        <p className="mt-4 text-sm leading-6 text-[var(--workspace-copy-body)]">
          No outputs are in motion yet.
        </p>
      ) : (
        <div className="mt-5 workspace-split-list">
          {assets.map((asset) => (
            <article
              key={asset.id}
              className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="overflow-hidden rounded-[12px] border border-[var(--workspace-line)] bg-[rgba(255,255,255,0.65)]">
                  <WorkspaceAssetPreview
                    data-testid={`asset-grid-preview-${asset.id}`}
                    assetType={asset.assetType}
                    title={asset.title}
                    previewUrl={asset.previewUrl}
                    posterUrl={asset.posterUrl}
                    autoPlay={asset.assetType.includes("video")}
                    loop={asset.assetType.includes("video")}
                    muted={asset.assetType.includes("video")}
                    className="flex h-[4.5rem] w-[5.75rem] items-center justify-center bg-[rgba(255,255,255,0.55)]"
                    mediaClassName="h-[4.5rem] w-[5.75rem] object-cover"
                    fallbackClassName="flex h-[4.5rem] w-[5.75rem] items-center justify-center bg-[rgba(255,255,255,0.55)] px-2 text-center"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {asset.assetType.includes("video") ? (
                      <FileVideo className="mt-0.5 h-4 w-4 shrink-0 text-[var(--workspace-copy-muted)]" />
                    ) : (
                      <FileImage className="mt-0.5 h-4 w-4 shrink-0 text-[var(--workspace-copy-muted)]" />
                    )}
                    <p className="truncate text-sm font-semibold text-[var(--workspace-copy-strong)]">
                      {asset.title}
                    </p>
                  </div>
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
