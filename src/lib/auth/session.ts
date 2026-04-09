import { cache } from "react";
import { createServerSupabaseClient } from "@/lib/auth/server";

export const getSessionUser = cache(async () => {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return user;
});
