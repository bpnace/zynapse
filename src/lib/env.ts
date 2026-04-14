function readRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

function resolveDatabaseUrl() {
  return (
    process.env.DATABASE_POOL_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    ""
  );
}

function resolveWaitlistWebhookUrl() {
  if (process.env.NODE_ENV === "production") {
    return (
      process.env.WAITLIST_WEBHOOK_URL_PROD ||
      process.env.WAITLIST_WEBHOOK_URL ||
      ""
    );
  }

  return (
    process.env.WAITLIST_WEBHOOK_URL_DEV ||
    process.env.WAITLIST_WEBHOOK_URL ||
    ""
  );
}

export function getEnv() {
  return {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://zynapse.eu",
    analyticsId: process.env.NEXT_PUBLIC_ANALYTICS_ID ?? "",
    supabaseUrl:
      process.env.NEXT_PUBLIC_SUPABASE_URL ??
      "https://fqvxcyttyardsqugowjl.supabase.co",
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    googleSiteVerification: process.env.GOOGLE_SITE_VERIFICATION ?? "",
    bingSiteVerification: process.env.BING_SITE_VERIFICATION ?? "",
    waitlistWebhookUrl: resolveWaitlistWebhookUrl(),
    intakeWebhookUrl: process.env.INTAKE_WEBHOOK_URL ?? "",
    pilotRequestWebhookUrl:
      process.env.PILOT_REQUEST_WEBHOOK_URL ??
      process.env.INTAKE_WEBHOOK_URL ??
      "",
    notifyEmail: process.env.NOTIFY_EMAIL ?? "ops@zynapse.eu",
    turnstileSiteKey: process.env.TURNSTILE_SITE_KEY ?? "",
    turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY ?? "",
    brandInputsBucket: process.env.SUPABASE_BRAND_INPUTS_BUCKET ?? "",
    demoAssetsBucket: process.env.SUPABASE_DEMO_ASSETS_BUCKET ?? "",
  };
}

export function getServerEnv() {
  return {
    ...getEnv(),
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    databaseUrl: resolveDatabaseUrl(),
  };
}

export function getRequiredSupabaseEnv() {
  return {
    url: readRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: readRequiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  };
}

export function getOptionalSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return {
    url,
    anonKey,
  };
}

export function getRequiredDatabaseUrl() {
  const databaseUrl = resolveDatabaseUrl();

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL or a pooled equivalent (DATABASE_POOL_URL / POSTGRES_URL / POSTGRES_PRISMA_URL) is required.",
    );
  }

  return databaseUrl;
}
