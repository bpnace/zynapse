import { NextResponse } from "next/server";
import { ensureHumanSubmission } from "@/lib/intake/guards";
import { submitManagerApplication } from "@/lib/intake/submit-manager";
import { managerApplicationSchema } from "@/lib/validation/manager-application";

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = managerApplicationSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Ungültige Manager-Bewerbung.",
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
    const result = await submitManagerApplication(parsed.data);

    return NextResponse.json({ ok: true, mode: result.mode });
  } catch (error) {
    console.error("[zynapse:manager-intake]", error);

    return NextResponse.json(
      { error: "Die Bewerbung konnte aktuell nicht übergeben werden." },
      { status: 500 },
    );
  }
}
