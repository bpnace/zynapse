"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BRAND_INQUIRY_STORAGE_KEY, createBrandInquiryDefaults } from "@/lib/forms/storage";
import { buttonStyles } from "@/components/ui/button";

const initialFields = createBrandInquiryDefaults();

export function FinalCta() {
  const router = useRouter();
  const [values, setValues] = useState({
    industry: initialFields.industry,
    productUrl: initialFields.productUrl,
    goal: initialFields.goal,
    channel: initialFields.channel,
    budgetRange: initialFields.budgetRange,
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    window.localStorage.setItem(
      BRAND_INQUIRY_STORAGE_KEY,
      JSON.stringify(
        createBrandInquiryDefaults({
          ...values,
          startedAt: Date.now(),
        }),
      ),
    );

    router.push("/request");
  }

  return (
    <section
      className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 lg:px-10"
      data-reveal-section
      data-stagger="dense"
    >
      <div className="section-card section-surface-warm overflow-hidden rounded-[calc(var(--radius-panel)+0.1rem)] border-[rgba(191,106,83,0.16)] p-7 shadow-[0_24px_54px_rgba(31,36,48,0.1)] sm:p-9">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)]">
          <div className="space-y-5">
            <span className="eyebrow" data-animate-heading>
              Jetzt starten
            </span>
            <h2
              className="font-display text-4xl leading-[0.92] font-semibold tracking-[-0.06em] text-[var(--copy-strong)] sm:text-5xl"
              data-animate-heading
            >
              Der <span data-animate-word>Einstieg</span> beginnt mit einem{" "}
              <span className="title-accent">kompakten Briefing</span>. Nicht mit
              einem langen Setup-Call.
            </h2>
            <p
              className="max-w-xl text-base leading-7 text-[color:var(--copy-body)] sm:text-[1.0625rem]"
              data-animate-copy
            >
              Fünf Felder reichen für den Start. Danach übernimmt der vollständige
              Anfrage-Flow mit Kontext, Review und Übergabe in die Kampagnenplanung.
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="section-surface-paper grid gap-4 rounded-[var(--radius-card)] border border-[rgba(56,67,84,0.14)] p-5 md:grid-cols-2 md:p-6"
            data-animate-item
          >
            <label className="field-shell">
              <span className="field-label">Branche</span>
              <input
                required
                className="field-input"
                value={values.industry}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    industry: event.target.value,
                  }))
                }
                placeholder="z. B. D2C Wellness"
              />
            </label>
            <label className="field-shell">
              <span className="field-label">Produktlink</span>
              <input
                required
                className="field-input"
                value={values.productUrl}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    productUrl: event.target.value,
                  }))
                }
                placeholder="https://"
              />
            </label>
            <label className="field-shell">
              <span className="field-label">Ziel</span>
              <input
                required
                className="field-input"
                value={values.goal}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    goal: event.target.value,
                  }))
                }
                placeholder="z. B. Launch, Testing, Conversion"
              />
            </label>
            <label className="field-shell">
              <span className="field-label">Kanal</span>
              <input
                required
                className="field-input"
                value={values.channel}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    channel: event.target.value,
                  }))
                }
                placeholder="TikTok, Reels, Shorts"
              />
            </label>
            <label className="field-shell md:col-span-2">
              <span className="field-label">Budgetrahmen</span>
              <input
                required
                className="field-input"
                value={values.budgetRange}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    budgetRange: event.target.value,
                  }))
                }
                placeholder="z. B. 3.000 bis 8.000 Euro pro Monat"
              />
            </label>
            <button
              type="submit"
              className={`${buttonStyles({ size: "lg" })} md:col-span-2`}
            >
              Marken-Anfrage starten
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
