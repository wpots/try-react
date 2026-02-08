import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { FirebaseError } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB8-zyjKwH64jJ2EZ5l0Umiy41bC09_cTY",
  authDomain: "the-react-you.firebaseapp.com",
  projectId: "the-react-you",
  storageBucket: "the-react-you.firebasestorage.app",
  messagingSenderId: "6521631914",
  appId: "1:6521631914:web:075dc058850dad0e03ccd3",
  measurementId: "G-5632DNZE3E",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export { signInAnonymously, onAuthStateChanged, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup };

export const signInGuestUser = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    const user = userCredential.user;
    console.log("Guest user signed in:", user.uid);
    return user;
  } catch (error) {
    console.error("Guest sign-in error:", error);
    throw error;
  }
};
export default app;
