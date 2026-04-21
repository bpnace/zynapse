import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

type WorkspaceRoutePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
  checkpoints?: string[];
  ctaHref?: string;
  ctaLabel?: string;
};

export function WorkspaceRoutePlaceholder({
  eyebrow,
  title,
  description,
  checkpoints = [],
  ctaHref,
  ctaLabel = "Zur Übersicht",
}: WorkspaceRoutePlaceholderProps) {
  return (
    <section className="workspace-panel overflow-hidden p-6 sm:p-7">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.7fr)_minmax(18rem,0.3fr)]">
        <div className="space-y-4">
          <span className="workspace-section-label">{eyebrow}</span>
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)] sm:text-4xl">
              {title}
            </h1>
            <p className="max-w-3xl text-[0.98rem] leading-7 text-[var(--workspace-copy-muted)]">
              {description}
            </p>
          </div>
        </div>

        <div className="workspace-panel-muted p-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="workspace-section-label">Phase 1 focus</p>
              <p className="text-sm leading-6 text-[var(--workspace-copy-muted)]">
                This route is now scaffolded so navigation, shell identity, and protected-path
                wiring are in place before the deeper workflow screens land.
              </p>
            </div>

            {checkpoints.length > 0 ? (
              <ul className="space-y-2">
                {checkpoints.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm leading-6 text-[var(--workspace-copy-strong)]"
                  >
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[var(--workspace-accent)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            {ctaHref ? (
              <div className="pt-2">
                <ButtonLink href={ctaHref} variant="secondary">
                  {ctaLabel}
                </ButtonLink>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
