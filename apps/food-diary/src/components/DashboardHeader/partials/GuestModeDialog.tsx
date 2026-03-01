"use client";

import { Button, Typography } from "@repo/ui";
import { useTranslations } from "next-intl";
import {
  Dialog,
  Heading,
  Modal,
  ModalOverlay,
} from "react-aria-components";

interface GuestModeDialogProps {
  error: string | null;
  isOpen: boolean;
  isSigningIn: boolean;
  isWiping: boolean;
  onClose: () => void;
  onLoginWithGoogle: () => Promise<void>;
  onWipeData: () => Promise<void>;
}

export function GuestModeDialog({
  error,
  isOpen,
  isSigningIn,
  isWiping,
  onClose,
  onLoginWithGoogle,
  onWipeData,
}: GuestModeDialogProps): React.JSX.Element {
  const t = useTranslations("dashboard.guestMode");
  const isBusy = isSigningIn || isWiping;

  const handleLoginClick = (): void => {
    void onLoginWithGoogle();
  };

  const handleWipeClick = (): void => {
    void onWipeData();
  };

  const handleOpenChange = (nextIsOpen: boolean): void => {
    if (!nextIsOpen) {
      onClose();
    }
  };

  return (
    <ModalOverlay
      isDismissable
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      className={
        "fixed inset-0 z-50 flex items-center justify-center " +
        "bg-ds-on-surface/40 p-ds-m"
      }
    >
      <Modal className="w-full max-w-xl rounded-ds-md border border-ds-border bg-ds-surface p-ds-l shadow-ds-lg outline-none">
        <Dialog className="grid gap-ds-m outline-none">
          <Heading slot="title" className="font-ds-heading-sm text-ds-on-surface">
            {t("dialogTitle")}
          </Heading>

          <Typography variant="body" className="font-ds-body-base text-ds-on-surface-secondary">
            {t("dialogBody")}
          </Typography>
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
              onClick={handleLoginClick}
              type="button"
            >
              {isSigningIn
                ? t("loginWithGoogleLoading")
                : t("loginWithGoogle")}
            </Button>
            <Button
              className="w-full"
              disabled={isBusy}
              onClick={handleWipeClick}
              type="button"
              variant="destructive"
            >
              {isWiping ? t("wipeDataLoading") : t("wipeData")}
            </Button>
          </div>

          <Button
            disabled={isBusy}
            onClick={onClose}
            size="link"
            type="button"
            variant="link"
          >
            {t("close")}
          </Button>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
