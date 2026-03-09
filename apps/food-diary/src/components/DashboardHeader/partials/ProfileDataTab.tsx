"use client";

import { Button, Typography } from "@repo/ui";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface ProfileDataTabProps {
  error: string | null;
  isDeletingAccount: boolean;
  isExportingData: boolean;
  isWipingData: boolean;
  onDeleteAccount: () => Promise<void>;
  onExportData: () => Promise<void>;
  onWipeData: () => Promise<void>;
}

export function ProfileDataTab({
  error,
  isDeletingAccount,
  isExportingData,
  isWipingData,
  onDeleteAccount,
  onExportData,
  onWipeData,
}: ProfileDataTabProps): React.JSX.Element {
  const t = useTranslations("dashboard.profile");
  const isBusy = isDeletingAccount || isExportingData || isWipingData;
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleWipeDataClick = (): void => {
    void onWipeData();
  };

  const handleExportDataClick = (): void => {
    void onExportData();
  };

  const handleDeleteAccountClick = (): void => {
    setIsConfirmingDelete(true);
  };

  const handleConfirmDelete = (): void => {
    setIsConfirmingDelete(false);
    void onDeleteAccount();
  };

  const handleCancelDelete = (): void => {
    setIsConfirmingDelete(false);
  };

  return (
    <div className="grid gap-ds-m">
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

      <div className="grid gap-ds-xs rounded-ds-sm border border-ds-border bg-ds-surface-muted p-ds-s">
        <Typography variant="body" className="font-ds-body-sm text-ds-on-surface-secondary">
          {t("exportBody")}
        </Typography>
        <Button
          className="w-full"
          disabled={isBusy}
          onClick={handleExportDataClick}
          type="button"
          variant="secondary"
        >
          {isExportingData ? t("exportDataLoading") : t("exportData")}
        </Button>
      </div>

      <div className="grid gap-ds-xs rounded-ds-sm border border-ds-border bg-ds-surface-muted p-ds-s">
        <Typography variant="body" className="font-ds-body-sm text-ds-on-surface-secondary">
          {t("deleteBody")}
        </Typography>
        <Typography variant="body" className="font-ds-label-sm text-danger">
          {t("deleteWarning")}
        </Typography>
      </div>

      {error ? (
        <Typography variant="body" className="font-ds-body-sm text-danger">
          {error}
        </Typography>
      ) : null}

      <div className="grid gap-ds-xs sm:grid-cols-2">
        <Button
          className="w-full"
          disabled={isBusy}
          onClick={handleWipeDataClick}
          type="button"
          variant="destructive"
        >
          {isWipingData ? t("wipeDataLoading") : t("wipeData")}
        </Button>
        {isConfirmingDelete ? (
          <div className="col-span-full grid gap-ds-xs rounded-ds-sm border border-danger/30 bg-danger/5 p-ds-s">
            <Typography variant="body" className="font-ds-label-sm text-danger">
              {t("deleteAccountConfirm")}
            </Typography>
            <div className="flex flex-wrap gap-ds-xs">
              <Button
                className="flex-1"
                disabled={isDeletingAccount}
                onClick={handleConfirmDelete}
                type="button"
                variant="destructive"
              >
                {isDeletingAccount ? t("deleteAccountLoading") : t("deleteAccount")}
              </Button>
              <Button
                className="flex-1"
                disabled={isDeletingAccount}
                onClick={handleCancelDelete}
                type="button"
                variant="outline"
              >
                {t("deleteAccountConfirmCancel")}
              </Button>
            </div>
          </div>
        ) : (
          <Button
            className="w-full"
            disabled={isBusy}
            onClick={handleDeleteAccountClick}
            type="button"
            variant="destructive"
          >
            {t("deleteAccount")}
          </Button>
        )}
      </div>
    </div>
  );
}
