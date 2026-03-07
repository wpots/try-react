"use client";

import { Button, Typography } from "@repo/ui";
import { useTranslations } from "next-intl";

interface GuestDataTabProps {
  error: string | null;
  isSigningIn: boolean;
  isWiping: boolean;
  onLoginWithGoogle: () => Promise<void>;
  onWipeData: () => Promise<void>;
}

export function GuestDataTab({
  error,
  isSigningIn,
  isWiping,
  onLoginWithGoogle,
  onWipeData,
}: GuestDataTabProps): React.JSX.Element {
  const t = useTranslations("dashboard.guestMode");
  const isBusy = isSigningIn || isWiping;

  const handleLoginClick = (): void => {
    void onLoginWithGoogle();
  };

  const handleWipeClick = (): void => {
    void onWipeData();
  };

  return (
    <div className="grid gap-ds-m">
      <Typography variant="body" className="font-ds-body-base text-ds-on-surface-secondary">
        {t("mergeBody")}
      </Typography>

      <div className="grid gap-ds-xs rounded-ds-sm border border-ds-border bg-ds-surface-muted p-ds-s">
        <Typography variant="body" className="font-ds-body-sm text-ds-on-surface-secondary">
          {t("wipeBody")}
        </Typography>
        <Typography variant="body" className="font-ds-label-sm text-danger">
          {t("wipeWarning")}
        </Typography>
        <Typography variant="body" className="font-ds-body-sm text-ds-on-surface-secondary">
          {t("retentionBody")}
        </Typography>
      </div>

      {error ? (
        <Typography variant="body" className="font-ds-body-sm text-danger">
          {error}
        </Typography>
      ) : null}

      <div className="grid gap-ds-xs sm:grid-cols-2">
        <Button className="w-full" disabled={isBusy} onClick={handleLoginClick} type="button">
          {isSigningIn ? t("loginWithGoogleLoading") : t("loginWithGoogle")}
        </Button>
        <Button className="w-full" disabled={isBusy} onClick={handleWipeClick} type="button" variant="destructive">
          {isWiping ? t("wipeDataLoading") : t("wipeData")}
        </Button>
      </div>
    </div>
  );
}
