"use client";

import { startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Field, TextInput, TextareaInput } from "@/components/forms/form-primitives";
import { saveBriefDraft } from "@/lib/workspace/actions/save-brief-draft";
import { submitCampaignRequest } from "@/lib/workspace/actions/submit-campaign-request";
import type { WorkspaceDemoState } from "@/lib/workspace/demo";
import { brandsWorkspaceRoutes } from "@/lib/workspace/routes";
import {
  formatWorkspaceDate,
  formatWorkspaceLabel,
} from "@/lib/workspace/formatting";
import type {
  WorkspaceBriefField,
  WorkspaceBriefInput,
} from "@/lib/validation/workspace-brief";

type CampaignRequestBuilderProps = {
  demo: WorkspaceDemoState;
  initialValues: WorkspaceBriefInput;
  briefId?: string | null;
  status?: "draft" | "submitted";
  recentRequests: Array<{
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
    key: "campaign-goal",
    label: "Ziel und Angebot",
    description:
      "Definiere, was diese Kampagne erreichen soll und welches Angebot im Zentrum der Anfrage steht.",
    fields: ["title", "objective", "offer"],
  },
  {
    key: "audience-and-channels",
    label: "Zielgruppe und Kanäle",
    description:
      "Lege fest, wen das Setup ansprechen soll und wo die Kampagne vorrangig ausgespielt wird.",
    fields: ["audience", "channels"],
  },
  {
    key: "creative-direction",
    label: "Angles und Creative-Richtung",
    description:
      "Sammle Hooks, Richtungen und Referenzen, aus denen das spätere Setup vorgeschlagen werden soll.",
    fields: ["hooks", "creativeReferences"],
  },
  {
    key: "timing-and-approvals",
    label: "Budget, Timing und Freigabe",
    description:
      "Dokumentiere den zeitlichen Rahmen und den Freigabekontext, damit die Anfrage in einen realen Setup-Vorschlag übersetzt werden kann.",
    fields: ["budgetRange", "timeline", "approvalNotes"],
  },
];

