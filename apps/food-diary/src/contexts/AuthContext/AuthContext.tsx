"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { User } from "firebase/auth";
import { mergeGuestEntries } from "@/app/actions";
import { auth, onAuthStateChanged } from "@/lib/firebase";
import type { AuthContextValue, AuthProviderProps } from "./index";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const pendingMergeGuestIdStorageKey = "pendingMergeGuestId";

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pendingMergeGuestIdRef = useRef<string | null>(null);

  useEffect(() => {
    const pendingGuestId = window.localStorage.getItem(
      pendingMergeGuestIdStorageKey,
    );
    pendingMergeGuestIdRef.current = pendingGuestId;
  }, []);

  const markGuestForMerge = useCallback((guestId: string): void => {
    if (!guestId) {
      return;
    }

    pendingMergeGuestIdRef.current = guestId;
    window.localStorage.setItem(pendingMergeGuestIdStorageKey, guestId);
  }, []);

  const clearGuestMergeMarker = useCallback((): void => {
    pendingMergeGuestIdRef.current = null;
    window.localStorage.removeItem(pendingMergeGuestIdStorageKey);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (!currentUser || currentUser.isAnonymous) {
        return;
      }

      const pendingGuestId = pendingMergeGuestIdRef.current;
      if (!pendingGuestId || pendingGuestId === currentUser.uid) {
        clearGuestMergeMarker();
        return;
      }

      void (async () => {
        const result = await mergeGuestEntries(pendingGuestId, currentUser.uid);
        if (!result.success) {
          console.error(result.error ?? "Failed to merge guest entries.");
        }
        clearGuestMergeMarker();
      })();
    });

    return () => {
      unsubscribe();
    };
  }, [clearGuestMergeMarker]);

  const value = useMemo(
    () => ({
      user,
      loading,
      isGuest: Boolean(user?.isAnonymous),
      markGuestForMerge,
    }),
    [loading, markGuestForMerge, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
