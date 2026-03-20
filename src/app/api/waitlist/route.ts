import { NextResponse } from "next/server";
import { ensureHumanSubmission } from "@/lib/intake/guards";
import { waitlistSignupSchema } from "@/lib/validation/waitlist-signup";
import { submitWaitlistSignup } from "@/lib/waitlist/submit-waitlist";

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
    const result = await submitWaitlistSignup({
      email: parsed.data.email,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get("user-agent") ?? "",
    });

    return NextResponse.json({ ok: true, mode: result.mode });
  } catch (error) {
    console.error("[zynapse:waitlist]", error);

    return NextResponse.json(
      { error: "Dein Eintrag konnte gerade nicht gespeichert werden. Versuch es bitte noch einmal." },
      { status: 500 },
    );
  }
}