export function CampaignRequestBuilder({
  demo,
  initialValues,
  briefId,
  status = "draft",
  recentRequests,
}: CampaignRequestBuilderProps) {
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

  function routeToDraft(nextBriefId: string) {
    router.replace(`${brandsWorkspaceRoutes.campaigns.new()}?draft=${nextBriefId}`);
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

      if (briefId !== result.briefId && currentBriefId !== result.briefId) {
        routeToDraft(result.briefId);
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
      const result = await submitCampaignRequest(values, currentBriefId);

      setIsSaving(false);

      if (!result.success) {
        setStatusMessage(result.message);
        return;
      }

      setCurrentBriefId(result.briefId);
      setCurrentStatus("submitted");
      setFieldErrors({});
      setStatusMessage(result.message);
      router.replace(brandsWorkspaceRoutes.campaigns.setup(result.campaignId));
    });
  }

  return (
    <div className="grid gap-4">
      <section className="workspace-topbar px-4 py-4 sm:px-5">
        <div className="space-y-3">
          <p className="workspace-section-label">Campaign Builder</p>
          <h1 className="text-[1.85rem] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
            {currentStatus === "submitted" ? "Eingereichte Kampagnenanfrage" : "Neue Kampagne anlegen"}
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-[var(--workspace-copy-body)]">
            Übersetze die nächste Initiative in einen strukturierten Kampagnen-Request, aus dem ein
            konkreter Setup-Vorschlag entstehen kann.
          </p>
        </div>

        <div className="mt-4 border-t border-[var(--workspace-line)] pt-4">
          <div className="workspace-meta-row">
            <span>{stepTitle}</span>
            <span>{currentBriefId ? "Entwurf gespeichert" : "Neue Kampagne"}</span>
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
            <p className="workspace-section-label">Builder-Schritte</p>
            <div className="workspace-split-list">
              {steps.map((item, index) => (
                <button
                  key={item.key}
                  type="button"
                  className={
                    index === stepIndex
                      ? "flex w-full items-start justify-between gap-3 border-l-2 border-[var(--workspace-copy-strong)] py-4 pl-3 text-left"
                      : "flex w-full items-start justify-between gap-3 border-l-2 border-transparent py-4 pl-3 text-left"
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

          <div className="mt-6 border-t border-[var(--workspace-line)] pt-4">
            <p className="workspace-section-label">Letzte Kampagnenanfragen</p>
            {recentRequests.length > 0 ? (
              <div className="mt-3 workspace-split-list">
                {recentRequests.map((request) => (
                  <a
                    key={request.id}
                    href={`${brandsWorkspaceRoutes.campaigns.new()}?draft=${request.id}`}
                    className="block py-3"
                  >
                    <p className="text-sm font-semibold text-[var(--workspace-copy-strong)]">
                      {request.title}
                    </p>
                    <div className="mt-1 workspace-meta-row">
                      <span>{formatWorkspaceLabel(request.status)}</span>
                      <span>{formatWorkspaceDate(request.startedAt)}</span>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm leading-6 text-[var(--workspace-copy-body)]">
                Für diesen Bereich wurde noch keine Kampagnenanfrage gespeichert.
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
              <Field label="Titel der Kampagne" error={fieldErrors.title}>
                <TextInput
                  value={values.title}
                  onChange={(event) => updateValue("title", event.target.value)}
                  placeholder="Q2 Creator Launch für das neue Hero-Serum"
                  disabled={currentStatus === "submitted" || demo.isReadOnly}
                />
              </Field>
            ) : null}

            {step.fields.includes("objective") ? (
              <Field label="Was soll diese Kampagne erreichen?" error={fieldErrors.objective}>
                <TextareaInput
                  value={values.objective}
                  onChange={(event) => updateValue("objective", event.target.value)}
                  placeholder="Welche geschäftliche oder kommunikative Wirkung soll das Setup erzeugen?"
                  disabled={currentStatus === "submitted" || demo.isReadOnly}
                />
              </Field>
            ) : null}

            {step.fields.includes("offer") ? (
              <Field label="Welches Angebot steht im Fokus?" error={fieldErrors.offer}>
                <TextareaInput
                  value={values.offer}
                  onChange={(event) => updateValue("offer", event.target.value)}
                  placeholder="Beschreibe Produkt, Nutzenversprechen und den Kern des Angebots."
                  disabled={currentStatus === "submitted" || demo.isReadOnly}
                />
              </Field>
            ) : null}

            {step.fields.includes("audience") ? (
              <Field label="Wen soll die Kampagne erreichen?" error={fieldErrors.audience}>
                <TextareaInput
                  value={values.audience}
                  onChange={(event) => updateValue("audience", event.target.value)}
                  placeholder="Welche Zielgruppe, welcher Markt oder welches Buying-Mindset ist relevant?"
                  disabled={currentStatus === "submitted" || demo.isReadOnly}
                />
              </Field>
            ) : null}

            {step.fields.includes("channels") ? (
              <Field label="Welche Kanäle sind führend?" error={fieldErrors.channels}>
                <TextInput
                  value={values.channels}
                  onChange={(event) => updateValue("channels", event.target.value)}
                  placeholder="Meta Paid Social, TikTok, Reels, Landing Page, UGC Ads"
                  disabled={currentStatus === "submitted" || demo.isReadOnly}
                />
              </Field>
            ) : null}

            {step.fields.includes("hooks") ? (
              <Field label="Welche Angles oder Hooks müssen führen?" error={fieldErrors.hooks}>
                <TextareaInput
                  value={values.hooks}
                  onChange={(event) => updateValue("hooks", event.target.value)}
                  placeholder="Proof points, emotional hooks, objections, CTA direction"
                  disabled={currentStatus === "submitted" || demo.isReadOnly}
                />
              </Field>
            ) : null}

            {step.fields.includes("creativeReferences") ? (
              <Field
                label="Welche Beispiele oder Referenzen sind relevant?"
                error={fieldErrors.creativeReferences}
              >
                <TextareaInput
                  value={values.creativeReferences}
                  onChange={(event) => updateValue("creativeReferences", event.target.value)}
                  placeholder="Bestehende Gewinner, Referenz-Ads, Formatideen, No-gos"
                  disabled={currentStatus === "submitted" || demo.isReadOnly}
                />
              </Field>
            ) : null}

            {step.fields.includes("budgetRange") ? (
              <Field label="Welcher Budgetrahmen ist realistisch?" error={fieldErrors.budgetRange}>
                <TextInput
                  value={values.budgetRange}
                  onChange={(event) => updateValue("budgetRange", event.target.value)}
                  placeholder="z. B. 15.000–25.000 EUR"
                  disabled={currentStatus === "submitted" || demo.isReadOnly}
                />
              </Field>
            ) : null}

            {step.fields.includes("timeline") ? (
              <Field label="Welches Timing ist relevant?" error={fieldErrors.timeline}>
                <TextInput
                  value={values.timeline}
                  onChange={(event) => updateValue("timeline", event.target.value)}
                  placeholder="z. B. Setup-Review in 7 Tagen, Go-live in 4 Wochen"
                  disabled={currentStatus === "submitted" || demo.isReadOnly}
                />
              </Field>
            ) : null}

            {step.fields.includes("approvalNotes") ? (
              <Field label="Was ist für Freigaben wichtig?" error={fieldErrors.approvalNotes}>
                <TextareaInput
                  value={values.approvalNotes}
                  onChange={(event) => updateValue("approvalNotes", event.target.value)}
                  placeholder="Wer gibt frei, welche Claims brauchen besondere Prüfung, welche Stakeholder sind beteiligt?"
                  disabled={currentStatus === "submitted" || demo.isReadOnly}
                />
              </Field>
            ) : null}
          </div>

          {statusMessage ? (
            <p className="mt-5 text-sm leading-6 text-[var(--workspace-copy-body)]">
              {statusMessage}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--workspace-line)] pt-4">
            <button
              type="button"
              className="workspace-button workspace-button-secondary"
              onClick={() => setStepIndex((current) => Math.max(current - 1, 0))}
              disabled={stepIndex === 0 || isSaving}
            >
              Zurück
            </button>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="workspace-button workspace-button-secondary"
                onClick={() => handleSave(false)}
                disabled={isSaving || currentStatus === "submitted" || demo.isReadOnly}
              >
                {isSaving ? "Speichert..." : "Entwurf speichern"}
              </button>

              {stepIndex < steps.length - 1 ? (
                <button
                  type="button"
                  className="workspace-button workspace-button-primary"
                  onClick={() => handleSave(true)}
                  disabled={isSaving || currentStatus === "submitted" || demo.isReadOnly}
                >
                  Weiter
                </button>
              ) : (
                <button
                  type="button"
                  className="workspace-button workspace-button-primary"
                  onClick={handleSubmit}
                  disabled={isSaving || currentStatus === "submitted" || demo.isReadOnly}
                >
                  {isSaving ? "Wird eingereicht..." : "Kampagnenanfrage einreichen"}
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
