"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { startTransition, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, ButtonLink } from "@/components/ui/button";
import { createCreativeApplicationDefaults } from "@/lib/forms/storage";
import {
  creativeApplicationSchema,
  type CreativeApplicationInput,
} from "@/lib/validation/creative-application";
import {
  CheckboxPill,
  Field,
  TextareaInput,
  TextInput,
} from "@/components/forms/form-primitives";

const steps = [
  {
    title: "Kontakt und Standort",
    shortTitle: "Kontakt",
    copy: "Wer bist du und in welchem Arbeitskontext können wir dich einordnen?",
    fields: ["name", "email", "location"] as const,
  },
  {
    title: "Profil und Verfügbarkeit",
    shortTitle: "Profil",
    copy: "Wo sehen wir dein Profil und wie viel Kapazität ist realistisch?",
    fields: ["portfolioUrl", "availability"] as const,
  },
  {
    title: "Fokusbereiche",
    shortTitle: "Fokus",
    copy: "Welche Rollen und AI-Fähigkeiten passen am besten zu deiner Arbeit?",
    fields: ["focusChannels"] as const,
  },
  {
    title: "Case-Erfahrung",
    shortTitle: "Cases",
    copy: "Welche praktische Erfahrung zeigt, dass du testbare Kampagnenarbeit liefern kannst?",
    fields: ["caseSummary", "compensationNotes"] as const,
  },
] as const;

const focusChannelOptions = [
  "Prompt Engineering",
  "Creative Direction",
  "Prompt Design",
  "AI Production",
  "AI Engineering",
  "AI Strategy",
];

const requiredStepLabels: Record<number, string[]> = {
  0: ["Name", "E-Mail", "Standort oder Zeitzone"],
  1: ["Portfolio-Link", "Verfügbarkeit"],
  2: ["mindestens ein Fokusbereich"],
  3: ["Case-Erfahrung", "Datenschutzerklärung"],
};

const profileChecks = [
  "name",
  "email",
  "location",
  "portfolioUrl",
  "availability",
  "focusChannels",
  "caseSummary",
] as const;

function normalizeText(value: string | undefined) {
  return value?.trim() ?? "";
}

function buildFitSignals(values: CreativeApplicationInput) {
  const focus = values.focusChannels.join(" ").toLowerCase();

  if (focus.includes("direction") || focus.includes("strategy")) {
    return ["Creative Direction", "Kampagnenlogik", "Review-Fit"];
  }

  if (focus.includes("engineering") || focus.includes("production")) {
    return ["AI Workflow", "Prompt System", "Output-Fit"];
  }

  return ["Prompting", "Creative Ops", "Format-Fit"];
}

