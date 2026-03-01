# User Story 006: Google authentication with guest merging

## 1. Title

Implement Google authentication while preserving guest-owned entries.

## 2. Goal

Ensure guest sessions can be upgraded to a Google-authenticated account without losing diary data by migrating entries before redirecting to the dashboard.

## 3. Description

This story now documents the implementation in [apps/food-diary](apps/food-diary). Firebase Authentication handles Google sign-in via a popup that captures the anonymous UID before the exchange completes. When the Google credential resolves, the client and a dedicated server action hand ownership back to the authenticated user so entries that were created as a guest are preserved.

## 4. Technical Details

- `signInWithGoogle` uses `GoogleAuthProvider` + `browserPopupRedirectResolver` to avoid third-party storage issues and returns the anonymous UID that existed before the popup opened ([apps/food-diary/src/lib/auth.ts](apps/food-diary/src/lib/auth.ts#L1-L69)).
- `mergeGuestEntriesAfterGoogleSignIn` reassigns prefetched guest entries to the new UID using `migrateGuestEntriesByIds`, enabling the Firebase security rules to accept the update ([apps/food-diary/src/utils/mergeGuestEntriesAfterGoogleSignIn.ts](apps/food-diary/src/utils/mergeGuestEntriesAfterGoogleSignIn.ts#L1-L47)).
- A server action (`mergeGuestEntries`) remains available when migration requires authenticated reads and writes on the backend ([apps/food-diary/src/app/actions/mergeGuestEntries/mergeGuestEntries.ts](apps/food-diary/src/app/actions/mergeGuestEntries/mergeGuestEntries.ts#L1-L44)).
- `AuthButtons` exposes guest and Google buttons with loading/error handling and translation strings ([apps/food-diary/src/components/AuthButtons/AuthButtons.tsx](apps/food-diary/src/components/AuthButtons/AuthButtons.tsx#L1-L42)).
- The login page wraps `AuthButtons` inside the shared UI layout and pulls localized copy from `apps/food-diary/messages/{en,nl}/auth.json`.

## 5. Implementation summary

1. Google button tied to `signInWithGoogle` and `mergeGuestEntriesAfterGoogleSignIn`, with guest entry IDs fetched before the popup starts.
2. Auth context exposes `isGuest` so buttons disable while Firebase is still loading.
3. Server action `mergeGuestEntries` provides a fallback path when Firestore rules block the client migration.
4. Login page uses the shared UI components (`Card`, `Container`, `Typography`, `AuthButtons`) and translations for both English and Dutch.

## 6. Acceptance Criteria

- Google login and guest login options display on the login card.
- Entries created during an anonymous session are reassigned to the authenticated user after a Google login.
- Dedicated merge helpers exist on the client and server for the migration path.
- Loading/error messaging is surfaced during guest and Google flows.
- `signOut` already handles cleanup, so navigation flows remain consistent after login/logout.

## 7. Notes

- Copy for `continueWithGoogle`, `guestLoginLoading`, etc., lives in `apps/food-diary/messages/en/auth.json` and its Dutch counterpart.
- QA can reproduce the merge by signing in as guest, creating an entry, signing in with Google, and verifying the entry belongs to the Google UID.
