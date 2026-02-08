# User Story 005: Implement Guest Authentication

## 1. Title

Implement guest user authentication using Firebase Anonymous Authentication.

## 2. Goal

To allow users to start using the food diary application immediately without creating an account. Guest users will be authenticated anonymously via Firebase, and their data will be stored with a guest user ID that can be merged with a registered account later.

## 3. Description

As a developer, I need to implement guest authentication using Firebase Anonymous Authentication. When a user chooses to continue as a guest, they should be authenticated anonymously, receive a guest user ID, and be able to create diary entries. This guest ID will be used to merge entries when they later create a registered account.

## 4. Technical Details

- **Authentication Method:** Firebase Anonymous Authentication
- **Guest User ID:** Firebase Authentication UID (same format as registered users)
- **Data Storage:** Guest entries stored in Firestore with `userId` field set to guest UID
- **Account Merging:** Guest entries can be merged with registered account (handled in story 006)
- **Component:** `AuthButtons.tsx` or `GuestLoginButton.tsx` in `apps/food-diary/src/components/`

## 5. Steps to Implement

1. **Create Guest Auth Utility Function:**
   - In `apps/food-diary/src/lib/auth.ts` (or add to existing auth utilities)
   - Create `signInAnonymously()` function:
     ```typescript
     import { signInAnonymously as firebaseSignInAnonymously } from 'firebase/auth';
     import { auth } from './firebase';
     
     export async function signInAnonymously() {
       try {
         const userCredential = await firebaseSignInAnonymously(auth);
         return userCredential.user;
       } catch (error) {
         console.error('Error signing in anonymously:', error);
         throw error;
       }
     }
     ```

2. **Create Guest Login Component:**
   - Create `apps/food-diary/src/components/AuthButtons.tsx` (or `GuestLoginButton.tsx`)
   - Import `signInAnonymously` function
   - Use `useState` for loading state
   - Create button that calls `signInAnonymously()` on click
   - Handle success: Store user in context or redirect to main app
   - Handle errors: Display error message to user

3. **Create Auth Context (if not exists):**
   - Create `apps/food-diary/src/contexts/AuthContext.tsx`
   - Use `onAuthStateChanged` from Firebase to track current user
   - Provide `user` and `loading` state to components
   - Export `useAuth` hook for components to access auth state

4. **Update Auth Context to Handle Guest Users:**
   - In `AuthContext`, check if user is anonymous: `user.isAnonymous`
   - Provide `isGuest` boolean in context
   - Handle guest user state appropriately

5. **Create Guest Login Page (Optional):**
   - Update `apps/food-diary/src/app/[locale]/auth/login/page.tsx`
   - Add "Continue as Guest" button
   - Use `AuthButtons` component or create guest-specific button
   - After successful guest login, redirect to main app

6. **Handle Guest User in Application:**
   - Ensure guest users can access diary entry creation
   - Guest user ID should be used as `userId` in Firestore entries
   - No difference in functionality between guest and registered users (except account merging)

7. **Store Guest User ID:**
   - Guest user ID is automatically available via Firebase Auth
   - No need for local storage - Firebase handles persistence
   - User remains authenticated until they sign out or sign in with different method

8. **Test Guest Authentication:**
   - Click "Continue as Guest" button
   - Verify user is authenticated (check Firebase Auth state)
   - Verify guest user ID is available
   - Create a diary entry as guest user
   - Verify entry is saved with guest user ID in Firestore
   - Check that `user.isAnonymous` is `true`

## 6. Acceptance Criteria

- `signInAnonymously()` function created in auth utilities
- Guest login button/component created (`AuthButtons.tsx` or similar)
- Auth context created/updated to handle guest users
- Guest users can authenticate anonymously via Firebase
- Guest user ID is available after authentication
- Guest users can create diary entries (entries saved with guest user ID)
- Guest user state is tracked in Auth context (`isGuest` boolean available)
- Guest authentication works without errors
- Guest users remain authenticated across page refreshes
- Error handling for failed guest authentication is implemented

## 7. Notes

- Guest authentication uses Firebase Anonymous Auth - no additional setup needed
- Guest users have the same Firebase UID format as registered users
- Account merging (converting guest to registered) will be handled in story 006
- Guest users should be able to use all features except account-specific features (if any)
- Consider adding a message to guest users encouraging account creation to preserve data
