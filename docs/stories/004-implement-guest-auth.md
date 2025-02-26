# User Story 004: Implement Guest Authentication

## 1. Title

Implement guest user authentication using Firebase Authentication.

## 2. Goal

To enable guest user functionality in the Food Diary application, allowing users to use the app without creating an account, using Firebase Authentication's anonymous sign-in.

## 3. Description

As a junior developer, I need to implement guest authentication so that users can start using the food diary app immediately without the need to sign up. This will be achieved using Firebase Authentication's anonymous sign-in feature. Guest users' data will be stored in Firestore and can be merged with a permanent account if the user decides to sign up later.

## 4. Technical Details

- **Firebase Authentication:** Utilize Firebase Authentication's `signInAnonymously` method to authenticate guest users.
- **Guest User ID:** Upon successful anonymous sign-in, Firebase will provide a unique user ID for the guest user. This ID will be used to associate diary entries with the guest user in Firestore.
- **Data Storage:** Diary entries for guest users will be stored in Firestore, similar to registered users, using the guest user ID as `userId`.

## 5. Steps to Implement

1. **Import Firebase Auth Functions:**

   - Open `src/firebase.ts`.
   - Import `signInAnonymously` and `onAuthStateChanged` from `firebase/auth`.

     ```typescript
     // src/firebase.ts
     import { initializeApp } from "firebase/app";
     import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
     import { getFirestore } from "firebase/firestore";

     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_STORAGE_BUCKET",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID",
     };

     const app = initializeApp(firebaseConfig);
     export const auth = getAuth(app);
     export const db = getFirestore(app);
     export default app;

     export { signInAnonymously, onAuthStateChanged };
     ```

2. **Implement Guest Sign-in Function:**

   - Create a function in `src/firebase.ts` to handle guest sign-in.

     ```typescript
     // src/firebase.ts
     import { initializeApp } from "firebase/app";
     import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
     import { getFirestore } from "firebase/firestore";

     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_STORAGE_BUCKET",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID",
     };

     const app = initializeApp(firebaseConfig);
     export const auth = getAuth(app);
     export const db = getFirestore(app);
     export default app;

     export const signInGuestUser = async () => {
       try {
         const userCredential = await signInAnonymously(auth);
         const user = userCredential.user;
         console.log("Guest user signed in:", user.uid);
         return user;
       } catch (error: any) {
         console.error("Guest sign-in error:", error);
         throw error;
       }
     };
     ```

3. **Create Guest Login Button/Functionality in React App:**

   - Open `src/App.tsx` (or create a new component for authentication, e.g., `src/components/AuthButtons.tsx`).
   - Add a button that, when clicked, calls the `signInGuestUser` function.
   - Use `useEffect` and `onAuthStateChanged` to listen for authentication state changes and update the UI accordingly.

     ```typescript
     // src/App.tsx
     import React, { useEffect, useState } from "react";
     import Button from "@mui/material/Button";
     import { signInGuestUser, onAuthStateChanged, auth } from "./firebase";

     function App() {
       const [user, setUser] = useState<any>(null); // State to track user

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
         return () => unsubscribe(); // Cleanup subscription
       }, []);

       const handleGuestLogin = async () => {
         try {
           await signInGuestUser();
         } catch (error) {
           // Handle error (e.g., display error message)
         }
       };

       return (
         <>
           <h1>Food Diary App</h1>
           {user ? (
             <p>
               Signed in as user: {user.uid} (Guest: {user.isAnonymous ? "Yes" : "No"})
             </p>
           ) : (
             <Button variant="contained" color="primary" onClick={handleGuestLogin}>
               Continue as Guest
             </Button>
           )}
         </>
       );
     }

     export default App;
     ```

4. **Verify Guest Authentication:**
   - Run the development server (`npm run dev`).
   - You should see a "Continue as Guest" button.
   - Click the button. Check the console for "Guest user signed in:" and "User is signed in:" messages with a UID and `isAnonymous: true`.
   - The UI should update to show "Signed in as user: [UID] (Guest: Yes)".
   - Refresh the page. You should remain signed in as a guest user (check console logs again).

## 6. Acceptance Criteria

- Guest users can sign in anonymously using a "Continue as Guest" button.
- Upon successful guest sign-in, the user's UID is logged to the console, and the UI reflects that a user is signed in as a guest.
- User persistence is maintained across page reloads for guest users.
- No errors during guest authentication process.

## 7. Notes

- This user story implements basic guest authentication. Further stories will cover Google and Facebook login and merging guest data upon account creation.
- Error handling in `handleGuestLogin` can be improved to provide user feedback in case of authentication failures.
