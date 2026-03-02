import { ButtonLink } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { buildMetadata } from "@/lib/seo";
import { brandBenefits } from "@/lib/content/site";

export const metadata = buildMetadata({
  title: "Für Marken | Zynapse",
  description:
    "Für Marken- und Growth-Teams, die Creative planbarer produzieren, sauber freigeben und schneller testen wollen.",
  path: "/brands",
});

const brandSections = [
  {
    title: "Planbare Produktion",
    copy: "Vom ersten Briefing bis zur finalen Freigabe bleibt sichtbar, was als Nächstes entsteht, wer entscheiden muss und welche Deliverables daraus folgen.",
  },
  {
    title: "Mehr testbare Creatives",
    copy: "Die relevante Einheit ist nicht das Einzelvideo, sondern das Kampagnen-Pack mit Hooks, Angles, CTA-Varianten und Formaten.",
  },
  {
    title: "Klare Verantwortlichkeiten",
    copy: "Team, Manager und Studio greifen sauber ineinander, statt sich gegenseitig zu blockieren oder Aufgaben doppelt zu tragen.",
  },
];

export default function BrandsPage() {
  return (
    <>
      <PageHero
        label="Für Marken"
        title="Kampagnenproduktion, die sich im Team sauber steuern lässt."
        description="Zynapse ist für Marken- und Growth-Teams gebaut, die Creative schneller testen wollen, ohne sich in Briefings, Freigaben und Produktionsschleifen zu verlieren. Das Team gibt Richtung und Freigaben vor, der operative Weg bleibt klar."
        badges={["Planbare Produktion", "Freigabe vor Export", "Manager-geführte Strategie"]}
      />
      <section className="mx-auto grid w-full max-w-7xl gap-5 px-6 py-10 sm:px-8 lg:grid-cols-3 lg:px-10">
        {brandSections.map((section) => (
          <article key={section.title} className="section-card rounded-[1.8rem] p-6">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.05em]">
              {section.title}
            </h2>
            <p className="mt-4 text-[color:var(--copy-muted)]">{section.copy}</p>
          </article>
        ))}
      </section>
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-10 sm:px-8 lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] lg:px-10">
        <div className="space-y-4">
          <span className="eyebrow">Marken-Leitfaden</span>
          <h2 className="font-display text-4xl leading-[0.95] font-semibold tracking-[-0.05em]">
            Was das Team vorgibt. Was es zurückbekommt.
          </h2>
          <p className="text-[color:var(--copy-muted)]">
            Das Team liefert Ziel, Produkt, Stil, Budget und Freigaben. Zynapse
            übersetzt das in einen Produktionsfluss, der schneller testbar und
            besser reviewbar ist.
          </p>
        </div>
        <div className="section-card rounded-[2rem] p-7">
          <ul className="grid gap-4">
            {brandBenefits.map((item) => (
              <li
                key={item}
                className="rounded-[1.4rem] border border-[color:var(--line)] bg-white/[0.04] px-4 py-4 text-sm"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-12 sm:px-8 lg:px-10">
        <div>
          <p className="font-display text-3xl font-semibold tracking-[-0.05em]">
            Bereit für eine erste Marken-Anfrage?
          </p>
          <p className="mt-2 text-[color:var(--copy-muted)]">
            Der Anfrage-Flow braucht nur wenige Minuten und hält Rollen, Kontext
            und Freigaben von Anfang an sauber.
          </p>
        </div>
        <ButtonLink href="/request" size="lg">
          Marken-Anfrage starten
        </ButtonLink>
      </section>
    </>
  );
}
