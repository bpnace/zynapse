import { formatWorkspaceDateTime } from "@/lib/workspace/formatting";
import { OpsAssignmentForm } from "@/components/workspace/ops/ops-assignment-form";
import { OpsWorkflowForm } from "@/components/workspace/ops/ops-workflow-form";
import type { getOpsCampaignDetail } from "@/lib/workspace/queries/get-ops-campaign-detail";

type OpsCampaignDetailView = Awaited<ReturnType<typeof getOpsCampaignDetail>>;

export function OpsCampaignDetailScreen({
  view,
}: {
  view: NonNullable<OpsCampaignDetailView>;
}) {
  return (
    <div className="grid gap-6">
      <section className="workspace-panel rounded-[1.6rem] p-6">
        <p className="workspace-eyebrow">{view.campaign.packageTier}</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em]">
          {view.campaign.name}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--workspace-copy-muted)]">
          {view.campaign.campaignGoal ?? "Ops campaign detail for assignment, readiness, and delivery orchestration."}
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.95fr)]">
        <article className="workspace-panel rounded-[1.6rem] p-6">
          <p className="workspace-eyebrow">Assignments</p>
          <div className="mt-4 grid gap-3">
            {view.assignments.map((assignment) => (
              <div key={assignment.id} className="rounded-[1.2rem] border border-[var(--workspace-line)] px-4 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">
                      {assignment.creativeProfile?.displayName ?? assignment.userId}
                    </p>
                    <p className="text-sm text-[var(--workspace-copy-muted)]">
                      {assignment.assignmentRole} · {assignment.status}
                      {assignment.creativeProfile?.headline ? ` · ${assignment.creativeProfile.headline}` : ""}
                    </p>
                  </div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--workspace-copy-muted)]">
                    {assignment.revisions.filter((revision) => revision.status !== "resolved").length} open revisions
                  </p>
                </div>
                {assignment.scopeSummary ? (
                  <p className="mt-3 text-sm leading-6 text-[var(--workspace-copy-muted)]">
                    {assignment.scopeSummary}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </article>

        <div className="grid gap-4">
          <OpsAssignmentForm
            campaignId={view.campaign.id}
            creatives={view.availableCreatives}
            initialValues={{
              userId: view.assignments[0]?.userId,
              assignmentRole: view.assignments[0]?.assignmentRole,
              status: view.assignments[0]?.status,
              scopeSummary: view.assignments[0]?.scopeSummary,
              dueAt: view.assignments[0]?.dueAt?.toISOString() ?? null,
            }}
          />
          <OpsWorkflowForm
            campaignId={view.campaign.id}
            initialValues={{
              workflowStatus: view.workflow?.workflowStatus,
              reviewStatus: view.workflow?.reviewStatus,
              deliveryStatus: view.workflow?.deliveryStatus,
              commercialStatus: view.workflow?.commercialStatus,
              blockedReason: view.workflow?.blockedReason,
              slaDueAt: view.workflow?.slaDueAt?.toISOString() ?? null,
            }}
          />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.95fr)]">
        <article className="workspace-panel rounded-[1.6rem] p-6">
          <p className="workspace-eyebrow">Asset and revision visibility</p>
          <div className="mt-4 grid gap-3">
            {view.assets.map((asset) => (
              <div key={asset.id} className="rounded-[1.2rem] border border-[var(--workspace-line)] px-4 py-4">
                <p className="text-sm font-semibold">{asset.title}</p>
                <p className="mt-1 text-sm text-[var(--workspace-copy-muted)]">
                  {asset.reviewStatus} · {asset.versions.length} versions · {asset.revisions.filter((revision) => revision.status !== "resolved").length} open revisions
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="workspace-panel rounded-[1.6rem] p-6">
          <p className="workspace-eyebrow">Audit feed</p>
          <div className="mt-4 grid gap-3">
            {view.auditFeed.map((item) => (
              <div key={item.id} className="rounded-[1.2rem] border border-[var(--workspace-line)] px-4 py-4">
                <p className="text-sm font-semibold">{item.headline}</p>
                <p className="mt-1 text-sm text-[var(--workspace-copy-muted)]">{item.detail}</p>
                <p className="mt-2 text-xs text-[var(--workspace-copy-muted)]">
                  {formatWorkspaceDateTime(item.at)}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
