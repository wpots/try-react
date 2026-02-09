"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button, Card, Text } from "@repo/ui";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { signInAnonymously, signInWithGoogle } from "@/lib/auth";
import type { AuthButtonsProps } from "./index";

export function AuthButtons({ redirectPath = "/dashboard" }: AuthButtonsProps) {
  const t = useTranslations("auth");
  const router = useRouter();
  const { isGuest, loading, markGuestForMerge, user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [submittingMethod, setSubmittingMethod] = useState<
    "guest" | "google" | null
  >(null);

  const handleGuestLogin = async () => {
    setError(null);
    setSubmittingMethod("guest");

    try {
      await signInAnonymously();
      router.push(redirectPath);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t("guestLoginUnknownError");
      setError(message);
    } finally {
      setSubmittingMethod(null);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setSubmittingMethod("google");

    try {
      if (user?.isAnonymous) {
        markGuestForMerge(user.uid);
      }
      await signInWithGoogle();
      router.push(redirectPath);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t("googleLoginUnknownError");
      setError(message);
    } finally {
      setSubmittingMethod(null);
    }
  };

  const isBusy = loading || submittingMethod !== null;
  const isGoogleDisabled = isBusy || Boolean(user && !isGuest);
  const isGuestDisabled = isBusy || Boolean(user);

  return (
    <Card className="grid max-w-md gap-3">
      {user ? (
        <Text>
          {isGuest ? t("signedInGuest") : t("signedInUser", { uid: user.uid })}
        </Text>
      ) : null}

      <Button
        type="button"
        onClick={handleGuestLogin}
        disabled={isGuestDisabled}
      >
        {submittingMethod === "guest"
          ? t("guestLoginLoading")
          : t("continueAsGuest")}
      </Button>

      <Button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isGoogleDisabled}
      >
        {submittingMethod === "google"
          ? t("googleLoginLoading")
          : t("continueWithGoogle")}
      </Button>

      {error ? <Text tone="danger">{error}</Text> : null}
    </Card>
  );
}
