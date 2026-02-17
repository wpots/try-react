"use client";

import { useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import { signOut } from "firebase/auth";
import { useTranslations } from "next-intl";
import { auth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "@/lib/firebase";
import { getFirebaseAuthErrorMessage } from "@/lib/getFirebaseAuthErrorMessage";

const AuthTestPage = () => {
  const t = useTranslations("auth");
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const googleProvider = useMemo(() => new GoogleAuthProvider(), []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const message = getFirebaseAuthErrorMessage(err, "Google login failed.");
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setError(null);
    setLoading(true);
    try {
      await signOut(auth);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign out failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "40rem" }}>
      <h1>{t("title")}</h1>
      <p>{t("subtitle")}</p>

      {user ? (
        <div>
          <p>
            Signed in as: <strong>{user.email ?? user.uid}</strong>
          </p>
          <button type="button" onClick={handleSignOut} disabled={loading}>
            {loading ? "Signing out..." : "Sign out"}
          </button>
        </div>
      ) : (
        <button type="button" onClick={handleGoogleLogin} disabled={loading}>
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>
      )}

      {error ? <p style={{ color: "red", marginTop: "1rem" }}>{error}</p> : null}
    </main>
  );
};

export default AuthTestPage;
