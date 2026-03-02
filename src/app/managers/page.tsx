import { ButtonLink } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { buildMetadata } from "@/lib/seo";
import { managerBenefits } from "@/lib/content/site";

export const metadata = buildMetadata({
  title: "Für Social Media Manager | Zynapse",
  description:
    "Für Social Media Manager, die Kampagnenlogik als Kernleistung anbieten und Output skalieren wollen, ohne Creator-Operations zu tragen.",
  path: "/managers",
});

const managerSections = [
  {
    title: "Strategie bleibt sichtbar",
    copy: "Dein Wert verschwindet nicht in Operative-Noise. Kampagnenplanung, Hooks und Testing-Logik bleiben als Premium-Leistung präsent.",
  },
  {
    title: "Wiederkehrende Revenue",
    copy: "Statt Projektchaos entsteht ein laufender Prozess mit klaren Deliverables pro Kunde oder Monat.",
  },
  {
    title: "Weniger Creator-Chaos",
    copy: "Kein endloses Koordinieren von Assets, Briefings und Variationen. Das Studio übernimmt die Skalierung.",
  },
];

export default function ManagersPage() {
  return (
    <>
      <PageHero
        label="Für Manager"
        title="Manager-led campaign logic statt unsichtbarer Operative."
        description="Zynapse richtet sich an Social Media Manager und Strategen, die Kunden über Kampagnenlogik führen wollen, ohne sich im Produktionsbetrieb zu verlieren."
        badges={["Recurring revenue", "Campaign packs", "No creator chaos"]}
      />
      <section className="mx-auto grid w-full max-w-6xl gap-5 px-6 py-10 sm:px-8 lg:grid-cols-3 lg:px-10">
        {managerSections.map((section) => (
          <article key={section.title} className="section-card rounded-[1.8rem] p-6">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.05em]">
              {section.title}
            </h2>
            <p className="mt-4 text-[color:var(--copy-muted)]">{section.copy}</p>
          </article>
        ))}
      </section>
      <section className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 sm:px-8 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:px-10">
        <div className="space-y-4">
          <span className="eyebrow">Manager fit</span>
          <h2 className="font-display text-4xl leading-[0.95] font-semibold tracking-[-0.05em]">
            Wofür Manager zu Zynapse passen.
          </h2>
          <p className="text-[color:var(--copy-muted)]">
            Wenn du Messaging, Testing und Kampagnenstruktur stark führen kannst,
            aber nicht mehr jede Produktionsschleife selbst tragen willst, passt
            das Modell.
          </p>
        </div>
        <div className="section-card rounded-[2rem] p-7">
          <ul className="grid gap-4">
            {managerBenefits.map((item) => (
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
            Bewerbe dich auf den Manager Track.
          </p>
          <p className="mt-2 text-[color:var(--copy-muted)]">
            Zeig Portfolio, Fokuskanäle und Cases. Der Flow ist auf Qualifizierung gebaut, nicht auf generische Leads.
          </p>
        </div>
        <ButtonLink href="/apply" size="lg">
          Bewerbung starten
        </ButtonLink>
      </section>
    </>
  );
}
