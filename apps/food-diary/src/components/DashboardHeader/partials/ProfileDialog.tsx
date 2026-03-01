"use client";

import { Button, Text } from "@repo/ui";
import { useTranslations } from "next-intl";
import type { Key } from "react";
import {
  Dialog,
  Heading,
  Label,
  ListBox,
  ListBoxItem,
  Modal,
  ModalOverlay,
  Popover,
  Select,
  SelectValue,
  Button as AriaButton,
} from "react-aria-components";

import {
  useLanguageSwitcher,
  isLocale,
  localeLabels,
} from "@/components/LanguageSwitcher";
import { locales } from "@/i18n/config";

interface ProfileDialogProps {
  error: string | null;
  isDeletingAccount: boolean;
  isOpen: boolean;
  isWipingData: boolean;
  onClose: () => void;
  onDeleteAccount: () => Promise<void>;
  onWipeData: () => Promise<void>;
}

export function ProfileDialog({
  error,
  isDeletingAccount,
  isOpen,
  isWipingData,
  onClose,
  onDeleteAccount,
  onWipeData,
}: ProfileDialogProps): React.JSX.Element {
  const t = useTranslations("dashboard.profile");
  const isBusy = isDeletingAccount || isWipingData;
  const { isPending, locale, handleLocaleChange } = useLanguageSwitcher();

  const handleSelectionChange = (key: Key | null): void => {
    if (key == null) return;
    const next = String(key);
    if (!isLocale(next, locales)) return;
    handleLocaleChange(next);
  };

  const handleWipeDataClick = (): void => {
    void onWipeData();
  };

  const handleDeleteAccountClick = (): void => {
    const shouldDeleteAccount = window.confirm(t("deleteAccountConfirm"));

    if (!shouldDeleteAccount) {
      return;
    }

    void onDeleteAccount();
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
          <Heading
            slot="title"
            className="font-ds-heading-sm text-ds-on-surface"
          >
            {t("dialogTitle")}
          </Heading>

          <Text className="font-ds-body-base text-ds-on-surface-secondary">
            {t("dialogBody")}
          </Text>

          <div className="rounded-ds-sm border border-ds-border bg-ds-surface-muted p-ds-s">
            <Select
              aria-label={t("languageLabel")}
              className="grid gap-ds-xxs"
              isDisabled={isPending}
              onSelectionChange={handleSelectionChange}
              selectedKey={locale}
            >
              <Label className="font-ds-label-sm text-ds-on-surface-secondary">
                {t("languageLabel")}
              </Label>
              <AriaButton className="flex min-h-9 items-center justify-between rounded-ds-sm border border-ds-border bg-ds-surface px-ds-s py-ds-xxs font-ds-body-sm text-ds-on-surface">
                <SelectValue />
              </AriaButton>
              <Popover className="rounded-ds-sm border border-ds-border bg-ds-surface shadow-ds-md">
                <ListBox className="grid gap-1 p-1">
                  {locales.map((option) => (
                    <ListBoxItem
                      className="cursor-pointer rounded-ds-sm px-ds-s py-ds-xxs font-ds-body-sm text-ds-on-surface hover:bg-ds-surface-muted"
                      id={option}
                      key={option}
                    >
                      {localeLabels[option]}
                    </ListBoxItem>
                  ))}
                </ListBox>
              </Popover>
            </Select>
          </div>

          <div className="grid gap-ds-xs rounded-ds-sm border border-ds-border bg-ds-surface-muted p-ds-s">
            <Text className="font-ds-body-sm text-ds-on-surface-secondary">
              {t("wipeBody")}
            </Text>
            <Text className="font-ds-label-sm" tone="danger">
              {t("wipeWarning")}
            </Text>
          </div>

          <div className="grid gap-ds-xs rounded-ds-sm border border-ds-border bg-ds-surface-muted p-ds-s">
            <Text className="font-ds-body-sm text-ds-on-surface-secondary">
              {t("deleteBody")}
            </Text>
            <Text className="font-ds-label-sm" tone="danger">
              {t("deleteWarning")}
            </Text>
          </div>

          {error ? (
            <Text className="font-ds-body-sm" tone="danger">
              {error}
            </Text>
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
            <Button
              className="w-full"
              disabled={isBusy}
              onClick={handleDeleteAccountClick}
              type="button"
              variant="destructive"
            >
              {isDeletingAccount
                ? t("deleteAccountLoading")
                : t("deleteAccount")}
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
