import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getRequiredSupabaseEnv } from "@/lib/env";

export async function createServerSupabaseClient() {
  const env = getRequiredSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot always mutate cookies directly.
        }
      },
    },
  });
}
