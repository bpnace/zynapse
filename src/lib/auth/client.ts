"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getOptionalSupabaseEnv } from "@/lib/env";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function createBrowserSupabaseClient() {
  if (browserClient) {
    return browserClient;
  }

  const env = getOptionalSupabaseEnv();

  if (!env) {
    return null;
  }

  browserClient = createBrowserClient(env.url, env.anonKey);
  return browserClient;
}
