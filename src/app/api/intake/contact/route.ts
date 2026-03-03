import { NextResponse } from "next/server";
import { ensureHumanSubmission } from "@/lib/intake/guards";
import { submitContactInquiry } from "@/lib/intake/submit-contact";
import { contactInquirySchema } from "@/lib/validation/contact-inquiry";

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = contactInquirySchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Ungültige Kontakt-Anfrage.",
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
    const result = await submitContactInquiry(parsed.data);

    return NextResponse.json({ ok: true, mode: result.mode });
  } catch (error) {
    console.error("[zynapse:contact-intake]", error);

    return NextResponse.json(
      { error: "Die Kontakt-Anfrage konnte aktuell nicht übergeben werden." },
      { status: 500 },
    );
  }
}
