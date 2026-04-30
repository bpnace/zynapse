import {
  Children,
  Fragment,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { renderBoldZynapseCore } from "@/components/ui/bold-zynapse-core";
import { cn } from "@/lib/utils";

type ElementWithChildren = ReactElement<{
  children?: ReactNode;
  className?: unknown;
  "data-animate-word"?: unknown;
}>;

function hasGradientTextClass(className: unknown) {
  return (
    typeof className === "string" &&
    /\b(text-gradient|title-accent|title-accent-soft)\b/.test(className)
  );
}

function splitAnimatedWords(text: string, keyPrefix: string) {
  const parts = text.match(/(\s+|[^\s]+)/g) ?? [];

  return parts.map((part, index) => {
    if (/^\s+$/.test(part)) {
      return part;
    }

    return (
      <span key={`${keyPrefix}-${index}`} data-animate-word>
        {part}
      </span>
    );
  });
}

function renderAnimatedHeadingWords(node: ReactNode, keyPrefix = "heading"): ReactNode {
  if (typeof node === "string") {
    return splitAnimatedWords(node, keyPrefix);
  }

  return Children.map(node, (child, index) => {
    if (typeof child === "string") {
      return splitAnimatedWords(child, `${keyPrefix}-${index}`);
    }

    if (!isValidElement(child)) {
      return child;
    }

    const element = child as ElementWithChildren;
    const children = element.props.children;

    if (hasGradientTextClass(element.props.className)) {
      return cloneElement(element, {
        "data-animate-word": true,
        children,
      });
    }

    if (element.type === Fragment) {
      return (
        <Fragment key={`${keyPrefix}-fragment-${index}`}>
          {renderAnimatedHeadingWords(children, `${keyPrefix}-${index}`)}
        </Fragment>
      );
    }

    if (children === undefined) {
      return child;
    }

    return cloneElement(element, {
      "data-animate-word": undefined,
      children: renderAnimatedHeadingWords(children, `${keyPrefix}-${index}`),
    });
  });
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "left",
  accent,
  headingClassName,
}: {
  eyebrow: string;
  title: React.ReactNode;
  copy: React.ReactNode;
  align?: "left" | "center";
  accent?: string;
  headingClassName?: string;
}) {
  const alignment = align === "center" ? "mx-auto text-center" : "";
  const accentIndex =
    typeof title === "string" && accent ? title.indexOf(accent) : -1;

  const titleContent =
    typeof title === "string" && accent && accentIndex >= 0 ? (
      <>
        {title.slice(0, accentIndex)}
        <span className="title-accent">{accent}</span>
        {title.slice(accentIndex + accent.length)}
      </>
    ) : typeof title === "string" ? (
      title
    ) : (
      title
    );

  return (
    <div className={`max-w-5xl space-y-4 ${alignment}`}>
      <span className="eyebrow" data-animate-heading>
        {renderBoldZynapseCore(eyebrow)}
      </span>
      <h2
        className={cn(
          "overflow-visible pb-[0.24em] pr-[0.08em] font-display text-3xl leading-[1.18] font-semibold tracking-[-0.045em] text-balance sm:text-[3.2rem]",
          headingClassName,
        )}
        data-animate-heading
      >
        {renderAnimatedHeadingWords(titleContent)}
      </h2>
      <p
        className="max-w-5xl text-base leading-7 text-[color:var(--copy-body)] sm:text-[1.0625rem]"
        data-animate-copy
      >
        {typeof copy === "string" ? renderBoldZynapseCore(copy) : copy}
      </p>
    </div>
  );
}
