"use client";

import { Typography } from "@repo/ui";
import { useTranslations } from "next-intl";

import { HELP_URLS } from "@/constants/links";

interface HelpTabProps {
  namespace: "dashboard.profile" | "dashboard.guestMode";
}

export function HelpTab({ namespace }: HelpTabProps): React.JSX.Element {
  const t = useTranslations(namespace);

  return (
    <div className="grid gap-ds-s">
      <Typography variant="body" className="font-ds-body-base text-ds-on-surface">
        {t("help.title")}
      </Typography>
      <Typography variant="body" className="font-ds-body-sm text-ds-on-surface-secondary">
        {t("help.description")}
      </Typography>
      <div className="grid gap-ds-xs">
        <a
          className="inline-flex items-center font-ds-label-sm text-ds-primary underline underline-offset-2 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ds-primary"
          href={HELP_URLS.reportIssue}
          rel="noopener noreferrer"
          target="_blank"
        >
          {t("help.reportIssue")}
        </a>
        <a
          className="inline-flex items-center font-ds-label-sm text-ds-primary underline underline-offset-2 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ds-primary"
          href={HELP_URLS.buyCoffee}
          rel="noopener noreferrer"
          target="_blank"
        >
          {t("help.buyCoffee")}
        </a>
      </div>
    </div>
  );
}
