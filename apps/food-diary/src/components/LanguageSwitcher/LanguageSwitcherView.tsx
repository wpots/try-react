"use client";

import type { Key } from "react";
import {
  Button,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
} from "react-aria-components";
import { Text } from "@repo/ui";
import { defaultLocale, locales, type AppLocale } from "@/i18n/config";
import { isLocale } from "./utils";
import type { LanguageSwitcherViewProps } from "./index";

const DEFAULT_LABELS: Record<AppLocale, string> = {
  en: "English",
  nl: "Nederlands",
};

export function LanguageSwitcherView({
  ariaLabel,
  label,
  locale,
  onLocaleChange,
  disabled = false,
  options = locales,
}: LanguageSwitcherViewProps): React.JSX.Element {
  const handleSelectionChange = (key: Key): void => {
    const nextLocale = String(key);

    if (!isLocale(nextLocale, options)) {
      return;
    }

    onLocaleChange(nextLocale);
  };

  return (
    <Select
      aria-label={ariaLabel}
      className="inline-grid gap-2"
      isDisabled={disabled}
      onSelectionChange={handleSelectionChange}
      selectedKey={locale ?? defaultLocale}
    >
      <Label className="text-sm font-medium text-ds-text-strong">
        <Text className="text-sm text-ds-text-strong">{label}</Text>
      </Label>
      <Button className="flex min-h-9 min-w-40 items-center justify-between rounded-md border border-ds-border bg-ds-surface px-3 py-2 text-sm text-ds-text-strong">
        <SelectValue />
      </Button>
      <Popover className="rounded-md border border-ds-border bg-ds-surface shadow-lg">
        <ListBox className="grid gap-1 p-1">
          {options.map((option) => (
            <ListBoxItem
              className="cursor-pointer rounded-sm px-2 py-1 text-sm text-ds-text-strong"
              id={option}
              key={option}
            >
              {DEFAULT_LABELS[option]}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </Select>
  );
}
