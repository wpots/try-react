"use client";

import { useTranslations } from "next-intl";
import {
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
  Button as AriaButton,
} from "react-aria-components";

import { useLanguageSwitcher, isLocale, localeLabels } from "@/components/LanguageSwitcher";
import { locales } from "@/i18n/config";

import type { Key } from "react";

export function SettingsTab(): React.JSX.Element {
  const t = useTranslations("dashboard.profile");
  const { isPending, locale, handleLocaleChange } = useLanguageSwitcher();

  const handleSelectionChange = (key: Key | null): void => {
    if (key == null) return;
    const next = String(key);
    if (!isLocale(next, locales)) return;
    handleLocaleChange(next);
  };

  return (
    <div className="rounded-ds-sm border border-ds-border bg-ds-surface-muted p-ds-s">
      <Select
        aria-label={t("languageLabel")}
        className="grid gap-ds-xxs"
        isDisabled={isPending}
        onSelectionChange={handleSelectionChange}
        selectedKey={locale}
      >
        <Label className="font-ds-label-sm text-ds-on-surface-secondary">{t("languageLabel")}</Label>
        <AriaButton className="flex min-h-9 items-center justify-between rounded-ds-sm border border-ds-border bg-ds-surface px-ds-s py-ds-xxs font-ds-body-sm text-ds-on-surface">
          <SelectValue />
        </AriaButton>
        <Popover className="rounded-ds-sm border border-ds-border bg-ds-surface shadow-ds-md">
          <ListBox className="grid gap-1 p-1">
            {locales.map(option => (
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
  );
}
