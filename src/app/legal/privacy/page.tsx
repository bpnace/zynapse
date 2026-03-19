import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Datenschutz | Zynapse",
  description: "Datenschutzhinweise für Zynapse v1.",
  path: "/legal/privacy",
});

export default function PrivacyPage() {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 pt-32 pb-16 sm:px-8">
      <span className="eyebrow">Datenschutz</span>
      <h1 className="font-display text-5xl leading-[0.92] font-semibold tracking-[-0.06em]">
        Minimierte Datenerhebung, klarer Intake-Zweck
      </h1>
      <div className="section-card rounded-[2rem] p-8 text-[color:var(--copy-muted)]">
        <p>
          Zynapse v1 erhebt nur die Daten, die für Brand-Intake und Kreative-Qualifizierung
          notwendig sind. Vor dem Launch müssen Datenempfänger, Hosting-Orte,
          Speicherdauer und Rechtsgrundlagen final ergänzt und juristisch geprüft
          werden.
        </p>
      </div>
    </section>
  );
}
