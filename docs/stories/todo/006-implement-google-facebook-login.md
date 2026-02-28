# User Story 006: Implement Google Login

## 1. Title

Implement Google authentication with account merging for guest users.

## 2. Goal

To allow users to create persistent accounts using Google login via Firebase Authentication. When a guest user signs in with a social provider, their guest entries should be merged with their new registered account.

## 3. Description

As a developer, I need to implement Google authentication using Firebase Authentication. Users should be able to sign in with Google, and if they were previously using the app as a guest, their guest entries should be automatically merged with their new registered account.

## 4. Technical Details

- **Authentication Provider:** Google via Firebase Authentication
- **Firebase Methods:** `signInWithPopup` or `signInWithRedirect` with Google provider
- **Account Merging:** Update all guest entries in Firestore to use new authenticated user ID
- **Component:** Update `AuthButtons.tsx` to include Google login buttons
- **Server Action:** `mergeGuestEntries(guestId, userId)` to merge entries

## 5. Steps to Implement

1. **Create Social Auth Utility Functions:**
   - In `apps/food-diary/src/lib/auth.ts`, add:

     ```typescript
     import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
     import { auth } from "./firebase";

     const googleProvider = new GoogleAuthProvider();

     export async function signInWithGoogle() {
       try {
         const result = await signInWithPopup(auth, googleProvider);
         return result.user;
       } catch (error) {
         console.error("Error signing in with Google:", error);
         throw error;
       }
     }
     ```

2. **Create Account Merging Server Action:**
   - In `apps/food-diary/src/app/actions.ts`, create:

     ```typescript
     "use server";

     import { db } from "@/lib/firebase";
     import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

     export async function mergeGuestEntries(guestId: string, userId: string) {
       try {
         const entriesRef = collection(db, "diaryEntries");
         const q = query(entriesRef, where("userId", "==", guestId));
         const querySnapshot = await getDocs(q);

         const updatePromises = querySnapshot.docs.map(docSnapshot =>
           updateDoc(doc(db, "diaryEntries", docSnapshot.id), {
             userId: userId,
           }),
         );

         await Promise.all(updatePromises);
         return { success: true, mergedCount: querySnapshot.docs.length };
       } catch (error) {
         console.error("Error merging guest entries:", error);
         throw error;
       }
     }
     ```

3. **Update Auth Context to Handle Account Merging:**
   - In `apps/food-diary/src/contexts/AuthContext.tsx`
   - On auth state change, check if user was previously anonymous
   - If transitioning from guest to registered, call `mergeGuestEntries`
   - Store previous user ID in state or localStorage temporarily

4. **Update AuthButtons Component:**
   - Add Google login button

   - Use shared UI Button component from `@repo/ui`
   - Handle loading states for each button
   - Display error messages if authentication fails

5. **Handle Account Linking:**
   - When guest user signs in with social provider:
     - Get current guest user ID before sign-in
     - Sign in with provider
     - After successful sign-in, call `mergeGuestEntries` with old and new user IDs
     - Update UI to reflect account merge success

6. **Create Login Page:**
   - Update `apps/food-diary/src/app/[locale]/auth/login/page.tsx`
   - Display Google, and Guest login options
   - Use `AuthButtons` component
   - Add translations for login page text

7. **Handle Sign Out:**
   - Create `signOut()` function in auth utilities
   - Add sign out button to navigation/layout
   - Clear auth state on sign out

8. **Test Social Authentication:**
   - Test Google login flow
   - Test guest-to-registered account merging:
     - Sign in as guest
     - Create a diary entry
     - Sign in with Google
     - Verify entry is now associated with registered user ID
   - Test direct social login (no guest account)
   - Test error handling for failed authentication

## 6. Acceptance Criteria

- `signInWithGoogle()` function created
- Google login buttons added to `AuthButtons` component
- `mergeGuestEntries` server action created and functional
- Account merging works when guest user signs in with social provider
- All guest entries are updated with new user ID after social login
- Social authentication works without errors
- Error handling for failed social authentication is implemented
- Sign out functionality works correctly
- Login page displays all authentication options (Google, Guest)
- Translations added for login page (if applicable)

## 7. Notes

- Google OAuth apps must be configured in Firebase Console before testing
- Account merging should happen automatically when guest user signs in
- Consider showing a success message after account merge
- Social login popup may be blocked by browsers - consider `signInWithRedirect` as fallback
- User profile information (name, email, photo) can be accessed from `user` object after social login
