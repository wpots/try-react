import { getApp, getApps, initializeApp, type FirebaseOptions } from "firebase/app";
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInAnonymously, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

interface RuntimeEnv {
  NEXT_PUBLIC_FIREBASE_API_KEY?: string;
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?: string;
  NEXT_PUBLIC_FIREBASE_PROJECT_ID?: string;
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?: string;
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?: string;
  NEXT_PUBLIC_FIREBASE_APP_ID?: string;
  VITE_FIREBASE_API_KEY?: string;
  VITE_FIREBASE_AUTH_DOMAIN?: string;
  VITE_FIREBASE_PROJECT_ID?: string;
  VITE_FIREBASE_STORAGE_BUCKET?: string;
  VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
  VITE_FIREBASE_APP_ID?: string;
  STORYBOOK?: string | boolean;
  NODE_ENV?: string;
}

function readRuntimeEnv(): RuntimeEnv {
  if (typeof import.meta !== "undefined" && typeof import.meta.env === "object" && import.meta.env) {
    return import.meta.env as RuntimeEnv;
  }

  if (typeof process !== "undefined" && process.env) {
    return process.env as RuntimeEnv;
  }

  return {};
}

const runtimeEnv = readRuntimeEnv();

const firebaseConfig: FirebaseOptions = {
  apiKey: runtimeEnv.NEXT_PUBLIC_FIREBASE_API_KEY ?? runtimeEnv.VITE_FIREBASE_API_KEY,
  authDomain: runtimeEnv.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? runtimeEnv.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: runtimeEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? runtimeEnv.VITE_FIREBASE_PROJECT_ID,
  storageBucket: runtimeEnv.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? runtimeEnv.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    runtimeEnv.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? runtimeEnv.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: runtimeEnv.NEXT_PUBLIC_FIREBASE_APP_ID ?? runtimeEnv.VITE_FIREBASE_APP_ID,
};

const missingVars = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

const isStorybookRuntime =
  runtimeEnv.STORYBOOK === true || runtimeEnv.STORYBOOK === "true" || runtimeEnv.STORYBOOK === "1";

const isDevWithoutConfig =
  missingVars.length > 0 &&
  (runtimeEnv.NODE_ENV === "development" || (typeof process !== "undefined" && process.env.NODE_ENV === "development"));

if (missingVars.length > 0 && !isStorybookRuntime && !isDevWithoutConfig) {
  throw new Error(`Missing Firebase environment variables: ${missingVars.join(", ")}`);
}

if (missingVars.length > 0 && (isStorybookRuntime || isDevWithoutConfig)) {
  console.warn(
    `Firebase config missing: ${missingVars.join(", ")}. ` + "Using placeholder config (auth will not work).",
  );
}

const app =
  getApps().length > 0
    ? getApp()
    : initializeApp({
        apiKey: firebaseConfig.apiKey ?? "storybook",
        authDomain: firebaseConfig.authDomain ?? "storybook.local",
        projectId: firebaseConfig.projectId ?? "storybook",
        storageBucket: firebaseConfig.storageBucket ?? "storybook.appspot.com",
        messagingSenderId: firebaseConfig.messagingSenderId ?? "0",
        appId: firebaseConfig.appId ?? "1:0:web:storybook",
      });

export const auth = getAuth(app);
export const db = getFirestore(app);

export { GoogleAuthProvider, onAuthStateChanged, signInAnonymously, signInWithPopup };

export const getCurrentUser = () => auth.currentUser;

export const signInGuestUser = async () => {
  const userCredential = await signInAnonymously(auth);
  return userCredential.user;
};

export default app;