export function CreativeApplicationForm() {
  const [stepIndex, setStepIndex] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [stepAlert, setStepAlert] = useState("");
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
  } = useForm<CreativeApplicationInput>({
    resolver: zodResolver(creativeApplicationSchema),
    defaultValues: createCreativeApplicationDefaults(),
    mode: "onChange",
  });

  const values = watch();
  const selectedChannels = values.focusChannels ?? [];
  const isPrivacyAccepted = values.datenschutzAccepted;
  const currentStep = steps[stepIndex];

  const profileScore = useMemo(() => {
    const completed = profileChecks.filter((field) => {
      const value = values[field];

      if (Array.isArray(value)) {
        return value.length > 0;
      }

      return normalizeText(value).length > 0;
    }).length;

    return Math.round((completed / profileChecks.length) * 100);
  }, [values]);

  const missingInfo = useMemo(() => {
    const candidates = [
      {
        label: "Portfolio-Link",
        missing: normalizeText(values.portfolioUrl).length === 0,
        step: 1,
      },
      {
        label: "Fokusbereich",
        missing: !values.focusChannels?.length,
        step: 2,
      },
      {
        label: "Case-Erfahrung",
        missing: normalizeText(values.caseSummary).length < 30,
        step: 3,
      },
      {
        label: "Verfügbarkeit",
        missing: normalizeText(values.availability).length === 0,
        step: 1,
      },
    ];

    return candidates.filter((candidate) => candidate.missing);
  }, [values]);

  const fitSignals = useMemo(() => buildFitSignals(values), [values]);

  const readinessSignal = useMemo(() => {
    if (!selectedChannels.length) {
      return "Ohne Fokusbereich ist die Zuordnung zu passenden Kampagnenrollen noch offen.";
    }

    if (normalizeText(values.caseSummary).length < 30) {
      return "Der Case-Teil braucht noch konkretere Erfahrung, bevor wir die Passung bewerten können.";
    }

    return "Profil ist ausreichend konkret für die erste Qualifizierung.";
  }, [selectedChannels.length, values.caseSummary]);

  function toggleChannel(channel: string) {
    const current = new Set(getValues("focusChannels"));

    if (current.has(channel)) {
      current.delete(channel);
    } else {
      current.add(channel);
    }

    setValue("focusChannels", Array.from(current), {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  async function goToNextStep() {
    const valid = await trigger([...currentStep.fields], { shouldFocus: true });

    if (valid) {
      setStepAlert("");
      setStepIndex((current) => Math.min(current + 1, steps.length - 1));
      return;
    }

    const labels = requiredStepLabels[stepIndex] ?? ["die fehlenden Angaben"];
    setStepAlert(`Bitte ergänze ${labels.join(", ")}, damit wir dein Profil sinnvoll prüfen können.`);

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

  function jumpToSummary() {
    setStepAlert("");
    setStepIndex(steps.length - 1);
  }

  function renderStep() {
    if (stepIndex === 0) {
      return (
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Name" error={errors.name?.message}>
            <TextInput
              {...register("name")}
              className="min-h-12 py-3"
              placeholder="Dein Name"
            />
          </Field>
          <Field label="E-Mail" error={errors.email?.message}>
            <TextInput
              {...register("email")}
              className="min-h-12 py-3"
              placeholder="name@example.com"
            />
          </Field>
          <Field label="Standort / Zeitzone" error={errors.location?.message}>
            <TextInput
              {...register("location")}
              className="min-h-12 py-3"
              placeholder="Berlin / CET"
            />
          </Field>
        </div>
      );
    }

    if (stepIndex === 1) {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Portfolio / LinkedIn" error={errors.portfolioUrl?.message}>
            <TextInput
              {...register("portfolioUrl")}
              placeholder="https://linkedin.com/in/..."
            />
          </Field>
          <Field label="Verfügbarkeit" error={errors.availability?.message}>
            <TextInput
              {...register("availability")}
              placeholder="z. B. 2 neue Kunden oder 1 Retainer pro Monat"
            />
          </Field>
        </div>
      );
    }

    if (stepIndex === 2) {
      return (
        <Field
          label="Fokusbereiche"
          error={errors.focusChannels?.message}
          hint="Mehrfachauswahl möglich"
        >
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
            {focusChannelOptions.map((option) => (
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

    return (
      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.64fr)_minmax(0,0.36fr)]">
          <Field
            label="Relevante Case-Erfahrung"
            error={errors.caseSummary?.message}
          >
            <TextareaInput
              {...register("caseSummary")}
              className="min-h-[7rem]"
              placeholder="Welche Kreativ-Projekte, AI-Workflows oder Kampagnen hast du bereits geführt und was war dein konkreter Beitrag?"
            />
          </Field>
          <Field label="Preis / Vergütung" error={errors.compensationNotes?.message}>
            <TextareaInput
              {...register("compensationNotes")}
              className="min-h-[7rem]"
              placeholder="Optional: z. B. Retainer, Projektbasis oder Revenue Share"
            />
          </Field>
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

  async function onSubmit(values: CreativeApplicationInput) {
    setSubmitError("");
    setIsPending(true);

    startTransition(async () => {
      try {
        const response = await fetch("/api/intake/creative", {
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
            : "Die Bewerbung konnte nicht gesendet werden.",
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
          Bewerbung erhalten
        </p>
        <div className="mt-4 grid gap-5 md:grid-cols-[minmax(0,0.68fr)_auto] md:items-end">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-[-0.05em] text-[var(--copy-strong)] sm:text-4xl">
              Danke, deine Bewerbung ist eingegangen.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[color:var(--copy-body)] sm:text-base">
              Wir prüfen Profil, Cases und Fokusbereiche und melden uns,
              sobald wir im Launch-Rollout passende nächste Schritte freigeben.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
            <ButtonLink href="/" variant="secondary" className="rounded-[0.45rem]">
              Zur Startseite
            </ButtonLink>
            <ButtonLink
              href="/creatives"
              className="rounded-[0.45rem] hover:rounded-[0.45rem] focus-visible:rounded-[0.45rem]"
            >
              Track ansehen
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
              Bewerbung für Kreative
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

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
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
                {isPending ? "Sende Bewerbung..." : "Bewerbung absenden"}
              </Button>
            ) : null}
          </div>
        </form>
      </div>

      <aside className="h-fit rounded-[0.75rem] bg-[var(--copy-strong)] p-4 text-white shadow-[0_18px_44px_rgba(31,36,48,0.12)] xl:sticky xl:top-24">
        <p className="font-mono text-[0.68rem] tracking-[0.18em] uppercase text-white/[0.62]">
          Zynapse prüft mit
        </p>
        <div className="mt-3 flex items-end justify-between gap-4">
          <div>
            <p className="font-display text-[2.6rem] leading-none font-semibold tracking-[-0.05em]">
              {profileScore}%
            </p>
            <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-white/[0.55]">
              Profilfit
            </p>
          </div>
          <p className="max-w-[11rem] text-right text-sm leading-5 text-white/[0.72]">
            {missingInfo.length
              ? `Noch offen: ${missingInfo
                  .slice(0, 2)
                  .map((item) => item.label.toLowerCase())
                  .join(", ")}.`
              : "Bereit für die erste Prüfung."}
          </p>
        </div>

        <div className="mt-4 grid gap-4">
          <section>
            <p className="font-mono text-[0.65rem] tracking-[0.16em] uppercase text-white/[0.55]">
              Passung
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {fitSignals.map((signal) => (
                <span
                  key={signal}
                  className="rounded-[0.35rem] bg-white/[0.1] px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-white/[0.82]"
                >
                  {signal}
                </span>
              ))}
            </div>
          </section>

          <section>
            <p className="font-mono text-[0.65rem] tracking-[0.16em] uppercase text-white/[0.55]">
              Fokus
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(selectedChannels.length ? selectedChannels : ["Noch offen"]).slice(0, 3).map((focus) => (
                <span
                  key={focus}
                  className="rounded-[0.35rem] bg-white/[0.08] px-2.5 py-1 text-xs text-white/[0.78]"
                >
                  {focus}
                </span>
              ))}
            </div>
          </section>

          <section>
            <p className="font-mono text-[0.65rem] tracking-[0.16em] uppercase text-white/[0.55]">
              Signal
            </p>
            <p className="mt-2 text-sm leading-5 text-white/[0.75]">
              {readinessSignal}
            </p>
          </section>
        </div>

        <div className="mt-4 grid gap-2">
          <Button
            variant="secondary"
            className="justify-center rounded-[0.45rem]"
            onClick={goToMissingInfo}
          >
            Offene Info ergänzen
          </Button>
          <Button
            variant="ghost"
            className="justify-center rounded-[0.45rem] border border-white/[0.18] px-3 text-white hover:bg-white/[0.1]"
            onClick={jumpToSummary}
          >
            Zum Absenden
          </Button>
        </div>
      </aside>
    </div>
  );
}
