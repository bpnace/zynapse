"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/forms/form-primitives";
import { createBrowserSupabaseClient } from "@/lib/auth/client";

type WorkspaceLoginFormProps = {
  next?: string;
};

export function WorkspaceLoginForm({
  next = "/workspace",
}: WorkspaceLoginFormProps) {
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const redirectTo = useMemo(() => {
    const origin =
      typeof window === "undefined"
        ? process.env.NEXT_PUBLIC_SITE_URL ?? ""
        : window.location.origin;

    return `${origin}/auth/callback?next=${encodeURIComponent(next)}`;
  }, [next]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");
    setIsPending(true);

    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      setSubmitError(error.message);
      setIsPending(false);
      return;
    }

    setIsSuccess(true);
    setIsPending(false);
  }

  if (isSuccess) {
    return (
      <div className="space-y-3 rounded-[1.7rem] border border-[color:var(--line)] bg-white/75 p-6 text-left">
        <p className="text-base font-medium text-[var(--copy-strong)]">
          Der Magic Link wurde versendet.
        </p>
        <p className="text-sm leading-6 text-[color:var(--copy-body)]">
          Nutze den Link in deiner E-Mail, um in den Brand Workspace zu wechseln.
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-4 rounded-[1.7rem] border border-[color:var(--line)] bg-white/75 p-6 text-left"
      onSubmit={onSubmit}
    >
      <div className="space-y-2">
        <h2 className="font-display text-2xl font-semibold tracking-[-0.04em] text-[var(--copy-strong)]">
          Invite-only Login
        </h2>
        <p className="text-sm leading-6 text-[color:var(--copy-body)]">
          Der Zugang zum Workspace ist nur für eingeladene Brand-Teams vorgesehen.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="workspace-email" className="text-sm font-medium text-[var(--copy-strong)]">
          Geschäftliche E-Mail
        </label>
        <TextInput
          id="workspace-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="team@brand.com"
          required
        />
      </div>

      {submitError ? (
        <p className="text-sm text-[var(--danger)]">{submitError}</p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        className="w-full justify-center disabled:cursor-wait"
        disabled={isPending || !email}
      >
        {isPending ? "Link wird versendet..." : "Mit Magic Link anmelden"}
      </Button>
    </form>
  );
}
