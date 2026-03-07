import {
  browserPopupRedirectResolver,
  deleteUser,
  getRedirectResult,
  GoogleAuthProvider,
  signInAnonymously as firebaseSignInAnonymously,
  signInWithRedirect,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";

import { FirebaseError } from "firebase/app";

import { auth } from "@/lib/firebase";

import type { User } from "firebase/auth";

const googleProvider = new GoogleAuthProvider();
const GOOGLE_REDIRECT_CONTEXT_KEY = "google-sign-in-redirect-context";

interface GoogleRedirectContext {
  guestEntryIds: string[];
  guestUid: string | null;
}

export interface GoogleSignInResult {
  guestEntryIds: string[];
  mergedFromGuestId: string | null;
  redirectStarted: boolean;
  user: User | null;
}

function canUseSessionStorage(): boolean {
  return globalThis.window !== undefined && globalThis.sessionStorage !== undefined;
}

function readGoogleRedirectContext(): GoogleRedirectContext | null {
  if (!canUseSessionStorage()) {
    return null;
  }

  const storedContext = globalThis.sessionStorage.getItem(GOOGLE_REDIRECT_CONTEXT_KEY);

  if (!storedContext) {
    return null;
  }

  try {
    const parsedContext = JSON.parse(storedContext) as {
      guestEntryIds?: unknown;
      guestUid?: unknown;
    };

    return {
      guestEntryIds: Array.isArray(parsedContext.guestEntryIds)
        ? parsedContext.guestEntryIds.filter((entryId): entryId is string => typeof entryId === "string")
        : [],
      guestUid:
        typeof parsedContext.guestUid === "string" && parsedContext.guestUid.length > 0 ? parsedContext.guestUid : null,
    };
  } catch {
    return null;
  }
}

function consumeGoogleRedirectContext(): GoogleRedirectContext | null {
  const context = readGoogleRedirectContext();

  if (canUseSessionStorage()) {
    globalThis.sessionStorage.removeItem(GOOGLE_REDIRECT_CONTEXT_KEY);
  }

  return context;
}

function persistGoogleRedirectContext(context: GoogleRedirectContext): void {
  if (!canUseSessionStorage()) {
    return;
  }

  globalThis.sessionStorage.setItem(GOOGLE_REDIRECT_CONTEXT_KEY, JSON.stringify(context));
}

function shouldPreferRedirectForGoogleSignIn(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }

  const userAgent = navigator.userAgent;
  const isAndroid = /Android/i.test(userAgent);
  const isIPhone = /iPhone/i.test(userAgent);
  const isIPad = /iPad/i.test(userAgent);
  const isIPadDesktopMode = /Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1;

  return isAndroid || isIPhone || isIPad || isIPadDesktopMode;
}

function shouldFallbackToRedirect(error: unknown): boolean {
  if (!(error instanceof FirebaseError)) {
    return false;
  }

  return error.code === "auth/popup-blocked" || error.code === "auth/operation-not-supported-in-this-environment";
}

async function startGoogleRedirectSignIn(
  guestUid: string | null,
  guestEntryIds: string[],
): Promise<GoogleSignInResult> {
  persistGoogleRedirectContext({
    guestEntryIds,
    guestUid,
  });

  await signInWithRedirect(auth, googleProvider, browserPopupRedirectResolver);

  return {
    guestEntryIds,
    mergedFromGuestId: guestUid,
    redirectStarted: true,
    user: null,
  };
}

export async function signInAnonymously(): Promise<User> {
  try {
    const userCredential = await firebaseSignInAnonymously(auth);
    return userCredential.user;
  } catch (err) {
    console.error("Error signing in anonymously:", err);
    throw err;
  }
}

export async function completeGoogleRedirectSignIn(): Promise<GoogleSignInResult | null> {
  const redirectContext = consumeGoogleRedirectContext();
  const userCredential = await getRedirectResult(auth, browserPopupRedirectResolver);

  if (!userCredential) {
    return null;
  }

  return {
    guestEntryIds: redirectContext?.guestEntryIds ?? [],
    mergedFromGuestId: redirectContext?.guestUid ?? null,
    redirectStarted: false,
    user: userCredential.user,
  };
}

/**
 * Sign in with Google via popup.
 *
 * Passing `browserPopupRedirectResolver` explicitly ensures the SDK uses
 * `postMessage` for the parent ↔ popup handshake rather than cross-origin
 * cookies/storage — this fixes "The requested action is invalid" on browsers
 * that block third-party storage (Safari ITP, Firefox ETP, Brave).
 */
export async function signInWithGoogle(user?: User | null, guestEntryIds: string[] = []): Promise<GoogleSignInResult> {
  const guestUid = user?.isAnonymous ? user.uid : null;

  if (shouldPreferRedirectForGoogleSignIn()) {
    return startGoogleRedirectSignIn(guestUid, guestEntryIds);
  }

  try {
    const userCredential = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);

    return {
      guestEntryIds,
      mergedFromGuestId: guestUid,
      redirectStarted: false,
      user: userCredential.user,
    };
  } catch (err) {
    if (shouldFallbackToRedirect(err)) {
      return startGoogleRedirectSignIn(guestUid, guestEntryIds);
    }

    console.error("Error signing in with Google:", err);
    throw err;
  }
}

export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (err) {
    console.error("Error signing out:", err);
    throw err;
  }
}

export async function deleteSignedInUser(user: User): Promise<void> {
  try {
    await deleteUser(user);
  } catch (err) {
    console.error("Error deleting account:", err);
    throw err;
  }
}
