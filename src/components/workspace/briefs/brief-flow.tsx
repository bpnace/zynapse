"use client";

import { startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Field, TextInput, TextareaInput } from "@/components/forms/form-primitives";
import { saveBriefDraft } from "@/lib/workspace/actions/save-brief-draft";
import { submitBrief } from "@/lib/workspace/actions/submit-brief";
import type {
  WorkspaceBriefField,
  WorkspaceBriefInput,
} from "@/lib/validation/workspace-brief";

type BriefFlowProps = {
  initialValues: WorkspaceBriefInput;
  briefId?: string | null;
  status?: "draft" | "submitted";
  recentBriefs: Array<{
    id: string;
    title: string;
    status: "draft" | "submitted";
    startedAt: Date;
  }>;
};

type StepDefinition = {
  key: string;
  label: string;
  description: string;
  fields: WorkspaceBriefField[];
};

const steps: StepDefinition[] = [
  {
    key: "brief-core",
    label: "Objective and offer",
    description: "Capture what the campaign needs to do and what product or offer it is built around.",
    fields: ["title", "objective", "offer"],
  },
  {
    key: "audience-and-channels",
    label: "Audience and channels",
    description: "Document who this brief targets, how it should be distributed, and what angles matter most.",
    fields: ["audience", "channels", "hooks", "creativeReferences"],
  },
  {
    key: "timing-and-approvals",
    label: "Budget, timing, and approval",
    description: "Close the brief with operational context for budget, timing, and sign-off expectations.",
    fields: ["budgetRange", "timeline", "approvalNotes"],
  },
];

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

