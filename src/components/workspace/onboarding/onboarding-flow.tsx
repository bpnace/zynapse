"use client";

import { startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Field, TextInput, TextareaInput } from "@/components/forms/form-primitives";
import { saveBrandProfileDraft } from "@/lib/workspace/actions/save-brand-profile-draft";
import type { WorkspaceDemoState } from "@/lib/workspace/demo";
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
    key: "brand-basics",
    label: "Brand-Grundlagen",
    description: "Erfasst Website und Angebotskontext, damit sich der Workspace von Anfang an konkret anfühlt.",
    fields: ["website", "offerSummary"],
  },
  {
    key: "audience-and-tone",
    label: "Zielgruppe und Tonalität",
    description: "Beschreibt, für wen die Arbeit gedacht ist, wo sie laufen soll und wie die Brand klingen muss.",
    fields: ["targetAudience", "primaryChannels", "brandTone"],
  },
  {
    key: "review-and-guardrails",
    label: "Review und Guardrails",
    description: "Haltet fest, wer reviewt und welche Leitplanken das Team einhalten muss.",
    fields: ["reviewNotes", "claimGuardrails"],
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
        setStatusMessage("Setup gespeichert. Der Workspace hat jetzt genug Brand-Kontext, um sich spezifisch für euer Team anzufühlen.");
        return;
      }

      setStepIndex((current) => Math.min(current + 1, steps.length - 1));
      setStatusMessage("Entwurf gespeichert. Weiter mit dem nächsten Setup-Schritt.");
    });
  }

  if (isComplete) {
    return (
      <div className="grid gap-4">
        <section className="workspace-topbar px-4 py-4 sm:px-5">
          <p className="workspace-section-label">Setup abgeschlossen</p>
          <h1 className="mt-3 text-[1.85rem] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
            {organizationName} ist bereit für den Workspace
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--workspace-copy-body)]">
            Das Brand-Profil gibt Kampagne, Review und Übergabe jetzt genug Kontext,
            damit sie sich spezifisch statt generisch anfühlen.
          </p>
        </section>

        <section className="workspace-panel px-5 py-5">
          <p className="workspace-section-label">Status</p>
          <div className="mt-4 workspace-meta-row">
            <span>{completion.completed} von {completion.total} Feldern ausgefüllt</span>
            <span>{completion.percent}% abgeschlossen</span>
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
              Zurück zur Übersicht
            </button>
            <button
              type="button"
              className="workspace-button workspace-button-secondary"
              onClick={() => {
                setIsComplete(false);
                setStepIndex(0);
              }}
            >
              Setup prüfen
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
            Brand-Setup
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-[var(--workspace-copy-body)]">
            Ergänzt den Brand-Kontext, den der Workspace braucht, damit Kampagne,
            Review und Übergabe sich von Beginn an spezifisch für euer Team anfühlen.
          </p>
        </div>

        <div className="mt-4 border-t border-[var(--workspace-line)] pt-4">
          <div className="workspace-meta-row">
            <span>{stepTitle}</span>
            <span>{completion.completed} von {completion.total} Feldern ausgefüllt</span>
            <span>{completion.percent}% abgeschlossen</span>
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
            <p className="workspace-section-label">Fortschritt</p>
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
              <Field label="Produkt oder Angebot" error={fieldErrors.offerSummary}>
                <TextareaInput
                  value={values.offerSummary}
                  onChange={(event) => updateValue("offerSummary", event.target.value)}
                  placeholder="Was die Brand verkauft und warum es relevant ist."
                  disabled={demo.isReadOnly}
                />
              </Field>
            ) : null}

            {step.fields.includes("targetAudience") ? (
              <Field label="Zielgruppe" error={fieldErrors.targetAudience}>
                <TextareaInput
                  value={values.targetAudience}
                  onChange={(event) => updateValue("targetAudience", event.target.value)}
                  placeholder="Bei wem die Kampagne Anklang finden soll."
                  disabled={demo.isReadOnly}
                />
              </Field>
            ) : null}

            {step.fields.includes("primaryChannels") ? (
              <Field label="Primäre Kanäle" error={fieldErrors.primaryChannels}>
                <TextareaInput
                  value={values.primaryChannels}
                  onChange={(event) => updateValue("primaryChannels", event.target.value)}
                  placeholder="Welche Kanäle für diesen Workspace am wichtigsten sind."
                  disabled={demo.isReadOnly}
                />
              </Field>
            ) : null}

            {step.fields.includes("brandTone") ? (
              <Field label="Brand-Tonalität" error={fieldErrors.brandTone}>
                <TextareaInput
                  value={values.brandTone}
                  onChange={(event) => updateValue("brandTone", event.target.value)}
                  placeholder="Wie sich die Arbeit anhören und anfühlen soll."
                  disabled={demo.isReadOnly}
                />
              </Field>
            ) : null}

            {step.fields.includes("reviewNotes") ? (
              <Field
                label="Reviewer und Hinweise"
                hint="Hier notiert ihr, wer reviewt und worauf diese Personen achten."
                error={fieldErrors.reviewNotes}
              >
                <TextareaInput
                  value={values.reviewNotes}
                  onChange={(event) => updateValue("reviewNotes", event.target.value)}
                  placeholder="Wer reviewt die Arbeit, und welcher Kontext ist für die Freigabe wichtig?"
                  disabled={demo.isReadOnly}
                />
              </Field>
            ) : null}

            {step.fields.includes("claimGuardrails") ? (
              <Field label="Rechtliche oder Claim-Guardrails" error={fieldErrors.claimGuardrails}>
                <TextareaInput
                  value={values.claimGuardrails}
                  onChange={(event) => updateValue("claimGuardrails", event.target.value)}
                  placeholder="Welche Aussagen der Workflow nicht versprechen oder andeuten darf."
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
              {isSaving ? "Speichert..." : "Entwurf speichern"}
            </button>
            <button
              type="button"
              className="workspace-button workspace-button-primary"
              disabled={isSaving || demo.isReadOnly}
              onClick={() => saveCurrentStep(stepIndex === steps.length - 1)}
            >
              {stepIndex === steps.length - 1 ? "Setup abschließen" : "Speichern und weiter"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
