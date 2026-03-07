"use client";

import { Button, GoogleIcon, TextField, Typography } from "@repo/ui";
import { ArrowLeft, Mail, Phone, User } from "lucide-react";
import { useTranslations } from "next-intl";

import { useEmailPasswordAuth } from "@/hooks/useEmailPasswordAuth";
import { PHONE_RECAPTCHA_CONTAINER_ID, usePhoneAuth } from "@/hooks/usePhoneAuth";

import { useAuthButtons } from "./useAuthButtons";

import type { AuthButtonsProps } from "./index";


export function AuthButtons({ redirectPath = "/dashboard" }: AuthButtonsProps): React.JSX.Element {
  const t = useTranslations("auth");

  const phoneAuth = usePhoneAuth({ redirectPath, isBusy: false });
  const emailAuth = useEmailPasswordAuth({ redirectPath, isBusy: false });

  const externalBusy = phoneAuth.isSubmitting || emailAuth.submittingMethod !== null;

  const { error, isGuest, isGoogleDisabled, isGuestDisabled, onGuestLogin, onGoogleLogin, submittingMethod, userUid } =
    useAuthButtons({ redirectPath, externalBusy });

  const isAnyBusy = submittingMethod !== null || externalBusy;
  const isPhoneDisabled = isAnyBusy;
  const isEmailDisabled = isAnyBusy;

  // ─── Phone: enter phone number ───────────────────────────────────────────────
  if (phoneAuth.view === "phone-entry") {
    return (
      <>
        <TextField
          autoFocus
          id="phone-number"
          inputMode="tel"
          label={t("phoneNumber")}
          onChange={phoneAuth.onPhoneNumberChange}
          placeholder={t("phonePlaceholder")}
          type="tel"
          value={phoneAuth.phoneNumber}
        />

        <div id={PHONE_RECAPTCHA_CONTAINER_ID} />

        <Button
          className="w-full"
          disabled={phoneAuth.isSubmitting || !phoneAuth.phoneNumber.trim()}
          onClick={phoneAuth.onSendSms}
          type="button"
        >
          {phoneAuth.isSubmitting ? t("sendingSms") : t("sendSms")}
        </Button>

        <Button className="w-full" onClick={phoneAuth.onBack} type="button" variant="secondary">
          <ArrowLeft aria-hidden className="h-4 w-4" />
          {t("backToLogin")}
        </Button>

        {phoneAuth.error ? (
          <Typography variant="body" className="font-ds-body-sm text-danger">
            {phoneAuth.error}
          </Typography>
        ) : null}
      </>
    );
  }

  // ─── Phone: enter SMS code ────────────────────────────────────────────────────
  if (phoneAuth.view === "sms-entry") {
    return (
      <>
        <TextField
          autoFocus
          id="sms-code"
          inputMode="numeric"
          label={t("smsCode")}
          onChange={phoneAuth.onSmsCodeChange}
          placeholder={t("smsCodePlaceholder")}
          type="text"
          value={phoneAuth.smsCode}
        />

        <Button
          className="w-full"
          disabled={phoneAuth.isSubmitting || !phoneAuth.smsCode.trim()}
          onClick={phoneAuth.onVerifyCode}
          type="button"
        >
          {phoneAuth.isSubmitting ? t("verifyingCode") : t("verifyCode")}
        </Button>

        <Button className="w-full" onClick={phoneAuth.onBack} type="button" variant="secondary">
          <ArrowLeft aria-hidden className="h-4 w-4" />
          {t("backToLogin")}
        </Button>

        {phoneAuth.error ? (
          <Typography variant="body" className="font-ds-body-sm text-danger">
            {phoneAuth.error}
          </Typography>
        ) : null}
      </>
    );
  }

  // ─── Email/password form ──────────────────────────────────────────────────────
  if (emailAuth.view === "email-entry") {
    return (
      <>
        <TextField
          autoFocus
          id="email"
          inputMode="email"
          label={t("email")}
          onChange={emailAuth.onEmailChange}
          placeholder={t("emailPlaceholder")}
          type="email"
          value={emailAuth.email}
        />

        <TextField
          id="password"
          label={t("password")}
          onChange={emailAuth.onPasswordChange}
          placeholder={t("passwordPlaceholder")}
          type="password"
          value={emailAuth.password}
        />

        <Button
          className="w-full"
          disabled={
            emailAuth.submittingMethod !== null || !emailAuth.email.trim() || !emailAuth.password.trim()
          }
          onClick={emailAuth.onSignIn}
          type="button"
        >
          {emailAuth.submittingMethod === "email-signin" ? t("signingIn") : t("signIn")}
        </Button>

        <Button
          className="w-full"
          disabled={
            emailAuth.submittingMethod !== null || !emailAuth.email.trim() || !emailAuth.password.trim()
          }
          onClick={emailAuth.onSignUp}
          type="button"
          variant="secondary"
        >
          {emailAuth.submittingMethod === "email-signup" ? t("creatingAccount") : t("createAccount")}
        </Button>

        <Button
          className="w-full"
          disabled={emailAuth.submittingMethod !== null || !emailAuth.email.trim()}
          onClick={emailAuth.onSendPasswordReset}
          type="button"
          variant="secondary"
        >
          {emailAuth.submittingMethod === "email-reset" ? t("sendingPasswordReset") : t("forgotPassword")}
        </Button>

        <Button className="w-full" onClick={emailAuth.onBack} type="button" variant="secondary">
          <ArrowLeft aria-hidden className="h-4 w-4" />
          {t("backToLogin")}
        </Button>

        {emailAuth.successMessage ? (
          <Typography variant="body" className="font-ds-body-sm text-ds-on-surface">
            {emailAuth.successMessage}
          </Typography>
        ) : null}

        {emailAuth.error ? (
          <Typography variant="body" className="font-ds-body-sm text-danger">
            {emailAuth.error}
          </Typography>
        ) : null}
      </>
    );
  }

  // ─── Default: all four auth options ──────────────────────────────────────────
  return (
    <>
      {userUid ? (
        <Typography variant="body" className="font-ds-body-sm text-ds-on-surface-secondary">
          {isGuest ? t("signedInGuest") : t("signedInUser", { uid: userUid })}
        </Typography>
      ) : null}

      <Button className="w-full" disabled={isGuestDisabled} onClick={onGuestLogin} type="button" variant="secondary">
        <User aria-hidden />
        {submittingMethod === "guest" ? t("guestLoginLoading") : t("continueAsGuest")}
      </Button>

      <Button className="w-full" disabled={isGoogleDisabled} onClick={onGoogleLogin} type="button">
        <GoogleIcon className="h-5 w-5" />
        {submittingMethod === "google" ? t("googleLoginLoading") : t("continueWithGoogle")}
      </Button>

      <Button
        className="w-full"
        disabled={isPhoneDisabled}
        onClick={phoneAuth.onShowPhoneEntry}
        type="button"
        variant="secondary"
      >
        <Phone aria-hidden className="h-5 w-5" />
        {t("continueWithPhone")}
      </Button>

      <Button
        className="w-full"
        disabled={isEmailDisabled}
        onClick={emailAuth.onShowEmailEntry}
        type="button"
        variant="secondary"
      >
        <Mail aria-hidden className="h-5 w-5" />
        {t("continueWithEmail")}
      </Button>

      {error ? (
        <Typography variant="body" className="font-ds-body-sm text-danger">
          {error}
        </Typography>
      ) : null}
    </>
  );
}
