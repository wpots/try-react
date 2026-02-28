import {
  browserPopupRedirectResolver,
  deleteUser,
  GoogleAuthProvider,
  signInAnonymously as firebaseSignInAnonymously,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

import type { User } from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

export interface GoogleSignInResult {
  user: User;
  mergedFromGuestId: string | null;
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

/**
 * Sign in with Google via popup.
 *
 * Passing `browserPopupRedirectResolver` explicitly ensures the SDK uses
 * `postMessage` for the parent ↔ popup handshake rather than cross-origin
 * cookies/storage — this fixes "The requested action is invalid" on browsers
 * that block third-party storage (Safari ITP, Firefox ETP, Brave).
 */
export async function signInWithGoogle(user?: User | null): Promise<GoogleSignInResult> {
  const guestUid = user?.isAnonymous ? user.uid : null;

  try {
    const userCredential = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
    return {
      user: userCredential.user,
      mergedFromGuestId: guestUid,
    };
  } catch (err) {
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
