"use client";

import { startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Field, TextInput, TextareaInput } from "@/components/forms/form-primitives";
import { saveBrandProfileDraft } from "@/lib/workspace/actions/save-brand-profile-draft";
import type {
  WorkspaceOnboardingField,
  WorkspaceOnboardingInput,
} from "@/lib/validation/workspace-onboarding";

type OnboardingFlowProps = {
  organizationName: string;
  initialValues: WorkspaceOnboardingInput;
  initialCompletion: {
    completed: number;
    total: number;
    percent: number;
    isComplete: boolean;
  };
};

type FieldName = WorkspaceOnboardingField;

type StepDefinition = {
  key: string;
  label: string;
  description: string;
  fields: FieldName[];
};

const steps: StepDefinition[] = [
  {
    key: "brand-basics",
    label: "Brand basics",
    description: "Capture the website and product context that should personalize the workspace.",
    fields: ["website", "offerSummary"],
  },
  {
    key: "audience-and-tone",
    label: "Audience and tone",
    description: "Clarify who this campaign is for, where it should run, and how the brand should sound.",
    fields: ["targetAudience", "primaryChannels", "brandTone"],
  },
  {
    key: "review-and-guardrails",
    label: "Review and guardrails",
    description: "Document who reviews the work and the constraints the delivery flow must respect.",
    fields: ["reviewNotes", "claimGuardrails"],
  },
];

