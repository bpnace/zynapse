"use client";

import { startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Field, TextInput, TextareaInput } from "@/components/forms/form-primitives";
import { saveBriefDraft } from "@/lib/workspace/actions/save-brief-draft";
import { submitBrief } from "@/lib/workspace/actions/submit-brief";
import { brandsWorkspaceRoutes } from "@/lib/workspace/routes";
import {
  formatWorkspaceDate,
  formatWorkspaceLabel,
} from "@/lib/workspace/formatting";
import type { WorkspaceDemoState } from "@/lib/workspace/demo";
import type {
  WorkspaceBriefField,
  WorkspaceBriefInput,
} from "@/lib/validation/workspace-brief";

type BriefFlowProps = {
  demo: WorkspaceDemoState;
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
    label: "Ziel und Angebot",
    description: "Haltet fest, was diese Kampagne erreichen soll und welches Angebot im Mittelpunkt steht.",
    fields: ["title", "objective", "offer"],
  },
  {
    key: "audience-and-channels",
    label: "Zielgruppe und Kanäle",
    description: "Beschreibt, wen das Briefing anspricht, wo es laufen soll und welche Richtungen tragen müssen.",
    fields: ["audience", "channels", "hooks", "creativeReferences"],
  },
  {
    key: "timing-and-approvals",
    label: "Budget, Timing und Freigabe",
    description: "Schließt das Briefing mit Budget, Timing und Freigabekontext ab, damit das Team sicher arbeiten kann.",
    fields: ["budgetRange", "timeline", "approvalNotes"],
  },
];

