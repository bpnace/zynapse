import { CreativeApplicationForm } from "@/components/forms/creative-application/creative-application-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Bewerbung für Kreative | Zynapse",
  description:
    "Qualifizierungsflow für Kreative mit AI-Fokus, Cases, Rollenprofil und echter Kampagnenerfahrung.",
  path: "/apply",
  indexable: false,
});

export default function ApplyPage() {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pt-15 pb-16 sm:px-8 lg:px-10">
      <div className="space-y-5">
        <h1 className="font-display text-5xl leading-[0.92] font-semibold tracking-[-0.06em] sm:text-6xl">
          Bewirb dich für den Track für Kreative, wenn du Ideen in testbare Kampagnen übersetzen kannst.
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-[color:var(--copy-muted)]">
          Uns interessieren Prompt-Kompetenz, Kreativ-Systemdenken und echte
          AI-Produktionspraxis. Nicht generische Kontaktdaten ohne Substanz.
        </p>
      </div>
      <CreativeApplicationForm />
    </section>
  );
}
