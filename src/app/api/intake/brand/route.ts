import { NextResponse } from "next/server";
import { ensureHumanSubmission } from "@/lib/intake/guards";
import { submitBrandInquiry } from "@/lib/intake/submit-brand";
import { brandInquirySchema } from "@/lib/validation/brand-inquiry";

function resolveRequestOrigin(request: Request) {
  return request.headers.get("origin") ?? new URL(request.url).origin;
}

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = brandInquirySchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Ungültige Brand-Anfrage.",
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
    const result = await submitBrandInquiry(
      parsed.data,
      {
        origin: resolveRequestOrigin(request),
        userAgent: request.headers.get("user-agent") ?? "",
      },
    );

    return NextResponse.json({ ok: true, mode: result.mode });
  } catch (error) {
    console.error("[zynapse:brand-intake]", error);

    return NextResponse.json(
      { error: "Die Anfrage konnte aktuell nicht übergeben werden." },
      { status: 500 },
    );
  }
}
