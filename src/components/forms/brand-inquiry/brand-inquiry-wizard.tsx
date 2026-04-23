"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
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
    copy: "Was soll beworben werden und was soll die Kampagne erreichen?",
    fields: ["productUrl", "goal", "budgetRange"] as const,
  },
  {
    title: "Zielgruppe",
    copy: "Wen wollt ihr erreichen und was ist die wichtigste Kaufbarriere?",
    fields: ["targetAudience", "keyBarrier"] as const,
  },
  {
    title: "Kanäle und Formate",
    copy: "Wo sollen die Creatives laufen und welche Ausspielungen stehen zuerst an?",
    fields: ["channels"] as const,
  },
  {
    title: "Stil und Beispiele",
    copy: "Welche Richtung passt zu eurer Marke und welche Hinweise sollten wir früh sehen?",
    fields: ["industry", "styleDirection", "notes"] as const,
  },
  {
    title: "Timing und Review",
    copy: "Wann braucht ihr den Output und wie laufen Review und Freigabe aktuell?",
    fields: ["timeline", "reviewContext"] as const,
  },
  {
    title: "Zusammenfassung",
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
        <div className="grid gap-5 md:grid-cols-2">
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
              placeholder="z. B. Pilot, 5k bis 8k monatlich, laufender Creative Flow"
            />
          </Field>
        </div>
      );
    }

    if (stepIndex === 1) {
      return (
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Zielgruppe" error={errors.targetAudience?.message}>
            <TextareaInput
              {...register("targetAudience")}
              placeholder="z. B. DTC Käufer:innen, SaaS Marketing Leads, Performance Teams in wachsenden Brands"
            />
          </Field>
          <Field label="Wichtigste Kaufbarriere" error={errors.keyBarrier?.message}>
            <TextareaInput
              {...register("keyBarrier")}
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {channelOptions.map((option) => (
              <CheckboxPill
                key={option}
                checked={selectedChannels.includes(option)}
                onClick={() => toggleChannel(option)}
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
        <div className="grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
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
              placeholder="Was sollte das Creative Pack tonal, visuell oder rechtlich unbedingt berücksichtigen?"
            />
          </Field>
        </div>
      );
    }

    if (stepIndex === 4) {
      return (
        <div className="grid gap-5 md:grid-cols-2">
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
              placeholder="z. B. Marketing Lead reviewt zuerst, Founder gibt finale Claims frei"
            />
          </Field>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Name" error={errors.contactName?.message}>
            <TextInput {...register("contactName")} placeholder="Max Mustermann" />
          </Field>
          <Field label="Geschäftliche E-Mail" error={errors.workEmail?.message}>
            <TextInput {...register("workEmail")} placeholder="team@brand.com" />
          </Field>
          <Field label="Firma" error={errors.company?.message}>
            <TextInput {...register("company")} placeholder="Beispiel GmbH" />
          </Field>
        </div>
        <div className="rounded-[1.7rem] border border-[color:var(--line)] bg-black/5 p-5">
          <p className="font-mono text-xs tracking-[0.18em] uppercase text-[var(--copy-muted)]">
            Zusammenfassung
          </p>
          <dl className="mt-4 grid gap-4 md:grid-cols-2">
            {[
              ["Produkt", getValues("productUrl")],
              ["Ziel", getValues("goal")],
              ["Budget", getValues("budgetRange")],
              ["Zielgruppe", getValues("targetAudience")],
              ["Kaufbarriere", getValues("keyBarrier")],
              ["Kanäle", getValues("channels").join(", ")],
              ["Branche", getValues("industry")],
              ["Stilrichtung", getValues("styleDirection")],
              ["Timing", getValues("timeline")],
              ["Review", getValues("reviewContext")],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs uppercase tracking-[0.16em] text-[var(--copy-muted)]">
                  {label}
                </dt>
                <dd className="mt-1 text-sm">{value || "Noch offen"}</dd>
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
      <div className="section-card relative overflow-hidden rounded-[2rem] p-8 md:grid md:grid-cols-[minmax(0,0.74fr)_minmax(0,0.26fr)] md:items-end md:gap-8">
        <div className="relative z-10">
          <span className="eyebrow">Briefing erhalten</span>
          <h2 className="mt-6 font-display text-4xl font-semibold tracking-[-0.05em]">
            Danke, dein Kreativbriefing ist eingegangen.
          </h2>
          <p className="mt-4 max-w-3xl text-[color:var(--copy-muted)]">
            Wir prüfen deine Angaben und melden uns mit dem passenden nächsten
            Schritt für euren Creative Flow. Wenn noch etwas für den ersten
            Kreativplan fehlt, sagen wir es konkret.
          </p>
          <div className="mt-8 flex gap-3">
            <ButtonLink href="/" variant="secondary">
              Zur Startseite
            </ButtonLink>
            <ButtonLink href="/pricing">Creative Flows ansehen</ButtonLink>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none relative hidden min-h-[11rem] md:block"
        >
          <Image
            src="/logo/LogoSimple.png"
            alt=""
            width={512}
            height={512}
            className="absolute -right-[8rem] -bottom-[8rem] w-[20rem] opacity-[0.08] saturate-0"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,0.38fr)]">
      <div className="section-card rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow">Kreativbriefing</span>
            <h2 className="mt-5 font-display text-4xl font-semibold tracking-[-0.05em]">
              Schritt {stepIndex + 1} von {steps.length}: {currentStep.title}
            </h2>
            <p className="mt-3 max-w-2xl text-[color:var(--copy-muted)]">
              {currentStep.copy}
            </p>
          </div>
          <div className="w-full max-w-xs">
            <div className="mb-3 flex justify-between text-xs uppercase tracking-[0.16em] text-[var(--copy-muted)]">
              <span>Fortschritt</span>
              <span>{Math.round(((stepIndex + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/[0.06]">
              <div
                className="h-2 rounded-full bg-[var(--accent)]"
                style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
        <form className="mt-8 space-y-8" onSubmit={handleSubmit(onSubmit)}>
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
              <p className="rounded-2xl border border-[rgba(255,142,124,0.3)] bg-[rgba(255,142,124,0.08)] px-4 py-3 text-sm text-[var(--danger)]">
                {stepAlert}
              </p>
            ) : null}
          </div>
          {renderStep()}
          {submitError ? (
            <p className="rounded-2xl border border-[rgba(255,142,124,0.3)] bg-[rgba(255,142,124,0.08)] px-4 py-3 text-sm text-[var(--danger)]">
              {submitError}
            </p>
          ) : null}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={goToPreviousStep}
                disabled={stepIndex === 0}
                className="border border-[color:var(--line)] disabled:opacity-50"
              >
                Zurück
              </Button>
              {stepIndex < steps.length - 1 ? (
                <Button variant="secondary" onClick={goToNextStep}>
                  Weiter
                </Button>
              ) : null}
            </div>
            {stepIndex === steps.length - 1 ? (
              <Button
                type="submit"
                disabled={isPending || !isPrivacyAccepted}
                size="lg"
                className="disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-100 disabled:border-[rgba(56,67,84,0.16)] disabled:text-[var(--copy-soft)] disabled:shadow-none"
              >
                {isPending ? "Sende Briefing..." : "Kampagne anfragen"}
              </Button>
            ) : null}
          </div>
        </form>
      </div>

      <aside className="section-card section-surface-paper h-fit rounded-[2rem] p-6 sm:p-8">
        <span className="eyebrow">Zynapse Core prüft mit</span>
        <div className="mt-5 grid gap-4">
          <article className="rounded-[var(--radius-card)] border border-[rgba(56,67,84,0.12)] bg-white/82 p-4">
            <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--copy-soft)]">
              Briefing-Qualität
            </p>
            <p className="mt-2 font-display text-[1.9rem] leading-none font-semibold tracking-[-0.04em] text-[var(--copy-strong)]">
              {briefingQuality}%
            </p>
            <p className="mt-2 text-sm leading-6 text-[color:var(--copy-body)]">
              {missingInfo.length
                ? `Für bessere Routen fehlen noch ${missingInfo
                    .slice(0, 2)
                    .map((item) => item.label.toLowerCase())
                    .join(" und ")}.`
                : "Das Briefing ist stark genug für den ersten Kreativplan."}
            </p>
          </article>

          <article className="rounded-[var(--radius-card)] border border-[rgba(191,106,83,0.16)] bg-[rgba(255,244,236,0.76)] p-4">
            <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--copy-soft)]">
              Mögliche Kreativrouten
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {routeSuggestions.map((route) => (
                <span
                  key={route}
                  className="rounded-full border border-[rgba(191,106,83,0.16)] bg-white/70 px-3 py-1 text-xs uppercase tracking-[0.14em] text-[var(--copy-soft)]"
                >
                  {route}
                </span>
              ))}
            </div>
          </article>

          <article className="rounded-[var(--radius-card)] border border-[rgba(56,67,84,0.12)] bg-white/82 p-4">
            <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--copy-soft)]">
              Empfohlene Formate
            </p>
            <ul className="mt-3 grid gap-2">
              {formatSuggestions.map((format) => (
                <li
                  key={format}
                  className="rounded-[var(--radius-chip)] border border-[rgba(56,67,84,0.1)] bg-[rgba(248,249,251,0.78)] px-3 py-2 text-sm text-[color:var(--copy-body)]"
                >
                  {format}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-[var(--radius-card)] border border-[rgba(56,67,84,0.12)] bg-white/82 p-4">
            <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--copy-soft)]">
              Mögliche Risiken
            </p>
            <ul className="mt-3 grid gap-2">
              {riskSignals.map((risk) => (
                <li key={risk} className="text-sm leading-6 text-[color:var(--copy-body)]">
                  • {risk}
                </li>
              ))}
            </ul>
          </article>
        </div>

        <div className="mt-6 grid gap-3">
          <Button variant="secondary" className="justify-center" onClick={applyCoreSuggestion}>
            Vorschlag übernehmen
          </Button>
          <Button variant="ghost" className="justify-center border border-[color:var(--line)]" onClick={goToMissingInfo}>
            Fehlende Info ergänzen
          </Button>
          <Button variant="ghost" className="justify-center border border-[color:var(--line)]" onClick={jumpToSummary}>
            Trotzdem absenden
          </Button>
        </div>
      </aside>
    </div>
  );
}
