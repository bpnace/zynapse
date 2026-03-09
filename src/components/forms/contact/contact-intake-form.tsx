"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { buttonStyles } from "@/components/ui/button";
import { pricingPlans } from "@/lib/content/pricing";
import { createContactInquiryDefaults } from "@/lib/forms/storage";
import { contactInquirySchema, type ContactInquiryInput } from "@/lib/validation/contact-inquiry";
import { Field, SelectInput, TextareaInput, TextInput } from "@/components/forms/form-primitives";
import type { PricingPlan } from "@/types/site";

const planByName = new Map(pricingPlans.map((plan) => [plan.name, plan]));
const planById = new Map(pricingPlans.map((plan) => [plan.id, plan]));

const topicOptions = [
  { value: "Allgemeine Anfrage", label: "Allgemeine Anfrage" },
  ...pricingPlans.map((plan) => ({
    value: plan.name,
    label: `${plan.name} anfragen`,
  })),
  { value: "Partnernetzwerk", label: "Partnernetzwerk" },
  { value: "Operative Frage", label: "Operative Frage" },
];

function resolvePlanFromQuery(
  tier: string | null,
): PricingPlan | null {
  if (!tier) {
    return null;
  }

  return planById.get(tier as PricingPlan["id"]) ?? null;
}

