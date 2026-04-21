"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { updateOpsWorkflow } from "@/lib/workspace/actions/ops-control-plane";
import { Button } from "@/components/ui/button";
import { Field, SelectInput, TextInput, TextareaInput } from "@/components/forms/form-primitives";

type OpsWorkflowFormProps = {
  campaignId: string;
  initialValues: {
    workflowStatus?: string | null;
    reviewStatus?: string | null;
    deliveryStatus?: string | null;
    commercialStatus?: string | null;
    blockedReason?: string | null;
    slaDueAt?: string | null;
  };
};

const workflowStatuses = ["setup", "production", "review", "handover", "complete"] as const;
const reviewStatuses = ["not_ready", "in_review", "approved"] as const;
const deliveryStatuses = ["not_ready", "preparing", "ready"] as const;
const commercialStatuses = ["not_ready", "ready_for_pilot", "pilot_requested"] as const;

export function OpsWorkflowForm({
  campaignId,
  initialValues,
}: OpsWorkflowFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [workflowStatus, setWorkflowStatus] = useState(
    initialValues.workflowStatus ?? "setup",
  );
  const [reviewStatus, setReviewStatus] = useState(initialValues.reviewStatus ?? "not_ready");
  const [deliveryStatus, setDeliveryStatus] = useState(
    initialValues.deliveryStatus ?? "not_ready",
  );
  const [commercialStatus, setCommercialStatus] = useState(
    initialValues.commercialStatus ?? "not_ready",
  );
  const [blockedReason, setBlockedReason] = useState(initialValues.blockedReason ?? "");
  const [slaDueAt, setSlaDueAt] = useState(initialValues.slaDueAt?.slice(0, 10) ?? "");

  function submitWorkflow() {
    setIsPending(true);
    setMessage("");

    startTransition(async () => {
      const result = await updateOpsWorkflow({
        campaignId,
        workflowStatus: workflowStatus as (typeof workflowStatuses)[number],
        reviewStatus: reviewStatus as (typeof reviewStatuses)[number],
        deliveryStatus: deliveryStatus as (typeof deliveryStatuses)[number],
        commercialStatus: commercialStatus as (typeof commercialStatuses)[number],
        blockedReason,
        slaDueAt,
      });

      setIsPending(false);
      setMessage(result.message);

      if (result.success) {
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-4 rounded-[1.3rem] border border-[var(--workspace-line)] bg-[var(--workspace-panel)] p-4">
      <div className="space-y-1">
        <p className="workspace-section-label">Workflow control</p>
        <p className="text-sm leading-6 text-[var(--workspace-copy-muted)]">
          Update explicit internal readiness instead of relying on heuristic transitions.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Workflow">
          <SelectInput value={workflowStatus} onChange={(event) => setWorkflowStatus(event.target.value)} disabled={isPending}>
            {workflowStatuses.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Review">
          <SelectInput value={reviewStatus} onChange={(event) => setReviewStatus(event.target.value)} disabled={isPending}>
            {reviewStatuses.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </SelectInput>
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Delivery">
          <SelectInput value={deliveryStatus} onChange={(event) => setDeliveryStatus(event.target.value)} disabled={isPending}>
            {deliveryStatuses.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Commercial">
          <SelectInput value={commercialStatus} onChange={(event) => setCommercialStatus(event.target.value)} disabled={isPending}>
            {commercialStatuses.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </SelectInput>
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="SLA due">
          <TextInput type="date" value={slaDueAt} onChange={(event) => setSlaDueAt(event.target.value)} disabled={isPending} />
        </Field>
        <Field label="Blocked reason">
          <TextareaInput
            value={blockedReason}
            onChange={(event) => setBlockedReason(event.target.value)}
            disabled={isPending}
            className="min-h-24"
          />
        </Field>
      </div>

      {message ? (
        <p className="text-sm text-[var(--workspace-copy-body)]">{message}</p>
      ) : null}

      <div className="flex justify-end">
        <Button type="button" onClick={submitWorkflow} disabled={isPending}>
          {isPending ? "Updating…" : "Update workflow"}
        </Button>
      </div>
    </div>
  );
}
