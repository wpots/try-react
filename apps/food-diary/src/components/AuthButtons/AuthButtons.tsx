"use client";

import { useTranslations } from "next-intl";
import { Button, Card, Text } from "@repo/ui";
import type { AuthButtonsProps } from "./index";
import { useAuthButtons } from "./useAuthButtons";

export function AuthButtons({
  redirectPath = "/dashboard",
}: AuthButtonsProps): React.JSX.Element {
  const t = useTranslations("auth");
  const {
    error,
    isGuest,
    isGoogleDisabled,
    isGuestDisabled,
    onGuestLogin,
    onGoogleLogin,
    submittingMethod,
    userUid,
  } = useAuthButtons({ redirectPath });

  return (
    <Card className="grid max-w-md gap-3">
      {userUid ? (
        <Text>
          {isGuest ? t("signedInGuest") : t("signedInUser", { uid: userUid })}
        </Text>
      ) : null}

      <Button
        disabled={isGuestDisabled}
        onClick={onGuestLogin}
        type="button"
      >
        {submittingMethod === "guest"
          ? t("guestLoginLoading")
          : t("continueAsGuest")}
      </Button>

      <Button
        disabled={isGoogleDisabled}
        onClick={onGoogleLogin}
        type="button"
      >
        {submittingMethod === "google"
          ? t("googleLoginLoading")
          : t("continueWithGoogle")}
      </Button>

      {error ? <Text tone="danger">{error}</Text> : null}
    </Card>
  );
}
