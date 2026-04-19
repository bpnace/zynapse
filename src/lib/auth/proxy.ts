import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getRequiredSupabaseEnv } from "@/lib/env";
import { isProtectedWorkspacePath, resolveWorkspaceNextPath } from "@/lib/workspace/routes";

export async function updateSession(request: NextRequest) {
  const env = getRequiredSupabaseEnv();
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const userClaims = data?.claims;

  if (!userClaims && isProtectedWorkspacePath(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set(
      "next",
      resolveWorkspaceNextPath(
        `${request.nextUrl.pathname}${request.nextUrl.search}`,
        "/app",
      ),
    );
    return NextResponse.redirect(url);
  }

  return response;
}
