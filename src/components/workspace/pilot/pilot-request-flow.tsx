"use client";

import { startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Field, TextInput, TextareaInput } from "@/components/forms/form-primitives";
import { submitPilotRequest } from "@/lib/workspace/actions/submit-pilot-request";
import { formatWorkspaceDateTime, formatWorkspaceLabel } from "@/lib/workspace/formatting";
import type { WorkspaceDemoState } from "@/lib/workspace/demo";
import type { WorkspacePilotRequestInput } from "@/lib/validation/workspace-pilot-request";

type PilotRequestFlowProps = {
  organizationName: string;
  demo: WorkspaceDemoState;
  campaign: {
    id: string;
    name: string;
    packageTier: string;
    currentStage: string;
  } | null;
  campaigns: Array<{
    id: string;
    name: string;
    packageTier: string;
    currentStage: string;
  }>;
  latestRequest: {
    desiredTier: string;
    startWindow: string;
    internalStakeholders: string | null;
    message: string;
    status: string;
    handoffMode: string;
    submittedAt: Date;
  } | null;
  initialValues: WorkspacePilotRequestInput;
};

function buildDefaultPilotMessage(campaignName: string) {
  return `Wir möchten ${campaignName} in einen bezahlten Piloten überführen.`;
}

export function PilotRequestFlow({
  organizationName,
  demo,
  campaign,
  campaigns,
  latestRequest,
  initialValues,
}: PilotRequestFlowProps) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [selectedCampaignId, setSelectedCampaignId] = useState(campaign?.id ?? "");
  const [isPending, setIsPending] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [requestState, setRequestState] = useState<{
    success: boolean;
    status?: string;
    handoffMode?: string;
  } | null>(null);
  const selectedCampaign = useMemo(
    () => campaigns.find((item) => item.id === selectedCampaignId) ?? null,
    [campaigns, selectedCampaignId],
  );

  function updateValue(
    field: keyof WorkspacePilotRequestInput,
    value: string,
  ) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleCampaignChange(nextCampaignId: string) {
    const nextCampaign = campaigns.find((item) => item.id === nextCampaignId) ?? null;
    const previousCampaign = campaigns.find((item) => item.id === selectedCampaignId) ?? campaign;

    setSelectedCampaignId(nextCampaignId);

    if (!nextCampaign) {
      return;
    }

    setValues((current) => {
      const previousAutoMessage = previousCampaign
        ? buildDefaultPilotMessage(previousCampaign.name)
        : "";
      const nextAutoMessage = buildDefaultPilotMessage(nextCampaign.name);

      return {
        ...current,
        desiredTier:
          !current.desiredTier ||
          current.desiredTier === previousCampaign?.packageTier ||
          current.desiredTier === formatWorkspaceLabel(previousCampaign?.packageTier ?? "")
            ? formatWorkspaceLabel(nextCampaign.packageTier)
            : current.desiredTier,
        message:
          !current.message || current.message === previousAutoMessage
            ? nextAutoMessage
            : current.message,
      };
    });
  }

  function handleSubmit() {
    if (demo.isReadOnly) {
      setStatusMessage(demo.mutationMessage);
      return;
    }

    if (!selectedCampaignId) {
      setStatusMessage("Bitte wählt zuerst die Kampagne aus, die in den Piloten überführt werden soll.");
      return;
    }

    setIsPending(true);
    setStatusMessage("");

    startTransition(async () => {
      const result = await submitPilotRequest(selectedCampaignId, values);

      setIsPending(false);
      setStatusMessage(result.message);
      setRequestState({
        success: result.success,
        status: result.status,
        handoffMode: result.handoffMode,
      });

      if (result.success) {
        router.refresh();
      }
    });
  }

  return (
    <div className="grid gap-4">
      <section className="workspace-topbar px-4 py-4 sm:px-5">
        <div className="space-y-3">
          <p className="workspace-section-label">Pilotanfrage</p>
          <h1 className="text-[1.85rem] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
            Nächster kommerzieller Schritt
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-[var(--workspace-copy-body)]">
            Halte Umfang, Startfenster und Beteiligte für den nächsten
            bezahlten Auftrag fest, sobald die Übergabe belastbar vorbereitet
            ist.
          </p>
        </div>

        <div className="mt-4 border-t border-[var(--workspace-line)] pt-4">
          <div className="workspace-meta-row">
            <span>{organizationName}</span>
            {selectedCampaign ? <span>{selectedCampaign.name}</span> : null}
            {selectedCampaign ? <span>{formatWorkspaceLabel(selectedCampaign.packageTier)}</span> : null}
          </div>
          {demo.isDemoWorkspace ? (
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--workspace-copy-muted)]">
              {demo.mutationMessage}
            </p>
          ) : null}
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <section className="workspace-panel px-5 py-5">
          <div className="space-y-2">
            <p className="workspace-section-label">Pilot-Briefing</p>
            <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--workspace-copy-strong)]">
              Rahmen für den nächsten Auftrag
            </h2>
          </div>

          <div className="mt-5 grid gap-5">
            <Field label="Kampagne">
              <select
                value={selectedCampaignId}
                onChange={(event) => handleCampaignChange(event.target.value)}
                className="field-input"
                disabled={isPending || demo.isReadOnly}
              >
                {campaigns.length === 0 ? (
                  <option value="">Keine Kampagne verfügbar</option>
                ) : null}
                {campaigns.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Vorgeschlagenes Paket">
              <TextInput
                value={values.desiredTier}
                onChange={(event) => updateValue("desiredTier", event.target.value)}
                disabled={isPending || demo.isReadOnly}
              />
            </Field>

            <Field label="Gewünschter Start">
              <TextInput
                value={values.startWindow}
                onChange={(event) => updateValue("startWindow", event.target.value)}
                placeholder="Innerhalb der nächsten 30 Tage"
                disabled={isPending || demo.isReadOnly}
              />
            </Field>

            <Field label="Beteiligte">
              <TextInput
                value={values.internalStakeholders}
                onChange={(event) => updateValue("internalStakeholders", event.target.value)}
                placeholder="Gründerteam, Wachstumsverantwortung, Markenverantwortung"
                disabled={isPending || demo.isReadOnly}
              />
            </Field>

            <Field label="Hinweis zur Pilotanfrage">
              <TextareaInput
                value={values.message}
                onChange={(event) => updateValue("message", event.target.value)}
                placeholder="Warum ist jetzt der richtige Moment, in einen bezahlten Auftrag zu wechseln?"
                disabled={isPending || demo.isReadOnly}
              />
            </Field>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              className="workspace-button workspace-button-primary"
              disabled={isPending || !selectedCampaignId || demo.isReadOnly}
              onClick={handleSubmit}
            >
              {isPending ? "Wird gesendet..." : "Pilotanfrage senden"}
            </button>
            <button
              type="button"
              className="workspace-button workspace-button-secondary"
              disabled={isPending}
              onClick={() =>
                router.push(
                  selectedCampaign
                    ? `/workspace/campaigns/${selectedCampaign.id}/handover`
                    : "/workspace",
                )
              }
            >
              Zurück zur Übergabe
            </button>
          </div>

          {statusMessage ? (
            <div className="mt-5 border-t border-[var(--workspace-line)] pt-4">
              <p className="text-sm leading-6 text-[var(--workspace-copy-body)]">
                {statusMessage}
              </p>
            </div>
          ) : null}
        </section>

        <div className="grid gap-4 xl:sticky xl:top-5 xl:self-start">
          <section className="workspace-panel px-5 py-5">
            <div className="space-y-2">
              <p className="workspace-section-label">Ausgangslage</p>
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--workspace-copy-strong)]">
                Aktuelle Signale aus der Übergabe
              </h2>
            </div>
            <div className="mt-5 workspace-split-list">
              <div className="py-4">
                <p className="workspace-section-label">Organisation</p>
                <p className="mt-2 text-sm font-semibold text-[var(--workspace-copy-strong)]">
                  {organizationName}
                </p>
              </div>
              {selectedCampaign ? (
                <div className="py-4">
                  <p className="workspace-section-label">Kampagne</p>
                  <p className="mt-2 text-sm font-semibold text-[var(--workspace-copy-strong)]">
                    {selectedCampaign.name}
                  </p>
                  <div className="mt-2 workspace-meta-row">
                    <span>{formatWorkspaceLabel(selectedCampaign.packageTier)}</span>
                    <span>{formatWorkspaceLabel(selectedCampaign.currentStage)}</span>
                  </div>
                </div>
              ) : null}
            </div>
          </section>

          <section className="workspace-panel px-5 py-5">
            <div className="space-y-2">
              <p className="workspace-section-label">Letzter Stand</p>
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--workspace-copy-strong)]">
                Ergebnis der Pilotanfrage
              </h2>
            </div>
            {requestState ? (
              <div className="mt-4 space-y-3">
                <p className="text-sm leading-6 text-[var(--workspace-copy-body)]">
                  {requestState.success
                    ? "Die letzte Pilotanfrage wurde erfasst und an das Betriebsteam weitergegeben."
                    : "Die letzte Pilotanfrage wurde gespeichert, konnte aber nicht sauber an das Betriebsteam übermittelt werden."}
                </p>
                <div className="workspace-meta-row">
                  {requestState.status ? <span>{formatWorkspaceLabel(requestState.status)}</span> : null}
                  {requestState.handoffMode ? <span>{formatWorkspaceLabel(requestState.handoffMode)}</span> : null}
                </div>
              </div>
            ) : latestRequest ? (
              <div className="mt-4 space-y-3">
                <p className="text-sm leading-6 text-[var(--workspace-copy-body)]">
                  Für diese Kampagne liegt bereits eine Pilotanfrage vor.
                </p>
                <div className="workspace-meta-row">
                  <span>{formatWorkspaceLabel(latestRequest.status)}</span>
                  <span>{formatWorkspaceLabel(latestRequest.handoffMode)}</span>
                  <span>{formatWorkspaceDateTime(latestRequest.submittedAt)}</span>
                </div>
                <p className="text-sm leading-6 text-[var(--workspace-copy-body)]">
                  {latestRequest.message}
                </p>
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-[var(--workspace-copy-body)]">
                Für diese Kampagne wurde noch keine Pilotanfrage verschickt.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
