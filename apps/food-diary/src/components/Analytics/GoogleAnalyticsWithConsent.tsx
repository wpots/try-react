"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { useEffect, useState } from "react";

import { COOKIE_CONSENT_EVENT, getStoredCookieConsent, updateAnalyticsConsent } from "@/lib/analytics";

import type { CookieConsent } from "@repo/ui";

function getGaId(): string | null {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!gaId || gaId.trim().length === 0) {
    return null;
  }

  return gaId;
}

export function GoogleAnalyticsWithConsent(): React.JSX.Element | null {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const gaId = getGaId();

  useEffect(() => {
    setConsent(getStoredCookieConsent());

    const handleConsentChange = (event: Event): void => {
      const customEvent = event as CustomEvent<{ value?: CookieConsent }>;
      const nextConsent = customEvent.detail?.value;

      if (nextConsent === "granted" || nextConsent === "denied") {
        setConsent(nextConsent);
        return;
      }

      setConsent(getStoredCookieConsent());
    };

    const handleStorage = (event: StorageEvent): void => {
      if (event.key === null || event.key === "cookie_consent") {
        setConsent(getStoredCookieConsent());
      }
    };

    globalThis.addEventListener(COOKIE_CONSENT_EVENT, handleConsentChange as EventListener);
    globalThis.addEventListener("storage", handleStorage);

    return () => {
      globalThis.removeEventListener(COOKIE_CONSENT_EVENT, handleConsentChange as EventListener);
      globalThis.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    if (!consent) {
      return;
    }

    updateAnalyticsConsent(consent);
  }, [consent]);

  if (!gaId || consent !== "granted") {
    return null;
  }

  return <GoogleAnalytics gaId={gaId} />;
}
