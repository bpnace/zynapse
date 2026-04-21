"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { formatWorkspaceDateTime } from "@/lib/workspace/formatting";
import { adminWorkspaceRoutes, opsWorkspaceRoutes } from "@/lib/workspace/routes";
import { Field, SelectInput } from "@/components/forms/form-primitives";
import { OpsAssignmentForm } from "@/components/workspace/ops/ops-assignment-form";
import { OpsWorkflowForm } from "@/components/workspace/ops/ops-workflow-form";
import type { getOpsOverview } from "@/lib/workspace/queries/get-ops-overview";

type OpsOverviewView = Awaited<ReturnType<typeof getOpsOverview>>;
type OpsScreenMode = "overview" | "campaigns" | "assignments" | "review" | "commercial";

function renderSummaryCard(label: string, value: number, detail: string) {
  return (
    <article key={label} className="workspace-panel rounded-[1.5rem] p-5">
      <p className="workspace-eyebrow">{label}</p>
      <p className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em]">{value}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--workspace-copy-muted)]">{detail}</p>
    </article>
  );
}

export function OpsControlPlaneScreen({
  view,
  mode,
}: {
  view: OpsOverviewView;
  mode: OpsScreenMode;
}) {
  const pathname = usePathname();
  const [selectedCampaignId, setSelectedCampaignId] = useState(
    view.campaigns[0]?.id ?? "",
  );

  const selectedCampaign = useMemo(
    () =>
      view.campaigns.find((campaign) => campaign.id === selectedCampaignId) ??
      view.campaigns[0] ??
      null,
    [selectedCampaignId, view.campaigns],
  );

  const visibleCampaigns =
    mode === "review"
      ? view.reviewReadinessQueue
      : mode === "commercial"
        ? view.commercialQueue
        : view.campaigns;
  const getCampaignHref = (campaignId: string) =>
    pathname.startsWith("/admin/")
      ? adminWorkspaceRoutes.campaignDetail(campaignId)
      : opsWorkspaceRoutes.campaignDetail(campaignId);

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {[
          renderSummaryCard(
            "Active campaigns",
            view.summary.activeCampaigns,
            "Campaigns currently inside the managed delivery system.",
          ),
          renderSummaryCard(
            "In review",
            view.summary.campaignsInReview,
            "Campaigns waiting on internal or brand review decisions.",
          ),
          renderSummaryCard(
            "Ready for handoff",
            view.summary.readyForHandover,
            "Campaigns that can move into delivery or commercial transition.",
          ),
          renderSummaryCard(
            "Pilot requested",
            view.summary.pilotRequested,
            "Commercial transitions already pushed into pilot request state.",
          ),
          renderSummaryCard(
            "Blocked assignments",
            view.summary.blockedAssignments,
            "Assignments with explicit blockers that admins still need to clear.",
          ),
          renderSummaryCard(
            "Pending internal review",
            view.summary.pendingOpsReview,
            "Submitted versions still waiting for internal review.",
          ),
        ]}
      </section>

      {mode === "overview" ||
      mode === "campaigns" ||
      mode === "review" ||
      mode === "commercial" ? (
        <section className="grid gap-4">
          {visibleCampaigns.map((campaign) => (
            <article key={campaign.id} className="workspace-panel rounded-[1.6rem] p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="workspace-eyebrow">{campaign.packageTier}</p>
                  <h2 className="font-display text-3xl font-semibold tracking-[-0.04em]">
                    {campaign.name}
                  </h2>
                  <p className="text-sm text-[var(--workspace-copy-muted)]">
                    Stage {campaign.currentStage} · queue {campaign.reviewQueueStatus}
                    {campaign.workflow?.blockedReason
                      ? ` · blocked: ${campaign.workflow.blockedReason}`
                      : ""}
                  </p>
                </div>
                <Link
                  href={getCampaignHref(campaign.id)}
                  className="workspace-button inline-flex items-center justify-center"
                >
                  Open campaign
                </Link>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[1.2rem] border border-[var(--workspace-line)] px-4 py-4">
                  <p className="workspace-section-label">Assignments</p>
                  <p className="mt-2 text-2xl font-semibold">{campaign.assignmentCount}</p>
                  <p className="mt-2 text-sm text-[var(--workspace-copy-muted)]">
                    {campaign.blockedAssignmentCount} blocked · {campaign.submittedAssignmentCount} submitted
                  </p>
                </div>
                <div className="rounded-[1.2rem] border border-[var(--workspace-line)] px-4 py-4">
                  <p className="workspace-section-label">Review</p>
                  <p className="mt-2 text-2xl font-semibold">{campaign.unresolvedReviewCount}</p>
                  <p className="mt-2 text-sm text-[var(--workspace-copy-muted)]">
                    {campaign.awaitingOpsReviewCount} internal · {campaign.awaitingBrandReviewCount} brand
                  </p>
                </div>
                <div className="rounded-[1.2rem] border border-[var(--workspace-line)] px-4 py-4">
                  <p className="workspace-section-label">Approved assets</p>
                  <p className="mt-2 text-2xl font-semibold">{campaign.approvedAssetCount}</p>
                  <p className="mt-2 text-sm text-[var(--workspace-copy-muted)]">
                    {campaign.commercialReady ? "Commercially ready" : "Not ready for pilot yet"}
                  </p>
                </div>
                <div className="rounded-[1.2rem] border border-[var(--workspace-line)] px-4 py-4">
                  <p className="workspace-section-label">Latest submission</p>
                  <p className="mt-2 text-sm font-semibold">
                    {campaign.latestSubmissionAt
                      ? formatWorkspaceDateTime(campaign.latestSubmissionAt)
                      : "No submission yet"}
                  </p>
                  <p className="mt-2 text-sm text-[var(--workspace-copy-muted)]">
                    {campaign.openRevisionCount} open revisions
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : null}

      {mode === "overview" || mode === "assignments" ? (
        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.9fr)]">
          <article className="workspace-panel rounded-[1.6rem] p-6">
            <p className="workspace-eyebrow">Assignment board</p>
            <div className="mt-4 grid gap-3">
              {view.assignmentBoard.map((assignment) => (
                <div key={assignment.id} className="rounded-[1.2rem] border border-[var(--workspace-line)] px-4 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">
                        {assignment.creativeProfile?.displayName ?? assignment.userId}
                      </p>
                      <p className="text-sm text-[var(--workspace-copy-muted)]">
                        {assignment.campaign?.name ?? "Campaign"} · {assignment.assignmentRole} · {assignment.status}
                      </p>
                    </div>
                    <p className="text-xs uppercase tracking-[0.16em] text-[var(--workspace-copy-muted)]">
                      {assignment.openRevisionCount} revisions
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <div className="grid gap-4">
            {selectedCampaign ? (
              <div className="workspace-panel rounded-[1.6rem] p-4">
                <Field label="Assignment campaign">
                  <SelectInput
                    value={selectedCampaign.id}
                    onChange={(event) => setSelectedCampaignId(event.target.value)}
                  >
                    {view.campaigns.map((campaign) => (
                      <option key={campaign.id} value={campaign.id}>
                        {campaign.name}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
              </div>
            ) : (
              <article className="workspace-panel rounded-[1.6rem] p-6 text-sm leading-6 text-[var(--workspace-copy-muted)]">
                Create the first campaign before assigning creative work from the admin panel.
              </article>
            )}

            <OpsAssignmentForm
              campaignId={selectedCampaign?.id ?? ""}
              creatives={view.availableCreatives}
            />
          </div>
        </section>
      ) : null}

      {mode === "overview" ? (
        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.95fr)]">
          <article className="workspace-panel rounded-[1.6rem] p-6">
            <p className="workspace-eyebrow">Workflow audit</p>
            <div className="mt-4 grid gap-3">
              {view.auditFeed.map((item) => (
                <div key={item.id} className="rounded-[1.2rem] border border-[var(--workspace-line)] px-4 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{item.headline}</p>
                      <p className="mt-1 text-sm text-[var(--workspace-copy-muted)]">{item.detail}</p>
                    </div>
                    <p className="text-xs text-[var(--workspace-copy-muted)]">
                      {formatWorkspaceDateTime(item.at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          {selectedCampaign?.workflow ? (
            <OpsWorkflowForm
              campaignId={selectedCampaign.id}
              initialValues={{
                workflowStatus: selectedCampaign.workflow?.workflowStatus,
                reviewStatus: selectedCampaign.workflow?.reviewStatus,
                deliveryStatus: selectedCampaign.workflow?.deliveryStatus,
                commercialStatus: selectedCampaign.workflow?.commercialStatus,
                blockedReason: selectedCampaign.workflow?.blockedReason ?? "",
                slaDueAt: selectedCampaign.workflow?.slaDueAt?.toISOString() ?? null,
              }}
            />
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
