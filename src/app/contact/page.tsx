import { PageHero } from "@/components/ui/page-hero";
import { buildMetadata } from "@/lib/seo";
import { contactChannels } from "@/lib/content/site";

export const metadata = buildMetadata({
  title: "Kontakt | Zynapse",
  description:
    "Direkte Kontaktwege für Vertrieb, Manager-Netzwerk und operative Fragen.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        label="Kontakt"
        title="Drei direkte Kontaktwege statt eines allgemeinen Sammelpostfachs."
        description="Vertrieb, Manager-Netzwerk und Betrieb sind getrennt, damit Marken-Anfragen, Bewerbungen und operative Fragen nicht im selben Kanal landen."
        badges={["Vertrieb", "Netzwerk", "Betrieb"]}
      />
      <section className="mx-auto grid w-full max-w-7xl gap-5 px-6 py-10 sm:px-8 lg:grid-cols-3 lg:px-10">
        {contactChannels.map((channel) => (
          <article key={channel.label} className="section-card rounded-[1.9rem] p-6">
            <p className="font-mono text-xs tracking-[0.18em] uppercase text-[var(--accent-soft)]">
              {channel.label}
            </p>
            <h2 className="mt-4 font-display text-2xl font-semibold">{channel.value}</h2>
            <p className="mt-4 text-[color:var(--copy-muted)]">{channel.copy}</p>
          </article>
        ))}
      </section>
    </>
  );
}
