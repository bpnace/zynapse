import { PageHero } from "@/components/ui/page-hero";
import { buildMetadata } from "@/lib/seo";
import { caseStudies } from "@/lib/content/cases";

export const metadata = buildMetadata({
  title: "Referenzen | Zynapse",
  description:
    "Beispielhafte Referenzen und eine strukturierte Bibliothek für Kampagnen-Outputs.",
  path: "/cases",
});

export default function CasesPage() {
  return (
    <>
      <PageHero
        label="Referenzen"
        title="Fertige Strukturen für spätere echte Performance-Referenzen."
        description="Die v1 startet mit realistischen Platzhaltern, aber die Informationsarchitektur ist bereits auf echte Referenzen ausgelegt: Herausforderung, Ergebnis, Kennzahlen und Kampagnen-Pack."
        badges={["Herausforderung", "Ergebnis", "Kennzahlen"]}
      />
      <section className="mx-auto grid w-full max-w-7xl gap-5 px-6 py-10 sm:px-8 lg:grid-cols-3 lg:px-10">
        {caseStudies.map((entry) => (
          <article key={entry.slug} className="section-card rounded-[1.9rem] p-6">
            <p className="font-mono text-xs tracking-[0.18em] uppercase text-[var(--gold)]">
              {entry.brand} · {entry.sector}
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.05em]">
              {entry.summary}
            </h2>
            <p className="mt-4 text-sm text-[color:var(--copy-muted)]">
              {entry.challenge}
            </p>
            <p className="mt-4 text-sm text-[color:var(--foreground)]">
              {entry.outcome}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {entry.metrics.map((metric) => (
                <span
                  key={metric}
                  className="rounded-full border border-[color:var(--line)] px-3 py-1 text-xs uppercase tracking-[0.16em] text-[var(--copy-muted)]"
                >
                  {metric}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
