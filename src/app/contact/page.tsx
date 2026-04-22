import Image from "next/image";
import { Suspense } from "react";
import { PageMotion } from "@/components/animation/page-motion";
import { JsonLdScript } from "@/components/seo/json-ld";
import { ContactIntakeForm } from "@/components/forms/contact/contact-intake-form";
import { ButtonLink } from "@/components/ui/button";
import { contactChannels } from "@/lib/content/site";
import { buildBreadcrumbs, buildMetadata, buildPageJsonLd } from "@/lib/seo";

const pageSeo = {
  title: "Kontakt | Zynapse",
  description:
    "Schreib uns direkt bei Fragen zu Brands, Preisen oder operativen Themen. Du landest ohne Umwege beim richtigen Kontakt.",
  path: "/contact",
} as const;

export const metadata = buildMetadata(pageSeo);

export default function ContactPage() {
  const contactJsonLd = buildPageJsonLd({
    ...pageSeo,
    pageType: "ContactPage",
    breadcrumbs: buildBreadcrumbs("Kontakt", pageSeo.path),
  });

  return (
    <>
      <JsonLdScript data={contactJsonLd} />
      <PageMotion>
      <section
        className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pt-15 pb-14 sm:px-8 lg:px-10"
        data-reveal-section
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.68fr)_minmax(0,0.32fr)] lg:items-start">
          <div className="space-y-6">
            <h1
              className="font-display text-5xl leading-[0.92] font-semibold tracking-[-0.06em] text-balance sm:text-6xl"
              data-animate-heading
            >
              Schreib uns. Wir melden uns{" "}
              <span className="title-accent">schnell zurück</span>.
            </h1>
            <p
              className="max-w-4xl text-lg leading-8 text-[color:var(--copy-body)]"
              data-animate-copy
            >
              Egal ob du eine Kampagne anfragen willst, wissen möchtest, welcher
              Creative Flow gerade passt, oder ein operatives Thema klären
              musst: Deine Nachricht landet direkt beim richtigen Kontakt. Du
              musst nichts perfekt vorbereiten, ein paar klare Sätze reichen.
            </p>
            <div className="flex flex-wrap gap-3" data-animate-item>
              <ButtonLink href="/contact#kontaktformular" size="lg">
                Nachricht schicken
              </ButtonLink>
              <ButtonLink href="/pricing" variant="secondary" size="lg">
                Preise ansehen
              </ButtonLink>
            </div>
          </div>
          <div className="hidden lg:flex lg:absolute lg:top-15 lg:right-12 lg:z-10">
            <div className="relative h-[20rem] w-[16rem] sm:h-[24rem] sm:w-[18rem] lg:h-[20rem] lg:w-[23rem]">
              <Image
                src="/brand/peep-sitting-2.png"
                alt="Illustration einer sitzenden Person"
                fill
                className="object-contain object-top"
                sizes="(min-width: 1024px) 23rem, (min-width: 640px) 18rem, 16rem"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section
        className="mx-auto w-full max-w-7xl px-6 pt-2 pb-16 sm:px-8 lg:px-10"
        data-reveal-section
      >
        <Suspense fallback={<ContactFormFallback />}>
          <ContactIntakeForm />
        </Suspense>
      </section>
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
      </PageMotion>
    </>
  );
}

function ContactFormFallback() {
  return (
    <div className="section-card section-surface-paper rounded-[calc(var(--radius-panel)+0.1rem)] border-[rgba(56,67,84,0.16)] p-6 sm:p-8">
      <span className="eyebrow">Kontaktformular</span>
      <p className="mt-3 text-sm leading-6 text-[color:var(--copy-body)]">
        Formular lädt gerade. Dauert nur einen Moment.
      </p>
    </div>
  );
}