export function ContactIntakeForm() {
  const searchParams = useSearchParams();
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [activePlan, setActivePlan] = useState<PricingPlan | null>(null);
  const appliedMessageRef = useRef("");
  const formContainerRef = useRef<HTMLDivElement | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ContactInquiryInput>({
    resolver: zodResolver(contactInquirySchema),
    defaultValues: createContactInquiryDefaults({
      topic: "Allgemeine Anfrage",
    }),
  });

  const topicField = register("topic");

  useEffect(() => {
    const plan = resolvePlanFromQuery(searchParams.get("tier"));

    if (!plan) {
      return;
    }

    setActivePlan(plan);
    setValue("topic", plan.name, { shouldDirty: false });

    if (!getValues("teamContext")) {
      setValue("teamContext", plan.audience, { shouldDirty: false });
    }

    const currentMessage = getValues("message");

    if (!currentMessage || currentMessage === appliedMessageRef.current) {
      setValue("message", plan.contactMessage, { shouldDirty: false });
      appliedMessageRef.current = plan.contactMessage;
    }
  }, [getValues, searchParams, setValue]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const arrivedFromPricing =
      window.location.hash === "#kontaktformular" || Boolean(searchParams.get("tier"));

    if (!arrivedFromPricing || !formContainerRef.current) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      formContainerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 120);

    return () => window.clearTimeout(timeoutId);
  }, [searchParams]);

  function applyPlanPrefill(value: string) {
    const previousPlan = activePlan;
    const plan = planByName.get(value) ?? null;

    setActivePlan(plan);

    if (!plan) {
      if (previousPlan && getValues("teamContext") === previousPlan.audience) {
        setValue("teamContext", "", { shouldDirty: true });
      }

      if (getValues("message") === appliedMessageRef.current) {
        setValue("message", "", { shouldDirty: true });
      }

      appliedMessageRef.current = "";
      return;
    }

    setValue("teamContext", plan.audience, { shouldDirty: true });
    setValue("message", plan.contactMessage, { shouldDirty: true });
    appliedMessageRef.current = plan.contactMessage;
  }

  async function onSubmit(values: ContactInquiryInput) {
    setSubmitError("");
    setIsPending(true);

    startTransition(async () => {
      try {
        const response = await fetch("/api/intake/contact", {
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
            : "Die Kontakt-Anfrage konnte nicht gesendet werden.",
        );
      } finally {
        setIsPending(false);
      }
    });
  }

  if (isSuccess) {
    return (
      <div className="section-card section-surface-paper rounded-[calc(var(--radius-panel)+0.1rem)] border-[rgba(56,67,84,0.16)] p-7 sm:p-8">
        <span className="eyebrow" data-animate-heading>
          Kontakt gesendet
        </span>
        <h2
          className="mt-5 font-display text-4xl font-semibold tracking-[-0.05em] text-[var(--copy-strong)]"
          data-animate-heading
        >
          Die Anfrage ist eingegangen.
        </h2>
        <p
          className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--copy-body)]"
          data-animate-copy
        >
          Wir haben die Vorauswahl und dein Anliegen übernommen. Wir melden uns
          innerhalb von 24 Stunden mit den nächsten Schritten.
        </p>
      </div>
    );
  }

  return (
    <div
        id="kontaktformular"
        ref={formContainerRef}
        className="section-card section-surface-paper rounded-[calc(var(--radius-panel)+0.1rem)] border-[rgba(56,67,84,0.16)] p-6 sm:p-8"
      >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.35fr)_minmax(0,0.65fr)]">
        <div className="space-y-5">
          <span className="eyebrow" data-animate-heading>
            Kontaktformular
          </span>
          <h2
            className="font-display text-4xl leading-[0.94] font-semibold tracking-[-0.05em] text-[var(--copy-strong)]"
            data-animate-heading
          >
            Weniger Felder. Mehr Kontext, wenn du schon aus den Preisen kommst.
          </h2>
          <p
            className="text-base leading-7 text-[color:var(--copy-body)]"
            data-animate-copy
          >
            Wenn du ein Paket auswählst, übernimmt das Formular bereits die
            passende Einordnung. Du musst nur noch die teamrelevanten Details
            ergänzen.
          </p>

          <div className="section-surface-warm rounded-[var(--radius-card)] border border-[rgba(191,106,83,0.16)] p-5">
            <p className="font-mono text-xs tracking-[0.18em] uppercase text-[var(--accent-soft)]">
              {activePlan ? "Vorausgewähltes Paket" : "Ohne Paket starten"}
            </p>
            {activePlan ? (
              <>
                <h3 className="mt-3 font-display text-3xl font-semibold tracking-[-0.05em] text-[var(--copy-strong)]">
                  {activePlan.name}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[color:var(--copy-body)]">
                  {activePlan.fit}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {activePlan.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="rounded-full border border-[rgba(191,106,83,0.16)] bg-white/70 px-3 py-1 text-xs uppercase tracking-[0.16em] text-[var(--copy-soft)]"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <p className="mt-3 text-sm leading-6 text-[color:var(--copy-body)]">
                Nutze das Formular für allgemeine Fragen zu Preisen, Abläufen,
                Partnerschaften oder operativen Themen.
              </p>
            )}
          </div>
        </div>

        <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register("startedAt", { valueAsNumber: true })} />
          <input
            type="text"
            {...register("website")}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Name" error={errors.name?.message}>
              <TextInput {...register("name")} placeholder="Max Mustermann" />
            </Field>
            <Field label="E-Mail" error={errors.email?.message}>
              <TextInput {...register("email")} placeholder="team@brand.de" />
            </Field>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Team / Firma" error={errors.company?.message}>
              <TextInput {...register("company")} placeholder="Beispiel GmbH" />
            </Field>
            <Field
              label="Anliegen"
              error={errors.topic?.message}
              hint="Wenn du von den Preisen kommst, ist das passende Paket bereits ausgewählt."
            >
              <SelectInput
                {...topicField}
                onChange={(event) => {
                  topicField.onChange(event);
                  applyPlanPrefill(event.target.value);
                }}
              >
                {topicOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </SelectInput>
            </Field>
          </div>

          <Field
            label="Teamkontext"
            error={errors.teamContext?.message}
            hint="Ein kurzer Satz reicht: Teamgröße, Anzahl Brands oder aktueller Bedarf."
          >
            <TextInput
              {...register("teamContext")}
              placeholder="z. B. Growth-Team mit 1 Brand und laufendem Paid-Social-Testing"
            />
          </Field>

          <Field
            label="Nachricht"
            error={errors.message?.message}
            hint="Das Feld ist bei Paket-CTAs bereits vorbefüllt und kann direkt angepasst werden."
          >
            <TextareaInput
              {...register("message")}
              placeholder="Worum geht es konkret und was soll als Nächstes geklärt werden?"
            />
          </Field>

          {submitError ? (
            <p className="rounded-2xl border border-[rgba(255,142,124,0.3)] bg-[rgba(255,142,124,0.08)] px-4 py-3 text-sm text-[var(--danger)]">
              {submitError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isPending}
            className={buttonStyles({
              size: "lg",
              className: "w-full disabled:cursor-wait disabled:opacity-70",
            })}
            data-animate-item
          >
            {isPending ? "Sende Anfrage..." : "Kontakt-Anfrage senden"}
          </button>
        </form>
      </div>
    </div>
  );
}
