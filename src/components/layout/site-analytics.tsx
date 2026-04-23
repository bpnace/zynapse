"use client";

import { useEffect, useState } from "react";

type CcmAcceptedEmbedding = {
  id?: string;
  name?: string;
};

type CcmRuntime = {
  acceptedEmbeddings?: CcmAcceptedEmbedding[];
  fullConsentGiven?: boolean;
};

declare global {
  interface Window {
    CCM?: CcmRuntime;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __zynapseAnalyticsInitialized?: boolean;
  }
}

function hasAnalyticsConsent(ccm: CcmRuntime | undefined) {
  const acceptedEmbeddings = Array.isArray(ccm?.acceptedEmbeddings)
    ? ccm.acceptedEmbeddings
    : [];

  return (
    acceptedEmbeddings.some(
      (entry) =>
        typeof entry?.name === "string" &&
        entry.name.toLowerCase().includes("google analytics"),
    ) || ccm?.fullConsentGiven === true
  );
}

export function SiteAnalytics({ analyticsId }: { analyticsId: string }) {
  const resolvedAnalyticsId = analyticsId.trim();
  const [consentGranted, setConsentGranted] = useState(false);

  useEffect(() => {
    if (!resolvedAnalyticsId) {
      return;
    }

    let isActive = true;

    const syncConsent = () => {
      if (!isActive) {
        return;
      }

      setConsentGranted(hasAnalyticsConsent(window.CCM));
    };

    syncConsent();

    const intervalId = window.setInterval(syncConsent, 1000);
    const handleFocus = () => syncConsent();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncConsent();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [resolvedAnalyticsId]);

  useEffect(() => {
    if (!resolvedAnalyticsId) {
      return;
    }

    const disableKey = `ga-disable-${resolvedAnalyticsId}`;
    (window as unknown as Record<string, unknown>)[disableKey] =
      !consentGranted;

    if (!consentGranted || window.__zynapseAnalyticsInitialized) {
      return;
    }

    window.dataLayer = window.dataLayer ?? [];
    window.gtag =
      window.gtag ??
      function gtag(...args: unknown[]) {
        window.dataLayer?.push(args);
      };

    window.gtag("js", new Date());
    window.gtag("config", resolvedAnalyticsId);

    const analyticsScript = document.createElement("script");
    analyticsScript.id = "zynapse-analytics-loader";
    analyticsScript.async = true;
    analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
      resolvedAnalyticsId,
    )}`;
    document.head.appendChild(analyticsScript);

    window.__zynapseAnalyticsInitialized = true;
  }, [consentGranted, resolvedAnalyticsId]);

  return null;
}
