import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "@/i18n/navigation";
import { trackAuthMethodUsed } from "@/lib/analytics";
import { completeGoogleRedirectSignIn, signInAnonymously, signInWithGoogle } from "@/lib/auth";
import { getGuestEntryIds } from "@/lib/firestore/helpers";
import { getFirebaseAuthErrorKey } from "@/lib/getFirebaseAuthErrorMessage";
import { mergeGuestEntriesAfterGoogleSignIn } from "@/utils/mergeGuestEntriesAfterGoogleSignIn";

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

export function useAuthButtons({ redirectPath }: UseAuthButtonsInput): UseAuthButtonsResult {
  const t = useTranslations("auth");
  const router = useRouter();
  const { isGuest, loading, user } = useAuth();
  const hasHandledRedirectRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [submittingMethod, setSubmittingMethod] = useState<"guest" | "google" | null>(null);

  useEffect(() => {
    if (hasHandledRedirectRef.current) {
      return;
    }

    hasHandledRedirectRef.current = true;

    let isMounted = true;

    async function handleRedirectResult(): Promise<void> {
      setSubmittingMethod("google");

      try {
        const result = await completeGoogleRedirectSignIn();

        if (!isMounted || !result?.user) {
          return;
        }

        trackAuthMethodUsed("google");

        if (result.mergedFromGuestId) {
          const mergeResult = await mergeGuestEntriesAfterGoogleSignIn(
            result.mergedFromGuestId,
            result.user,
            result.guestEntryIds,
          );

          if (!mergeResult.success) {
            console.error(mergeResult.error ?? t("mergeUnknownError"));
          }
        }

        router.push(redirectPath);
      } catch (err) {
        if (!isMounted) {
          return;
        }

        const message = t(getFirebaseAuthErrorKey(err, "googleLoginUnknownError"));
        setError(message);
      } finally {
        if (isMounted) {
          setSubmittingMethod(null);
        }
      }
    }

    void handleRedirectResult();

    return () => {
      isMounted = false;
    };
  }, [redirectPath, router, t]);

  const handleGuestLogin = async (): Promise<void> => {
    setError(null);
    setSubmittingMethod("guest");

    try {
      await signInAnonymously();
      trackAuthMethodUsed("guest");
      router.push(redirectPath);
    } catch (err) {
      const message = err instanceof Error ? err.message : t("guestLoginUnknownError");
      setError(message);
    } finally {
      setSubmittingMethod(null);
    }
  };

  const handleGoogleLogin = async (): Promise<void> => {
    setError(null);
    setSubmittingMethod("google");

    try {
      // Pre-fetch entry IDs while still authenticated as the anonymous guest
      const guestEntryIds = user?.isAnonymous ? await getGuestEntryIds(user.uid) : [];

      const result = await signInWithGoogle(user, guestEntryIds);

      if (result.redirectStarted || !result.user) {
        return;
      }

      trackAuthMethodUsed("google");

      if (result.mergedFromGuestId) {
        const mergeResult = await mergeGuestEntriesAfterGoogleSignIn(
          result.mergedFromGuestId,
          result.user,
          result.guestEntryIds,
        );

        if (!mergeResult.success) {
          console.error(mergeResult.error ?? t("mergeUnknownError"));
        }
      }

      router.push(redirectPath);
    } catch (err) {
      const message = t(getFirebaseAuthErrorKey(err, "googleLoginUnknownError"));
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
