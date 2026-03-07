"use client";

import { useEffect, useState } from "react";

import { cn } from "../../lib/utils";
import { Button } from "../Button";
import { Typography } from "../Typography";

export const COOKIE_CONSENT_KEY = "cookie_consent";
export type CookieConsent = "granted" | "denied";

export interface CookieConsentBannerProps {
  heading: string;
  body: string;
  acceptLabel: string;
  rejectLabel: string;
  className?: string;
  onAccept?: () => void;
  onReject?: () => void;
}

export function CookieConsentBanner({
  heading,
  body,
  acceptLabel,
  rejectLabel,
  className,
  onAccept,
  onReject,
}: CookieConsentBannerProps): React.JSX.Element | null {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const handleAccept = (): void => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "granted" satisfies CookieConsent);
    setVisible(false);
    onAccept?.();
  };

  const handleReject = (): void => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "denied" satisfies CookieConsent);
    setVisible(false);
    onReject?.();
  };

  return (
    <div
      role="region"
      aria-label={heading}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-ds-border bg-ds-surface p-ds-m shadow-ds-lg",
        "sm:bottom-ds-m sm:right-ds-m sm:max-w-md sm:rounded-ds-md sm:border sm:inset-x-auto",
        className,
      )}
    >
      <div className="grid gap-ds-s">
        <Typography variant="body" tag="p" className="font-ds-label-base text-ds-on-surface">
          {heading}
        </Typography>
        <Typography variant="body" tag="p" className="font-ds-body-sm text-ds-on-surface-secondary">
          {body}
        </Typography>
        <div className="flex flex-wrap gap-ds-xs">
          <Button size="sm" variant="default" onClick={handleAccept}>
            {acceptLabel}
          </Button>
          <Button size="sm" variant="outline" onClick={handleReject}>
            {rejectLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
