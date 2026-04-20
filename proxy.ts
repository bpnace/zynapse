import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/auth/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/app/:path*",
    "/brands/:path*",
    "/ops/:path*",
    "/creatives/tasks/:path*",
    "/creatives/campaigns/:path*",
    "/creatives/feedback/:path*",
    "/ops/:path*",
  ],
};
