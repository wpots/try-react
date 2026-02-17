import { useState } from "react";
import { useTranslations } from "next-intl";
import { mergeGuestEntries } from "@/app/actions";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "@/i18n/navigation";
import { signInAnonymously, signInWithGoogle } from "@/lib/auth";
import { getFirebaseAuthErrorMessage } from "@/lib/getFirebaseAuthErrorMessage";
import { getHomeSplashDisabledState } from "./utils";

export interface UseHomeSplashResult {
  accountCta: string;
  accountFeatureDevice: string;
  accountFeaturePrivacy: string;
  accountTitle: string;
  appName: string;
  errorMessage: string | null;
  footerLinkLabel: string;
  footerPrefix: string;
  guestCta: string;
  guestFeatureLocal: string;
  guestFeatureWarning: string;
  guestTitle: string;
  isGoogleDisabled: boolean;
  isGuestDisabled: boolean;
  onGoogleClick: () => Promise<void>;
  onGuestClick: () => Promise<void>;
  subtitle: string;
  title: string;
}

export function useHomeSplash(): UseHomeSplashResult {
  const t = useTranslations("home.splash");
  const router = useRouter();
  const { isGuest, loading, user } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittingMethod, setSubmittingMethod] = useState<
    "guest" | "google" | null
  >(null);

  const handleGuestLogin = async (): Promise<void> => {
    setErrorMessage(null);
    setSubmittingMethod("guest");

    try {
      await signInAnonymously();
      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : t("guestError");
      setErrorMessage(message);
    } finally {
      setSubmittingMethod(null);
    }
  };

  const handleGoogleLogin = async (): Promise<void> => {
    setErrorMessage(null);
    setSubmittingMethod("google");

    try {
      const result = await signInWithGoogle(user);

      if (result.mergedFromGuestId) {
        const mergeResult = await mergeGuestEntries(
          result.mergedFromGuestId,
          result.user.uid,
        );

        if (!mergeResult.success) {
          throw new Error(mergeResult.error ?? t("mergeError"));
        }
      }

      router.push("/dashboard");
    } catch (err) {
      const message = getFirebaseAuthErrorMessage(err, t("googleError"));
      setErrorMessage(message);
    } finally {
      setSubmittingMethod(null);
    }
  };

  const { isGoogleDisabled, isGuestDisabled } = getHomeSplashDisabledState({
    isGuest,
    isLoading: loading,
    hasUser: Boolean(user),
    submittingMethod,
  });

  return {
    accountCta:
      submittingMethod === "google" ? t("googleLoading") : t("googleCta"),
    accountFeatureDevice: t("accountFeatureDevice"),
    accountFeaturePrivacy: t("accountFeaturePrivacy"),
    accountTitle: t("accountTitle"),
    appName: t("appName"),
    errorMessage,
    footerLinkLabel: t("footerLink"),
    footerPrefix: t("footerPrefix"),
    guestCta: submittingMethod === "guest" ? t("guestLoading") : t("guestCta"),
    guestFeatureLocal: t("guestFeatureLocal"),
    guestFeatureWarning: t("guestFeatureWarning"),
    guestTitle: t("guestTitle"),
    isGoogleDisabled,
    isGuestDisabled,
    onGoogleClick: handleGoogleLogin,
    onGuestClick: handleGuestLogin,
    subtitle: t("subtitle"),
    title: t("title"),
  };
}
