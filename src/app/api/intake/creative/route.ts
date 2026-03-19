import { NextResponse } from "next/server";
import { ensureHumanSubmission } from "@/lib/intake/guards";
import { submitCreativeApplication } from "@/lib/intake/submit-creative";
import { creativeApplicationSchema } from "@/lib/validation/creative-application";

function resolveRequestOrigin(request: Request) {
  return request.headers.get("origin") ?? new URL(request.url).origin;
}

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = creativeApplicationSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Ungültige Bewerbung für Kreative.",
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
    const result = await submitCreativeApplication(
      parsed.data,
      resolveRequestOrigin(request),
    );

    return NextResponse.json({ ok: true, mode: result.mode });
  } catch (error) {
    console.error("[zynapse:creative-intake]", error);

    return NextResponse.json(
      { error: "Die Bewerbung konnte aktuell nicht übergeben werden." },
      { status: 500 },
    );
  }
}
