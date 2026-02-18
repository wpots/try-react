import { FirebaseError } from "firebase/app";
import {
  deleteUser,
  GoogleAuthProvider,
  linkWithPopup,
  signInAnonymously as firebaseSignInAnonymously,
  signInWithCredential,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

import type { User } from "firebase/auth";

const googleProvider = new GoogleAuthProvider();
const credentialAlreadyInUseErrorCode = "auth/credential-already-in-use";
const accountExistsDifferentCredentialErrorCode =
  "auth/account-exists-with-different-credential";

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

export async function signInWithGoogle(
  user?: User | null,
): Promise<GoogleSignInResult> {
  try {
    if (user?.isAnonymous) {
      const userCredential = await linkWithPopup(user, googleProvider);
      return {
        user: userCredential.user,
        mergedFromGuestId: null,
      };
    }

    const userCredential = await signInWithPopup(auth, googleProvider);
    return {
      user: userCredential.user,
      mergedFromGuestId: null,
    };
  } catch (err) {
    if (
      user?.isAnonymous &&
      err instanceof FirebaseError &&
      (err.code === credentialAlreadyInUseErrorCode ||
        err.code === accountExistsDifferentCredentialErrorCode)
    ) {
      const credential = GoogleAuthProvider.credentialFromError(err);
      if (credential) {
        const existingUserCredential = await signInWithCredential(
          auth,
          credential,
        );
        return {
          user: existingUserCredential.user,
          mergedFromGuestId: user.uid,
        };
      }
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
