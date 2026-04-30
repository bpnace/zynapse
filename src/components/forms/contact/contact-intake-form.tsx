"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, ButtonLink } from "@/components/ui/button";
import { BoldZynapseCore } from "@/components/ui/bold-zynapse-core";
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
        label: "Zynapse Core",
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
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="rounded-[0.75rem] bg-white p-6 shadow-[0_18px_44px_rgba(31,36,48,0.08)] sm:p-7">
          <p className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-[var(--copy-soft)]">
            Nachricht gesendet
          </p>
          <div className="mt-4 grid gap-5 md:grid-cols-[minmax(0,0.68fr)_auto] md:items-end">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-[-0.05em] text-[var(--copy-strong)] sm:text-4xl">
                Danke, wir haben deine Nachricht.
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[color:var(--copy-body)] sm:text-base">
                Wir haben alles übernommen und melden uns in der Regel innerhalb
                von 24 Stunden mit einem konkreten nächsten Schritt bei dir.
              </p>
            </div>
            <ButtonLink href="/" variant="secondary" className="rounded-[0.45rem]">
              Zur Startseite
            </ButtonLink>
          </div>
        </div>

        <aside className="h-fit rounded-[0.75rem] bg-[var(--copy-strong)] p-4 text-white shadow-[0_18px_44px_rgba(31,36,48,0.12)]">
          <p className="font-mono text-[0.68rem] tracking-[0.18em] uppercase text-white/[0.62]">
            Was jetzt passiert
          </p>
          <div className="mt-4 grid gap-4">
            <div>
              <p className="font-mono text-[0.65rem] tracking-[0.16em] uppercase text-white/[0.55]">
                Antwort
              </p>
              <p className="mt-2 text-sm leading-5 text-white/[0.75]">
                Falls nichts Dringendes dazwischenkommt, hörst du innerhalb von
                24 Stunden von uns.
              </p>
            </div>
            <div>
              <p className="font-mono text-[0.65rem] tracking-[0.16em] uppercase text-white/[0.55]">
                Nächster Schritt
              </p>
              <p className="mt-2 text-sm leading-5 text-white/[0.75]">
                Wir melden uns nicht nur mit einer Bestätigung, sondern mit
                einem konkreten Vorschlag oder einer Rückfrage.
              </p>
            </div>
          </div>
        </aside>
      </div>
    );
  }

  return (
    <div
      id="kontaktformular"
      ref={formContainerRef}
      className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]"
    >
      <div className="rounded-[0.75rem] bg-white p-4 shadow-[0_18px_44px_rgba(31,36,48,0.08)] sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
          <div>
            <p className="font-mono text-[0.68rem] tracking-[0.18em] uppercase text-[var(--copy-soft)]">
              Kontaktformular
            </p>
            <h2 className="mt-2 font-display text-2xl leading-[1] font-semibold tracking-[-0.05em] text-[var(--copy-strong)]">
              Erzähl uns kurz, worum es geht.
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[color:var(--copy-body)]">
              <BoldZynapseCore>
                Wenn du schon aus den Preisen kommst, ist der passende
                Zynapse-Core-Rahmen vorausgewählt. Wenn nicht, reichen ein paar
                klare Sätze zu Team, Thema und Ziel.
              </BoldZynapseCore>
            </p>
          </div>
          <div className="rounded-[0.55rem] bg-[rgba(31,36,48,0.04)] p-3">
            <p className="font-mono text-[0.65rem] tracking-[0.16em] uppercase text-[var(--copy-muted)]">
              Formularstatus
            </p>
            <p className="mt-2 text-sm leading-5 text-[color:var(--copy-body)]">
              Vier kurze Angaben plus Nachricht. Wir routen sie direkt an den
              passenden Kontakt.
            </p>
          </div>
        </div>

        <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
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

          <section className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <p className="font-mono text-[0.68rem] tracking-[0.16em] uppercase text-[var(--copy-soft)]">
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

          <section className="grid gap-4 border-t border-[rgba(31,36,48,0.12)] pt-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <p className="font-mono text-[0.68rem] tracking-[0.16em] uppercase text-[var(--copy-soft)]">
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

          <section className="grid gap-4 border-t border-[rgba(31,36,48,0.12)] pt-4">
            <p className="font-mono text-[0.68rem] tracking-[0.16em] uppercase text-[var(--copy-soft)]">
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
              <p className="rounded-[0.45rem] bg-[rgba(184,58,44,0.06)] px-4 py-3 text-sm text-[#8f241b]">
                {submitError}
              </p>
            ) : null}

            <div className="flex flex-col gap-3 border-t border-[rgba(31,36,48,0.12)] pt-3 sm:flex-row sm:items-center sm:justify-between">
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

      <aside className="h-fit rounded-[0.75rem] bg-[var(--copy-strong)] p-4 text-white shadow-[0_18px_44px_rgba(31,36,48,0.12)] xl:sticky xl:top-24">
        <p className="font-mono text-[0.68rem] tracking-[0.18em] uppercase text-white/[0.62]">
          Zynapse sortiert mit
        </p>
        <div className="mt-3 flex items-end justify-between gap-4">
          <div>
            <p className="font-display text-[2.6rem] leading-none font-semibold tracking-[-0.05em]">
              24h
            </p>
            <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-white/[0.55]">
              Antwortfenster
            </p>
          </div>
          <p className="max-w-[11rem] text-right text-sm leading-5 text-white/[0.72]">
            Kein perfektes Briefing nötig. Wir klären den passenden nächsten
            Schritt.
          </p>
        </div>

        <div className="mt-4 grid gap-4">
          {briefingRows.map((row) => (
            <section key={row.label}>
              <p className="font-mono text-[0.65rem] tracking-[0.16em] uppercase text-white/[0.55]">
                <BoldZynapseCore>{row.label}</BoldZynapseCore>
              </p>
              <p className="mt-2 text-sm leading-5 text-white/[0.75]">
                <BoldZynapseCore>{row.value}</BoldZynapseCore>
              </p>
            </section>
          ))}
        </div>
      </aside>
    </div>
  );
}
