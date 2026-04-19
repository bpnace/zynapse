"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/forms/form-primitives";
import {
  waitlistSignupSchema,
  type WaitlistSignupInput,
} from "@/lib/validation/waitlist-signup";

function createDefaultValues(): WaitlistSignupInput {
  return {
    email: "",
    startedAt: Date.now(),
    website: "",
  };
}

export function LoginWaitlistForm() {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WaitlistSignupInput>({
    resolver: zodResolver(waitlistSignupSchema),
    defaultValues: createDefaultValues(),
  });

  async function onSubmit(values: WaitlistSignupInput) {
    setSubmitError("");
    setIsPending(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(
          payload.error ?? "Dein Eintrag konnte gerade nicht gespeichert werden.",
        );
      }

      setIsSuccess(true);
      reset(createDefaultValues());
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Dein Eintrag konnte gerade nicht gespeichert werden.",
      );
    } finally {
      setIsPending(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="space-y-3 text-center">
        <p className="text-base font-medium text-[var(--copy-strong)]">
          Du stehst auf der Warteliste.
        </p>
        <p className="text-sm leading-6 text-[color:var(--copy-body)]">
          Wir geben dir Bescheid, sobald die ersten Zugänge freigeschaltet
          werden.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <form
        className="flex flex-col gap-3 sm:flex-row sm:items-start"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input type="hidden" {...register("startedAt", { valueAsNumber: true })} />
        <input
          type="text"
          {...register("website")}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        <div className="w-full text-left">
          <label htmlFor="login-waitlist-email" className="sr-only">
            E-Mail
          </label>
          <TextInput
            id="login-waitlist-email"
            {...register("email")}
            type="email"
            autoComplete="email"
            placeholder="Deine E-Mail-Adresse"
            className="min-h-12 w-full bg-white/94"
          />
        </div>

        <Button
          type="submit"
          size="lg"
          hidePrimaryArrows
          className="min-w-[11rem] justify-center whitespace-nowrap disabled:cursor-wait"
          disabled={isPending}
        >
          {isPending ? "Wird eingetragen..." : "Auf die Warteliste"}
        </Button>
      </form>

      {errors.email?.message ? (
        <p className="text-left text-sm text-[var(--danger)]">
          {errors.email.message}
        </p>
      ) : null}

      {submitError ? (
        <p className="text-left text-sm text-[var(--danger)]">
          {submitError}
        </p>
      ) : null}

      <p className="text-sm leading-6 text-[color:var(--copy-muted)]">
        Kein Newsletter, kein Spam, nur eine Benachrichtigung zum Start von
        Zynapse. <b>Versprochen</b>.
      </p>
    </div>
  );
}
