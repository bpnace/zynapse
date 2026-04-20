"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/forms/form-primitives";
import { createBrowserSupabaseClient } from "@/lib/auth/client";
import { resolveWorkspaceNextPath } from "@/lib/workspace/routes";

type WorkspaceLoginFormProps = {
  next?: string;
  availableMethods?: LoginMethod[];
  initialMethod?: LoginMethod;
  initialEmail?: string;
};

type LoginStep = "email-entry" | "otp-entry";
type LoginMethod = "otp" | "password";

const RESEND_COOLDOWN_SECONDS = 30;

function maskEmail(email: string) {
  const [localPart, domain = ""] = email.split("@");

  if (!localPart || !domain) {
    return email;
  }

  if (localPart.length <= 2) {
    return `${localPart[0] ?? "*"}*@${domain}`;
  }

  return `${localPart[0]}${"*".repeat(Math.max(localPart.length - 2, 1))}${localPart.at(-1)}@${domain}`;
}

function mapOtpError(error: unknown) {
  if (!(error instanceof Error)) {
    return "Login ist aktuell nicht verfügbar. Bitte später erneut versuchen.";
  }

  const message = error.message.toLowerCase();

  if (message.includes("signups not allowed for otp")) {
    return "Diese E-Mail hat noch keinen Zugang. Nutze bitte eine eingeladene E-Mail-Adresse oder die Warteliste.";
  }

  if (message.includes("invalid") && message.includes("otp")) {
    return "Der Code ist ungültig. Bitte prüfe ihn und versuche es erneut.";
  }

  if (message.includes("expired") && message.includes("otp")) {
    return "Der Code ist abgelaufen. Fordere bitte einen neuen Code an.";
  }

  if (
    message.includes("too many requests") ||
    message.includes("over_email_send_rate_limit")
  ) {
    return "Zu viele Versuche. Bitte warte kurz, bevor du es erneut versuchst.";
  }

  return error.message;
}

function mapPasswordError(error: unknown) {
  if (!(error instanceof Error)) {
    return "Login ist aktuell nicht verfügbar. Bitte später erneut versuchen.";
  }

  const message = error.message.toLowerCase();

  if (
    message.includes("invalid login credentials") ||
    message.includes("invalid credentials")
  ) {
    return "E-Mail oder Passwort ist falsch.";
  }

  if (message.includes("email not confirmed")) {
    return "Diese E-Mail-Adresse ist noch nicht bestätigt.";
  }

  if (message.includes("too many requests")) {
    return "Zu viele Versuche. Bitte warte kurz, bevor du es erneut versuchst.";
  }

  return error.message;
}

