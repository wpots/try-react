"use client";

import { HamburgerMenu, Link, Navigation, Typography } from "@repo/ui";
import { User } from "lucide-react";
import {
  Button,
  Label,
  ListBox,
  ListBoxItem,
  Menu,
  MenuItem,
  Popover,
  Select,
  SelectValue,
} from "react-aria-components";

import {
  useLanguageSwitcher,
  isLocale,
  localeLabels,
} from "@/components/LanguageSwitcher";
import { locales } from "@/i18n/config";
import { Link as I18nLink } from "@/i18n/navigation";

import type { HeaderNavProps } from "./index";
import type { Key } from "react";

export function HeaderNav({ navItems, cms }: HeaderNavProps): React.JSX.Element {
  const { isPending, label, locale, handleLocaleChange } = useLanguageSwitcher();

  const handleSelectionChange = (key: Key | null): void => {
    if (key == null) return;
    const next = String(key);
    if (!isLocale(next, locales)) return;
    handleLocaleChange(next);
  };

  return (
    <>
      <Navigation className="hidden md:block">
        {navItems.map(item => (
          <Navigation.Item key={item.id} id={item.id} href={item.href} className="text-ds-on-surface">
            {item.children}
          </Navigation.Item>
        ))}
      </Navigation>

      <HamburgerMenu
        buttonLabel={cms("accountMenuLabel")}
        triggerContent={
          <>
            <span
              className="flex h-4 w-4 flex-col justify-between md:hidden"
              aria-hidden
            >
              <span className="block h-0.5 w-4 bg-current" />
              <span className="block h-0.5 w-4 bg-current" />
              <span className="block h-0.5 w-4 bg-current" />
            </span>
            <User className="hidden md:block" aria-hidden />
          </>
        }
      >
        <Menu className="grid gap-ds-s outline-none">
          {navItems.map(item => (
            <MenuItem key={item.id} className="md:!hidden">
              <Link as={I18nLink} href={item.href} variant="link">
                {item.children}
              </Link>
            </MenuItem>
          ))}
          <MenuItem>
            <Link as={I18nLink} href="/auth/login" variant="link">
              {cms("login")}
            </Link>
          </MenuItem>
          <MenuItem className="px-ds-s py-ds-xs">
            <Select
              aria-label={label}
              className="inline-grid gap-2"
              isDisabled={isPending}
              onSelectionChange={handleSelectionChange}
              selectedKey={locale}
            >
              <Label className="text-sm font-medium text-ds-text-strong">
                <Typography variant="body" className="text-sm text-ds-text-strong">{label}</Typography>
              </Label>
              <Button className="flex min-h-9 min-w-40 items-center justify-between rounded-md border border-ds-border bg-ds-surface px-3 py-2 text-sm text-ds-text-strong">
                <SelectValue />
              </Button>
              <Popover className="rounded-md border border-ds-border bg-ds-surface shadow-lg">
                <ListBox className="grid gap-1 p-1">
                  {locales.map((option) => (
                    <ListBoxItem
                      className="cursor-pointer rounded-sm px-2 py-1 text-sm text-ds-text-strong"
                      id={option}
                      key={option}
                    >
                      {localeLabels[option]}
                    </ListBoxItem>
                  ))}
                </ListBox>
              </Popover>
            </Select>
          </MenuItem>
        </Menu>
      </HamburgerMenu>
    </>
  );
}
