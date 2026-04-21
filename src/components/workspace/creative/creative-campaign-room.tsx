import { CreativeSubmissionForm } from "@/components/workspace/creative/creative-submission-form";
import { StatusPill } from "@/components/workspace/dashboard/status-pill";

type CreativeCampaignRoomProps = {
  campaign: {
    id: string;
    name: string;
    campaignGoal: string | null;
    currentStage: string;
    packageTier: string;
  };
  assignment: {
    id: string;
    assignmentRole: string;
    scopeSummary: string | null;
    status: string;
  };
  tasks: Array<{
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    assetId: string | null;
  }>;
  revisions: Array<{
    id: string;
    title: string;
    detail: string;
    status: string;
    assetId: string | null;
  }>;
  assets: Array<{
    id: string;
    title: string;
    assetType: string;
    reviewStatus: string;
    previewUrl: string | null;
    versions: Array<{
      id: string;
      versionLabel: string;
      submissionStatus: string;
    }>;
    linkedTasks: Array<{ id: string; title: string }>;
    openRevisions: Array<{ id: string; title: string }>;
  }>;
};

export function CreativeCampaignRoom({
  campaign,
  assignment,
  tasks,
  revisions,
  assets,
}: CreativeCampaignRoomProps) {
  const primaryTask = tasks[0] ?? null;
  const primaryAsset = assets[0] ?? null;

  return (
    <div className="workspace-page-stack">
      <section className="workspace-topbar px-5 py-5 sm:px-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="workspace-section-label">Task room</span>
            <span className="workspace-stat-chip">{campaign.packageTier}</span>
            <StatusPill value={campaign.currentStage} />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-[2.05rem] leading-[1] font-semibold tracking-[-0.05em] text-[var(--workspace-copy-strong)]">
              {campaign.name}
            </h1>
            <p className="max-w-3xl text-[0.98rem] leading-7 text-[var(--workspace-copy-body)]">
              {campaign.campaignGoal ??
                "Halte die zugewiesene Kampagne in Bewegung, bündele Revisionen klar und bereite die nächste belastbare Submission vor."}
            </p>
          </div>
          <div className="workspace-stat-strip">
            <span className="workspace-stat-chip">Rolle {assignment.assignmentRole}</span>
            <span className="workspace-stat-chip">Status {assignment.status}</span>
            <span className="workspace-stat-chip">{tasks.length} Tasks</span>
            <span className="workspace-stat-chip">{revisions.length} Revisionen</span>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.06fr)_minmax(320px,0.84fr)]">
        <div className="grid gap-4">
          <section className="workspace-panel px-6 py-6">
            <div className="space-y-2">
              <p className="workspace-section-label">Aktive Tasks</p>
              <h2 className="font-display text-[1.75rem] leading-[1.04] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
                Ausführung im aktuellen Sprint
              </h2>
            </div>
            <div className="mt-4 workspace-split-list">
              {tasks.map((task) => (
                <div key={task.id} className="py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[var(--workspace-copy-strong)]">
                        {task.title}
                      </p>
                      {task.description ? (
                        <p className="mt-2 text-sm leading-6 text-[var(--workspace-copy-muted)]">
                          {task.description}
                        </p>
                      ) : null}
                    </div>
                    <div className="space-y-2 text-right">
                      <StatusPill value={task.status} />
                      <p className="text-xs uppercase tracking-[0.16em] text-[var(--workspace-copy-muted)]">
                        {task.priority}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="workspace-panel px-6 py-6">
            <div className="space-y-2">
              <p className="workspace-section-label">Revision queue</p>
              <h2 className="font-display text-[1.75rem] leading-[1.04] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
                Offene Präzisierungen
              </h2>
            </div>
            <div className="mt-4 workspace-split-list">
              {revisions.length > 0 ? (
                revisions.map((revision) => (
                  <div key={revision.id} className="py-3">
                    <p className="text-sm font-semibold text-[var(--workspace-copy-strong)]">
                      {revision.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[var(--workspace-copy-muted)]">
                      {revision.detail}
                    </p>
                  </div>
                ))
              ) : (
                <p className="py-3 text-sm leading-6 text-[var(--workspace-copy-muted)]">
                  Derzeit liegen keine offenen Revisionen für diese Kampagne vor.
                </p>
              )}
            </div>
          </section>
        </div>

        <div className="grid gap-4">
          <section className="workspace-panel px-6 py-6">
            <div className="space-y-2">
              <p className="workspace-section-label">Submit next version</p>
              <h2 className="font-display text-[1.65rem] leading-[1.05] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
                Nächste Version einreichen
              </h2>
            </div>
            {primaryTask && primaryAsset ? (
              <div className="mt-4">
                <CreativeSubmissionForm
                  campaignId={campaign.id}
                  assignmentId={assignment.id}
                  assetId={primaryAsset.id}
                  taskId={primaryTask.id}
                  suggestedVersionLabel={`${primaryAsset.title} · v${primaryAsset.versions.length + 2}`}
                />
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-[var(--workspace-copy-muted)]">
                Sobald mindestens ein aktives Asset und ein Task verknüpft sind, kannst du von hier aus eine neue Version einreichen.
              </p>
            )}
          </section>

          <section className="workspace-panel px-6 py-6">
            <div className="space-y-2">
              <p className="workspace-section-label">Assigned assets</p>
              <h2 className="font-display text-[1.65rem] leading-[1.05] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
                Assets im aktuellen Raum
              </h2>
            </div>
            <div className="mt-4 workspace-split-list">
              {assets.map((asset) => (
                <div key={asset.id} className="py-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[var(--workspace-copy-strong)]">
                        {asset.title}
                      </p>
                      <p className="mt-2 text-sm text-[var(--workspace-copy-muted)]">
                        {asset.assetType} · {asset.reviewStatus}
                      </p>
                    </div>
                    <p className="text-xs text-[var(--workspace-copy-muted)]">
                      {asset.versions.length} Version{asset.versions.length === 1 ? "" : "en"}
                    </p>
                  </div>
                  {asset.openRevisions.length > 0 ? (
                    <p className="mt-3 text-sm text-[var(--workspace-copy-muted)]">
                      {asset.openRevisions.length} offene Revision{asset.openRevisions.length === 1 ? "" : "en"}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
