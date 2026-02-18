"use client";

import { useCallback, useEffect, useState } from "react";
import type { Key } from "react";
import { useTranslations } from "next-intl";
import { mergeGuestEntries, wipeGuestEntries } from "@/app/actions";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "@/i18n/navigation";
import { signInWithGoogle, signOut } from "@/lib/auth";
import { getFirebaseAuthErrorMessage } from "@/lib/getFirebaseAuthErrorMessage";

export const guestModeActionKey = "guest-mode";
export const loginActionKey = "login";
export const logoutActionKey = "logout";

export type SubmitAction = "google" | "logout" | "wipe" | null;

export interface UseDashboardHeaderStateResult {
  error: string | null;
  isAuthenticated: boolean;
  isAuthenticatedGuest: boolean;
  isGuestModeDialogOpen: boolean;
  onCloseGuestModeDialog: () => void;
  onGuestGoogleLogin: () => Promise<void>;
  onGuestWipeData: () => Promise<void>;
  onMenuAction: (key: Key) => Promise<void>;
  submittingAction: SubmitAction;
  userPhotoUrl: string | null;
}

function getAvatarUrl(photoUrl: string | null | undefined): string | null {
  if (photoUrl == null) {
    return null;
  }

  const trimmedPhotoUrl = photoUrl.trim();
  if (trimmedPhotoUrl.length === 0) {
    return null;
  }

  return trimmedPhotoUrl;
}

export function useDashboardHeaderState(): UseDashboardHeaderStateResult {
  const tAuth = useTranslations("auth");
  const tGuestMode = useTranslations("dashboard.guestMode");
  const router = useRouter();
  const { isGuest, loading, user } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const [isGuestModeDialogOpen, setIsGuestModeDialogOpen] = useState(false);
  const [submittingAction, setSubmittingAction] = useState<SubmitAction>(null);

  const isAuthenticated = !loading && Boolean(user);
  const isAuthenticatedGuest = isAuthenticated && isGuest;

  useEffect(() => {
    if (!isAuthenticatedGuest && isGuestModeDialogOpen) {
      setIsGuestModeDialogOpen(false);
    }
  }, [isAuthenticatedGuest, isGuestModeDialogOpen]);

  const handleGuestGoogleLogin = useCallback(async (): Promise<void> => {
    if (!user || !isGuest || submittingAction !== null) {
      return;
    }

    setError(null);
    setSubmittingAction("google");

    try {
      const result = await signInWithGoogle(user);

      if (result.mergedFromGuestId) {
        const mergeResult = await mergeGuestEntries(
          result.mergedFromGuestId,
          result.user.uid,
        );

        if (!mergeResult.success) {
          throw new Error(mergeResult.error ?? tAuth("mergeUnknownError"));
        }
      }

      setIsGuestModeDialogOpen(false);
    } catch (err) {
      setError(getFirebaseAuthErrorMessage(err, tAuth("googleLoginUnknownError")));
    } finally {
      setSubmittingAction(null);
    }
  }, [isGuest, submittingAction, tAuth, user]);

  const handleGuestWipeData = useCallback(async (): Promise<void> => {
    if (!user || !isGuest || submittingAction !== null) {
      return;
    }

    setError(null);
    setSubmittingAction("wipe");

    try {
      const wipeResult = await wipeGuestEntries(user.uid);

      if (!wipeResult.success) {
        throw new Error(wipeResult.error ?? tGuestMode("wipeUnknownError"));
      }

      await signOut();
      setIsGuestModeDialogOpen(false);
      router.push("/auth/login");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : tGuestMode("wipeUnknownError");
      setError(message);
    } finally {
      setSubmittingAction(null);
    }
  }, [isGuest, router, submittingAction, tGuestMode, user]);

  const handleMenuAction = useCallback(
    async (key: Key): Promise<void> => {
      const actionKey = String(key);

      if (actionKey === guestModeActionKey) {
        setError(null);
        setIsGuestModeDialogOpen(true);
        return;
      }

      if (actionKey === loginActionKey) {
        router.push("/auth/login");
        return;
      }

      if (actionKey !== logoutActionKey || submittingAction !== null) {
        return;
      }

      setError(null);
      setSubmittingAction("logout");

      try {
        await signOut();
        router.push("/auth/login");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : tAuth("signOutError");
        setError(message);
      } finally {
        setSubmittingAction(null);
      }
    },
    [router, submittingAction, tAuth],
  );

  return {
    error,
    isAuthenticated,
    isAuthenticatedGuest,
    isGuestModeDialogOpen,
    onCloseGuestModeDialog: () => setIsGuestModeDialogOpen(false),
    onGuestGoogleLogin: handleGuestGoogleLogin,
    onGuestWipeData: handleGuestWipeData,
    onMenuAction: handleMenuAction,
    submittingAction,
    userPhotoUrl: getAvatarUrl(user?.photoURL),
  };
}
