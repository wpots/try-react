import { RecaptchaVerifier } from "firebase/auth";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "@/i18n/navigation";
import { trackAuthMethodUsed } from "@/lib/analytics";
import { sendPhoneVerificationSms } from "@/lib/auth";
import { auth } from "@/lib/firebase";
import { getGuestEntryIds } from "@/lib/firestore/helpers";
import { getFirebaseAuthErrorKey } from "@/lib/getFirebaseAuthErrorMessage";
import { mergeGuestEntriesAfterGoogleSignIn } from "@/utils/mergeGuestEntriesAfterGoogleSignIn";

import type { ConfirmationResult } from "firebase/auth";

export type PhoneAuthView = "idle" | "phone-entry" | "sms-entry";

export interface UsePhoneAuthResult {
  view: PhoneAuthView;
  phoneNumber: string;
  smsCode: string;
  error: string | null;
  isSubmitting: boolean;
  onPhoneNumberChange: (value: string) => void;
  onSmsCodeChange: (value: string) => void;
  onShowPhoneEntry: () => void;
  onSendSms: () => Promise<void>;
  onVerifyCode: () => Promise<void>;
  onBack: () => void;
  recaptchaContainerId: string;
}

const RECAPTCHA_CONTAINER_ID = "phone-recaptcha-container";

export function usePhoneAuth({
  redirectPath,
  isBusy,
}: {
  redirectPath: string;
  isBusy: boolean;
}): UsePhoneAuthResult {
  const t = useTranslations("auth");
  const router = useRouter();
  const { user } = useAuth();

  const [view, setView] = useState<PhoneAuthView>("idle");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const confirmationResultRef = useRef<ConfirmationResult | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  function getOrCreateRecaptchaVerifier(): RecaptchaVerifier {
    if (recaptchaVerifierRef.current) {
      return recaptchaVerifierRef.current;
    }

    const verifier = new RecaptchaVerifier(auth, RECAPTCHA_CONTAINER_ID, { size: "invisible" });
    recaptchaVerifierRef.current = verifier;
    return verifier;
  }

  function clearRecaptchaVerifier(): void {
    if (recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current.clear();
      recaptchaVerifierRef.current = null;
    }
  }

  const onShowPhoneEntry = (): void => {
    setError(null);
    setPhoneNumber("");
    setSmsCode("");
    setView("phone-entry");
  };

  const onBack = (): void => {
    setView("idle");
    setError(null);
    setPhoneNumber("");
    setSmsCode("");
    confirmationResultRef.current = null;
    clearRecaptchaVerifier();
  };

  const onSendSms = async (): Promise<void> => {
    if (isBusy || isSubmitting) return;
    setError(null);
    setIsSubmitting(true);

    try {
      const verifier = getOrCreateRecaptchaVerifier();
      const confirmationResult = await sendPhoneVerificationSms(phoneNumber, verifier);
      confirmationResultRef.current = confirmationResult;
      setView("sms-entry");
    } catch (err) {
      const key = getFirebaseAuthErrorKey(err, "phoneLoginUnknownError");
      setError(t(key));
      clearRecaptchaVerifier();
    } finally {
      setIsSubmitting(false);
    }
  };

  const onVerifyCode = async (): Promise<void> => {
    if (isBusy || isSubmitting || !confirmationResultRef.current) return;
    setError(null);
    setIsSubmitting(true);

    try {
      const guestEntryIds = user?.isAnonymous ? await getGuestEntryIds(user.uid) : [];
      const guestUid = user?.isAnonymous ? user.uid : null;

      const userCredential = await confirmationResultRef.current.confirm(smsCode);

      trackAuthMethodUsed("phone");

      if (guestUid && userCredential.user) {
        const mergeResult = await mergeGuestEntriesAfterGoogleSignIn(guestUid, userCredential.user, guestEntryIds);
        if (!mergeResult.success) {
          console.error(mergeResult.error ?? t("mergeUnknownError"));
        }
      }

      router.push(redirectPath);
    } catch (err) {
      const key = getFirebaseAuthErrorKey(err, "phoneLoginUnknownError");
      setError(t(key));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    view,
    phoneNumber,
    smsCode,
    error,
    isSubmitting,
    onPhoneNumberChange: setPhoneNumber,
    onSmsCodeChange: setSmsCode,
    onShowPhoneEntry,
    onSendSms,
    onVerifyCode,
    onBack,
    recaptchaContainerId: RECAPTCHA_CONTAINER_ID,
  };
}
