"use client";

import { Typography } from "@repo/ui";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

interface PrivacyTabProps {
  namespace: "dashboard.profile" | "dashboard.guestMode";
}

export function PrivacyTab({ namespace }: PrivacyTabProps): React.JSX.Element {
  const t = useTranslations(namespace);

  return (
    <div className="grid gap-ds-s">
      <Typography variant="body" className="font-ds-body-sm text-ds-on-surface-secondary">
        {t("privacy.summary")}
      </Typography>
      <Link
        href="/privacy"
        className="inline-flex items-center font-ds-label-sm text-ds-primary underline underline-offset-2 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ds-primary"
      >
        {t("privacy.cta")}
      </Link>
    </div>
  );
}
