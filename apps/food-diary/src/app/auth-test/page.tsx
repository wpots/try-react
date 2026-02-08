"use client";

import { useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import { signOut } from "firebase/auth";
import { auth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "@/lib/firebase";

const AuthTestPage = () => {
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
      const message = err instanceof Error ? err.message : "Google login failed.";
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
      <h1>Auth Test</h1>
      <p>Use this page to validate Firebase Google login.</p>

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
