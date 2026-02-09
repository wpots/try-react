import type { User } from "firebase/auth";
import {
  GoogleAuthProvider,
  signInAnonymously as firebaseSignInAnonymously,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

const googleProvider = new GoogleAuthProvider();

export async function signInAnonymously(): Promise<User> {
  try {
    const userCredential = await firebaseSignInAnonymously(auth);
    return userCredential.user;
  } catch (err) {
    console.error("Error signing in anonymously:", err);
    throw err;
  }
}

export async function signInWithGoogle(): Promise<User> {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    return userCredential.user;
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
