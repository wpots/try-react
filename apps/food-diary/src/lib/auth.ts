import type { User } from "firebase/auth";
import { signInAnonymously as firebaseSignInAnonymously } from "firebase/auth";
import { auth } from "@/lib/firebase";

export async function signInAnonymously(): Promise<User> {
  try {
    const userCredential = await firebaseSignInAnonymously(auth);
    return userCredential.user;
  } catch (err) {
    console.error("Error signing in anonymously:", err);
    throw err;
  }
}
