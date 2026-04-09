import { NextResponse } from "next/server";
import { ensureHumanSubmission } from "@/lib/intake/guards";
import { waitlistSignupSchema } from "@/lib/validation/waitlist-signup";
import {
  buildWaitlistWebhookEnvelope,
  submitWaitlistSignup,
} from "@/lib/waitlist/submit-waitlist";

function resolveRequestOrigin(request: Request) {
  return request.headers.get("origin") ?? new URL(request.url).origin;
}

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = waitlistSignupSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Bitte gib eine gültige E-Mail-Adresse an.",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const guard = ensureHumanSubmission({
    startedAt: parsed.data.startedAt,
    website: parsed.data.website,
  });

  if (!guard.ok) {
    return NextResponse.json({ error: guard.reason }, { status: 400 });
  }

  try {
    const result = await submitWaitlistSignup(
      buildWaitlistWebhookEnvelope({
        source: "waitlist_signup",
        userAgent: request.headers.get("user-agent") ?? "",
        origin: resolveRequestOrigin(request),
        contact: {
          email: parsed.data.email,
        },
        raw: {
          email: parsed.data.email,
          startedAt: parsed.data.startedAt,
        },
      }),
    );

    return NextResponse.json({ ok: true, mode: result.mode });
  } catch (error) {
    console.error("[zynapse:waitlist]", error);

    return NextResponse.json(
      { error: "Dein Eintrag konnte gerade nicht gespeichert werden. Versuch es bitte noch einmal." },
      { status: 500 },
    );
  }
}
