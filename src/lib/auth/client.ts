"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getRequiredSupabaseEnv } from "@/lib/env";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function createBrowserSupabaseClient() {
  if (browserClient) {
    return browserClient;
  }

  const env = getRequiredSupabaseEnv();

  browserClient = createBrowserClient(env.url, env.anonKey);
  return browserClient;
}
