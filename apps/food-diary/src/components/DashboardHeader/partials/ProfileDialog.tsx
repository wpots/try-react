"use client";

import { Button, Tabs } from "@repo/ui";
import { useTranslations } from "next-intl";
import { Dialog, Heading, Modal, ModalOverlay } from "react-aria-components";

import { AffirmationsTab } from "./AffirmationsTab";
import { ProfileDataTab } from "./ProfileDataTab";
import { SettingsTab } from "./SettingsTab";

interface ProfileDialogProps {
  error: string | null;
  isDeletingAccount: boolean;
  isExportingData: boolean;
  isOpen: boolean;
  isWipingData: boolean;
  onClose: () => void;
  onDeleteAccount: () => Promise<void>;
  onExportData: () => Promise<void>;
  onWipeData: () => Promise<void>;
}

export function ProfileDialog({
  error,
  isDeletingAccount,
  isExportingData,
  isOpen,
  isWipingData,
  onClose,
  onDeleteAccount,
  onExportData,
  onWipeData,
}: ProfileDialogProps): React.JSX.Element {
  const t = useTranslations("dashboard.profile");
  const isBusy = isDeletingAccount || isExportingData || isWipingData;

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
        <ProfileDataTab
          error={error}
          isDeletingAccount={isDeletingAccount}
          isExportingData={isExportingData}
          isWipingData={isWipingData}
          onDeleteAccount={onDeleteAccount}
          onExportData={onExportData}
          onWipeData={onWipeData}
        />
      ),
    },
    {
      id: "affirmations" as const,
      label: t("tabs.affirmations"),
      content: <AffirmationsTab isGuest={false} />,
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
