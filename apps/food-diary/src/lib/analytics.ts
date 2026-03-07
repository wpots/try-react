import { COOKIE_CONSENT_EVENT, COOKIE_CONSENT_KEY } from "@repo/ui";

import type { CookieConsent } from "@repo/ui";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export { COOKIE_CONSENT_EVENT, COOKIE_CONSENT_KEY };

export function getStoredCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedConsent = window.localStorage.getItem(COOKIE_CONSENT_KEY);

  if (storedConsent === "granted" || storedConsent === "denied") {
    return storedConsent;
  }

  return null;
}

export function updateAnalyticsConsent(consent: CookieConsent): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("consent", "update", {
    analytics_storage: consent,
  });
}
