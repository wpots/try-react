"use client";

import { Avatar, HamburgerMenu, Text, cn } from "@repo/ui";
import { User } from "lucide-react";
import { useTranslations } from "next-intl";
import { Menu, MenuItem } from "react-aria-components";


import { GuestModeDialog } from "./partials/GuestModeDialog";
import { ProfileDialog } from "./partials/ProfileDialog";
import {
  guestModeActionKey,
  loginActionKey,
  logoutActionKey,
  profileActionKey,
  useDashboardHeaderState,
} from "./useDashboardHeaderState";

import type { DashboardHeaderProps } from "./index";

function getMenuItemClassName(): string {
  return cn(
    "cursor-pointer rounded-ds-sm px-ds-s py-ds-xs",
    "font-ds-label-sm text-ds-on-surface outline-none",
    "hover:bg-ds-surface-muted focus:bg-ds-surface-muted",
  );
}

export function DashboardHeader({
  className,
  id = "dashboard-header",
  ...props
}: DashboardHeaderProps): React.JSX.Element {
  const tAuth = useTranslations("auth");
  const tGuestMode = useTranslations("dashboard.guestMode");
  const tLandingNav = useTranslations("landing.nav");
  const tNav = useTranslations("nav");
  const tProfile = useTranslations("dashboard.profile");
  const {
    error,
    isAuthenticated,
    isAuthenticatedGuest,
    isGuestModeDialogOpen,
    isProfileDialogOpen,
    onCloseGuestModeDialog,
    onCloseProfileDialog,
    onGuestGoogleLogin,
    onGuestWipeData,
    onMenuAction,
    onProfileDeleteAccount,
    onProfileWipeData,
    submittingAction,
    userPhotoUrl,
  } = useDashboardHeaderState();

  return (
    <>
      <header
        data-component-type="DashboardHeader"
        id={id}
        className={cn("pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-end", "px-ds-l py-ds-m", className)}
        {...props}
      >
        <HamburgerMenu
          buttonLabel={tLandingNav("accountMenuLabel")}
          className="pointer-events-auto"
          buttonClassName={cn(
            "h-10 w-10 overflow-hidden border-transparent bg-transparent p-0",
            "!text-ds-on-surface-secondary hover:border-transparent",
            "hover:bg-transparent hover:!text-ds-on-surface",
          )}
          triggerContent={
            <Avatar src={userPhotoUrl ?? undefined} alt="" aria-hidden className="h-full w-full">
              <User />
            </Avatar>
          }
        >
          <Menu className="grid gap-ds-xs outline-none" onAction={onMenuAction}>
            {isAuthenticatedGuest ? (
              <>
                <MenuItem id={guestModeActionKey} className={getMenuItemClassName()}>
                  {tGuestMode("menuLabel")}
                </MenuItem>
                <MenuItem id={loginActionKey} className={getMenuItemClassName()}>
                  {tNav("login")}
                </MenuItem>
              </>
            ) : isAuthenticated ? (
              <>
                <MenuItem id={profileActionKey} className={getMenuItemClassName()}>
                  {tProfile("menuLabel")}
                </MenuItem>
                <MenuItem id={logoutActionKey} isDisabled={submittingAction !== null} className={getMenuItemClassName()}>
                  {submittingAction === "logout" ? tAuth("signingOut") : tAuth("signOut")}
                </MenuItem>
              </>
            ) : (
              <MenuItem id={loginActionKey} className={getMenuItemClassName()}>
                {tNav("login")}
              </MenuItem>
            )}

            {error ? (
              <MenuItem id="auth-error" isDisabled className="cursor-default px-ds-s py-ds-xs">
                <Text className="text-xs" tone="danger">
                  {error}
                </Text>
              </MenuItem>
            ) : null}
          </Menu>
        </HamburgerMenu>
      </header>

      <GuestModeDialog
        error={error}
        isOpen={isGuestModeDialogOpen}
        isSigningIn={submittingAction === "google"}
        isWiping={submittingAction === "wipe-guest"}
        onClose={onCloseGuestModeDialog}
        onLoginWithGoogle={onGuestGoogleLogin}
        onWipeData={onGuestWipeData}
      />
      <ProfileDialog
        error={error}
        isDeletingAccount={submittingAction === "delete-account"}
        isOpen={isProfileDialogOpen}
        isWipingData={submittingAction === "wipe-user"}
        onClose={onCloseProfileDialog}
        onDeleteAccount={onProfileDeleteAccount}
        onWipeData={onProfileWipeData}
      />
    </>
  );
}
