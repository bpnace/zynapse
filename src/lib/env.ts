const DEFAULT_INTAKE_WEBHOOK_URL =
  "https://automation.codariq.de/webhook/95d1df54-a4c7-449c-9f02-531a75922e05";

export function getEnv() {
  return {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://zynapse.example",
    analyticsId: process.env.NEXT_PUBLIC_ANALYTICS_ID ?? "",
    intakeWebhookUrl:
      process.env.INTAKE_WEBHOOK_URL ?? DEFAULT_INTAKE_WEBHOOK_URL,
    notifyEmail: process.env.NOTIFY_EMAIL ?? "",
    turnstileSiteKey: process.env.TURNSTILE_SITE_KEY ?? "",
    turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY ?? "",
  };
}
