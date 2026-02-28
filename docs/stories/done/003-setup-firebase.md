# User Story 003: Setup Firebase

## 1. Title

Configure Firebase Authentication and Firestore in the food-diary application.

## 2. Goal

To set up Firebase Authentication (Google) and Firestore database in the food-diary Next.js application, enabling user authentication and data persistence.

## 3. Description

As a developer, I need to configure Firebase services in the food-diary application. This includes setting up Firebase SDK, configuring environment variables, initializing Firebase app, and creating Firebase utility functions for authentication and Firestore access.

## 4. Technical Details

- **Firebase Services:** Authentication (Google) and Firestore
- **Location:** `apps/food-diary/src/lib/firebase.ts` (or `apps/food-diary/src/firebase.ts`)
- **Environment Variables:** Firebase config values stored in `.env.local` and Vercel
- **SDK:** Firebase v10+ (modular SDK)
- **Authentication:** Client-side Firebase Auth SDK
- **Firestore:** Server Actions will use Firebase Admin SDK or client SDK depending on context

## 5. Steps to Implement

1. **Install Firebase Dependencies:**
   - In `apps/food-diary/`, install: `firebase`
   - Run `pnpm add firebase` from `apps/food-diary/`

2. **Create Firebase Configuration File:**
   - Create `apps/food-diary/src/lib/firebase.ts`
   - Import Firebase modules: `initializeApp`, `getAuth`, `getFirestore` from `firebase/app`, `firebase/auth`, `firebase/firestore`
   - Define Firebase config object using environment variables:
     ```typescript
     const firebaseConfig = {
       apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
       authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
       projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
       storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
       messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
       appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
     };
     ```

3. **Initialize Firebase App:**
   - Check if app already initialized (prevent multiple initializations)
   - Initialize app: `const app = initializeApp(firebaseConfig)`
   - Initialize Auth: `export const auth = getAuth(app)`
   - Initialize Firestore: `export const db = getFirestore(app)`

4. **Create Environment Variables File:**
   - Create `apps/food-diary/.env.local` (add to `.gitignore`)
   - Add Firebase configuration variables:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
     ```

5. **Export Firebase Utilities:**
   - Export `auth` and `db` from `firebase.ts`
   - Export helper functions if needed (e.g., `getCurrentUser()`)

6. **Configure Firebase Project:**
   - In Firebase Console, enable Authentication providers:
     - Google (enable and configure)
   - In Firestore, create database (start in test mode for development)
   - Set up Firestore security rules (basic rules for development)

7. **Create Type Definitions (Optional):**
   - Create `apps/food-diary/src/types/firebase.ts` for Firestore document types
   - Define types for `DiaryEntry`, `User`, etc. (will be expanded in story 007)

8. **Test Firebase Connection:**
   - Create a test page or component to verify Firebase initialization
   - Check browser console for any Firebase errors
   - Verify environment variables are loaded correctly

## 6. Acceptance Criteria

- `firebase` package installed in `apps/food-diary/`
- `apps/food-diary/src/lib/firebase.ts` (or `src/firebase.ts`) created with Firebase initialization
- Firebase app, auth, and db instances exported
- `.env.local` file created with all required Firebase environment variables
- Firebase project configured in Firebase Console:
  - Google Authentication enabled
  - Firestore database created
- Firebase initialization works without errors
- Environment variables are accessible in the application
- Firebase instances can be imported in other files

## 7. Notes

- Firebase configuration uses `NEXT_PUBLIC_` prefix for client-side access
- For Server Actions, we may need Firebase Admin SDK in the future (not needed for initial setup)
- Firestore security rules should be configured properly before production deployment
- Keep `.env.local` out of version control (already in `.gitignore`)
- Firebase project should be created in Firebase Console before starting this story
