"use client";

import { Button, Typography } from "@repo/ui";
import { useTranslations } from "next-intl";
import { Dialog, Heading, Modal, ModalOverlay, Tab, TabList, TabPanel, Tabs } from "react-aria-components";

import { HelpTab } from "./HelpTab";
import { PrivacyTab } from "./PrivacyTab";

const TAB_CLASS =
  "cursor-pointer border-b-2 border-transparent px-ds-s pb-ds-xs font-ds-label-sm text-ds-on-surface-secondary outline-none hover:text-ds-on-surface focus-visible:ring-2 focus-visible:ring-ds-primary selected:border-ds-primary selected:text-ds-on-surface";

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
      className={"fixed inset-0 z-50 flex items-center justify-center " + "bg-ds-on-surface/40 p-ds-m"}
    >
      <Modal className="w-full max-w-xl rounded-ds-md border border-ds-border bg-ds-surface p-ds-l shadow-ds-lg outline-none">
        <Dialog className="grid gap-ds-m outline-none">
          <Heading slot="title" className="font-ds-heading-sm text-ds-on-surface">
            {t("dialogTitle")}
          </Heading>

          <Tabs>
            <TabList
              aria-label={t("dialogTitle")}
              className="flex gap-ds-xs border-b border-ds-border"
            >
              <Tab
                id="account"
                className={TAB_CLASS}
              >
                {t("tabs.account")}
              </Tab>
              <Tab
                id="privacy"
                className={TAB_CLASS}
              >
                {t("tabs.privacy")}
              </Tab>
              <Tab
                id="help"
                className={TAB_CLASS}
              >
                {t("tabs.help")}
              </Tab>
            </TabList>

            <TabPanel id="account" className="grid gap-ds-m pt-ds-m outline-none">
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
            </TabPanel>

            <TabPanel id="privacy" className="pt-ds-m outline-none">
              <PrivacyTab namespace="dashboard.guestMode" />
            </TabPanel>

            <TabPanel id="help" className="pt-ds-m outline-none">
              <HelpTab namespace="dashboard.guestMode" />
            </TabPanel>
          </Tabs>

          <Button disabled={isBusy} onClick={onClose} size="link" type="button" variant="link">
            {t("close")}
          </Button>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
