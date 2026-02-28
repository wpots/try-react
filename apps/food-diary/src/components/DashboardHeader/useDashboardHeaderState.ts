"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

import { wipeEntries } from "@/app/actions";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "@/i18n/navigation";
import { deleteSignedInUser, signInWithGoogle, signOut } from "@/lib/auth";
import { getFirebaseAuthErrorMessage } from "@/lib/getFirebaseAuthErrorMessage";
import { mergeGuestEntriesAfterGoogleSignIn } from "@/utils/mergeGuestEntriesAfterGoogleSignIn";

import type { Key } from "react";

export const guestModeActionKey = "guest-mode";
export const loginActionKey = "login";
export const logoutActionKey = "logout";
export const profileActionKey = "profile";

export type SubmitAction =
  | "delete-account"
  | "google"
  | "logout"
  | "wipe-guest"
  | "wipe-user"
  | null;

export interface UseDashboardHeaderStateResult {
  error: string | null;
  isAuthenticated: boolean;
  isAuthenticatedGuest: boolean;
  isGuestModeDialogOpen: boolean;
  isProfileDialogOpen: boolean;
  onCloseGuestModeDialog: () => void;
  onCloseProfileDialog: () => void;
  onGuestGoogleLogin: () => Promise<void>;
  onGuestWipeData: () => Promise<void>;
  onMenuAction: (key: Key) => Promise<void>;
  onProfileDeleteAccount: () => Promise<void>;
  onProfileWipeData: () => Promise<void>;
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
  const tProfile = useTranslations("dashboard.profile");
  const router = useRouter();
  const { isGuest, loading, user } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const [isGuestModeDialogOpen, setIsGuestModeDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [submittingAction, setSubmittingAction] = useState<SubmitAction>(null);

  const isAuthenticated = !loading && Boolean(user);
  const isAuthenticatedGuest = isAuthenticated && isGuest;
  const isAuthenticatedRegistered = isAuthenticated && !isGuest;

  useEffect(() => {
    if (!isAuthenticatedGuest && isGuestModeDialogOpen) {
      setIsGuestModeDialogOpen(false);
    }
  }, [isAuthenticatedGuest, isGuestModeDialogOpen]);

  useEffect(() => {
    if (!isAuthenticatedRegistered && isProfileDialogOpen) {
      setIsProfileDialogOpen(false);
    }
  }, [isAuthenticatedRegistered, isProfileDialogOpen]);

  const handleGuestGoogleLogin = useCallback(async (): Promise<void> => {
    if (!user || !isGuest || submittingAction !== null) {
      return;
    }

    setError(null);
    setSubmittingAction("google");

    try {
      const result = await signInWithGoogle(user);

      if (result.mergedFromGuestId) {
        const mergeResult = await mergeGuestEntriesAfterGoogleSignIn(
          result.mergedFromGuestId,
          result.user.uid,
        );

        if (!mergeResult.success) {
          console.error(mergeResult.error ?? tAuth("mergeUnknownError"));
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
    setSubmittingAction("wipe-guest");

    try {
      const wipeResult = await wipeEntries(user.uid);

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

  const handleProfileWipeData = useCallback(async (): Promise<void> => {
    if (!user || isGuest || submittingAction !== null) {
      return;
    }

    setError(null);
    setSubmittingAction("wipe-user");

    try {
      const wipeResult = await wipeEntries(user.uid);

      if (!wipeResult.success) {
        throw new Error(wipeResult.error ?? tProfile("wipeUnknownError"));
      }

      setIsProfileDialogOpen(false);
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : tProfile("wipeUnknownError");
      setError(message);
    } finally {
      setSubmittingAction(null);
    }
  }, [isGuest, router, submittingAction, tProfile, user]);

  const handleProfileDeleteAccount = useCallback(async (): Promise<void> => {
    if (!user || isGuest || submittingAction !== null) {
      return;
    }

    setError(null);
    setSubmittingAction("delete-account");

    try {
      const userId = user.uid;
      await deleteSignedInUser(user);

      const wipeResult = await wipeEntries(userId);
      if (!wipeResult.success) {
        console.error(wipeResult.error ?? tProfile("wipeUnknownError"));
      }

      setIsProfileDialogOpen(false);
      router.push("/auth/login");
    } catch (err) {
      setError(
        getFirebaseAuthErrorMessage(err, tProfile("deleteAccountUnknownError")),
      );
    } finally {
      setSubmittingAction(null);
    }
  }, [isGuest, router, submittingAction, tProfile, user]);

  const handleMenuAction = useCallback(
    async (key: Key): Promise<void> => {
      const actionKey = String(key);

      if (actionKey === guestModeActionKey) {
        setError(null);
        setIsProfileDialogOpen(false);
        setIsGuestModeDialogOpen(true);
        return;
      }

      if (actionKey === profileActionKey) {
        setError(null);
        setIsGuestModeDialogOpen(false);
        setIsProfileDialogOpen(true);
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
    isProfileDialogOpen,
    onCloseGuestModeDialog: () => setIsGuestModeDialogOpen(false),
    onCloseProfileDialog: () => setIsProfileDialogOpen(false),
    onGuestGoogleLogin: handleGuestGoogleLogin,
    onGuestWipeData: handleGuestWipeData,
    onMenuAction: handleMenuAction,
    onProfileDeleteAccount: handleProfileDeleteAccount,
    onProfileWipeData: handleProfileWipeData,
    submittingAction,
    userPhotoUrl: getAvatarUrl(user?.photoURL),
  };
}
