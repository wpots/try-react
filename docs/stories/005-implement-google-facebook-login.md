# User Story 005: Implement Google Login

## 1. Title

Implement Google login using Firebase Authentication.

## 2. Goal

To enable user authentication with Google in the Food Diary application using Firebase Authentication, providing users with options to create persistent accounts.

## 3. Description

As a junior developer, I need to implement Google login functionality so that users can create accounts and have their data persistently stored. This will be done using Firebase Authentication's Google sign-in provider.

## 4. Technical Details

- **Firebase Authentication:** Utilize Firebase Authentication's `signInWithPopup` method for Google login.
- **OAuth Providers:** Google sign-in provider must be enabled in the Firebase Console.
- **User Accounts:** Upon successful Google sign-in, Firebase Authentication will create user accounts. User data will be stored in the `users` collection in Firestore (initially, just user IDs).

## 5. Steps to Implement

1. **Enable Google Sign-in in Firebase Console:**
   - Ensure Google sign-in method is enabled in the Firebase Console as described in User Story 003.
2. **Import Firebase Sign-in Functions:**
   - Open `src/firebase.ts`.
   - Import `GoogleAuthProvider` and `signInWithPopup` from `firebase/auth`.
     ```typescript
     // src/firebase.ts
     import { initializeApp } from "firebase/app";
     import {
       getAuth,
       signInAnonymously,
       onAuthStateChanged,
       GoogleAuthProvider,
       signInWithPopup,
     } from "firebase/auth"; // Import these
     import { getFirestore } from "firebase/firestore";
     // ... (Firebase config and initialization)
     export { signInAnonymously, onAuthStateChanged, GoogleAuthProvider, signInWithPopup }; // Export these
     ```
3. **Implement Google Sign-in Function:**

   - Create a function in `src/firebase.ts` to handle Google sign-in.

     ```typescript
     // src/firebase.ts
     // ... (imports and initialization as before)

     const googleAuthProvider = new GoogleAuthProvider();

     export const signInWithGoogle = async () => {
       try {
         const userCredential = await signInWithPopup(auth, googleAuthProvider);
         const user = userCredential.user;
         console.log("Google user signed in:", user.uid);
         return user;
       } catch (error: any) {
         console.error("Google sign-in error:", error);
         throw error;
       }
     };
     ```

4. **Add Google Login Button in React App:**

   - Open `src/App.tsx` (or `src/components/AuthButtons.tsx`).
   - Add a button for Google login that, when clicked, calls `signInWithGoogle` function.

     ```typescript
     // src/App.tsx
     import React, { useEffect, useState } from "react";
     import Button from "@mui/material/Button";
     import { signInGuestUser, onAuthStateChanged, auth, signInWithGoogle } from "./firebase"; // Import new sign-in functions

     function App() {
       const [user, setUser] = useState<any>(null);

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

       const handleGuestLogin = async () => {
         try {
           await signInGuestUser();
         } catch (error) {
           // Handle error
         }
       };

       const handleGoogleLogin = async () => {
         try {
           await signInWithGoogle();
         } catch (error) {
           // Handle error
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
             <>
               <Button variant="contained" color="primary" onClick={handleGuestLogin}>
                 Continue as Guest
               </Button>
               <Button variant="contained" color="primary" onClick={handleGoogleLogin}>
                 Login with Google
               </Button>
             </>
           )}
         </>
       );
     }

     export default App;
     ```

5. **Verify Google Login:**
   - Run the development server (`npm run dev`).
   - You should see "Continue as Guest" and "Login with Google" buttons.
   - Click "Login with Google" button.
   - Complete the sign-in flow in the pop-up window.
   - Check the console for "Google user signed in:" message with user UID.
   - The UI should update to show "Signed in as user: [UID] (Guest: No)".
   - Refresh the page. You should remain signed in with your Google account.
   - In the Firebase Console, in "Authentication" -> "Users", you should see the newly created user accounts.

## 6. Acceptance Criteria

- Users can sign in with Google using a dedicated button.
- Upon successful Google sign-in, user UIDs are logged to the console, and the UI reflects that a user is signed in (not as guest).
- User persistence is maintained across page reloads for Google users.
- New user accounts are created in Firebase Authentication for Google logins.
- No errors during Google authentication process.

## 7. Notes

- Ensure you have properly configured OAuth client IDs and secrets in the Firebase Console for Google if required.
- Error handling in `handleGoogleLogin` can be improved.
- User profile data (beyond UID) can be fetched and stored in Firestore in subsequent user stories.
