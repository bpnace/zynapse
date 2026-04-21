"use client";

import { startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { upsertOpsAssignment } from "@/lib/workspace/actions/ops-control-plane";
import { Button } from "@/components/ui/button";
import { Field, SelectInput, TextInput, TextareaInput } from "@/components/forms/form-primitives";
import type { OpsCreativeOption } from "@/lib/workspace/ops-creative-options";

type OpsAssignmentFormProps = {
  campaignId: string;
  creatives: OpsCreativeOption[];
  initialValues?: {
    userId?: string | null;
    assignmentRole?: string;
    status?: string;
    scopeSummary?: string | null;
    dueAt?: string | null;
  };
};

const assignmentRoles = [
  "creative",
  "creative_lead",
  "editor",
  "motion",
  "designer",
  "copy",
] as const;

const assignmentStatuses = [
  "assigned",
  "accepted",
  "in_progress",
  "blocked",
  "submitted",
  "completed",
] as const;

export function OpsAssignmentForm({
  campaignId,
  creatives,
  initialValues,
}: OpsAssignmentFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [userId, setUserId] = useState(
    initialValues?.userId ?? creatives[0]?.userId ?? "",
  );
  const [assignmentRole, setAssignmentRole] = useState(
    initialValues?.assignmentRole ?? "creative",
  );
  const [status, setStatus] = useState(initialValues?.status ?? "assigned");
  const [scopeSummary, setScopeSummary] = useState(
    initialValues?.scopeSummary ??
      "Own the current delivery sprint, tighten submissions, and keep revision context explicit for the internal team.",
  );
  const [dueAt, setDueAt] = useState(initialValues?.dueAt?.slice(0, 10) ?? "");

  const hasCreatives = creatives.length > 0;
  const helperText = useMemo(() => {
    if (!campaignId) {
      return "Create or select a campaign before assigning work.";
    }

    if (!hasCreatives) {
      return "No creative memberships are available in this org yet.";
    }

    return "Assignments update the shared campaign graph and revalidate the linked brand, creative, and admin views.";
  }, [campaignId, hasCreatives]);

  function submitAssignment() {
    if (!campaignId || !hasCreatives) {
      return;
    }

    setIsPending(true);
    setMessage("");

    startTransition(async () => {
      const result = await upsertOpsAssignment({
        campaignId,
        userId,
        assignmentRole: assignmentRole as (typeof assignmentRoles)[number],
        status: status as (typeof assignmentStatuses)[number],
        scopeSummary,
        dueAt,
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
        <p className="workspace-section-label">Assignment control</p>
        <p className="text-sm leading-6 text-[var(--workspace-copy-muted)]">{helperText}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Creative">
          <SelectInput
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            disabled={!campaignId || !hasCreatives || isPending}
          >
            {creatives.map((creative) => (
              <option key={creative.userId} value={creative.userId}>
                {creative.displayName} · {creative.role}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Role">
          <SelectInput
            value={assignmentRole}
            onChange={(event) => setAssignmentRole(event.target.value)}
            disabled={!campaignId || !hasCreatives || isPending}
          >
            {assignmentRoles.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </SelectInput>
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Status">
          <SelectInput
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            disabled={!campaignId || !hasCreatives || isPending}
          >
            {assignmentStatuses.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Due date">
          <TextInput
            type="date"
            value={dueAt}
            onChange={(event) => setDueAt(event.target.value)}
            disabled={!campaignId || !hasCreatives || isPending}
          />
        </Field>
      </div>

      <Field label="Scope summary">
        <TextareaInput
          value={scopeSummary}
          onChange={(event) => setScopeSummary(event.target.value)}
          disabled={!campaignId || !hasCreatives || isPending}
        />
      </Field>

      {message ? (
        <p className="text-sm text-[var(--workspace-copy-body)]">{message}</p>
      ) : null}

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={submitAssignment}
          disabled={!campaignId || !hasCreatives || isPending}
        >
          {isPending ? "Saving…" : "Save assignment"}
        </Button>
      </div>
    </div>
  );
}
