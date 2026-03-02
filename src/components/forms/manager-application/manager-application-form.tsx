"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { buttonStyles } from "@/components/ui/button";
import {
  MANAGER_APPLICATION_STORAGE_KEY,
  createManagerApplicationDefaults,
} from "@/lib/forms/storage";
import {
  managerApplicationSchema,
  type ManagerApplicationInput,
} from "@/lib/validation/manager-application";
import {
  CheckboxPill,
  Field,
  TextareaInput,
  TextInput,
} from "@/components/forms/form-primitives";

const focusChannelOptions = ["TikTok", "Instagram Reels", "YouTube Shorts", "Meta Ads", "UGC-Konzepte"];

export function ManagerApplicationForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ManagerApplicationInput>({
    resolver: zodResolver(managerApplicationSchema),
    defaultValues: createManagerApplicationDefaults(),
  });

  const selectedChannels = watch("focusChannels");

  useEffect(() => {
    const saved = window.localStorage.getItem(MANAGER_APPLICATION_STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<ManagerApplicationInput>;
        reset(createManagerApplicationDefaults(parsed));
      } catch {
        window.localStorage.removeItem(MANAGER_APPLICATION_STORAGE_KEY);
      }
    }
  }, [reset]);

  useEffect(() => {
    const subscription = watch((value) => {
      window.localStorage.setItem(
        MANAGER_APPLICATION_STORAGE_KEY,
        JSON.stringify(
          createManagerApplicationDefaults(value as Partial<ManagerApplicationInput>),
        ),
      );
    });

    return () => subscription.unsubscribe();
  }, [watch]);

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

  async function onSubmit(values: ManagerApplicationInput) {
    setSubmitError("");
    setIsPending(true);

    startTransition(async () => {
      try {
        const response = await fetch("/api/intake/manager", {
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

        window.localStorage.removeItem(MANAGER_APPLICATION_STORAGE_KEY);
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
      <div className="section-card rounded-[2rem] p-8">
        <span className="eyebrow">Manager-Track</span>
        <h2 className="mt-6 font-display text-4xl font-semibold tracking-[-0.05em]">
          Deine Bewerbung ist eingegangen.
        </h2>
        <p className="mt-4 max-w-2xl text-[color:var(--copy-muted)]">
          Wir prüfen jetzt deine Angaben, Cases und Fokuskanäle. Bis die Übergabe
          live geschaltet ist, läuft die Bewerbung intern noch als strukturierter
          Testeintrag.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="section-card rounded-[2rem] p-6 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,0.68fr)]">
        <div className="space-y-5">
          <span className="eyebrow">Manager-Bewerbung</span>
          <h2 className="font-display text-4xl font-semibold tracking-[-0.05em]">
            Wir prüfen Passung. Nicht nur Kontaktdaten.
          </h2>
          <p className="text-[color:var(--copy-muted)]">
            Uns interessieren die Informationen, die für starke Kampagnenarbeit
            wirklich zählen: Cases, Kanäle, Verfügbarkeit und strategische Tiefe.
          </p>
        </div>
        <div className="space-y-8">
          <input type="hidden" {...register("startedAt", { valueAsNumber: true })} />
          <input type="text" {...register("website")} className="hidden" tabIndex={-1} autoComplete="off" />
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Name" error={errors.name?.message}>
              <TextInput {...register("name")} placeholder="Dein Name" />
            </Field>
            <Field label="E-Mail" error={errors.email?.message}>
              <TextInput {...register("email")} placeholder="name@example.com" />
            </Field>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Portfolio / LinkedIn" error={errors.portfolioUrl?.message}>
              <TextInput {...register("portfolioUrl")} placeholder="https://linkedin.com/in/..." />
            </Field>
            <Field label="Standort / Zeitzone" error={errors.location?.message}>
              <TextInput {...register("location")} placeholder="Berlin / CET" />
            </Field>
          </div>
          <Field
            label="Fokuskanäle"
            error={errors.focusChannels?.message}
            hint="Mehrfachauswahl möglich"
          >
            <div className="flex flex-wrap gap-3">
              {focusChannelOptions.map((option) => (
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
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Verfügbarkeit" error={errors.availability?.message}>
              <TextInput
                {...register("availability")}
                placeholder="z. B. 2 neue Kunden oder 1 Retainer pro Monat"
              />
            </Field>
            <Field
              label="Preis / Vergütung"
              error={errors.compensationNotes?.message}
              hint="Optional"
            >
              <TextInput
                {...register("compensationNotes")}
                placeholder="z. B. Retainer, Projektbasis oder Revenue Share"
              />
            </Field>
          </div>
          <Field
            label="Relevante Case-Erfahrung"
            error={errors.caseSummary?.message}
          >
            <TextareaInput
              {...register("caseSummary")}
              placeholder="Welche Kampagnen, Marken oder Growth-Situationen hast du bereits geführt und was war dein Beitrag?"
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
          >
            {isPending ? "Sende Bewerbung..." : "Bewerbung absenden"}
          </button>
        </div>
      </div>
    </form>
  );
}
