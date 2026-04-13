import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleSupabaseClient } from "@/lib/auth/admin";

const workspaceLoginSchema = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
});

export async function POST(request: Request) {
  try {
    const payload = workspaceLoginSchema.parse(await request.json());
    const supabase = createServiceRoleSupabaseClient();

    if (!supabase) {
      throw new Error("Supabase service role client is not configured.");
    }

    const { data, error } = await supabase.rpc("workspace_login_eligible", {
      target_email: payload.email,
    });

    if (error) {
      throw error;
    }

    if (!data) {
      return NextResponse.json(
        {
          error:
            "Diese E-Mail hat noch keinen Workspace-Zugang. Nutze bitte eine eingeladene E-Mail-Adresse oder die Waitlist.",
        },
        { status: 403 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Der Login konnte gerade nicht vorbereitet werden." },
      { status: 400 },
    );
  }
}
