"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { pricingPlans } from "@/lib/content/pricing";
import { createContactInquiryDefaults } from "@/lib/forms/storage";
import {
  contactInquirySchema,
  type ContactInquiryInput,
} from "@/lib/validation/contact-inquiry";
import {
  Field,
  SelectInput,
  TextareaInput,
  TextInput,
} from "@/components/forms/form-primitives";
import type { PricingPlan } from "@/types/site";

const planByName = new Map(pricingPlans.map((plan) => [plan.name, plan]));
const planById = new Map(pricingPlans.map((plan) => [plan.id, plan]));

const topicOptions = [
  { value: "Allgemeine Frage", label: "Allgemeine Frage" },
  ...pricingPlans.map((plan) => ({
    value: plan.name,
    label: `${plan.name} anfragen`,
  })),
  { value: "Partner:in werden", label: "Partner:in werden" },
  { value: "Operatives Thema", label: "Operatives Thema" },
];

function resolvePlanFromQuery(tier: string | null): PricingPlan | null {
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
      topic: "Allgemeine Frage",
    }),
  });

  const topicField = register("topic");

  const briefingRows = useMemo(() => {
    if (!activePlan) {
      return [
        {
          label: "Routing",
          value: "Wir sortieren Brands, Preise und operative Themen direkt an den passenden Kontakt.",
        },
        {
          label: "Start ohne Paket",
          value: "Du kannst auch einfach kurz schreiben, was gerade ansteht oder welche Frage du klären willst.",
        },
        {
          label: "Was reicht",
          value: "Ein paar klare Sätze zu Team, Thema und Ziel reichen für den ersten Schritt.",
        },
      ];
    }

    return [
      {
        label: "Creative Flow",
        value: activePlan.name,
      },
      {
        label: "Passt wenn",
        value: activePlan.fit,
      },
      {
        label: "Schwerpunkte",
        value: activePlan.highlights.join(" / "),
      },
    ];
  }, [activePlan]);

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
      window.location.hash === "#kontaktformular" ||
      Boolean(searchParams.get("tier"));

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
      if (
        previousPlan &&
        getValues("teamContext") === previousPlan.audience
      ) {
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
          throw new Error(
            payload.error ??
              "Deine Nachricht konnte gerade nicht gesendet werden.",
          );
        }

        setIsSuccess(true);
      } catch (error) {
        setSubmitError(
          error instanceof Error
            ? error.message
            : "Deine Nachricht konnte gerade nicht gesendet werden.",
        );
      } finally {
        setIsPending(false);
      }
    });
  }

  if (isSuccess) {
    return (
      <div className="relative overflow-hidden rounded-[0.7rem] border border-[rgba(56,67,84,0.16)] bg-[rgba(255,252,248,0.98)] shadow-[0_14px_28px_rgba(31,36,48,0.05)]">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[3px] bg-[var(--accent)]" />
        <div className="relative grid gap-6 px-7 py-7 sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)]">
          <div className="space-y-4">
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--accent-soft)]">
              Nachricht gesendet
            </p>
            <h2 className="font-display text-4xl font-semibold tracking-[-0.05em] text-[var(--copy-strong)]">
              Danke, wir haben deine Nachricht.
            </h2>
            <p className="max-w-xl text-base leading-7 text-[color:var(--copy-body)]">
              Wir haben alles übernommen und melden uns in der Regel innerhalb
              von 24 Stunden mit einem konkreten nächsten Schritt bei dir.
            </p>
          </div>

          <div className="grid divide-y divide-[rgba(56,67,84,0.1)] rounded-[0.6rem] border border-[rgba(56,67,84,0.12)] bg-[rgba(247,249,252,0.76)]">
            <div className="grid gap-1 px-5 py-4">
              <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--accent-soft)]">
                Antwort
              </p>
              <p className="text-sm leading-6 text-[color:var(--copy-body)]">
                Falls nichts Dringendes dazwischenkommt, hörst du innerhalb von
                24 Stunden von uns.
              </p>
            </div>
            <div className="grid gap-1 px-5 py-4">
              <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--accent-soft)]">
                Nächster Schritt
              </p>
              <p className="text-sm leading-6 text-[color:var(--copy-body)]">
                Wir melden uns nicht nur mit einer Bestätigung, sondern mit
                einem konkreten Vorschlag oder einer Rückfrage.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="kontaktformular"
      ref={formContainerRef}
      className="relative overflow-hidden rounded-[0.7rem] border border-[rgba(56,67,84,0.16)] bg-[rgba(255,252,248,0.98)] shadow-[0_14px_28px_rgba(31,36,48,0.05)]"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[3px] bg-[var(--accent)]" />

      <div className="relative grid gap-0 lg:grid-cols-[minmax(0,0.34fr)_minmax(0,0.66fr)]">
        <aside className="border-b border-[rgba(56,67,84,0.1)] px-6 py-6 sm:px-8 sm:py-8 lg:border-r lg:border-b-0">
          <div className="space-y-5">
            <div className="space-y-3">
              <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--accent-soft)]">
                Kontaktformular
              </p>
              <h2 className="font-display text-4xl leading-[0.94] font-semibold tracking-[-0.05em] text-[var(--copy-strong)]">
                Erzähl uns kurz, worum es geht.
              </h2>
              <p className="text-base leading-7 text-[color:var(--copy-body)]">
                Wenn du schon aus den Preisen kommst, ist der passende Creative
                Flow hier bereits vorausgewählt. Wenn nicht, ist das auch okay.
                Ein paar Stichpunkte reichen völlig.
              </p>
            </div>

            <div className="grid divide-y divide-[rgba(56,67,84,0.1)] border-y border-[rgba(56,67,84,0.1)]">
              {briefingRows.map((row) => (
                <div key={row.label} className="grid gap-1 py-4">
                  <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--copy-soft)]">
                    {row.label}
                  </p>
                  <p className="text-sm leading-6 text-[color:var(--copy-body)]">
                    {row.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <form className="grid gap-0" onSubmit={handleSubmit(onSubmit)}>
          <input
            type="hidden"
            {...register("startedAt", { valueAsNumber: true })}
          />
          <input
            type="text"
            {...register("website")}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          <section className="grid gap-5 border-b border-[rgba(56,67,84,0.1)] px-6 py-6 sm:px-8 md:grid-cols-2">
            <div className="md:col-span-2">
              <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--accent-soft)]">
                Kontakt
              </p>
            </div>
            <Field label="Name" error={errors.name?.message}>
              <TextInput {...register("name")} placeholder="Max Mustermann" />
            </Field>
            <Field label="E-Mail" error={errors.email?.message}>
              <TextInput {...register("email")} placeholder="team@brand.de" />
            </Field>
          </section>

          <section className="grid gap-5 border-b border-[rgba(56,67,84,0.1)] px-6 py-6 sm:px-8 md:grid-cols-2">
            <div className="md:col-span-2">
              <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--accent-soft)]">
                Kontext
              </p>
            </div>
            <Field label="Team / Firma" error={errors.company?.message}>
              <TextInput
                {...register("company")}
                placeholder="Beispiel GmbH"
              />
            </Field>
            <Field label="Worum geht's?" error={errors.topic?.message}>
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
            <div className="md:col-span-2">
              <Field
                label="Teamkontext"
                error={errors.teamContext?.message}
                hint="Ein kurzer Satz reicht: Teamgröße, Anzahl Brands oder was gerade ansteht."
              >
                <TextInput
                  {...register("teamContext")}
                  placeholder="z. B. kleines Brand-Team mit Produktlaunch und Bedarf an laufenden Creatives"
                />
              </Field>
            </div>
          </section>

          <section className="grid gap-5 px-6 py-6 sm:px-8">
            <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--accent-soft)]">
              Nachricht
            </p>
            <Field
              label="Nachricht"
              error={errors.message?.message}
              hint="Wenn du über ein Paket kommst, ist hier schon ein Entwurf drin. Du kannst ihn direkt anpassen."
            >
              <TextareaInput
                {...register("message")}
                placeholder="Worum geht es gerade, was willst du erreichen und was sollen wir zuerst mit dir klären?"
                className="min-h-40"
              />
            </Field>

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
                <span className="field-error">
                  {errors.datenschutzAccepted.message}
                </span>
              ) : null}
            </label>

            {submitError ? (
              <p className="rounded-[0.45rem] border border-[rgba(255,142,124,0.3)] bg-[rgba(255,142,124,0.08)] px-4 py-3 text-sm text-[var(--danger)]">
                {submitError}
              </p>
            ) : null}

            <div className="flex flex-wrap items-start gap-4">
              <Button
                type="submit"
                disabled={isPending}
                size="md"
                variant="ghost"
                className="w-[15rem] max-w-full justify-center rounded-[0.45rem] border border-[rgba(191,106,83,0.22)] bg-[var(--accent-strong)] px-4 py-2.5 text-sm font-semibold tracking-[0.01em] text-white shadow-[0_10px_18px_rgba(224,94,67,0.14)] hover:bg-[var(--accent)] hover:text-white disabled:cursor-wait"
              >
                {isPending
                  ? "Nachricht wird gesendet..."
                  : "Nachricht senden"}
              </Button>
              <p className="max-w-sm text-xs leading-5 text-[color:var(--copy-muted)]">
                Wenn etwas unklar ist, melden wir uns zuerst mit einer
                Rückfrage statt mit einer generischen Standardantwort.
              </p>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
}
