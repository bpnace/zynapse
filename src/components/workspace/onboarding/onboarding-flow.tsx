"use client";

import { startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Field, TextInput, TextareaInput } from "@/components/forms/form-primitives";
import { saveBrandProfileDraft } from "@/lib/workspace/actions/save-brand-profile-draft";
import type { WorkspaceDemoState } from "@/lib/workspace/demo";
import { brandsWorkspaceRoutes } from "@/lib/workspace/routes";
import type {
  WorkspaceOnboardingField,
  WorkspaceOnboardingInput,
} from "@/lib/validation/workspace-onboarding";

type OnboardingFlowProps = {
  organizationName: string;
  demo: WorkspaceDemoState;
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
    key: "business-context",
    label: "Angebot und Kontext",
    description:
      "Lege Website und Angebotskontext fest, damit jede Kampagnenanfrage auf derselben Basis startet.",
    fields: ["website", "offerSummary"],
  },
  {
    key: "audience-and-channels",
    label: "Zielgruppe und Kanäle",
    description:
      "Definiere, wen die Arbeit erreichen soll und welche Kanäle für die nächste Kampagnenrunde führend sind.",
    fields: ["targetAudience", "primaryChannels"],
  },
  {
    key: "brand-direction",
    label: "Markenton und Guardrails",
    description:
      "Halte fest, wie die Marke klingen muss und welche Claims, Aussagen oder No-gos nicht verletzt werden dürfen.",
    fields: ["brandTone", "claimGuardrails"],
  },
  {
    key: "approval-operating-model",
    label: "Freigabe und Entscheidungskreis",
    description:
      "Dokumentiere den Freigabekontext, damit Setup, Review und Delivery nicht von Route zu Route neu erklärt werden müssen.",
    fields: ["reviewNotes"],
  },
];