export function BriefFlow({
  demo,
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
    () => `Schritt ${stepIndex + 1} von ${steps.length}`,
    [stepIndex],
  );

  function updateValue(field: WorkspaceBriefField, value: string) {
    if (currentStatus === "submitted" || demo.isReadOnly) {
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
    if (currentStatus === "submitted" || demo.isReadOnly) {
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
        router.replace(brandsWorkspaceRoutes.briefs.detail(result.briefId));
      }

      if (advance) {
        setStepIndex((current) => Math.min(current + 1, steps.length - 1));
      }
    });
  }

  function handleSubmit() {
    if (currentStatus === "submitted" || demo.isReadOnly) {
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
      router.replace(brandsWorkspaceRoutes.briefs.detail(result.briefId));
    });
  }

  return (
    <div className="grid gap-4">
      <section className="workspace-topbar px-4 py-4 sm:px-5">
        <div className="space-y-3">
          <p className="workspace-section-label">Briefings</p>
          <h1 className="text-[1.85rem] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
            {currentStatus === "submitted" ? "Eingereichtes Briefing" : "Briefing erstellen"}
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-[var(--workspace-copy-body)]">
            Haltet Ziel, Kanalprioritäten und Freigabekontext an einem Ort fest,
            damit das Team mit einem echten Briefing statt mit Annahmen arbeitet.
          </p>
        </div>

        <div className="mt-4 border-t border-[var(--workspace-line)] pt-4">
          <div className="workspace-meta-row">
            <span>{stepTitle}</span>
            <span>{currentBriefId ? "Entwurf gespeichert" : "Neues Briefing"}</span>
            <span>{currentStatus === "submitted" || demo.isReadOnly ? "Nur lesen" : "Bearbeitbar"}</span>
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
            <p className="workspace-section-label">Ablauf</p>
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
            <p className="workspace-section-label">Letzte Briefings</p>
            {recentBriefs.length > 0 ? (
              <div className="mt-3 workspace-split-list">
                {recentBriefs.map((brief) => (
                  <a
                    key={brief.id}
                    href={brandsWorkspaceRoutes.briefs.detail(brief.id)}
                    className="block py-3"
                  >
                    <p className="text-sm font-semibold text-[var(--workspace-copy-strong)]">
                      {brief.title}
                    </p>
                    <div className="mt-1 workspace-meta-row">
                      <span>{formatWorkspaceLabel(brief.status)}</span>
                      <span>{formatWorkspaceDate(brief.startedAt)}</span>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm leading-6 text-[var(--workspace-copy-body)]">
                Für diesen Bereich wurde noch kein Briefing gespeichert.
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
              <Field label="Titel des Briefings" error={fieldErrors.title}>
                <TextInput
                  value={values.title}
                  onChange={(event) => updateValue("title", event.target.value)}
                  placeholder="Q2-Briefing für die Serumeinführung"
                  disabled={currentStatus === "submitted" || demo.isReadOnly}
                />
              </Field>
            ) : null}

            {step.fields.includes("objective") ? (
              <Field label="Ziel" error={fieldErrors.objective}>
                <TextareaInput
                  value={values.objective}
                  onChange={(event) => updateValue("objective", event.target.value)}
                  placeholder="Was soll das Team mit diesem Briefing erreichen?"
                  disabled={currentStatus === "submitted" || demo.isReadOnly}
                />
              </Field>
            ) : null}

            {step.fields.includes("offer") ? (
              <Field label="Angebot oder Produkt" error={fieldErrors.offer}>
                <TextareaInput
                  value={values.offer}
                  onChange={(event) => updateValue("offer", event.target.value)}
                  placeholder="Welches Produkt oder Angebot steht im Mittelpunkt?"
                  disabled={currentStatus === "submitted" || demo.isReadOnly}
                />
              </Field>
            ) : null}

            {step.fields.includes("audience") ? (
              <Field label="Zielgruppe" error={fieldErrors.audience}>
                <TextareaInput
                  value={values.audience}
                  onChange={(event) => updateValue("audience", event.target.value)}
                  placeholder="Bei wem soll die Kampagne Anklang finden?"
                  disabled={currentStatus === "submitted" || demo.isReadOnly}
                />
              </Field>
            ) : null}

            {step.fields.includes("channels") ? (
              <Field label="Kanal-Mix" error={fieldErrors.channels}>
                <TextareaInput
                  value={values.channels}
                  onChange={(event) => updateValue("channels", event.target.value)}
                  placeholder="Welche Kanäle sind für dieses Briefing am wichtigsten?"
                  disabled={currentStatus === "submitted" || demo.isReadOnly}
                />
              </Field>
            ) : null}

            {step.fields.includes("hooks") ? (
              <Field label="Einstiege oder Prioritäten in der Ansprache" error={fieldErrors.hooks}>
                <TextareaInput
                  value={values.hooks}
                  onChange={(event) => updateValue("hooks", event.target.value)}
                  placeholder="Welche Ansätze, Einstiege oder Wirkbeweise sollen führen?"
                  disabled={currentStatus === "submitted" || demo.isReadOnly}
                />
              </Field>
            ) : null}

            {step.fields.includes("creativeReferences") ? (
              <Field label="Kreativ-Referenzen" error={fieldErrors.creativeReferences}>
                <TextareaInput
                  value={values.creativeReferences}
                  onChange={(event) => updateValue("creativeReferences", event.target.value)}
                  placeholder="Relevante Varianten, Beispiele oder aktuelle Gewinner ergänzen."
                  disabled={currentStatus === "submitted" || demo.isReadOnly}
                />
              </Field>
            ) : null}

            {step.fields.includes("budgetRange") ? (
              <Field label="Budgetrahmen" error={fieldErrors.budgetRange}>
                <TextInput
                  value={values.budgetRange}
                  onChange={(event) => updateValue("budgetRange", event.target.value)}
                  placeholder="15.000–25.000 EUR"
                  disabled={currentStatus === "submitted" || demo.isReadOnly}
                />
              </Field>
            ) : null}

            {step.fields.includes("timeline") ? (
              <Field label="Timing" error={fieldErrors.timeline}>
                <TextInput
                  value={values.timeline}
                  onChange={(event) => updateValue("timeline", event.target.value)}
                  placeholder="Markteinführung innerhalb von vier Wochen"
                  disabled={currentStatus === "submitted" || demo.isReadOnly}
                />
              </Field>
            ) : null}

            {step.fields.includes("approvalNotes") ? (
              <Field label="Freigabe-Erwartungen" error={fieldErrors.approvalNotes}>
                <TextareaInput
                  value={values.approvalNotes}
                  onChange={(event) => updateValue("approvalNotes", event.target.value)}
                  placeholder="Wer gibt frei, und was muss das Team vor der Freigabe beachten?"
                  disabled={currentStatus === "submitted" || demo.isReadOnly}
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
              disabled={isSaving || currentStatus === "submitted" || demo.isReadOnly}
              onClick={() => handleSave(false)}
            >
              {isSaving ? "Speichert..." : "Entwurf speichern"}
            </button>
            <button
              type="button"
              className="workspace-button workspace-button-secondary"
              disabled={isSaving || currentStatus === "submitted" || demo.isReadOnly}
              onClick={() => handleSave(true)}
            >
              Speichern und weiter
            </button>
            <button
              type="button"
              className="workspace-button workspace-button-primary"
              disabled={isSaving || currentStatus === "submitted" || demo.isReadOnly}
              onClick={handleSubmit}
            >
              {currentStatus === "submitted" ? "Eingereicht" : "Briefing einreichen"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
