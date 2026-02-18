"use client";

import { useTranslations } from "next-intl";
import { Button, GoogleIcon, Text } from "@repo/ui";
import { User } from "lucide-react";
import type { AuthButtonsProps } from "./index";
import { useAuthButtons } from "./useAuthButtons";

export function AuthButtons({ redirectPath = "/dashboard" }: AuthButtonsProps): React.JSX.Element {
  const t = useTranslations("auth");
  const { error, isGuest, isGoogleDisabled, isGuestDisabled, onGuestLogin, onGoogleLogin, submittingMethod, userUid } =
    useAuthButtons({ redirectPath });

  return (
    <>
      {userUid ? (
        <Text className="font-ds-body-sm text-ds-on-surface-secondary">
          {isGuest ? t("signedInGuest") : t("signedInUser", { uid: userUid })}
        </Text>
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
        <Text className="font-ds-body-sm" tone="danger">
          {error}
        </Text>
      ) : null}
    </>
  );
}
