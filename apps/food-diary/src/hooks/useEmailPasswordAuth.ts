import { useTranslations } from "next-intl";
import { useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "@/i18n/navigation";
import { trackAuthMethodUsed } from "@/lib/analytics";
import { sendPasswordReset, signInWithEmailPassword, signUpWithEmailPassword } from "@/lib/auth";
import { getGuestEntryIds } from "@/lib/firestore/helpers";
import { getFirebaseAuthErrorKey } from "@/lib/getFirebaseAuthErrorMessage";
import { mergeGuestEntriesAfterGoogleSignIn } from "@/utils/mergeGuestEntriesAfterGoogleSignIn";

import type { UserCredential } from "firebase/auth";

export type EmailPasswordView = "idle" | "email-entry";
export type EmailSubmittingMethod = "email-signin" | "email-signup" | "email-reset" | null;

export interface UseEmailPasswordAuthResult {
  view: EmailPasswordView;
  email: string;
  password: string;
  error: string | null;
  successMessage: string | null;
  submittingMethod: EmailSubmittingMethod;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onShowEmailEntry: () => void;
  onSignIn: () => Promise<void>;
  onSignUp: () => Promise<void>;
  onSendPasswordReset: () => Promise<void>;
  onBack: () => void;
}

export function useEmailPasswordAuth({
  redirectPath,
  isBusy,
}: {
  redirectPath: string;
  isBusy: boolean;
}): UseEmailPasswordAuthResult {
  const t = useTranslations("auth");
  const router = useRouter();
  const { user } = useAuth();

  const [view, setView] = useState<EmailPasswordView>("idle");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submittingMethod, setSubmittingMethod] = useState<EmailSubmittingMethod>(null);

  const isSubmitting = submittingMethod !== null;

  const onShowEmailEntry = (): void => {
    setError(null);
    setSuccessMessage(null);
    setEmail("");
    setPassword("");
    setView("email-entry");
  };

  const onBack = (): void => {
    setView("idle");
    setError(null);
    setSuccessMessage(null);
    setEmail("");
    setPassword("");
  };

  async function performMergeAndNavigate(userCredential: UserCredential): Promise<void> {
    const guestEntryIds = user?.isAnonymous ? await getGuestEntryIds(user.uid) : [];
    const guestUid = user?.isAnonymous ? user.uid : null;

    if (guestUid && userCredential.user) {
      const mergeResult = await mergeGuestEntriesAfterGoogleSignIn(guestUid, userCredential.user, guestEntryIds);
      if (!mergeResult.success) {
        console.error(mergeResult.error ?? t("mergeUnknownError"));
      }
    }

    router.push(redirectPath);
  }

  const onSignIn = async (): Promise<void> => {
    if (isBusy || isSubmitting) return;
    setError(null);
    setSuccessMessage(null);
    setSubmittingMethod("email-signin");

    try {
      const userCredential = await signInWithEmailPassword(email, password);
      trackAuthMethodUsed("email");
      await performMergeAndNavigate(userCredential);
    } catch (err) {
      const key = getFirebaseAuthErrorKey(err, "emailLoginUnknownError");
      setError(t(key));
    } finally {
      setSubmittingMethod(null);
    }
  };

  const onSignUp = async (): Promise<void> => {
    if (isBusy || isSubmitting) return;
    setError(null);
    setSuccessMessage(null);
    setSubmittingMethod("email-signup");

    try {
      const userCredential = await signUpWithEmailPassword(email, password);
      trackAuthMethodUsed("email");
      await performMergeAndNavigate(userCredential);
    } catch (err) {
      const key = getFirebaseAuthErrorKey(err, "emailSignUpUnknownError");
      setError(t(key));
    } finally {
      setSubmittingMethod(null);
    }
  };

  const onSendPasswordReset = async (): Promise<void> => {
    if (isBusy || isSubmitting) return;
    setError(null);
    setSuccessMessage(null);
    setSubmittingMethod("email-reset");

    try {
      await sendPasswordReset(email);
      setSuccessMessage(t("passwordResetSent"));
    } catch (err) {
      const key = getFirebaseAuthErrorKey(err, "emailLoginUnknownError");
      setError(t(key));
    } finally {
      setSubmittingMethod(null);
    }
  };

  return {
    view,
    email,
    password,
    error,
    successMessage,
    submittingMethod,
    onEmailChange: setEmail,
    onPasswordChange: setPassword,
    onShowEmailEntry,
    onSignIn,
    onSignUp,
    onSendPasswordReset,
    onBack,
  };
}
