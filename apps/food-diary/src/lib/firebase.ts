import { getApp, getApps, initializeApp, type FirebaseOptions } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import type { User } from "firebase/auth";

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

function readImportMetaEnv(): RuntimeEnv {
  if (
    typeof import.meta === "undefined" ||
    typeof import.meta.env !== "object" ||
    !import.meta.env
  ) {
    return {};
  }

  return {
    NEXT_PUBLIC_FIREBASE_API_KEY: import.meta.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
      import.meta.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID:
      import.meta.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
      import.meta.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
      import.meta.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: import.meta.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    VITE_FIREBASE_MESSAGING_SENDER_ID:
      import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
    STORYBOOK: import.meta.env.STORYBOOK,
    NODE_ENV: import.meta.env.NODE_ENV,
  };
}

const importMetaEnv = readImportMetaEnv();

const processEnv: RuntimeEnv = {
  NEXT_PUBLIC_FIREBASE_API_KEY:
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_FIREBASE_API_KEY
      : undefined,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
      : undefined,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID:
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
      : undefined,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
      : undefined,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
      : undefined,
  NEXT_PUBLIC_FIREBASE_APP_ID:
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_FIREBASE_APP_ID
      : undefined,
  STORYBOOK:
    typeof process !== "undefined" ? process.env.STORYBOOK : undefined,
  NODE_ENV:
    typeof process !== "undefined" ? process.env.NODE_ENV : undefined,
};

const firebaseConfig: FirebaseOptions = {
  apiKey:
    processEnv.NEXT_PUBLIC_FIREBASE_API_KEY ??
    importMetaEnv.NEXT_PUBLIC_FIREBASE_API_KEY ??
    importMetaEnv.VITE_FIREBASE_API_KEY,
  authDomain:
    processEnv.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ??
    importMetaEnv.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ??
    importMetaEnv.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:
    processEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID ??
    importMetaEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID ??
    importMetaEnv.VITE_FIREBASE_PROJECT_ID,
  storageBucket:
    processEnv.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    importMetaEnv.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    importMetaEnv.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    processEnv.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ??
    importMetaEnv.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ??
    importMetaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:
    processEnv.NEXT_PUBLIC_FIREBASE_APP_ID ??
    importMetaEnv.NEXT_PUBLIC_FIREBASE_APP_ID ??
    importMetaEnv.VITE_FIREBASE_APP_ID,
};

const missingVars = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

const storybookEnv = processEnv.STORYBOOK ?? importMetaEnv.STORYBOOK;
const nodeEnv = processEnv.NODE_ENV ?? importMetaEnv.NODE_ENV;

const isStorybookRuntime =
  storybookEnv === true || storybookEnv === "true" || storybookEnv === "1";

const isDevWithoutConfig =
  missingVars.length > 0 && nodeEnv === "development";

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

/** Subscribe to Firebase Auth state changes. Returns an unsubscribe function. */
export function subscribeToAuthState(
  callback: (user: User | null) => void,
): () => void {
  return onAuthStateChanged(auth, callback);
}

export const getCurrentUser = () => auth.currentUser;

export default app;
