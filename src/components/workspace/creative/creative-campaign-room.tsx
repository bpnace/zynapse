import { CreativeSubmissionForm } from "@/components/workspace/creative/creative-submission-form";

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
    <div className="grid gap-4">
      <section className="workspace-panel rounded-[1.6rem] p-6">
        <p className="workspace-eyebrow">Task room</p>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <h1 className="font-display text-4xl font-semibold tracking-[-0.05em]">
              {campaign.name}
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-[var(--workspace-copy-muted)]">
              {campaign.campaignGoal ??
                "Keep the assigned sprint moving, package revisions clearly, and submit delivery-ready variants back into ops review."}
            </p>
          </div>
          <div className="rounded-[1.2rem] border border-[var(--workspace-line)] px-4 py-3 text-sm text-[var(--workspace-copy-muted)]">
            <p>Role: {assignment.assignmentRole}</p>
            <p>Status: {assignment.status}</p>
            <p>Stage: {campaign.currentStage}</p>
          </div>
        </div>
        {assignment.scopeSummary ? (
          <p className="mt-4 text-sm leading-7 text-[var(--workspace-copy-muted)]">
            {assignment.scopeSummary}
          </p>
        ) : null}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
        <div className="grid gap-4">
          <article className="workspace-panel rounded-[1.6rem] p-6">
            <p className="workspace-eyebrow">Active tasks</p>
            <div className="mt-4 grid gap-3">
              {tasks.map((task) => (
                <div key={task.id} className="rounded-[1.2rem] border border-[var(--workspace-line)] px-4 py-4">
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
                    <p className="text-xs uppercase tracking-[0.16em] text-[var(--workspace-copy-muted)]">
                      {task.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="workspace-panel rounded-[1.6rem] p-6">
            <p className="workspace-eyebrow">Revision queue</p>
            <div className="mt-4 grid gap-3">
              {revisions.map((revision) => (
                <div key={revision.id} className="rounded-[1.2rem] border border-[var(--workspace-line)] px-4 py-4">
                  <p className="text-sm font-semibold text-[var(--workspace-copy-strong)]">
                    {revision.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--workspace-copy-muted)]">
                    {revision.detail}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className="grid gap-4">
          <article className="workspace-panel rounded-[1.6rem] p-6">
            <p className="workspace-eyebrow">Submit next version</p>
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
          </article>

          <article className="workspace-panel rounded-[1.6rem] p-6">
            <p className="workspace-eyebrow">Assigned assets</p>
            <div className="mt-4 grid gap-3">
              {assets.map((asset) => (
                <div key={asset.id} className="rounded-[1.2rem] border border-[var(--workspace-line)] px-4 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[var(--workspace-copy-strong)]">
                        {asset.title}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--workspace-copy-muted)]">
                        {asset.assetType} · {asset.reviewStatus}
                      </p>
                    </div>
                    <p className="text-xs text-[var(--workspace-copy-muted)]">
                      {asset.versions.length} version{asset.versions.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  {asset.openRevisions.length > 0 ? (
                    <p className="mt-3 text-sm text-[var(--workspace-copy-muted)]">
                      {asset.openRevisions.length} open revision item(s)
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
