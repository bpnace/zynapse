"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { startTransition, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, ButtonLink } from "@/components/ui/button";
import {
  BRAND_INQUIRY_STORAGE_KEY,
  createBrandInquiryDefaults,
} from "@/lib/forms/storage";
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
    title: "Ausgangslage",
    copy: "Welche Kategorie, welches Produkt und welche Ausgangslage bringt das Team mit?",
    fields: ["industry"] as const,
  },
  {
    title: "Produktlink",
    copy: "Ein Link reicht. Entscheidend ist ein sauberer Ausgangspunkt für Briefing und Kreativ-Richtung.",
    fields: ["productUrl"] as const,
  },
  {
    title: "Ziel & Kanal",
    copy: "Worauf soll die kreative Route zuerst optimieren und wo wird sie als Erstes ausgespielt?",
    fields: ["goal", "channels"] as const,
  },
  {
    title: "Budget & Timing",
    copy: "Damit Kampagnen-Pack, Umfang und Priorität realistisch eingeordnet werden können.",
    fields: ["budgetRange", "timeline"] as const,
  },
  {
    title: "Freitext",
    copy: "Optionaler Kontext zu Stil, Offer, Creator-Referenzen, Claims oder Restriktionen.",
    fields: ["notes"] as const,
  },
  {
    title: "Überprüfung",
    copy: "Zum Schluss fehlen nur noch die Kontaktdaten für die Übergabe.",
    fields: ["contactName", "workEmail", "company"] as const,
  },
];

const timelineOptions = [
  "Sofort / diese Woche",
  "In den nächsten 2 Wochen",
  "Diesen Monat",
  "Noch in Planung",
];

const channelOptions = [
  "TikTok",
  "Instagram Reels",
  "YouTube Shorts",
  "Meta Ads",
  "LinkedIn Video",
  "Pinterest",
];

export function BrandInquiryWizard() {
  const [stepIndex, setStepIndex] = useState(0);
  const [submitError, setSubmitError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<BrandInquiryInput>({
    resolver: zodResolver(brandInquirySchema),
    defaultValues: createBrandInquiryDefaults(),
    mode: "onChange",
  });

  const selectedChannels = watch("channels");

  useEffect(() => {
    const saved = window.localStorage.getItem(BRAND_INQUIRY_STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<BrandInquiryInput>;
        reset(createBrandInquiryDefaults(parsed));
      } catch {
        window.localStorage.removeItem(BRAND_INQUIRY_STORAGE_KEY);
      }
    }
  }, [reset]);

  useEffect(() => {
    const subscription = watch((value) => {
      window.localStorage.setItem(
        BRAND_INQUIRY_STORAGE_KEY,
        JSON.stringify(createBrandInquiryDefaults(value as Partial<BrandInquiryInput>)),
      );
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  async function goToNextStep() {
    const currentStep = steps[stepIndex];
    const valid = await trigger([...currentStep.fields]);

    if (valid) {
      setStepIndex((current) => Math.min(current + 1, steps.length - 1));
    }
  }

  function goToPreviousStep() {
    setStepIndex((current) => Math.max(current - 1, 0));
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
        <Field label="Branche" error={errors.industry?.message}>
          <TextInput
            {...register("industry")}
            placeholder="z. B. D2C Wellness, Beauty, Food, B2B SaaS"
          />
        </Field>
      );
    }

    if (stepIndex === 1) {
      return (
        <Field label="Produktlink" error={errors.productUrl?.message}>
          <TextInput {...register("productUrl")} placeholder="https://example.com" />
        </Field>
      );
    }

    if (stepIndex === 2) {
      return (
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Ziel" error={errors.goal?.message}>
            <TextInput
              {...register("goal")}
              placeholder="z. B. Conversion-Testing, Launch, Awareness"
            />
          </Field>
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
        </div>
      );
    }

    if (stepIndex === 3) {
      return (
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Budgetrahmen" error={errors.budgetRange?.message}>
            <TextInput
              {...register("budgetRange")}
              placeholder="z. B. 3k bis 8k pro Monat"
            />
          </Field>
          <Field label="Zeitplan" error={errors.timeline?.message}>
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
        </div>
      );
    }

    if (stepIndex === 4) {
      return (
        <Field
          label="Zusätzlicher Kontext"
          error={errors.notes?.message}
          hint="Optional: Offer, Stilreferenzen, besondere Claims, Ausschlüsse."
        >
          <TextareaInput
            {...register("notes")}
            placeholder="Was sollte das Kampagnen-Pack inhaltlich, tonal oder rechtlich unbedingt berücksichtigen?"
          />
        </Field>
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
            Überprüfung
          </p>
          <dl className="mt-4 grid gap-4 md:grid-cols-2">
            {[
              ["Branche", getValues("industry")],
              ["Produktlink", getValues("productUrl")],
              ["Ziel", getValues("goal")],
              ["Kanäle", getValues("channels").join(", ")],
              ["Budget", getValues("budgetRange")],
              ["Zeitplan", getValues("timeline")],
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

        window.localStorage.removeItem(BRAND_INQUIRY_STORAGE_KEY);
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
          <span className="eyebrow">Anfrage erhalten</span>
          <h2 className="mt-6 font-display text-4xl font-semibold tracking-[-0.05em]">
            Danke, deine Anfrage ist eingegangen.
          </h2>
          <p className="mt-4 max-w-3xl text-[color:var(--copy-muted)]">
            Wir prüfen deine Angaben und priorisieren passende Setups im Rahmen
            des Launch-Rollouts. Sobald wir den nächsten passenden Slot
            freigeben, melden wir uns direkt bei dir.
          </p>
          <div className="mt-8 flex gap-3">
            <ButtonLink href="/" variant="secondary">
              Zur Landing
            </ButtonLink>
            <ButtonLink href="/pricing#referenzen">Referenzen ansehen</ButtonLink>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none relative hidden min-h-[11rem] md:block"
        >
          <div className="absolute inset-y-0 right-0 w-full bg-[radial-gradient(circle_at_center,rgba(225,103,69,0.1),transparent_70%)]" />
          <Image
            src="/logo/Wortmarke1.png"
            alt=""
            width={1208}
            height={305}
            className="absolute right-0 bottom-1 h-auto w-[14rem] opacity-[0.08] saturate-0"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="section-card rounded-[2rem] p-6 sm:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="eyebrow">Brand-Anfrage</span>
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
        <input type="text" {...register("website")} className="hidden" tabIndex={-1} autoComplete="off" />
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
              disabled={isPending}
              size="lg"
              className="disabled:cursor-wait"
            >
              {isPending ? "Sende Anfrage..." : "Brand-Anfrage absenden"}
            </Button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
