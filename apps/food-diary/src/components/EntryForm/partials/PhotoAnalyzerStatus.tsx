import { Typography } from "@repo/ui";
import { useTranslations } from "next-intl";

import type { AnalysisStatus } from "../index";

interface PhotoAnalyzerStatusProps {
  status: AnalysisStatus;
  remaining: number | null;
}

export function PhotoAnalyzerStatus({
  status,
  remaining,
}: Readonly<PhotoAnalyzerStatusProps>): React.JSX.Element | null {
  const t = useTranslations("entry.form");

  return (
    <>
      {status === "quota-reached" ? (
        <Typography variant="body" size="xs" className="text-ds-text-muted">
          {t("quotaLimitReached")}
        </Typography>
      ) : null}
      {status !== "quota-reached" && remaining !== null ? (
        <Typography variant="body" size="xs" className="text-ds-text-muted">
          {t("quotaRemaining", { count: remaining })}
        </Typography>
      ) : null}
      {status === "error" ? (
        <Typography variant="body" size="xs" className="text-ds-danger" role="alert">
          {t("analysisError")}
        </Typography>
      ) : null}
    </>
  );
}
