import { COOKIE_CONSENT_KEY } from "@repo/ui";

import type { CookieConsent } from "@repo/ui";

type AnalyticsParamValue = boolean | number | string;
type AnalyticsParams = Record<string, AnalyticsParamValue | undefined>;

declare global {
  var gtag: ((...args: unknown[]) => void) | undefined;

  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export { COOKIE_CONSENT_EVENT, COOKIE_CONSENT_KEY } from "@repo/ui";

function getGaMeasurementId(): string | null {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!gaId || gaId.trim().length === 0) {
    return null;
  }

  return gaId;
}

function canTrackAnalytics(): boolean {
  return (
    globalThis.window !== undefined &&
    typeof globalThis.gtag === "function" &&
    getStoredCookieConsent() === "granted" &&
    getGaMeasurementId() !== null
  );
}

export function getStoredCookieConsent(): CookieConsent | null {
  if (globalThis.window === undefined) {
    return null;
  }

  const storedConsent = globalThis.localStorage.getItem(COOKIE_CONSENT_KEY);

  if (storedConsent === "granted" || storedConsent === "denied") {
    return storedConsent;
  }

  return null;
}

export function updateAnalyticsConsent(consent: CookieConsent): void {
  if (globalThis.window === undefined || typeof globalThis.gtag !== "function") {
    return;
  }

  globalThis.gtag("consent", "update", {
    analytics_storage: consent,
  });
}

export function trackEvent(name: string, params?: AnalyticsParams): void {
  if (!canTrackAnalytics()) {
    return;
  }

  globalThis.gtag?.("event", name, params);
}

export function syncAnalyticsUser(userId: string | null): void {
  const gaId = getGaMeasurementId();

  if (!gaId || !canTrackAnalytics()) {
    return;
  }

  globalThis.gtag?.("config", gaId, {
    user_id: userId ?? undefined,
  });
}

export function trackAuthMethodUsed(method: "google" | "guest"): void {
  trackEvent("auth_method_used", { method });
}

export function trackEntryCreated(params: { entryType: string; authState: "guest" | "registered" }): void {
  trackEvent("entry_created", {
    entry_type: params.entryType,
    auth_state: params.authState,
  });
}

export function trackImageUploaded(params: { mimeType: string }): void {
  trackEvent("image_uploaded", {
    mime_type: params.mimeType,
  });
}

export function trackAiAnalysisTriggered(params: { locale: string }): void {
  trackEvent("ai_analysis_triggered", {
    locale: params.locale,
  });
}
