"use client";

import { Button, GoogleIcon, Typography } from "@repo/ui";
import { User } from "lucide-react";
import { useTranslations } from "next-intl";

import { useAuthButtons } from "./useAuthButtons";

import type { AuthButtonsProps } from "./index";


export function AuthButtons({ redirectPath = "/dashboard" }: AuthButtonsProps): React.JSX.Element {
  const t = useTranslations("auth");
  const { error, isGuest, isGoogleDisabled, isGuestDisabled, onGuestLogin, onGoogleLogin, submittingMethod, userUid } =
    useAuthButtons({ redirectPath });

  return (
    <>
      {userUid ? (
        <Typography variant="body" className="font-ds-body-sm text-ds-on-surface-secondary">
          {isGuest ? t("signedInGuest") : t("signedInUser", { uid: userUid })}
        </Typography>
      ) : null}

      <Button className="w-full" disabled={isGuestDisabled} onClick={onGuestLogin} type="button" variant="secondary">
        <User aria-hidden />
        {submittingMethod === "guest" ? t("guestLoginLoading") : t("continueAsGuest")}
      </Button>

      <Button className="w-full" disabled={isGoogleDisabled} onClick={onGoogleLogin} type="button">
        <GoogleIcon className="h-5 w-5" />
        {submittingMethod === "google" ? t("googleLoginLoading") : t("continueWithGoogle")}
      </Button>

      {error ? (
        <Typography variant="body" className="font-ds-body-sm text-danger">
          {error}
        </Typography>
      ) : null}
    </>
  );
}
