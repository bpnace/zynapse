import { ButtonLink } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { buildMetadata } from "@/lib/seo";
import { managerBenefits } from "@/lib/content/site";

export const metadata = buildMetadata({
  title: "Für Social Media Manager | Zynapse",
  description:
    "Für Social Media Manager, die Kampagnenlogik als Kernleistung verkaufen und Output skalieren wollen, ohne im Operativen zu verschwinden.",
  path: "/managers",
});

const managerSections = [
  {
    title: "Strategie bleibt sichtbar",
    copy: "Dein Wert verschwindet nicht im Tagesgeschäft. Kampagnenplanung, Hooks und Testing-Logik bleiben als bezahlte Kernleistung sichtbar.",
  },
  {
    title: "Planbare Erlöse",
    copy: "Statt Projektfeuerwehr entsteht ein laufender Prozess mit klaren Deliverables pro Kunde, Kampagne oder Monat.",
  },
  {
    title: "Weniger Creator-Chaos",
    copy: "Kein endloses Hinterherlaufen bei Assets, Briefings und Varianten. Das Studio übernimmt die operative Skalierung.",
  },
];

export default function ManagersPage() {
  return (
    <>
      <PageHero
        label="Für Manager"
        title="Du führst die Kampagnenlogik. Nicht das Produktionschaos."
        description="Zynapse richtet sich an Social Media Manager und Strategen, die ihren Wert über Kampagnenlogik, Messaging und Testing beweisen wollen, ohne im Operativen zu verschwinden."
        badges={["Planbare Erlöse", "Kampagnen-Packs", "Kein Creator-Chaos"]}
      />
      <section className="mx-auto grid w-full max-w-7xl gap-5 px-6 py-10 sm:px-8 lg:grid-cols-3 lg:px-10">
        {managerSections.map((section) => (
          <article key={section.title} className="section-card rounded-[1.8rem] p-6">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.05em]">
              {section.title}
            </h2>
            <p className="mt-4 text-[color:var(--copy-muted)]">{section.copy}</p>
          </article>
        ))}
      </section>
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-10 sm:px-8 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:px-10">
        <div className="space-y-4">
          <span className="eyebrow">Manager-Profil</span>
          <h2 className="font-display text-4xl leading-[0.95] font-semibold tracking-[-0.05em]">
            Für wen Zynapse wirklich passt.
          </h2>
          <p className="text-[color:var(--copy-muted)]">
            Wenn du Messaging, Testing und Kampagnenstruktur sicher führen kannst,
            aber nicht mehr jede Produktionsschleife selbst tragen willst, passt
            dieses Modell.
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
      <section className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-12 sm:px-8 lg:px-10">
        <div>
          <p className="font-display text-3xl font-semibold tracking-[-0.05em]">
            Bewirb dich für den Manager-Track.
          </p>
          <p className="mt-2 text-[color:var(--copy-muted)]">
            Zeig Portfolio, Fokuskanäle und Cases. Der Flow ist auf echte
            Qualifizierung gebaut, nicht auf generische Leads.
          </p>
        </div>
        <ButtonLink href="/apply" size="lg">
          Bewerbung starten
        </ButtonLink>
      </section>
    </>
  );
}
