import { ContactIntakeForm } from "@/components/forms/contact/contact-intake-form";
import { PageHero } from "@/components/ui/page-hero";
import { buildMetadata } from "@/lib/seo";
import { contactChannels } from "@/lib/content/site";
import { Suspense } from "react";

export const metadata = buildMetadata({
  title: "Kontakt | Zynapse",
  description:
    "Direkte Kontaktwege für Vertrieb, Netzwerk für Kreative und operative Fragen.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        label="Kontakt"
        title="Vertrieb, Netzwerk oder operative Fragen – jeder Kontaktweg hat einen klaren Zweck."
        description="Für Brand-Anfragen, Paketfragen und Erstgespräche nutzt du den Vertrieb. Für den Track für Kreative nutzt du das Netzwerk. Für alles Operative den direkten Betriebskanal."
        badges={["Vertrieb", "Formular", "Betrieb"]}
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
      <section className="mx-auto w-full max-w-7xl px-6 pt-2 pb-16 sm:px-8 lg:px-10">
        <Suspense fallback={<ContactFormFallback />}>
          <ContactIntakeForm />
        </Suspense>
      </section>
    </>
  );
}

function ContactFormFallback() {
  return (
    <div className="section-card section-surface-paper rounded-[calc(var(--radius-panel)+0.1rem)] border-[rgba(56,67,84,0.16)] p-6 sm:p-8">
      <span className="eyebrow">Kontaktformular</span>
      <p className="mt-3 text-sm leading-6 text-[color:var(--copy-body)]">
        Formular wird geladen...
      </p>
    </div>
  );
}
