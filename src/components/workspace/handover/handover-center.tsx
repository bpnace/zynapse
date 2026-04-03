import Link from "next/link";
import { ArrowRight, FileImage, FileVideo, FolderOutput } from "lucide-react";
import { StatusPill } from "@/components/workspace/dashboard/status-pill";

type HandoverCenterProps = {
  campaign: {
    id: string;
    name: string;
    packageTier: string;
    currentStage: string;
  };
  stageItems: Array<{
    stageKey: string;
    status: string;
  }>;
  approvedAssets: Array<{
    id: string;
    title: string;
    assetType: string;
    format: string | null;
    versionLabel: string | null;
    storagePath: string | null;
    thumbnailPath: string | null;
    source: string | null;
  }>;
  groupedAssets: Array<{
    label: string;
    items: Array<{
      id: string;
      title: string;
      assetType: string;
      format: string | null;
      versionLabel: string | null;
      storagePath: string | null;
      thumbnailPath: string | null;
      source: string | null;
    }>;
  }>;
  usageSummary: {
    heading: string;
    body: string;
  };
  campaignNotes: string | null;
  nextStep: string | null;
};

function formatStageLabel(value: string) {
  return value.replaceAll("_", " ");
}

export function HandoverCenter({
  campaign,
  stageItems,
  approvedAssets,
  groupedAssets,
  usageSummary,
  campaignNotes,
  nextStep,
}: HandoverCenterProps) {
  return (
    <div className="grid gap-4">
      <section className="workspace-topbar px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-3">
            <p className="workspace-section-label">Handover center</p>
            <div className="space-y-1">
              <h1 className="text-[1.85rem] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
                {campaign.name}
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-[var(--workspace-copy-body)]">
                This is the final delivery surface for the seeded campaign: approved
                outputs, delivery metadata, rights context, and the next commercial
                step once the review cycle is complete.
              </p>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Link
              href={`/workspace/campaigns/${campaign.id}`}
              className="workspace-button workspace-button-secondary"
            >
              Back to campaign
            </Link>
            <button
              type="button"
              className="workspace-button workspace-button-disabled"
              disabled
              title="Pilot request flow lands in a later workflow slice."
            >
              Request paid pilot
            </button>
          </div>
        </div>

        <div className="mt-4 border-t border-[var(--workspace-line)] pt-4">
          <div className="workspace-meta-row">
            <span>{campaign.packageTier}</span>
            <span>{approvedAssets.length} approved assets</span>
            <span>{groupedAssets.length} delivery groups</span>
          </div>
          <div className="mt-3">
            <StatusPill value={campaign.currentStage} tone="accent" />
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.18fr)_minmax(320px,0.82fr)]">
        <div className="grid gap-4">
          <section className="workspace-panel px-5 py-5">
            <div className="space-y-2">
              <p className="workspace-section-label">Approved outputs</p>
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--workspace-copy-strong)]">
                What the buyer would receive now
              </h2>
            </div>

            {groupedAssets.length > 0 ? (
              <div className="mt-5 workspace-split-list">
                {groupedAssets.map((group) => (
                  <section key={group.label} className="py-4">
                    <p className="workspace-section-label">{group.label}</p>
                    <div className="mt-3 workspace-split-list">
                      {group.items.map((asset) => (
                        <article key={asset.id} className="py-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                {asset.assetType.includes("video") ? (
                                  <FileVideo className="h-4 w-4 text-[var(--workspace-copy-muted)]" />
                                ) : (
                                  <FileImage className="h-4 w-4 text-[var(--workspace-copy-muted)]" />
                                )}
                                <p className="truncate text-sm font-semibold text-[var(--workspace-copy-strong)]">
                                  {asset.title}
                                </p>
                              </div>
                              <div className="mt-2 workspace-meta-row">
                                <span>{asset.assetType}</span>
                                {asset.format ? <span>{asset.format}</span> : null}
                                {asset.versionLabel ? <span>{asset.versionLabel}</span> : null}
                              </div>
                            </div>
                            <StatusPill value="approved" />
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                <p className="text-sm leading-6 text-[var(--workspace-copy-body)]">
                  No approved assets are available for handover yet.
                </p>
                <Link
                  href={`/workspace/campaigns/${campaign.id}/review`}
                  className="workspace-button workspace-button-secondary"
                >
                  Return to review room
                </Link>
              </div>
            )}
          </section>

          <section className="workspace-panel px-5 py-5">
            <div className="space-y-2">
              <p className="workspace-section-label">Mock delivery metadata</p>
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--workspace-copy-strong)]">
                Delivery package references
              </h2>
            </div>

            <div className="mt-5 workspace-split-list">
              {approvedAssets.map((asset) => (
                <article key={asset.id} className="py-4">
                  <div className="flex items-center gap-2">
                    <FolderOutput className="h-4 w-4 text-[var(--workspace-copy-muted)]" />
                    <p className="text-sm font-semibold text-[var(--workspace-copy-strong)]">
                      {asset.title}
                    </p>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="workspace-section-label">Storage path</p>
                      <p className="mt-2 text-sm break-all text-[var(--workspace-copy-body)]">
                        {asset.storagePath ?? "No storage path available"}
                      </p>
                    </div>
                    <div>
                      <p className="workspace-section-label">Thumbnail path</p>
                      <p className="mt-2 text-sm break-all text-[var(--workspace-copy-body)]">
                        {asset.thumbnailPath ?? "No thumbnail path available"}
                      </p>
                    </div>
                    <div>
                      <p className="workspace-section-label">Version</p>
                      <p className="mt-2 text-sm text-[var(--workspace-copy-body)]">
                        {asset.versionLabel ?? "No version label"}
                      </p>
                    </div>
                    <div>
                      <p className="workspace-section-label">Source</p>
                      <p className="mt-2 text-sm text-[var(--workspace-copy-body)]">
                        {asset.source ?? "No source metadata"}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <p className="mt-5 text-xs leading-5 text-[var(--workspace-copy-muted)]">
              This slice exposes delivery references and package metadata only. It
              intentionally does not pretend a live download pipeline already exists.
            </p>
          </section>
        </div>

        <div className="grid gap-4 xl:sticky xl:top-5 xl:self-start">
          <section className="workspace-panel px-5 py-5">
            <div className="space-y-2">
              <p className="workspace-section-label">Usage and rights summary</p>
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--workspace-copy-strong)]">
                Delivery context
              </h2>
            </div>
            <p className="mt-4 text-base font-semibold text-[var(--workspace-copy-strong)]">
              {usageSummary.heading}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--workspace-copy-body)]">
              {usageSummary.body}
            </p>

            <div className="mt-5 border-t border-[var(--workspace-line)] pt-4">
              <p className="workspace-section-label">Campaign notes</p>
              <p className="mt-2 text-sm leading-6 text-[var(--workspace-copy-body)]">
                {campaignNotes ??
                  "No additional campaign delivery notes are seeded for this handover yet."}
              </p>
            </div>

            <div className="mt-5 border-t border-[var(--workspace-line)] pt-4">
              <p className="workspace-section-label">Workflow status</p>
              <div className="mt-3 workspace-split-list">
                {stageItems.map((stage) => (
                  <div key={stage.stageKey} className="flex items-center justify-between gap-3 py-3">
                    <span className="text-sm text-[var(--workspace-copy-body)]">
                      {formatStageLabel(stage.stageKey)}
                    </span>
                    <StatusPill value={stage.status} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="workspace-panel px-5 py-5">
            <div className="space-y-2">
              <p className="workspace-section-label">Next step</p>
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--workspace-copy-strong)]">
                What happens after handover
              </h2>
            </div>
            <p className="mt-4 text-sm leading-6 text-[var(--workspace-copy-body)]">
              {nextStep ??
                "The next workflow slice will turn this delivery package into the paid pilot request flow."}
            </p>

            <div className="mt-5 grid gap-3">
              <Link
                href={`/workspace/campaigns/${campaign.id}/review`}
                className="workspace-button workspace-button-secondary"
              >
                Back to review room
              </Link>
              <button
                type="button"
                className="workspace-button workspace-button-disabled"
                disabled
                title="Pilot request flow lands in a later workflow slice."
              >
                Request paid pilot
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 text-xs leading-5 text-[var(--workspace-copy-muted)]">
              Pilot request stays visible as the commercial next step, but it remains
              read-only until that routed flow is implemented.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
