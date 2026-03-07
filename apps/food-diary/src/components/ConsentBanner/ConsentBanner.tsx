"use client";

import { CookieConsentBanner } from "@repo/ui";
import { useTranslations } from "next-intl";

export function ConsentBanner(): React.JSX.Element | null {
  const t = useTranslations("consent");

  return (
    <CookieConsentBanner
      heading={t("heading")}
      body={t("body")}
      acceptLabel={t("acceptLabel")}
      rejectLabel={t("rejectLabel")}
    />
  );
}