export function OnboardingFlow({
  organizationName,
  demo,
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
    () => `Schritt ${stepIndex + 1} von ${steps.length}`,
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
    if (demo.isReadOnly) {
      setStatusMessage(demo.mutationMessage);
      return;
    }

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
        setStatusMessage("Kontext gespeichert. Der Bereich hat jetzt genug Markenkontext, um sich spezifisch für euer Team anzufühlen.");
        return;
      }

      setStepIndex((current) => Math.min(current + 1, steps.length - 1));
      setStatusMessage("Entwurf gespeichert. Weiter mit dem nächsten Schritt.");
    });
  }

  if (isComplete) {
    return (
      <div className="workspace-page-stack">
        <section className="workspace-topbar px-5 py-5 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="workspace-section-label">Markenkontext vollständig</span>
            {demo.isDemoWorkspace ? (
              <span className="workspace-demo-badge">{demo.shellBadge}</span>
            ) : null}
          </div>
          <h1 className="mt-3 font-display text-[2.15rem] leading-[1.02] font-semibold tracking-[-0.05em] text-[var(--workspace-copy-strong)]">
            {organizationName} ist bereit für Freigabe und Übergabe
          </h1>
          <p className="mt-2 max-w-3xl text-[0.98rem] leading-7 text-[var(--workspace-copy-body)]">
            Der zentrale Markenkontext steht. Damit bauen Freigabe, Übergabe
            und der nächste kommerzielle Schritt auf denselben Annahmen auf.
          </p>
        </section>

        <section className="workspace-panel px-5 py-5">
          <div className="space-y-3">
            <p className="workspace-section-label">Status</p>
            <div className="workspace-stat-strip">
              <span className="workspace-stat-chip">
                {completion.completed} von {completion.total} Feldern erfasst
              </span>
              <span className="workspace-stat-chip">{completion.percent}% vollständig</span>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-[var(--workspace-copy-body)]">
            {statusMessage}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              className="workspace-button workspace-button-primary"
              onClick={() => router.push(brandsWorkspaceRoutes.home())}
            >
              Zur Übersicht
            </button>
            <button
              type="button"
              className="workspace-button workspace-button-secondary"
              onClick={() => {
                setIsComplete(false);
                setStepIndex(0);
              }}
            >
              Kontext prüfen
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="workspace-page-stack">
      <section className="workspace-topbar px-5 py-5 sm:px-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="workspace-section-label">Markenkontext</span>
            {demo.isDemoWorkspace ? (
              <span className="workspace-demo-badge">{demo.shellBadge}</span>
            ) : null}
          </div>
          <h1 className="font-display text-[2.15rem] leading-[1.02] font-semibold tracking-[-0.05em] text-[var(--workspace-copy-strong)]">
            Brand Setup
          </h1>
          <p className="max-w-3xl text-[0.98rem] leading-7 text-[var(--workspace-copy-body)]">
            Halte den Markenkontext fest, der die Kampagnenanfrage, den Setup-Vorschlag und spätere
            Reviews zusammenhält, ohne ihn in jeder Route neu zu erklären.
          </p>
        </div>

        <div className="mt-4 border-t border-[var(--workspace-line)] pt-4">
          <div className="workspace-stat-strip">
            <span className="workspace-stat-chip">{stepTitle}</span>
            <span className="workspace-stat-chip">
              {completion.completed} von {completion.total} Feldern erfasst
            </span>
            <span className="workspace-stat-chip">{completion.percent}% vollständig</span>
          </div>
          {demo.isDemoWorkspace ? (
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--workspace-copy-muted)]">
              {demo.mutationMessage}
            </p>
          ) : null}
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(260px,0.72fr)_minmax(0,1.28fr)]">
        <section className="workspace-panel px-5 py-5">
          <div className="space-y-3">
            <p className="workspace-section-label">Bereiche</p>
            <div className="workspace-split-list">
              {steps.map((item, index) => (
                <button
                  key={item.key}
                  type="button"
                  className={
                    index === stepIndex
                      ? "flex w-full items-start justify-between gap-3 rounded-[18px] border border-[var(--workspace-line)] bg-[rgba(255,255,255,0.72)] px-4 py-4 text-left shadow-[var(--workspace-shadow-soft)]"
                      : "flex w-full items-start justify-between gap-3 rounded-[18px] border border-transparent px-4 py-4 text-left"
                  }
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
            <h2 className="font-display text-[1.75rem] leading-[1.05] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
              {step.label}
            </h2>
            <p className="text-sm leading-6 text-[var(--workspace-copy-body)]">
              {step.description}
            </p>
          </div>

          <div className="mt-5 grid gap-5">
            {step.fields.includes("website") ? (
              <Field
                label="Unternehmens-Website"
                hint={`Der Organisationsname bleibt an ${organizationName} verankert.`}
                error={fieldErrors.website}
              >
                <TextInput
                  value={values.website}
                  onChange={(event) => updateValue("website", event.target.value)}
                  placeholder="https://brand.example"
                  disabled={demo.isReadOnly}
                />
              </Field>
            ) : null}

            {step.fields.includes("offerSummary") ? (
              <Field label="Angebotskern" error={fieldErrors.offerSummary}>
                <TextareaInput
                  value={values.offerSummary}
                  onChange={(event) => updateValue("offerSummary", event.target.value)}
                  placeholder="Was genau wird angeboten und warum ist es für diese Zusammenarbeit relevant?"
                  disabled={demo.isReadOnly}
                />
              </Field>
            ) : null}

            {step.fields.includes("targetAudience") ? (
              <Field label="Zielgruppe" error={fieldErrors.targetAudience}>
                <TextareaInput
                  value={values.targetAudience}
                  onChange={(event) => updateValue("targetAudience", event.target.value)}
                  placeholder="Wen soll die Kampagne konkret erreichen?"
                  disabled={demo.isReadOnly}
                />
              </Field>
            ) : null}

            {step.fields.includes("primaryChannels") ? (
              <Field label="Zentrale Kanäle" error={fieldErrors.primaryChannels}>
                <TextareaInput
                  value={values.primaryChannels}
                  onChange={(event) => updateValue("primaryChannels", event.target.value)}
                  placeholder="Auf welchen Kanälen soll die Kampagne eingesetzt werden?"
                  disabled={demo.isReadOnly}
                />
              </Field>
            ) : null}

            {step.fields.includes("brandTone") ? (
              <Field label="Tonalität" error={fieldErrors.brandTone}>
                <TextareaInput
                  value={values.brandTone}
                  onChange={(event) => updateValue("brandTone", event.target.value)}
                  placeholder="Wie soll die Marke sprachlich und visuell wirken?"
                  disabled={demo.isReadOnly}
                />
              </Field>
            ) : null}

            {step.fields.includes("reviewNotes") ? (
              <Field
                label="Freigebende und Hinweise"
                hint="Halte fest, wer freigibt und worauf in der Freigabe geachtet werden muss."
                error={fieldErrors.reviewNotes}
              >
                <TextareaInput
                  value={values.reviewNotes}
                  onChange={(event) => updateValue("reviewNotes", event.target.value)}
                  placeholder="Wer gibt die Arbeit frei und welcher Kontext ist für die Entscheidung wichtig?"
                  disabled={demo.isReadOnly}
                />
              </Field>
            ) : null}

            {step.fields.includes("claimGuardrails") ? (
              <Field label="Aussagen und Leitplanken" error={fieldErrors.claimGuardrails}>
                <TextareaInput
                  value={values.claimGuardrails}
                  onChange={(event) => updateValue("claimGuardrails", event.target.value)}
                  placeholder="Welche Aussagen, rechtlichen Grenzen oder No-Gos muss die Kampagne beachten?"
                  disabled={demo.isReadOnly}
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
              disabled={isSaving || demo.isReadOnly}
              onClick={() => saveCurrentStep(false)}
            >
              {isSaving ? "Wird gespeichert..." : "Entwurf speichern"}
            </button>
            <button
              type="button"
              className="workspace-button workspace-button-primary"
              disabled={isSaving || demo.isReadOnly}
              onClick={() => saveCurrentStep(stepIndex === steps.length - 1)}
            >
              {stepIndex === steps.length - 1 ? "Kontext abschließen" : "Speichern und weiter"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
