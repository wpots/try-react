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
    default:
      return fallbackKey;
  }
}
