import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/auth/server";
import { resolveWorkspaceNextPath } from "@/lib/workspace/routes";

function resolveSafeNextPath(next: string | null) {
  return resolveWorkspaceNextPath(next, "/app");
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const next = resolveSafeNextPath(url.searchParams.get("next"));

  const supabase = await createServerSupabaseClient();
  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : tokenHash && type
      ? await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as EmailOtpType,
        })
      : { error: new Error("Missing auth callback parameters.") };

  if (error) {
    return NextResponse.redirect(new URL("/login?error=auth_callback_failed", url.origin));
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
