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
      className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 lg:px-10"
      data-reveal-section
      data-stagger="dense"
    >
      <div className="section-card overflow-hidden rounded-[2.2rem] p-7 sm:p-9">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)]">
          <div className="space-y-5">
            <span className="eyebrow" data-animate-heading>
              Final CTA
            </span>
            <h2
              className="font-display text-4xl leading-[0.92] font-semibold tracking-[-0.06em] sm:text-5xl"
              data-animate-heading
            >
              Start mit einem kompakten Brief. Den Rest baut das System.
            </h2>
            <p
              className="max-w-xl text-base leading-7 text-[color:var(--copy-muted)] sm:text-lg sm:leading-8"
              data-animate-copy
            >
              Ein Satz, ein klarer CTA und nur die fünf wichtigsten Felder. Danach
              übernimmt der vollständige Wizard mit Review, Kontaktangaben und
              finaler Übergabe.
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="grid gap-4 md:grid-cols-2"
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
                placeholder="Awareness oder Conversion"
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
              <span className="field-label">Budget Range</span>
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
                placeholder="z. B. 3k bis 8k pro Monat"
              />
            </label>
            <button
              type="submit"
              className={`${buttonStyles({ size: "lg" })} md:col-span-2`}
            >
              Kampagne anfragen
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
