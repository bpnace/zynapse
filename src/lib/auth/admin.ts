import { createClient } from "@supabase/supabase-js";
import { getEnv, getServerEnv } from "@/lib/env";
import type { WorkspaceDatabase } from "@/lib/workspace/data/types";

let serviceRoleClient: ReturnType<typeof createClient<WorkspaceDatabase>> | null = null;

export function createServiceRoleSupabaseClient() {
  if (serviceRoleClient) {
    return serviceRoleClient;
  }

  const env = getServerEnv();
  const publicEnv = getEnv();

  if (!publicEnv.supabaseUrl || !env.supabaseServiceRoleKey) {
    return null;
  }

  serviceRoleClient = createClient(
    publicEnv.supabaseUrl,
    env.supabaseServiceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

  return serviceRoleClient;
}
