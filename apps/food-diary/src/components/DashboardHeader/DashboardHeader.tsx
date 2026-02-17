"use client";

import { useCallback, useState } from "react";
import type { Key } from "react";
import { Menu, MenuItem } from "react-aria-components";
import { useTranslations } from "next-intl";
import { HamburgerMenu, Text, cn } from "@repo/ui";
import { signOut } from "@/lib/auth";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/contexts/AuthContext";

import type { DashboardHeaderProps } from "./index";

const loginActionKey = "login";
const logoutActionKey = "logout";

export function DashboardHeader({
  className,
  id = "dashboard-header",
  ...props
}: DashboardHeaderProps): React.JSX.Element {
  const tAuth = useTranslations("auth");
  const tLandingNav = useTranslations("landing.nav");
  const tNav = useTranslations("nav");
  const router = useRouter();
  const { loading, user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isAuthenticated = !loading && Boolean(user);

  const handleMenuAction = useCallback(
    async (key: Key): Promise<void> => {
      const actionKey = String(key);

      if (actionKey === loginActionKey) {
        router.push("/auth/login");
        return;
      }

      if (actionKey !== logoutActionKey || isSubmitting) {
        return;
      }

      setError(null);
      setIsSubmitting(true);

      try {
        await signOut();
        router.push("/auth/login");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : tAuth("signOutError");
        setError(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, router, tAuth],
  );

  return (
    <header
      data-component-type="DashboardHeader"
      id={id}
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-end",
        "px-ds-l py-ds-m",
        className,
      )}
      {...props}
    >
      <HamburgerMenu
        buttonLabel={tLandingNav("accountMenuLabel")}
        className="pointer-events-auto"
        buttonClassName={cn(
          "h-6 w-6 border-transparent bg-transparent p-0",
          "!text-ds-on-surface-secondary hover:border-transparent",
          "hover:bg-transparent hover:!text-ds-on-surface",
        )}
      >
        <Menu className="grid gap-ds-xs outline-none" onAction={handleMenuAction}>
          {isAuthenticated ? (
            <MenuItem
              id={logoutActionKey}
              isDisabled={isSubmitting}
              className={cn(
                "cursor-pointer rounded-ds-sm px-ds-s py-ds-xs",
                "font-ds-label-sm text-ds-on-surface outline-none",
                "hover:bg-ds-surface-muted focus:bg-ds-surface-muted",
              )}
            >
              {isSubmitting ? tAuth("signingOut") : tAuth("signOut")}
            </MenuItem>
          ) : (
            <MenuItem
              id={loginActionKey}
              className={cn(
                "cursor-pointer rounded-ds-sm px-ds-s py-ds-xs",
                "font-ds-label-sm text-ds-on-surface outline-none",
                "hover:bg-ds-surface-muted focus:bg-ds-surface-muted",
              )}
            >
              {tNav("login")}
            </MenuItem>
          )}
          {error ? (
            <MenuItem
              id="auth-error"
              isDisabled
              className="cursor-default px-ds-s py-ds-xs"
            >
              <Text className="text-xs" tone="danger">
                {error}
              </Text>
            </MenuItem>
          ) : null}
        </Menu>
      </HamburgerMenu>
    </header>
  );
}
