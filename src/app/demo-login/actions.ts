"use server";

import { redirect } from "next/navigation";
import { enforceDemoLoginRateLimit } from "@/lib/auth/login-rate-limit";
import { createServerSupabaseClient } from "@/lib/auth/server";
import {
  getDemoWorkspaceConfig,
  getDemoWorkspaceTypeForEmail,
  resolveDemoWorkspaceNextPathForEmail,
} from "@/lib/workspace/demo";
import { brandsWorkspaceRoutes } from "@/lib/workspace/routes";

function buildLoginRedirect(errorCode: string, next: string) {
  const params = new URLSearchParams({
    error: errorCode,
    next,
  });

  return `/demo-login?${params.toString()}`;
}

export async function submitDemoLogin(formData: FormData) {
  const email = String(formData.get("workspace-email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("workspace-password") ?? "");
  const next = resolveDemoWorkspaceNextPathForEmail(
    email,
    String(formData.get("next") ?? brandsWorkspaceRoutes.overview()),
  );
  const demoConfig = getDemoWorkspaceConfig();
  const demoWorkspaceType = getDemoWorkspaceTypeForEmail(email);

  if (!demoConfig.isEnabled) {
    redirect("/login");
  }

  const rateLimit = enforceDemoLoginRateLimit({ email });

  if (!rateLimit.ok) {
    redirect(buildLoginRedirect("invalid_credentials", next));
  }

  if (!demoWorkspaceType) {
    redirect(buildLoginRedirect("invalid_credentials", next));
  }

  let signInError = false;

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    signInError = Boolean(error);
  } catch {
    redirect(buildLoginRedirect("auth_unavailable", next));
  }

  if (signInError) {
    redirect(buildLoginRedirect("invalid_credentials", next));
  }

  redirect(next);
}
