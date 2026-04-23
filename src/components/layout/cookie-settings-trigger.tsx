"use client";

import type { ReactNode } from "react";

type CookieSettingsTriggerProps = {
  children: ReactNode;
  className?: string;
};

export function CookieSettingsTrigger({
  children,
  className,
}: CookieSettingsTriggerProps) {
  const handleClick = () => {
    if (typeof window === "undefined") {
      return;
    }

    const ccm = (
      window as Window & { CCM?: { openControlPanel?: () => void } }
    ).CCM;

    if (typeof ccm?.openControlPanel === "function") {
      ccm.openControlPanel();
      return;
    }

    const fallbackTrigger = Array.from(
      document.querySelectorAll<HTMLButtonElement>("button"),
    ).find(
      (button) =>
        button.getAttribute("aria-label") === "Cookie-Zustimmung ändern" ||
        button.textContent?.includes("Cookie-Zustimmung ändern"),
    );

    fallbackTrigger?.click();
  };

  return (
    <button type="button" className={className} onClick={handleClick}>
      {children}
    </button>
  );
}
