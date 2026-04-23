"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type SiteNavLinkProps = LinkProps & {
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
};

export function SiteNavLink({
  href,
  children,
  className,
  onNavigate,
  ...props
}: SiteNavLinkProps) {
  const pathname = usePathname();
  const hrefValue = typeof href === "string" ? href : href.toString();
  const isSectionLink = hrefValue.startsWith("/#");
  const sectionId = isSectionLink ? hrefValue.slice(2) : null;

  return (
    <Link
      href={href}
      className={className}
      onClick={(event) => {
        if (isSectionLink && pathname === "/" && sectionId) {
          event.preventDefault();

          const target = document.getElementById(sectionId);
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            window.history.replaceState(null, "", `/#${sectionId}`);
          }
        }

        onNavigate?.();
      }}
      {...props}
    >
      {children}
    </Link>
  );
}
