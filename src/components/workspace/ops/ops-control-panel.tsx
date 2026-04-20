"use client";

import { startTransition, useMemo, useState } from "react";
import { Field, SelectInput, TextInput, TextareaInput } from "@/components/forms/form-primitives";
import {
  updateOpsWorkflow,
  upsertOpsAssignment,
} from "@/lib/workspace/actions/ops-control-plane";
import type {
  AssignmentRole,
  AssignmentStatus,
  CampaignWorkflowCommercialStatus,
  CampaignWorkflowDeliveryStatus,
  CampaignWorkflowReviewStatus,
  CampaignWorkflowStatus,
} from "@/lib/workspace/data/types";

type OpsControlPanelProps = {
  campaignId: string;
  availableCreatives: Array<{
    userId: string;
    displayName: string;
  }>;
  workflowDefaults: {
    opsOwnerUserId: string | null;
    workflowStatus: CampaignWorkflowStatus;
    reviewStatus: CampaignWorkflowReviewStatus;
    deliveryStatus: CampaignWorkflowDeliveryStatus;
    commercialStatus: CampaignWorkflowCommercialStatus;
    blockedReason: string | null;
    slaDueAt: string | null;
  };
};

export function OpsControlPanel({
  campaignId,
  availableCreatives,
  workflowDefaults,
}: OpsControlPanelProps) {
  const [workflowValues, setWorkflowValues] = useState({
    opsOwnerUserId: workflowDefaults.opsOwnerUserId ?? "",
    workflowStatus: workflowDefaults.workflowStatus,
    reviewStatus: workflowDefaults.reviewStatus,
    deliveryStatus: workflowDefaults.deliveryStatus,
    commercialStatus: workflowDefaults.commercialStatus,
    blockedReason: workflowDefaults.blockedReason ?? "",
    slaDueAt: workflowDefaults.slaDueAt ?? "",
  });
  const [assignmentValues, setAssignmentValues] = useState({
    userId: availableCreatives[0]?.userId ?? "",
    assignmentRole: "creative" as AssignmentRole,
    status: "assigned" as AssignmentStatus,
    scopeSummary: "Own the next execution slice and keep revisions moving.",
    dueAt: "",
  });
  const [workflowMessage, setWorkflowMessage] = useState("");
  const [assignmentMessage, setAssignmentMessage] = useState("");
  const [isWorkflowPending, setIsWorkflowPending] = useState(false);
  const [isAssignmentPending, setIsAssignmentPending] = useState(false);

  const canAssign = useMemo(() => availableCreatives.length > 0, [availableCreatives.length]);

  function handleWorkflowSubmit() {
    setIsWorkflowPending(true);
    setWorkflowMessage("");

    startTransition(async () => {
      const result = await updateOpsWorkflow({
        campaignId,
        opsOwnerUserId: workflowValues.opsOwnerUserId,
        workflowStatus: workflowValues.workflowStatus,
        reviewStatus: workflowValues.reviewStatus,
        deliveryStatus: workflowValues.deliveryStatus,
        commercialStatus: workflowValues.commercialStatus,
        blockedReason: workflowValues.blockedReason,
        slaDueAt: workflowValues.slaDueAt,
      });

      setIsWorkflowPending(false);
      setWorkflowMessage(result.message);
    });
  }

  function handleAssignmentSubmit() {
    if (!canAssign || !assignmentValues.userId) {
      setAssignmentMessage("Keine Creative-Profile verfügbar.");
      return;
    }

    setIsAssignmentPending(true);
    setAssignmentMessage("");

    startTransition(async () => {
      const result = await upsertOpsAssignment({
        campaignId,
        userId: assignmentValues.userId,
        assignmentRole: assignmentValues.assignmentRole,
        status: assignmentValues.status,
        scopeSummary: assignmentValues.scopeSummary,
        dueAt: assignmentValues.dueAt,
      });

      setIsAssignmentPending(false);
      setAssignmentMessage(result.message);
    });
  }

  return (
    <div className="grid gap-4 2xl:grid-cols-2">
      <section className="workspace-panel px-5 py-5">
        <div className="space-y-2">
          <p className="workspace-section-label">Workflow transitions</p>
          <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--workspace-copy-strong)]">
            Review, delivery, and commercial readiness
          </h2>
        </div>

        <div className="mt-5 grid gap-4">
          <Field label="Ops owner">
            <SelectInput
              value={workflowValues.opsOwnerUserId}
              onChange={(event) =>
                setWorkflowValues((current) => ({ ...current, opsOwnerUserId: event.target.value }))
              }
              disabled={isWorkflowPending}
            >
              <option value="">Unassigned</option>
              {availableCreatives.map((creative) => (
                <option key={creative.userId} value={creative.userId}>
                  {creative.displayName}
                </option>
              ))}
            </SelectInput>
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Workflow status">
              <SelectInput
                value={workflowValues.workflowStatus}
                onChange={(event) =>
                  setWorkflowValues((current) => ({
                    ...current,
                    workflowStatus: event.target.value as CampaignWorkflowStatus,
                  }))
                }
                disabled={isWorkflowPending}
              >
                {[
                  ["setup", "Setup"],
                  ["production", "Production"],
                  ["review", "Review"],
                  ["handover", "Handover"],
                  ["complete", "Complete"],
                ].map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Review status">
              <SelectInput
                value={workflowValues.reviewStatus}
                onChange={(event) =>
                  setWorkflowValues((current) => ({
                    ...current,
                    reviewStatus: event.target.value as CampaignWorkflowReviewStatus,
                  }))
                }
                disabled={isWorkflowPending}
              >
                {[
                  ["not_ready", "Not ready"],
                  ["in_review", "In review"],
                  ["approved", "Approved"],
                ].map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Delivery status">
              <SelectInput
                value={workflowValues.deliveryStatus}
                onChange={(event) =>
                  setWorkflowValues((current) => ({
                    ...current,
                    deliveryStatus: event.target.value as CampaignWorkflowDeliveryStatus,
                  }))
                }
                disabled={isWorkflowPending}
              >
                {[
                  ["not_ready", "Not ready"],
                  ["preparing", "Preparing"],
                  ["ready", "Ready"],
                ].map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Commercial status">
              <SelectInput
                value={workflowValues.commercialStatus}
                onChange={(event) =>
                  setWorkflowValues((current) => ({
                    ...current,
                    commercialStatus: event.target.value as CampaignWorkflowCommercialStatus,
                  }))
                }
                disabled={isWorkflowPending}
              >
                {[
                  ["not_ready", "Not ready"],
                  ["ready_for_pilot", "Ready for pilot"],
                  ["pilot_requested", "Pilot requested"],
                ].map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </SelectInput>
            </Field>
          </div>

          <Field label="Blocked reason">
            <TextareaInput
              value={workflowValues.blockedReason}
              onChange={(event) =>
                setWorkflowValues((current) => ({ ...current, blockedReason: event.target.value }))
              }
              placeholder="Only add a blocker when Ops needs to call it out explicitly."
              disabled={isWorkflowPending}
              className="min-h-24"
            />
          </Field>
          <Field label="SLA due at">
            <TextInput
              type="datetime-local"
              value={workflowValues.slaDueAt}
              onChange={(event) =>
                setWorkflowValues((current) => ({ ...current, slaDueAt: event.target.value }))
              }
              disabled={isWorkflowPending}
            />
          </Field>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            className="workspace-button workspace-button-primary"
            disabled={isWorkflowPending}
            onClick={handleWorkflowSubmit}
          >
            {isWorkflowPending ? "Saving..." : "Update workflow"}
          </button>
        </div>

        {workflowMessage ? (
          <p className="mt-3 text-sm leading-6 text-[var(--workspace-copy-body)]">{workflowMessage}</p>
        ) : null}
      </section>

      <section className="workspace-panel px-5 py-5">
        <div className="space-y-2">
          <p className="workspace-section-label">Assignments</p>
          <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--workspace-copy-strong)]">
            Assign or reassign creative work
          </h2>
        </div>

        <div className="mt-5 grid gap-4">
          <Field label="Creative">
            <SelectInput
              value={assignmentValues.userId}
              onChange={(event) =>
                setAssignmentValues((current) => ({ ...current, userId: event.target.value }))
              }
              disabled={isAssignmentPending || !canAssign}
            >
              {!canAssign ? <option value="">No creative profiles available</option> : null}
              {availableCreatives.map((creative) => (
                <option key={creative.userId} value={creative.userId}>
                  {creative.displayName}
                </option>
              ))}
            </SelectInput>
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Assignment role">
              <SelectInput
                value={assignmentValues.assignmentRole}
                onChange={(event) =>
                  setAssignmentValues((current) => ({
                    ...current,
                    assignmentRole: event.target.value as AssignmentRole,
                  }))
                }
                disabled={isAssignmentPending || !canAssign}
              >
                {[
                  ["creative", "Creative"],
                  ["creative_lead", "Creative lead"],
                  ["editor", "Editor"],
                  ["motion", "Motion"],
                  ["designer", "Designer"],
                  ["copy", "Copy"],
                ].map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Assignment status">
              <SelectInput
                value={assignmentValues.status}
                onChange={(event) =>
                  setAssignmentValues((current) => ({
                    ...current,
                    status: event.target.value as AssignmentStatus,
                  }))
                }
                disabled={isAssignmentPending || !canAssign}
              >
                {[
                  ["assigned", "Assigned"],
                  ["accepted", "Accepted"],
                  ["in_progress", "In progress"],
                  ["blocked", "Blocked"],
                  ["submitted", "Submitted"],
                  ["completed", "Completed"],
                ].map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </SelectInput>
            </Field>
          </div>

          <Field label="Scope summary">
            <TextareaInput
              value={assignmentValues.scopeSummary}
              onChange={(event) =>
                setAssignmentValues((current) => ({ ...current, scopeSummary: event.target.value }))
              }
              disabled={isAssignmentPending || !canAssign}
              className="min-h-24"
            />
          </Field>
          <Field label="Due at">
            <TextInput
              type="datetime-local"
              value={assignmentValues.dueAt}
              onChange={(event) =>
                setAssignmentValues((current) => ({ ...current, dueAt: event.target.value }))
              }
              disabled={isAssignmentPending || !canAssign}
            />
          </Field>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            className="workspace-button workspace-button-primary"
            disabled={isAssignmentPending || !canAssign}
            onClick={handleAssignmentSubmit}
          >
            {isAssignmentPending ? "Saving..." : "Save assignment"}
          </button>
        </div>

        {assignmentMessage ? (
          <p className="mt-3 text-sm leading-6 text-[var(--workspace-copy-body)]">{assignmentMessage}</p>
        ) : null}
      </section>
    </div>
  );
}