export function BriefFlow({
  initialValues,
  briefId,
  status = "draft",
  recentBriefs,
}: BriefFlowProps) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [stepIndex, setStepIndex] = useState(0);
  const [currentBriefId, setCurrentBriefId] = useState<string | null>(briefId ?? null);
  const [currentStatus, setCurrentStatus] = useState<"draft" | "submitted">(status);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<WorkspaceBriefField, string>>>(
    {},
  );

  const step = steps[stepIndex];
  const stepTitle = useMemo(
    () => `Step ${stepIndex + 1} of ${steps.length}`,
    [stepIndex],
  );

  function updateValue(field: WorkspaceBriefField, value: string) {
    if (currentStatus === "submitted") {
      return;
    }

    setValues((current) => ({
      ...current,
      [field]: value,
    }));
    setFieldErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  function handleSave(advance: boolean) {
    if (currentStatus === "submitted") {
      return;
    }

    setIsSaving(true);
    setStatusMessage("");

    const requiredFields = [...step.fields];

    startTransition(async () => {
      const result = await saveBriefDraft(values, requiredFields, currentBriefId);

      setIsSaving(false);

      if (!result.success) {
        setFieldErrors(result.fieldErrors ?? {});
        setStatusMessage(result.message);
        return;
      }

      setFieldErrors({});
      setCurrentBriefId(result.briefId);
      setCurrentStatus(result.status);
      setStatusMessage(result.message);

      if (briefId !== result.briefId) {
        router.replace(`/workspace/briefs/${result.briefId}`);
      }

      if (advance) {
        setStepIndex((current) => Math.min(current + 1, steps.length - 1));
      }
    });
  }

  function handleSubmit() {
    if (currentStatus === "submitted") {
      return;
    }

    setIsSaving(true);
    setStatusMessage("");

    startTransition(async () => {
      const result = await submitBrief(values, currentBriefId);

      setIsSaving(false);

      if (!result.success) {
        setStatusMessage(result.message);
        return;
      }

      setCurrentBriefId(result.briefId);
      setCurrentStatus(result.status);
      setFieldErrors({});
      setStatusMessage(result.message);
      router.replace(`/workspace/briefs/${result.briefId}`);
    });
  }

  return (
    <div className="grid gap-4">
      <section className="workspace-topbar px-4 py-4 sm:px-5">
        <div className="space-y-3">
          <p className="workspace-section-label">Briefs</p>
          <h1 className="text-[1.85rem] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
            {currentStatus === "submitted" ? "Submitted brief" : "Create a real brief"}
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-[var(--workspace-copy-body)]">
            This flow turns the seeded workspace into a real buyer workflow by
            capturing campaign intent, channel priorities, and approval context in a
            workspace-scoped brief.
          </p>
        </div>

        <div className="mt-4 border-t border-[var(--workspace-line)] pt-4">
          <div className="workspace-meta-row">
            <span>{stepTitle}</span>
            <span>{currentBriefId ? "Draft persisted" : "New brief"}</span>
            <span>{currentStatus === "submitted" ? "Read only" : "Editable"}</span>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(260px,0.72fr)_minmax(0,1.28fr)]">
        <section className="workspace-panel px-5 py-5">
          <div className="space-y-3">
            <p className="workspace-section-label">Flow</p>
            <div className="workspace-split-list">
              {steps.map((item, index) => (
                <button
                  key={item.key}
                  type="button"
                  className={index === stepIndex ? "flex w-full items-start justify-between gap-3 border-l-2 border-[var(--workspace-copy-strong)] py-4 pl-3 text-left" : "flex w-full items-start justify-between gap-3 border-l-2 border-transparent py-4 pl-3 text-left"}
                  onClick={() => setStepIndex(index)}
                >
                  <div>
                    <p className="text-sm font-semibold text-[var(--workspace-copy-strong)]">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[var(--workspace-copy-muted)]">
                      {item.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-[var(--workspace-line)] pt-4">
            <p className="workspace-section-label">Recent briefs</p>
            {recentBriefs.length > 0 ? (
              <div className="mt-3 workspace-split-list">
                {recentBriefs.map((brief) => (
                  <a
                    key={brief.id}
                    href={`/workspace/briefs/${brief.id}`}
                    className="block py-3"
                  >
                    <p className="text-sm font-semibold text-[var(--workspace-copy-strong)]">
                      {brief.title}
                    </p>
                    <div className="mt-1 workspace-meta-row">
                      <span>{brief.status}</span>
                      <span>{formatDate(brief.startedAt)}</span>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm leading-6 text-[var(--workspace-copy-body)]">
                No saved briefs exist yet for this workspace.
              </p>
            )}
          </div>
        </section>

        <section className="workspace-panel px-5 py-5">
          <div className="space-y-2">
            <p className="workspace-section-label">{stepTitle}</p>
            <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--workspace-copy-strong)]">
              {step.label}
            </h2>
            <p className="text-sm leading-6 text-[var(--workspace-copy-body)]">
              {step.description}
            </p>
          </div>

          <div className="mt-5 grid gap-5">
            {step.fields.includes("title") ? (
              <Field label="Brief title" error={fieldErrors.title}>
                <TextInput
                  value={values.title}
                  onChange={(event) => updateValue("title", event.target.value)}
                  placeholder="Q2 serum launch brief"
                  disabled={currentStatus === "submitted"}
                />
              </Field>
            ) : null}

            {step.fields.includes("objective") ? (
              <Field label="Objective" error={fieldErrors.objective}>
                <TextareaInput
                  value={values.objective}
                  onChange={(event) => updateValue("objective", event.target.value)}
                  placeholder="What should this brief help the team achieve?"
                  disabled={currentStatus === "submitted"}
                />
              </Field>
            ) : null}

            {step.fields.includes("offer") ? (
              <Field label="Offer or product" error={fieldErrors.offer}>
                <TextareaInput
                  value={values.offer}
                  onChange={(event) => updateValue("offer", event.target.value)}
                  placeholder="What product or offer is the brief built around?"
                  disabled={currentStatus === "submitted"}
                />
              </Field>
            ) : null}

            {step.fields.includes("audience") ? (
              <Field label="Audience" error={fieldErrors.audience}>
                <TextareaInput
                  value={values.audience}
                  onChange={(event) => updateValue("audience", event.target.value)}
                  placeholder="Who should the campaign resonate with?"
                  disabled={currentStatus === "submitted"}
                />
              </Field>
            ) : null}

            {step.fields.includes("channels") ? (
              <Field label="Channel mix" error={fieldErrors.channels}>
                <TextareaInput
                  value={values.channels}
                  onChange={(event) => updateValue("channels", event.target.value)}
                  placeholder="Which channels matter most for this brief?"
                  disabled={currentStatus === "submitted"}
                />
              </Field>
            ) : null}

            {step.fields.includes("hooks") ? (
              <Field label="Hooks or messaging priorities" error={fieldErrors.hooks}>
                <TextareaInput
                  value={values.hooks}
                  onChange={(event) => updateValue("hooks", event.target.value)}
                  placeholder="Which angles, hooks, or proof moments should lead?"
                  disabled={currentStatus === "submitted"}
                />
              </Field>
            ) : null}

            {step.fields.includes("creativeReferences") ? (
              <Field label="Creative references" error={fieldErrors.creativeReferences}>
                <TextareaInput
                  value={values.creativeReferences}
                  onChange={(event) => updateValue("creativeReferences", event.target.value)}
                  placeholder="Reference assets, examples, or current winners."
                  disabled={currentStatus === "submitted"}
                />
              </Field>
            ) : null}

            {step.fields.includes("budgetRange") ? (
              <Field label="Budget range" error={fieldErrors.budgetRange}>
                <TextInput
                  value={values.budgetRange}
                  onChange={(event) => updateValue("budgetRange", event.target.value)}
                  placeholder="EUR 15k-25k"
                  disabled={currentStatus === "submitted"}
                />
              </Field>
            ) : null}

            {step.fields.includes("timeline") ? (
              <Field label="Timing" error={fieldErrors.timeline}>
                <TextInput
                  value={values.timeline}
                  onChange={(event) => updateValue("timeline", event.target.value)}
                  placeholder="Launch within four weeks"
                  disabled={currentStatus === "submitted"}
                />
              </Field>
            ) : null}

            {step.fields.includes("approvalNotes") ? (
              <Field label="Approval expectations" error={fieldErrors.approvalNotes}>
                <TextareaInput
                  value={values.approvalNotes}
                  onChange={(event) => updateValue("approvalNotes", event.target.value)}
                  placeholder="Who signs off and what should the team expect?"
                  disabled={currentStatus === "submitted"}
                />
              </Field>
            ) : null}
          </div>

          {statusMessage ? (
            <p className="mt-5 text-sm leading-6 text-[var(--workspace-copy-muted)]">
              {statusMessage}
            </p>
          ) : null}

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <button
              type="button"
              className="workspace-button workspace-button-secondary"
              disabled={isSaving || currentStatus === "submitted"}
              onClick={() => handleSave(false)}
            >
              {isSaving ? "Saving..." : "Save draft"}
            </button>
            <button
              type="button"
              className="workspace-button workspace-button-secondary"
              disabled={isSaving || currentStatus === "submitted"}
              onClick={() => handleSave(true)}
            >
              Save and continue
            </button>
            <button
              type="button"
              className="workspace-button workspace-button-primary"
              disabled={isSaving || currentStatus === "submitted"}
              onClick={handleSubmit}
            >
              {currentStatus === "submitted" ? "Submitted" : "Submit brief"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
