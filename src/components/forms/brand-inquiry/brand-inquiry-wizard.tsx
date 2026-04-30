"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { startTransition, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, ButtonLink } from "@/components/ui/button";
import { createBrandInquiryDefaults } from "@/lib/forms/storage";
import {
  brandInquirySchema,
  type BrandInquiryInput,
} from "@/lib/validation/brand-inquiry";
import {
  CheckboxPill,
  Field,
  SelectInput,
  TextareaInput,
  TextInput,
} from "@/components/forms/form-primitives";

const steps = [
  {
    title: "Produkt und Ziel",
    shortTitle: "Produkt",
    copy: "Was soll beworben werden und was soll die Kampagne erreichen?",
    fields: ["productUrl", "goal", "budgetRange"] as const,
  },
  {
    title: "Zielgruppe",
    shortTitle: "Zielgruppe",
    copy: "Wen wollt ihr erreichen und was ist die wichtigste Kaufbarriere?",
    fields: ["targetAudience", "keyBarrier"] as const,
  },
  {
    title: "Kanäle und Formate",
    shortTitle: "Kanäle",
    copy: "Wo sollen die Creatives laufen und welche Ausspielungen stehen zuerst an?",
    fields: ["channels"] as const,
  },
  {
    title: "Stil und Beispiele",
    shortTitle: "Stil",
    copy: "Welche Richtung passt zu eurer Marke und welche Hinweise sollten wir früh sehen?",
    fields: ["industry", "styleDirection", "notes"] as const,
  },
  {
    title: "Timing und Review",
    shortTitle: "Timing",
    copy: "Wann braucht ihr den Output und wie laufen Review und Freigabe aktuell?",
    fields: ["timeline", "reviewContext"] as const,
  },
  {
    title: "Zusammenfassung",
    shortTitle: "Kontakt",
    copy: "Zynapse Core zeigt, was vorhanden ist und was für den ersten Kreativplan noch hilfreich wäre.",
    fields: ["contactName", "workEmail", "company"] as const,
  },
] as const;

const timelineOptions = [
  "Sofort / diese Woche",
  "In den nächsten 2 Wochen",
  "Diesen Monat",
  "Noch in Planung",
] as const;

const channelOptions = [
  "TikTok",
  "Instagram Reels",
  "YouTube Shorts",
  "Meta Ads",
  "LinkedIn Ads",
  "Pinterest",
] as const;

const requiredStepLabels: Record<number, string[]> = {
  0: ["Produktlink", "Ziel", "Budgetrahmen"],
  1: ["Zielgruppe", "wichtigste Kaufbarriere"],
  2: ["mindestens ein Kanal"],
  3: ["Branche"],
  4: ["Timing"],
  5: ["Name", "geschäftliche E-Mail", "Firma", "Datenschutzerklärung"],
};

const requiredBriefingChecks = [
  "productUrl",
  "goal",
  "budgetRange",
  "targetAudience",
  "keyBarrier",
  "channels",
  "industry",
  "timeline",
  "reviewContext",
] as const;

function normalizeText(value: string | undefined) {
  return value?.trim() ?? "";
}

function buildRouteSuggestions(values: BrandInquiryInput) {
  const goal = normalizeText(values.goal).toLowerCase();
  const channels = values.channels.join(" ").toLowerCase();

  if (goal.includes("launch") || goal.includes("aktion") || goal.includes("offer")) {
    return ["Offer Push", "Product Proof", "Founder oder Expert Style"];
  }

  if (channels.includes("tiktok") || channels.includes("reels") || channels.includes("shorts")) {
    return ["Problem Hook", "UGC Style", "Product Proof"];
  }

  return ["Problem Hook", "Product Proof", "Offer Push"];
}