export function OnboardingFlow({
  organizationName,
  initialValues,
  initialCompletion,
}: OnboardingFlowProps) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [stepIndex, setStepIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [statusMessage, setStatusMessage] = useState("");
  const [completion, setCompletion] = useState(initialCompletion);
  const [isComplete, setIsComplete] = useState(initialCompletion.isComplete);

  const step = steps[stepIndex];
  const stepTitle = useMemo(
    () => `Step ${stepIndex + 1} of ${steps.length}`,
    [stepIndex],
  );

  function updateValue(field: FieldName, value: string) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
    setFieldErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  function saveCurrentStep(isFinal: boolean) {
    setIsSaving(true);
    setStatusMessage("");

    startTransition(async () => {
      const requiredFields = isFinal
        ? (Object.keys(values) as FieldName[])
        : [...step.fields];
      const result = await saveBrandProfileDraft(values, requiredFields);

      setIsSaving(false);

      if (!result.success) {
        setFieldErrors(result.fieldErrors ?? {});
        setStatusMessage(result.message);
        return;
      }

      setFieldErrors({});
      setCompletion(result.completion);

      if (isFinal || result.completion.isComplete) {
        setIsComplete(true);
        setStatusMessage("Setup saved. The workspace now has enough brand context to feel tailored.");
        return;
      }

      setStepIndex((current) => Math.min(current + 1, steps.length - 1));
      setStatusMessage("Draft saved. Continue with the next setup step.");
    });
  }

  if (isComplete) {
    return (
      <div className="grid gap-4">
        <section className="workspace-topbar px-4 py-4 sm:px-5">
          <p className="workspace-section-label">Setup complete</p>
          <h1 className="mt-3 text-[1.85rem] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
            {organizationName} is ready for the seeded workflow
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--workspace-copy-body)]">
            The brand profile is now populated enough for the seeded campaign,
            review room, and handover surfaces to feel contextual instead of generic.
          </p>
        </section>

        <section className="workspace-panel px-5 py-5">
          <p className="workspace-section-label">Completion state</p>
          <div className="mt-4 workspace-meta-row">
            <span>{completion.completed} of {completion.total} fields completed</span>
            <span>{completion.percent}% complete</span>
          </div>
          <p className="mt-4 text-sm leading-6 text-[var(--workspace-copy-body)]">
            {statusMessage}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              className="workspace-button workspace-button-primary"
              onClick={() => router.push("/workspace")}
            >
              Return to workspace overview
            </button>
            <button
              type="button"
              className="workspace-button workspace-button-secondary"
              onClick={() => {
                setIsComplete(false);
                setStepIndex(0);
              }}
            >
              Review setup again
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <section className="workspace-topbar px-4 py-4 sm:px-5">
        <div className="space-y-3">
          <p className="workspace-section-label">Setup</p>
          <h1 className="text-[1.85rem] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
            Brand profile setup
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-[var(--workspace-copy-body)]">
            This short setup flow personalizes the seeded workspace without changing
            the core seeded campaign logic.
          </p>
        </div>

        <div className="mt-4 border-t border-[var(--workspace-line)] pt-4">
          <div className="workspace-meta-row">
            <span>{stepTitle}</span>
            <span>{completion.completed} of {completion.total} fields completed</span>
            <span>{completion.percent}% complete</span>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(260px,0.72fr)_minmax(0,1.28fr)]">
        <section className="workspace-panel px-5 py-5">
          <div className="space-y-3">
            <p className="workspace-section-label">Progress</p>
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
            {step.fields.includes("website") ? (
              <Field
                label="Company website"
                hint={`The organization name stays anchored to ${organizationName}.`}
                error={fieldErrors.website}
              >
                <TextInput
                  value={values.website}
                  onChange={(event) => updateValue("website", event.target.value)}
                  placeholder="https://brand.example"
                />
              </Field>
            ) : null}

            {step.fields.includes("offerSummary") ? (
              <Field label="Product or offer" error={fieldErrors.offerSummary}>
                <TextareaInput
                  value={values.offerSummary}
                  onChange={(event) => updateValue("offerSummary", event.target.value)}
                  placeholder="What the brand is selling and why it matters."
                />
              </Field>
            ) : null}

            {step.fields.includes("targetAudience") ? (
              <Field label="Target audience" error={fieldErrors.targetAudience}>
                <TextareaInput
                  value={values.targetAudience}
                  onChange={(event) => updateValue("targetAudience", event.target.value)}
                  placeholder="Who the campaign should resonate with."
                />
              </Field>
            ) : null}

            {step.fields.includes("primaryChannels") ? (
              <Field label="Primary channels" error={fieldErrors.primaryChannels}>
                <TextareaInput
                  value={values.primaryChannels}
                  onChange={(event) => updateValue("primaryChannels", event.target.value)}
                  placeholder="Which channels matter most for this workspace."
                />
              </Field>
            ) : null}

            {step.fields.includes("brandTone") ? (
              <Field label="Brand tone" error={fieldErrors.brandTone}>
                <TextareaInput
                  value={values.brandTone}
                  onChange={(event) => updateValue("brandTone", event.target.value)}
                  placeholder="How the work should sound and feel."
                />
              </Field>
            ) : null}

            {step.fields.includes("reviewNotes") ? (
              <Field
                label="Review stakeholders and notes"
                hint="This field currently captures who reviews the work and any review-specific context."
                error={fieldErrors.reviewNotes}
              >
                <TextareaInput
                  value={values.reviewNotes}
                  onChange={(event) => updateValue("reviewNotes", event.target.value)}
                  placeholder="Who needs to review the work, and what context should guide approval?"
                />
              </Field>
            ) : null}

            {step.fields.includes("claimGuardrails") ? (
              <Field label="Legal or claim guardrails" error={fieldErrors.claimGuardrails}>
                <TextareaInput
                  value={values.claimGuardrails}
                  onChange={(event) => updateValue("claimGuardrails", event.target.value)}
                  placeholder="What the workflow must avoid promising or implying."
                />
              </Field>
            ) : null}
          </div>

          {statusMessage ? (
            <p className="mt-5 text-sm leading-6 text-[var(--workspace-copy-muted)]">
              {statusMessage}
            </p>
          ) : null}

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              className="workspace-button workspace-button-secondary"
              disabled={isSaving}
              onClick={() => saveCurrentStep(false)}
            >
              {isSaving ? "Saving..." : "Save draft"}
            </button>
            <button
              type="button"
              className="workspace-button workspace-button-primary"
              disabled={isSaving}
              onClick={() => saveCurrentStep(stepIndex === steps.length - 1)}
            >
              {stepIndex === steps.length - 1 ? "Finish setup" : "Save and continue"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
