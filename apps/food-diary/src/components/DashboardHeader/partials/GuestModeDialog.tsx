"use client";

import { Button, Tabs } from "@repo/ui";
import { useTranslations } from "next-intl";
import { Dialog, Heading, Modal, ModalOverlay } from "react-aria-components";

import { AffirmationsTab } from "./AffirmationsTab";
import { GuestDataTab } from "./GuestDataTab";
import { SettingsTab } from "./SettingsTab";

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

  const handleOpenChange = (nextIsOpen: boolean): void => {
    if (!nextIsOpen) {
      onClose();
    }
  };

  const tabItems = [
    {
      id: "settings" as const,
      label: t("tabs.settings"),
      content: <SettingsTab />,
    },
    {
      id: "data-account" as const,
      label: t("tabs.dataAccount"),
      content: (
        <GuestDataTab
          error={error}
          isSigningIn={isSigningIn}
          isWiping={isWiping}
          onLoginWithGoogle={onLoginWithGoogle}
          onWipeData={onWipeData}
        />
      ),
    },
    {
      id: "affirmations" as const,
      label: t("tabs.affirmations"),
      content: <AffirmationsTab isGuest={true} />,
    },
  ];

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

          <Tabs
            aria-label={t("dialogTitle")}
            defaultSelectedKey="settings"
            items={tabItems}
          />

          <Button disabled={isBusy} onClick={onClose} size="link" type="button" variant="link">
            {t("close")}
          </Button>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