function buildFormatSuggestions(channels: string[]) {
  if (channels.some((channel) => /tiktok|reels|shorts/i.test(channel))) {
    return ["9:16 Short Form", "4:5 Paid Social", "1:1 Feed Cut"];
  }

  if (channels.some((channel) => /linkedin/i.test(channel))) {
    return ["1:1 Feed Video", "16:9 Explainer", "4:5 Social Cut"];
  }

  return ["9:16 Vertical", "1:1 Square", "16:9 Wide"];
}

export function BrandInquiryWizard() {
  const [stepIndex, setStepIndex] = useState(0);
  const [submitError, setSubmitError] = useState("");
  const [stepAlert, setStepAlert] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    getValues,
    setFocus,
    formState: { errors },
  } = useForm<BrandInquiryInput>({
    resolver: zodResolver(brandInquirySchema),
    defaultValues: createBrandInquiryDefaults(),
    mode: "onChange",
  });

  const values = watch();
  const selectedChannels = values.channels ?? [];
  const isPrivacyAccepted = values.datenschutzAccepted;

  const briefingQuality = useMemo(() => {
    const completed = requiredBriefingChecks.filter((field) => {
      const value = values[field];

      if (Array.isArray(value)) {
        return value.length > 0;
      }

      return normalizeText(value).length > 0;
    }).length;

    return Math.round((completed / requiredBriefingChecks.length) * 100);
  }, [values]);

  const missingInfo = useMemo(() => {
    const candidates = [
      {
        label: "Wichtigste Kaufbarriere",
        missing: normalizeText(values.keyBarrier).length === 0,
        step: 1,
      },
      {
        label: "Zielgruppe",
        missing: normalizeText(values.targetAudience).length === 0,
        step: 1,
      },
      {
        label: "Review- und Freigabeweg",
        missing: normalizeText(values.reviewContext).length === 0,
        step: 4,
      },
      {
        label: "Stilrichtung oder Referenzen",
        missing:
          normalizeText(values.styleDirection).length === 0 &&
          normalizeText(values.notes).length === 0,
        step: 3,
      },
    ];

    return candidates.filter((candidate) => candidate.missing);
  }, [values]);

  const routeSuggestions = useMemo(() => buildRouteSuggestions(values), [values]);
  const formatSuggestions = useMemo(
    () => buildFormatSuggestions(values.channels ?? []),
    [values.channels],
  );

  const riskSignals = useMemo(() => {
    const risks: string[] = [];

    if (!normalizeText(values.keyBarrier)) {
      risks.push("Die wichtigste Kaufbarriere fehlt noch für bessere Hooks.");
    }

    if (!normalizeText(values.reviewContext)) {
      risks.push("Freigabeweg ist unklar. Review kann später unnötig bremsen.");
    }

    if (!values.channels?.length) {
      risks.push("Ohne Kanal ist die Formatpriorisierung noch zu offen.");
    }

    return risks.length
      ? risks
      : ["Keine offensichtlichen Risiken. Briefing ist bereit für den ersten Kreativplan."];
  }, [values]);

  useEffect(() => {
    setStepAlert("");
  }, [stepIndex]);

  async function goToNextStep() {
    const currentStep = steps[stepIndex];
    const valid = await trigger([...currentStep.fields], { shouldFocus: true });

    if (valid) {
      setStepAlert("");
      setStepIndex((current) => Math.min(current + 1, steps.length - 1));
      return;
    }

    const labels = requiredStepLabels[stepIndex] ?? ["die fehlenden Angaben"];
    setStepAlert(
      `Bitte ergänze ${labels.join(", ")}, damit Zynapse Core den nächsten Schritt sinnvoll vorbereiten kann.`,
    );

    const firstField = currentStep.fields[0];
    if (firstField) {
      setFocus(firstField);
    }
  }

  function goToPreviousStep() {
    setStepAlert("");
    setStepIndex((current) => Math.max(current - 1, 0));
  }

  function goToStep(targetIndex: number) {
    setStepAlert("");
    setStepIndex(Math.max(0, Math.min(targetIndex, steps.length - 1)));
  }

  function goToMissingInfo() {
    const firstMissing = missingInfo[0];

    if (firstMissing) {
      setStepAlert("");
      setStepIndex(firstMissing.step);
    }
  }

  function applyCoreSuggestion() {
    if (!normalizeText(getValues("styleDirection"))) {
      setValue(
        "styleDirection",
        `${routeSuggestions[0]}, ${routeSuggestions[1]} und ${routeSuggestions[2]} als erste Kreativrouten`,
        { shouldDirty: true },
      );
    }

    if (!normalizeText(getValues("reviewContext"))) {
      setValue(
        "reviewContext",
        "Zentraler Review mit einer finalen Freigabe durch Marketing oder Brand Lead",
        { shouldDirty: true },
      );
    }

    if (stepIndex < 3) {
      setStepIndex(3);
    }

    setStepAlert("");
  }

  function jumpToSummary() {
    setStepAlert("");
    setStepIndex(steps.length - 1);
  }

  function toggleChannel(channel: string) {
    const current = new Set(getValues("channels"));

    if (current.has(channel)) {
      current.delete(channel);
    } else {
      current.add(channel);
    }

    setValue("channels", Array.from(current), {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  const currentStep = steps[stepIndex];

  function renderStep() {
    if (stepIndex === 0) {
      return (
        <div className="grid gap-4 lg:grid-cols-3">
          <Field label="Produktlink" error={errors.productUrl?.message}>
            <TextInput {...register("productUrl")} placeholder="https://example.com" />
          </Field>
          <Field label="Ziel" error={errors.goal?.message}>
            <TextInput
              {...register("goal")}
              placeholder="z. B. mehr testbare Creatives für Conversion-Tests"
            />
          </Field>
          <Field label="Budgetrahmen" error={errors.budgetRange?.message} hint="Hilft beim Paket- und Scope-Fit">
            <TextInput
              {...register("budgetRange")}
              placeholder="z. B. Pilot, 5k bis 8k monatlich, laufender Zynapse-Core-Prozess"
            />
          </Field>
        </div>
      );
    }

    if (stepIndex === 1) {
      return (
        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="Zielgruppe" error={errors.targetAudience?.message}>
            <TextareaInput
              {...register("targetAudience")}
              className="min-h-[6rem]"
              placeholder="z. B. DTC Käufer:innen, SaaS Marketing Leads, Performance Teams in wachsenden Brands"
            />
          </Field>
          <Field label="Wichtigste Kaufbarriere" error={errors.keyBarrier?.message}>
            <TextareaInput
              {...register("keyBarrier")}
              className="min-h-[6rem]"
              placeholder="z. B. zu teuer, zu wenig Vertrauen, Produktnutzen noch nicht klar"
            />
          </Field>
        </div>
      );
    }

    if (stepIndex === 2) {
      return (
        <Field
          label="Kanäle"
          error={errors.channels?.message}
          hint="Mehrfachauswahl möglich"
        >
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
            {channelOptions.map((option) => (
              <CheckboxPill
                key={option}
                checked={selectedChannels.includes(option)}
                onClick={() => toggleChannel(option)}
                className="rounded-[0.45rem] px-3 py-2.5 text-left"
              >
                {option}
              </CheckboxPill>
            ))}
          </div>
        </Field>
      );
    }

    if (stepIndex === 3) {
      return (
        <div className="grid gap-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Field label="Branche" error={errors.industry?.message}>
              <TextInput
                {...register("industry")}
                placeholder="z. B. DTC Wellness, Beauty, Food, B2B SaaS"
              />
            </Field>
            <Field label="Stilrichtung" error={errors.styleDirection?.message}>
              <TextInput
                {...register("styleDirection")}
                placeholder="z. B. Premium Look, UGC Style, Product Proof, Founder Clip"
              />
            </Field>
          </div>
          <Field
            label="Beispiele und Hinweise"
            error={errors.notes?.message}
            hint="Optional: Claims, Referenzen, No-Gos oder rechtliche Hinweise."
          >
            <TextareaInput
              {...register("notes")}
              className="min-h-[5.75rem]"
              placeholder="Was sollte das Creative Pack tonal, visuell oder rechtlich unbedingt berücksichtigen?"
            />
          </Field>
        </div>
      );
    }

    if (stepIndex === 4) {
      return (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)]">
          <Field label="Timing" error={errors.timeline?.message}>
            <SelectInput {...register("timeline")} defaultValue="">
              <option value="" disabled>
                Bitte auswählen
              </option>
              {timelineOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field
            label="Review und Freigabe"
            error={errors.reviewContext?.message}
            hint="Optional, aber hilfreich"
          >
            <TextareaInput
              {...register("reviewContext")}
              className="min-h-[6rem]"
              placeholder="z. B. Marketing Lead reviewt zuerst, Founder gibt finale Claims frei"
            />
          </Field>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Name" error={errors.contactName?.message}>
            <TextInput
              {...register("contactName")}
              className="min-h-12 py-3"
              placeholder="Max Mustermann"
            />
          </Field>
          <Field label="Geschäftliche E-Mail" error={errors.workEmail?.message}>
            <TextInput
              {...register("workEmail")}
              className="min-h-12 py-3"
              placeholder="team@brand.com"
            />
          </Field>
          <Field label="Firma" error={errors.company?.message}>
            <TextInput
              {...register("company")}
              className="min-h-12 py-3"
              placeholder="Beispiel GmbH"
            />
          </Field>
        </div>
        <div className="rounded-[0.6rem] bg-[rgba(31,36,48,0.04)] p-2.5">
          <p className="font-mono text-[0.68rem] tracking-[0.16em] uppercase text-[var(--copy-soft)]">
            Zusammenfassung
          </p>
          <dl className="mt-2 grid gap-x-4 gap-y-2 sm:grid-cols-4">
            {[
              ["Produkt", getValues("productUrl")],
              ["Ziel", getValues("goal")],
              ["Kanäle", getValues("channels").join(", ")],
              ["Timing", getValues("timeline")],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[var(--copy-muted)]">
                  {label}
                </dt>
                <dd className="mt-1 line-clamp-1 text-sm leading-5 text-[color:var(--copy-body)]">
                  {value || "Noch offen"}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <label className="grid gap-2">
          <span className="inline-flex items-start gap-3 text-sm text-[color:var(--copy-body)]">
            <input
              type="checkbox"
              {...register("datenschutzAccepted")}
              className="mt-0.5 h-4 w-4 rounded border-[color:var(--line)] accent-[var(--accent)]"
            />
            <span>
              Ich akzeptiere die{" "}
              <Link
                href="/legal/privacy"
                className="underline decoration-[color:var(--accent-soft)] underline-offset-4 hover:text-[var(--copy-strong)]"
              >
                Datenschutzerklärung
              </Link>
              .
            </span>
          </span>
          {errors.datenschutzAccepted ? (
            <span className="field-error">{errors.datenschutzAccepted.message}</span>
          ) : null}
        </label>
      </div>
    );
  }

  async function onSubmit(values: BrandInquiryInput) {
    setSubmitError("");
    setIsPending(true);

    startTransition(async () => {
      try {
        const response = await fetch("/api/intake/brand", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const payload = (await response.json()) as { error?: string };
          throw new Error(payload.error ?? "Übermittlung fehlgeschlagen.");
        }

        setIsSuccess(true);
      } catch (error) {
        setSubmitError(
          error instanceof Error
            ? error.message
            : "Die Anfrage konnte nicht gesendet werden.",
        );
      } finally {
        setIsPending(false);
      }
    });
  }

  if (isSuccess) {
    return (
      <div className="rounded-[0.75rem] bg-white p-6 shadow-[0_18px_44px_rgba(31,36,48,0.08)] sm:p-7">
        <p className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-[var(--copy-soft)]">
          Briefing erhalten
        </p>
        <div className="mt-4 grid gap-5 md:grid-cols-[minmax(0,0.68fr)_auto] md:items-end">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-[-0.05em] text-[var(--copy-strong)] sm:text-4xl">
              Danke, dein Kreativbriefing ist eingegangen.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[color:var(--copy-body)] sm:text-base">
              Wir prüfen deine Angaben und melden uns mit dem passenden nächsten
              Schritt für Zynapse Core. Wenn noch etwas für den ersten
              Kreativplan fehlt, sagen wir es konkret.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
            <ButtonLink href="/" variant="secondary" className="rounded-[0.45rem]">
              Zur Startseite
            </ButtonLink>
            <ButtonLink
              href="/pricing"
              className="rounded-[0.45rem] hover:rounded-[0.45rem] focus-visible:rounded-[0.45rem]"
            >
              Zynapse Core ansehen
            </ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
      <div className="rounded-[0.75rem] bg-white p-4 shadow-[0_18px_44px_rgba(31,36,48,0.08)] sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start">
          <div>
            <p className="font-mono text-[0.68rem] tracking-[0.18em] uppercase text-[var(--copy-soft)]">
              Kreativbriefing
            </p>
            <h2 className="mt-2 font-display text-2xl leading-[1] font-semibold tracking-[-0.05em] text-[var(--copy-strong)]">
              Schritt {stepIndex + 1} von {steps.length}: {currentStep.title}
            </h2>
            <p className="mt-2 line-clamp-1 max-w-3xl text-sm leading-6 text-[color:var(--copy-body)]">
              {currentStep.copy}
            </p>
          </div>
          <div className="rounded-[0.55rem] bg-[rgba(31,36,48,0.04)] p-3">
            <div className="mb-2 flex justify-between font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--copy-muted)]">
              <span>Fortschritt</span>
              <span>{Math.round(((stepIndex + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="h-1 rounded-[2px] bg-[rgba(31,36,48,0.12)]">
              <div
                className="h-1 rounded-[2px] bg-[var(--copy-strong)]"
                style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
          {steps.map((step, index) => (
            <button
              key={step.title}
              type="button"
              aria-current={index === stepIndex ? "step" : undefined}
              onClick={() => goToStep(index)}
              className={`min-h-10 rounded-[0.45rem] px-3 py-2 text-left transition-colors ${
                index === stepIndex
                  ? "bg-[var(--copy-strong)] text-white"
                  : "bg-[rgba(31,36,48,0.04)] text-[var(--copy-body)] hover:bg-[rgba(31,36,48,0.08)]"
              }`}
            >
              <span className="block font-mono text-[0.62rem] tracking-[0.12em] uppercase opacity-70">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="mt-1 block text-sm font-semibold leading-4 tracking-[-0.01em]">
                {step.shortTitle}
              </span>
            </button>
          ))}
        </div>

        <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register("startedAt", { valueAsNumber: true })} />
          <input
            type="text"
            {...register("website")}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />
          <div className="grid gap-2">
            <p className="text-sm leading-6 text-[color:var(--copy-soft)]">
              Pflicht in diesem Schritt: {requiredStepLabels[stepIndex]?.join(", ")}.
            </p>
            {stepAlert ? (
              <p className="rounded-[0.45rem] bg-[rgba(184,58,44,0.06)] px-4 py-3 text-sm text-[#8f241b]">
                {stepAlert}
              </p>
            ) : null}
          </div>
          {renderStep()}
          {submitError ? (
            <p className="rounded-[0.45rem] bg-[rgba(184,58,44,0.06)] px-4 py-3 text-sm text-[#8f241b]">
              {submitError}
            </p>
          ) : null}
          <div className="flex flex-col gap-3 border-t border-[rgba(31,36,48,0.12)] pt-3 sm:flex-row sm:items-center sm:justify-end">
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={goToPreviousStep}
                disabled={stepIndex === 0}
                className="rounded-[0.45rem] border border-[rgba(31,36,48,0.16)] disabled:opacity-50"
              >
                Zurück
              </Button>
              {stepIndex < steps.length - 1 ? (
                <Button
                  onClick={goToNextStep}
                  className="rounded-[0.45rem] hover:rounded-[0.45rem] focus-visible:rounded-[0.45rem]"
                >
                  Weiter
                </Button>
              ) : null}
            </div>
            {stepIndex === steps.length - 1 ? (
              <Button
                type="submit"
                disabled={isPending || !isPrivacyAccepted}
                className="rounded-[0.45rem] hover:rounded-[0.45rem] focus-visible:rounded-[0.45rem] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-100 disabled:border-[rgba(56,67,84,0.16)] disabled:text-[var(--copy-soft)] disabled:shadow-none"
              >
                {isPending ? "Sende Briefing..." : "Kampagne anfragen"}
              </Button>
            ) : null}
          </div>
        </form>
      </div>

      <aside className="h-fit rounded-[0.75rem] bg-[var(--copy-strong)] p-4 text-white shadow-[0_18px_44px_rgba(31,36,48,0.12)] xl:sticky xl:top-24">
        <p className="font-mono text-[0.68rem] tracking-[0.18em] uppercase text-white/[0.62]">
          Zynapse Core prüft mit
        </p>
        <div className="mt-3 flex items-end justify-between gap-4">
          <div>
            <p className="font-display text-[2.6rem] leading-none font-semibold tracking-[-0.05em]">
              {briefingQuality}%
            </p>
            <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-white/[0.55]">
              Qualität
            </p>
          </div>
          <p className="max-w-[11rem] text-right text-sm leading-5 text-white/[0.72]">
            {missingInfo.length
              ? `Noch offen: ${missingInfo
                  .slice(0, 2)
                  .map((item) => item.label.toLowerCase())
                  .join(", ")}.`
              : "Bereit für den ersten Kreativplan."}
          </p>
        </div>

        <div className="mt-4 grid gap-4">
          <section>
            <p className="font-mono text-[0.65rem] tracking-[0.16em] uppercase text-white/[0.55]">
              Kreativrouten
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {routeSuggestions.map((route) => (
                <span
                  key={route}
                  className="rounded-[0.35rem] bg-white/[0.1] px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-white/[0.82]"
                >
                  {route}
                </span>
              ))}
            </div>
          </section>

          <section>
            <p className="font-mono text-[0.65rem] tracking-[0.16em] uppercase text-white/[0.55]">
              Formate
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {formatSuggestions.map((format) => (
                <span
                  key={format}
                  className="rounded-[0.35rem] bg-white/[0.08] px-2.5 py-1 text-xs text-white/[0.78]"
                >
                  {format}
                </span>
              ))}
            </div>
          </section>

          <section>
            <p className="font-mono text-[0.65rem] tracking-[0.16em] uppercase text-white/[0.55]">
              Risikosignal
            </p>
            <p className="mt-2 text-sm leading-5 text-white/[0.75]">
              {riskSignals[0]}
            </p>
          </section>
        </div>

        <div className="mt-4 grid gap-2">
          <Button
            variant="secondary"
            className="justify-center rounded-[0.45rem]"
            onClick={applyCoreSuggestion}
          >
            Vorschlag übernehmen
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="ghost"
              className="justify-center rounded-[0.45rem] border border-white/[0.18] px-3 text-white hover:bg-white/[0.1]"
              onClick={goToMissingInfo}
            >
              Ergänzen
            </Button>
            <Button
              variant="ghost"
              className="justify-center rounded-[0.45rem] border border-white/[0.18] px-3 text-white hover:bg-white/[0.1]"
              onClick={jumpToSummary}
            >
              Absenden
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}
