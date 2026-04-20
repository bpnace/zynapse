import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { getRequiredSupabaseEnv } from "@/lib/env";
import { enforceWorkspaceLoginRateLimit } from "@/lib/auth/login-rate-limit";

const workspaceLoginSchema = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
});

const GENERIC_WORKSPACE_LOGIN_MESSAGE =
  "Wenn diese E-Mail für den geschützten Bereich freigeschaltet ist, haben wir einen Code gesendet. Andernfalls nutze bitte die Warteliste.";

export async function POST(request: Request) {
  try {
    const payload = workspaceLoginSchema.parse(await request.json());
    const rateLimit = enforceWorkspaceLoginRateLimit({
      request,
      email: payload.email,
    });

    if (!rateLimit.ok) {
      return NextResponse.json(
        { error: rateLimit.reason },
        {
          status: 429,
          headers: {
            "Retry-After": `${Math.ceil(rateLimit.retryAfterMs / 1000)}`,
          },
        },
      );
    }

    const env = getRequiredSupabaseEnv();
    const supabase = createClient(env.url, env.anonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data, error } = await supabase.rpc("workspace_login_eligible", {
      target_email: payload.email,
    });

    if (error) {
      throw error;
    }

    if (data) {
      const otpClient = createClient(env.url, env.anonKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });

      const { error: otpError } = await otpClient.auth.signInWithOtp({
        email: payload.email,
        options: {
          shouldCreateUser: false,
        },
      });

      if (otpError) {
        throw otpError;
      }
    }

    return NextResponse.json({
      ok: true,
      message: GENERIC_WORKSPACE_LOGIN_MESSAGE,
    });
  } catch {
    return NextResponse.json(
      { error: "Der Login konnte gerade nicht vorbereitet werden." },
      { status: 400 },
    );
  }
}
