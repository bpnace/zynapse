import { ButtonLink } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { buildMetadata } from "@/lib/seo";
import { brandBenefits } from "@/lib/content/site";

export const metadata = buildMetadata({
  title: "Für Brands | Zynapse",
  description:
    "Für Brands, die aus einem Brief planbaren Video-Output mit klarer Rollenverteilung und weniger Agentur-Overhead machen wollen.",
  path: "/brands",
});

const brandSections = [
  {
    title: "Planbare Produktion",
    copy: "Vom ersten Brief bis zur finalen Freigabe bleibt sichtbar, was als Nächstes entsteht und wo Entscheidungen wirklich gebraucht werden.",
  },
  {
    title: "Performance-orientierte Creatives",
    copy: "Die Einheit ist nicht das Einzelvideo, sondern das Kampagnen-Pack: Hooks, Angles, CTA-Varianten und Formate.",
  },
  {
    title: "Klare Verantwortlichkeiten",
    copy: "Brand, Manager und Studio greifen ineinander, statt sich gegenseitig zu blockieren oder Aufgaben doppelt zu tragen.",
  },
];

export default function BrandsPage() {
  return (
    <>
      <PageHero
        label="Für Brands"
        title="Kampagnenproduktion ohne unplanbares Agenturgefühl."
        description="Zynapse ist für Teams gebaut, die weniger Abstimmungschaos und mehr testbaren Creative-Output wollen. Du gibst Kontext und Freigaben, nicht operative Detailsteuerung."
        badges={["Planbare Produktion", "Review before export", "Manager-led strategy"]}
      />
      <section className="mx-auto grid w-full max-w-6xl gap-5 px-6 py-10 sm:px-8 lg:grid-cols-3 lg:px-10">
        {brandSections.map((section) => (
          <article key={section.title} className="section-card rounded-[1.8rem] p-6">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.05em]">
              {section.title}
            </h2>
            <p className="mt-4 text-[color:var(--copy-muted)]">{section.copy}</p>
          </article>
        ))}
      </section>
      <section className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 sm:px-8 lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] lg:px-10">
        <div className="space-y-4">
          <span className="eyebrow">Brand playbook</span>
          <h2 className="font-display text-4xl leading-[0.95] font-semibold tracking-[-0.05em]">
            Was du lieferst, was du zurückbekommst.
          </h2>
          <p className="text-[color:var(--copy-muted)]">
            Die Brand liefert Ziel, Produkt, Stil, Budget und finale Freigaben.
            Zynapse übersetzt das in eine operative Produktionsspur.
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
      <section className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-12 sm:px-8 lg:px-10">
        <div>
          <p className="font-display text-3xl font-semibold tracking-[-0.05em]">
            Bereit für einen ersten Kampagnen-Request?
          </p>
          <p className="mt-2 text-[color:var(--copy-muted)]">
            Der Wizard braucht nur wenige Minuten und hält die Rollen von Anfang an sauber.
          </p>
        </div>
        <ButtonLink href="/request" size="lg">
          Brand Intake starten
        </ButtonLink>
      </section>
    </>
  );
}
