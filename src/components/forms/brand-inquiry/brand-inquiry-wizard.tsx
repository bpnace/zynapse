"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ButtonLink, buttonStyles } from "@/components/ui/button";
import {
  BRAND_INQUIRY_STORAGE_KEY,
  createBrandInquiryDefaults,
} from "@/lib/forms/storage";
import {
  brandInquirySchema,
  type BrandInquiryInput,
} from "@/lib/validation/brand-inquiry";
import {
  Field,
  SelectInput,
  TextareaInput,
  TextInput,
} from "@/components/forms/form-primitives";

const steps = [
  {
    title: "Branche",
    copy: "Welche Kategorie, welches Produkt und welche Ausgangslage bringt die Kampagne mit?",
    fields: ["industry"] as const,
  },
  {
    title: "Produktlink",
    copy: "Ein Link reicht. Das Studio braucht einen klaren Ausgangspunkt.",
    fields: ["productUrl"] as const,
  },
  {
    title: "Ziel & Kanal",
    copy: "Worauf soll das Creative optimieren und wo wird es zuerst ausgespielt?",
    fields: ["goal", "channel"] as const,
  },
  {
    title: "Budget & Timing",
    copy: "Damit Kampagnen-Pack und Umfang sauber eingerahmt werden können.",
    fields: ["budgetRange", "timeline"] as const,
  },
  {
    title: "Freitext",
    copy: "Optionaler Kontext zu Stil, Offer, Creator-Referenzen oder Restriktionen.",
    fields: ["notes"] as const,
  },
  {
    title: "Review",
    copy: "Jetzt fehlen nur noch die Kontaktangaben für die Übergabe.",
    fields: ["contactName", "workEmail", "company"] as const,
  },
];

const timelineOptions = [
  "Sofort / diese Woche",
  "In den nächsten 2 Wochen",
  "Diesen Monat",
  "Noch in Planung",
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
    getValues,
    formState: { errors },
  } = useForm<BrandInquiryInput>({
    resolver: zodResolver(brandInquirySchema),
    defaultValues: createBrandInquiryDefaults(),
    mode: "onChange",
  });

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

  const currentStep = steps[stepIndex];

  function renderStep() {
    if (stepIndex === 0) {
      return (
        <Field label="Branche" error={errors.industry?.message}>
          <TextInput
            {...register("industry")}
            placeholder="z. B. D2C Wellness, Fashion, B2B SaaS"
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
              placeholder="z. B. TikTok Conversion, Awareness Launch"
            />
          </Field>
          <Field label="Kanal" error={errors.channel?.message}>
            <TextInput
              {...register("channel")}
              placeholder="TikTok, Reels, Shorts"
            />
          </Field>
        </div>
      );
    }

    if (stepIndex === 3) {
      return (
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Budget Range" error={errors.budgetRange?.message}>
            <TextInput
              {...register("budgetRange")}
              placeholder="z. B. 3k bis 8k pro Monat"
            />
          </Field>
          <Field label="Timeline" error={errors.timeline?.message}>
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
            placeholder="Was sollte das Kampagnen-Pack unbedingt berücksichtigen?"
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
          <Field label="Work Email" error={errors.workEmail?.message}>
            <TextInput {...register("workEmail")} placeholder="team@brand.com" />
          </Field>
          <Field label="Firma" error={errors.company?.message}>
            <TextInput {...register("company")} placeholder="Brand GmbH" />
          </Field>
        </div>
        <div className="rounded-[1.7rem] border border-[color:var(--line)] bg-black/20 p-5">
          <p className="font-mono text-xs tracking-[0.18em] uppercase text-[var(--copy-muted)]">
            Review
          </p>
          <dl className="mt-4 grid gap-4 md:grid-cols-2">
            {[
              ["Branche", getValues("industry")],
              ["Produktlink", getValues("productUrl")],
              ["Ziel", getValues("goal")],
              ["Kanal", getValues("channel")],
              ["Budget", getValues("budgetRange")],
              ["Timeline", getValues("timeline")],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs uppercase tracking-[0.16em] text-[var(--copy-muted)]">
                  {label}
                </dt>
                <dd className="mt-1 text-sm">{value || "Noch nicht ausgefüllt"}</dd>
              </div>
            ))}
          </dl>
        </div>
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
          throw new Error(payload.error ?? "Submission failed.");
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
      <div className="section-card rounded-[2rem] p-8">
        <span className="eyebrow">Anfrage erhalten</span>
        <h2 className="mt-6 font-display text-4xl font-semibold tracking-[-0.05em]">
          Die Kampagnenanfrage ist im System.
        </h2>
        <p className="mt-4 max-w-2xl text-[color:var(--copy-muted)]">
          Nächster Schritt: Qualifizierung und Übergabe in die Kampagnenplanung.
          Ohne konfigurierten Webhook landet die Submission aktuell als strukturierter
          Server-Log, damit die Architektur testbar bleibt.
        </p>
        <div className="mt-8 flex gap-3">
          <ButtonLink href="/" variant="secondary">
            Zur Landing
          </ButtonLink>
          <ButtonLink href="/cases">Cases ansehen</ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="section-card rounded-[2rem] p-6 sm:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="eyebrow">Brand Inquiry Wizard</span>
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
            <button
              type="button"
              onClick={goToPreviousStep}
              disabled={stepIndex === 0}
              className={buttonStyles({
                variant: "ghost",
                className:
                  "border border-[color:var(--line)] disabled:cursor-not-allowed disabled:opacity-50",
              })}
            >
              Zurück
            </button>
            {stepIndex < steps.length - 1 ? (
              <button
                type="button"
                onClick={goToNextStep}
                className={buttonStyles({ variant: "secondary" })}
              >
                Weiter
              </button>
            ) : null}
          </div>
          {stepIndex === steps.length - 1 ? (
            <button
              type="submit"
              disabled={isPending}
              className={buttonStyles({
                size: "lg",
                className: "disabled:cursor-wait disabled:opacity-70",
              })}
            >
              {isPending ? "Sende Anfrage..." : "Anfrage abschicken"}
            </button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
