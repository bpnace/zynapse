import { BoldZynapseCore } from "@/components/ui/bold-zynapse-core";
import type { MarketingFaqItem } from "@/lib/content/faq";
import { marketingFaqItems } from "@/lib/content/faq";
import { cn } from "@/lib/utils";

type MarketingFaqProps = {
  items?: readonly MarketingFaqItem[];
  eyebrow?: string;
  title?: React.ReactNode;
  copy?: React.ReactNode;
  className?: string;
};

export function MarketingFaq({
  items = marketingFaqItems,
  eyebrow = "FAQ",
  title = "Häufige Fragen zu Zynapse Core.",
  copy = "Die wichtigsten Entscheidungen vor einem Creative Sprint: Hook, Zielgruppe, Variantenlogik und Übergabe an Media.",
  className,
}: MarketingFaqProps) {
  return (
    <div
      className={cn("border-t border-[rgba(56,67,84,0.14)] pt-10", className)}
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.36fr)_minmax(0,0.64fr)] lg:items-start">
        <div className="space-y-4">
          <p
            className="font-mono text-[10px] tracking-[0.16em] text-[var(--copy-soft)] uppercase"
            data-animate-heading
          >
            {eyebrow}
          </p>
          <h2
            className="max-w-3xl font-display text-3xl leading-[1] font-semibold tracking-[-0.05em] text-balance text-[var(--copy-strong)] sm:text-[3.1rem]"
            data-animate-heading
          >
            {title}
          </h2>
          <p
            className="max-w-2xl text-base leading-7 text-[color:var(--copy-body)]"
            data-animate-copy
          >
            {typeof copy === "string" ? <BoldZynapseCore>{copy}</BoldZynapseCore> : copy}
          </p>
        </div>

        <div
          className="grid overflow-hidden rounded-[0.55rem] border border-[rgba(56,67,84,0.16)] bg-white shadow-[0_14px_28px_rgba(31,36,48,0.05)]"
          data-animate-item
        >
          {items.map((item, index) => (
            <article
              key={item.question}
              className={cn(
                "grid grid-cols-[2.75rem_minmax(0,1fr)] gap-4 px-5 py-5 sm:px-6",
                index > 0 && "border-t border-[rgba(56,67,84,0.12)]",
              )}
            >
              <span className="font-mono text-[10px] tracking-[0.16em] text-[var(--accent-soft)] uppercase">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-[1.35rem] leading-[1.05] font-semibold tracking-[-0.04em] text-balance text-[var(--copy-strong)]">
                  {item.question}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[color:var(--copy-body)]">
                  <BoldZynapseCore>{item.answer}</BoldZynapseCore>
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
