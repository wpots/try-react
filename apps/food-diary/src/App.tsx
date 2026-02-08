import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { User, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import firebaseApp from "@/lib/firebase";
import { signInGuestUser, onAuthStateChanged, auth } from "@/lib/firebase";
import { Button } from "@repo/ui";
import "./App.css";

console.log("Firebase initialized:", firebaseApp);

function App() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState<User | null>(null);

  const googleAuthProvider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      if (currentUser) {
        setUser(currentUser);
        console.log("User is signed in:", currentUser.uid, "(isAnonymous:", currentUser.isAnonymous, ")");
      } else {
        setUser(null);
        console.log("No user is signed in.");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      console.log("Google user signed in:", result.user.uid);
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount(count => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
      <Button type="button">Hello Shared UI</Button>
      {user ? (
        <p>
          Signed in as user: {user.uid} (Guest: {user.isAnonymous ? "Yes" : "No"})
        </p>
      ) : (
        <>
          <Button
            type="button"
            onClick={async () => {
              try {
                await signInGuestUser();
              } catch (error) {
                console.error("Guest sign-in error:", error);
              }
            }}
          >
            Continue as Guest
          </Button>
          <Button type="button" onClick={handleGoogleLogin}>
            Login with Google
          </Button>
        </>
      )}
    </>
  );
}

export default App;
