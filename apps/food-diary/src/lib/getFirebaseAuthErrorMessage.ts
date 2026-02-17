import { FirebaseError } from "firebase/app";

function getActiveHostname(): string {
  if (typeof window === "undefined") {
    return "this domain";
  }

  return window.location.hostname;
}

function getDefaultMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (!(error instanceof Error)) {
    return fallbackMessage;
  }

  const message = error.message.trim();
  if (!message) {
    return fallbackMessage;
  }

  return message;
}

/**
 * Maps Firebase Auth errors to actionable user-facing messages.
 */
export function getFirebaseAuthErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (!(error instanceof FirebaseError)) {
    return getDefaultMessage(error, fallbackMessage);
  }

  const host = getActiveHostname();

  if (error.code === "auth/unauthorized-domain") {
    return (
      `Google sign-in is blocked for ${host}. ` +
      "Add this domain in Firebase Authentication settings."
    );
  }

  if (error.code === "auth/operation-not-allowed") {
    return (
      "Google sign-in is disabled for this Firebase project. " +
      "Enable the Google provider in Firebase Authentication."
    );
  }

  if (error.code === "auth/popup-blocked") {
    return "Your browser blocked the sign-in popup. Allow popups and retry.";
  }

  if (error.code === "auth/popup-closed-by-user") {
    return "The sign-in popup was closed before login finished.";
  }

  if (error.code === "auth/cancelled-popup-request") {
    return "A sign-in request is already in progress. Wait and try again.";
  }

  if (error.code === "auth/network-request-failed") {
    return "Network request failed during sign-in. Check your connection.";
  }

  if (error.code === "auth/auth-domain-config-required") {
    return (
      "Firebase authDomain is missing in app config. " +
      "Set NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN."
    );
  }

  if (error.code === "auth/invalid-api-key") {
    return "Firebase API key is invalid. Check NEXT_PUBLIC_FIREBASE_API_KEY.";
  }

  return `${fallbackMessage} (${error.code})`;
}