export function WorkspaceLoginForm({
  next = "/app",
  availableMethods = ["otp"],
  initialMethod = availableMethods[0] ?? "otp",
  initialEmail = "",
}: WorkspaceLoginFormProps) {
  const router = useRouter();
  const safeNextPath = useMemo(
    () => resolveWorkspaceNextPath(next, "/app"),
    [next],
  );
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [method, setMethod] = useState<LoginMethod>(initialMethod);
  const [step, setStep] = useState<LoginStep>("email-entry");
  const [isPending, setIsPending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [helperMessage, setHelperMessage] = useState("");
  const [cooldownSecondsLeft, setCooldownSecondsLeft] = useState(0);
  const isLoginConfigured =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);
  const maskedEmail = useMemo(
    () => maskEmail(normalizedEmail),
    [normalizedEmail],
  );

  useEffect(() => {
    if (cooldownSecondsLeft <= 0 || method !== "otp" || step !== "otp-entry") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCooldownSecondsLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [cooldownSecondsLeft, method, step]);

  async function requestOtp(targetEmail: string) {
    const loginPreparationResponse = await fetch("/api/auth/workspace-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: targetEmail,
      }),
    });

    if (!loginPreparationResponse.ok) {
      const payload = (await loginPreparationResponse.json()) as { error?: string };
      throw new Error(
        payload.error ??
          "Login ist aktuell nicht verfügbar. Bitte später erneut versuchen.",
      );
    }

    const payload = (await loginPreparationResponse.json()) as {
      message?: string;
    };

    return (
      payload.message ??
      "Wenn diese E-Mail freigeschaltet ist, wurde ein Code versendet."
    );
  }

  function resetModeState(nextMethod: LoginMethod) {
    setMethod(nextMethod);
    setStep("email-entry");
    setPassword("");
    setOtpCode("");
    setCooldownSecondsLeft(0);
    setSubmitError("");
    setHelperMessage("");
  }

  async function handleEmailSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const targetEmail = String(formData.get("workspace-email") ?? "")
      .trim()
      .toLowerCase();

    setSubmitError("");
    setHelperMessage("");
    setIsPending(true);

    try {
      setEmail(targetEmail);
      const helperCopy = await requestOtp(targetEmail);
      setStep("otp-entry");
      setOtpCode("");
      setCooldownSecondsLeft(RESEND_COOLDOWN_SECONDS);
      setHelperMessage(helperCopy);
    } catch (error) {
      setSubmitError(mapOtpError(error));
    } finally {
      setIsPending(false);
    }
  }

  async function handleOtpSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const token = String(formData.get("workspace-otp") ?? "")
      .replace(/\D/g, "")
      .slice(0, 6);

    setSubmitError("");
    setHelperMessage("");
    setIsPending(true);

    try {
      const supabase = createBrowserSupabaseClient();

      if (!supabase) {
        throw new Error(
          "Login ist aktuell nicht verfügbar. Bitte später erneut versuchen.",
        );
      }

      const { error } = await supabase.auth.verifyOtp({
        email: normalizedEmail,
        token,
        type: "email",
      });

      if (error) {
        throw error;
      }

      router.push(safeNextPath);
      router.refresh();
    } catch (error) {
      setSubmitError(mapOtpError(error));
    } finally {
      setIsPending(false);
    }
  }

  async function handlePasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const targetEmail = String(formData.get("workspace-email") ?? "")
      .trim()
      .toLowerCase();
    const targetPassword = String(formData.get("workspace-password") ?? "");

    setSubmitError("");
    setHelperMessage("");
    setIsPending(true);

    try {
      const supabase = createBrowserSupabaseClient();

      if (!supabase) {
        throw new Error(
          "Login ist aktuell nicht verfügbar. Bitte später erneut versuchen.",
        );
      }

      setEmail(targetEmail);
      setPassword(targetPassword);

      const { error } = await supabase.auth.signInWithPassword({
        email: targetEmail,
        password: targetPassword,
      });

      if (error) {
        throw error;
      }

      router.push(safeNextPath);
      router.refresh();
    } catch (error) {
      setSubmitError(mapPasswordError(error));
    } finally {
      setIsPending(false);
    }
  }

  async function handleResendCode() {
    if (cooldownSecondsLeft > 0) {
      return;
    }

    setSubmitError("");
    setHelperMessage("");
    setIsPending(true);

    try {
      await requestOtp(normalizedEmail);
      setCooldownSecondsLeft(RESEND_COOLDOWN_SECONDS);
      setOtpCode("");
      setHelperMessage("Ein neuer Code wurde an deine E-Mail-Adresse gesendet.");
    } catch (error) {
      setSubmitError(mapOtpError(error));
    } finally {
      setIsPending(false);
    }
  }

  function handleChangeEmail() {
    setStep("email-entry");
    setOtpCode("");
    setCooldownSecondsLeft(0);
    setSubmitError("");
    setHelperMessage("");
  }

  const isEmailSubmitDisabled = isPending || !isLoginConfigured;
  const isOtpSubmitDisabled = isPending || !isLoginConfigured;
  const isPasswordSubmitDisabled = isPending || !isLoginConfigured;
  const isResendDisabled = isPending || cooldownSecondsLeft > 0;

  return (
    <form
      className="space-y-4 rounded-[1.7rem] border border-[color:var(--line)] bg-white/75 p-6 text-left"
      onSubmit={
        method === "password"
          ? handlePasswordSubmit
          : step === "email-entry"
            ? handleEmailSubmit
            : handleOtpSubmit
      }
    >
      <div className="space-y-2">
        <h2 className="font-display text-2xl font-semibold tracking-[-0.04em] text-[var(--copy-strong)]">
          Zugang auf Einladung
        </h2>
        <p className="text-sm leading-6 text-[color:var(--copy-body)]">
          Der geschützte Bereich ist nur für eingeladene Teams freigeschaltet.
        </p>
      </div>

      {availableMethods.length > 1 ? (
        <div className="inline-flex rounded-full border border-[color:var(--line)] bg-white/80 p-1">
          {availableMethods.includes("otp") ? (
            <button
              type="button"
              className={
                method === "otp"
                  ? "rounded-full bg-[var(--foreground)] px-4 py-2 text-sm font-medium text-white"
                  : "rounded-full px-4 py-2 text-sm font-medium text-[var(--copy-body)]"
              }
              onClick={() => resetModeState("otp")}
            >
              Code per E-Mail
            </button>
          ) : null}
          {availableMethods.includes("password") ? (
            <button
              type="button"
              className={
                method === "password"
                  ? "rounded-full bg-[var(--foreground)] px-4 py-2 text-sm font-medium text-white"
                  : "rounded-full px-4 py-2 text-sm font-medium text-[var(--copy-body)]"
              }
              onClick={() => resetModeState("password")}
            >
              Mit Passwort
            </button>
          ) : null}
        </div>
      ) : null}

      {method === "password" ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="workspace-email"
              className="text-sm font-medium text-[var(--copy-strong)]"
            >
              Geschäftliche E-Mail
            </label>
            <TextInput
              id="workspace-email"
              name="workspace-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="team@brand.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="workspace-password"
              className="text-sm font-medium text-[var(--copy-strong)]"
            >
              Passwort
            </label>
            <TextInput
              id="workspace-password"
              name="workspace-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Dein Test-Passwort"
              required
            />
          </div>
        </div>
      ) : step === "email-entry" ? (
        <div className="space-y-2">
          <label
            htmlFor="workspace-email"
            className="text-sm font-medium text-[var(--copy-strong)]"
          >
            Geschäftliche E-Mail
          </label>
          <TextInput
            id="workspace-email"
            name="workspace-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="team@brand.com"
            required
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-[1.1rem] border border-[color:var(--line)] bg-white/70 px-4 py-3">
            <p className="text-sm font-medium text-[var(--copy-strong)]">
              Code gesendet an {maskedEmail}
            </p>
            <p className="mt-1 text-sm leading-6 text-[color:var(--copy-body)]">
              Gib den 6-stelligen Code aus deiner E-Mail ein, um direkt in den
              geschützten Bereich zu wechseln.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="workspace-otp"
              className="text-sm font-medium text-[var(--copy-strong)]"
            >
              6-stelliger Code
            </label>
            <TextInput
              id="workspace-otp"
              name="workspace-otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              value={otpCode}
              onChange={(event) =>
                setOtpCode(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="123456"
              required
            />
          </div>
        </div>
      )}

      {!isLoginConfigured ? (
        <p className="text-sm text-[var(--danger)]">
          Login ist aktuell nicht verfügbar. Die Supabase-Konfiguration fehlt.
        </p>
      ) : null}

      {helperMessage ? (
        <p className="text-sm text-[var(--copy-body)]">{helperMessage}</p>
      ) : null}

      {submitError ? (
        <p className="text-sm text-[var(--danger)]">{submitError}</p>
      ) : null}

      {method === "password" ? (
        <Button
          type="submit"
          size="lg"
          className="justify-center disabled:cursor-wait"
          disabled={isPasswordSubmitDisabled}
        >
          {isPending ? "Login wird geprüft..." : "Mit Passwort anmelden"}
        </Button>
      ) : step === "email-entry" ? (
        <Button
          type="submit"
          size="lg"
          className="justify-center disabled:cursor-wait"
          disabled={isEmailSubmitDisabled}
        >
          {isPending ? "Code wird gesendet..." : "Code anfordern"}
        </Button>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            type="submit"
            size="lg"
            className="justify-center disabled:cursor-wait"
            disabled={isOtpSubmitDisabled}
          >
            {isPending ? "Code wird geprüft..." : "Code bestätigen"}
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="justify-center"
            disabled={isResendDisabled}
            onClick={handleResendCode}
          >
            {cooldownSecondsLeft > 0
              ? `Code erneut senden (${cooldownSecondsLeft}s)`
              : "Code erneut senden"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="md"
            className="justify-center self-start px-0 text-sm"
            onClick={handleChangeEmail}
          >
            E-Mail ändern
          </Button>
        </div>
      )}
    </form>
  );
}
