import { FirebaseError } from "firebase/app";

/**
 * Maps Firebase Auth error codes to translation keys under the `auth` namespace.
 * Returns `fallbackKey` when the error is not a recognised Firebase Auth error.
 */
export function getFirebaseAuthErrorKey(error: unknown, fallbackKey: string): string {
  if (!(error instanceof FirebaseError)) {
    return fallbackKey;
  }

  switch (error.code) {
    case "auth/unauthorized-domain":
      return "firebase.unauthorizedDomain";
    case "auth/operation-not-allowed":
      return "firebase.operationNotAllowed";
    case "auth/popup-blocked":
      return "firebase.popupBlocked";
    case "auth/popup-closed-by-user":
      return "firebase.popupClosedByUser";
    case "auth/cancelled-popup-request":
      return "firebase.cancelledPopupRequest";
    case "auth/network-request-failed":
      return "firebase.networkRequestFailed";
    case "auth/requires-recent-login":
      return "firebase.requiresRecentLogin";
    case "auth/auth-domain-config-required":
      return "firebase.authDomainConfigRequired";
    case "auth/invalid-api-key":
      return "firebase.invalidApiKey";
    case "auth/invalid-action-code":
      return "firebase.invalidActionCode";
    case "auth/invalid-phone-number":
      return "firebase.invalidPhoneNumber";
    case "auth/missing-phone-number":
      return "firebase.missingPhoneNumber";
    case "auth/quota-exceeded":
      return "firebase.quotaExceeded";
    case "auth/user-disabled":
      return "firebase.userDisabled";
    case "auth/invalid-verification-code":
      return "firebase.invalidVerificationCode";
    case "auth/missing-verification-code":
      return "firebase.missingVerificationCode";
    case "auth/code-expired":
      return "firebase.sessionExpired";
    case "auth/session-expired":
      return "firebase.sessionExpired";
    case "auth/email-already-in-use":
      return "firebase.emailAlreadyInUse";
    case "auth/invalid-email":
      return "firebase.invalidEmail";
    case "auth/wrong-password":
      return "firebase.wrongPassword";
    case "auth/user-not-found":
      return "firebase.userNotFound";
    case "auth/invalid-credential":
      return "firebase.wrongPassword";
    case "auth/weak-password":
      return "firebase.weakPassword";
    case "auth/too-many-requests":
      return "firebase.tooManyRequests";
    default:
      return fallbackKey;
  }
}
