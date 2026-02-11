import { useState } from "react";
import { useTranslations } from "next-intl";
import { mergeGuestEntries } from "@/app/actions";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "@/i18n/navigation";
import { signInAnonymously, signInWithGoogle } from "@/lib/auth";
import { getAuthButtonsDisabledState } from "./utils";

interface UseAuthButtonsInput {
  redirectPath: string;
}

export interface UseAuthButtonsResult {
  error: string | null;
  isGuest: boolean;
  isGoogleDisabled: boolean;
  isGuestDisabled: boolean;
  onGuestLogin: () => Promise<void>;
  onGoogleLogin: () => Promise<void>;
  submittingMethod: "guest" | "google" | null;
  userUid: string | null;
}

export function useAuthButtons({
  redirectPath,
}: UseAuthButtonsInput): UseAuthButtonsResult {
  const t = useTranslations("auth");
  const router = useRouter();
  const { isGuest, loading, user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [submittingMethod, setSubmittingMethod] = useState<
    "guest" | "google" | null
  >(null);

  const handleGuestLogin = async (): Promise<void> => {
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

  const handleGoogleLogin = async (): Promise<void> => {
    setError(null);
    setSubmittingMethod("google");

    try {
      const result = await signInWithGoogle(user);

      if (result.mergedFromGuestId) {
        const mergeResult = await mergeGuestEntries(
          result.mergedFromGuestId,
          result.user.uid,
        );

        if (!mergeResult.success) {
          throw new Error(mergeResult.error ?? t("mergeUnknownError"));
        }
      }

      router.push(redirectPath);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t("googleLoginUnknownError");
      setError(message);
    } finally {
      setSubmittingMethod(null);
    }
  };

  const { isGoogleDisabled, isGuestDisabled } = getAuthButtonsDisabledState({
    isGuest,
    isLoading: loading,
    hasUser: Boolean(user),
    submittingMethod,
  });

  return {
    error,
    isGuest,
    isGoogleDisabled,
    isGuestDisabled,
    onGuestLogin: handleGuestLogin,
    onGoogleLogin: handleGoogleLogin,
    submittingMethod,
    userUid: user?.uid ?? null,
  };
}
