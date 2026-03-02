export function getEnv() {
  return {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://zynapse.example",
    analyticsId: process.env.NEXT_PUBLIC_ANALYTICS_ID ?? "",
    intakeWebhookUrl: process.env.INTAKE_WEBHOOK_URL ?? "",
    notifyEmail: process.env.NOTIFY_EMAIL ?? "",
    turnstileSiteKey: process.env.TURNSTILE_SITE_KEY ?? "",
    turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY ?? "",
  };
}
