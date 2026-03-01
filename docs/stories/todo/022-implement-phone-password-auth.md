# User Story 022: Phone and username/password authentication

## 1. Title

Add phone number sign-in plus a username/password (email/password) flow so that guests and Google users have additional, persistent paths into the diary.

## 2. Goal

Give people an alternative to the existing guest+Google path by supporting Firebase phone authentication (SMS verification) and a classic email/password account, while ensuring any entries created during the anonymous session merge into whichever credential they choose.

## 3. Description

Firebase Authentication already powers guest sessions and Google logins. The next step is to expand the login page so that it shows:

- a phone login workflow (trigger SMS, verify code) that reuses the same guest-entry merging helpers,
- an email/password signup/sign-in form that integrates with Firebase's custom claims and offers password reset.

Both flows should treat guest data like the Google flow: prefetch the guest UID, complete the credential exchange, and then migrate entries through `mergeGuestEntries` / helper utilities before navigating to `/dashboard`.

## 4. Technical Details

- **Phone authentication:** use `RecaptchaVerifier` + `signInWithPhoneNumber` to send/receive codes; store the `ConfirmationResult` so the guest can verify in a second step. Share translated copy for the two-step UI and expose button states in `AuthButtons` or a sibling component.
- **Email/password:** allow registration and sign-in via `createUserWithEmailAndPassword` + `signInWithEmailAndPassword`, include password reset via `sendPasswordResetEmail`, and enforce validation on both client and server.
- **Guest merging:** reuse `mergeGuestEntriesAfterGoogleSignIn`/`mergeGuestEntries` but supply the Firebase `user` returned from these new flows (the helper already accepts a `User` argument).
- **UI:** extend `AuthButtons` (or a new `AuthChoosers` component) so the login card has clear actions for Google, guest, phone, and email/password, including form fields for email/username and SMS verification input.
- **Translations and copy:** add phrases such as `continueWithPhone`, `verifySmsCode`, `emailPasswordSignIn`, and error keys for phone/email auth to the existing locale files.

## 5. Steps to Implement

1. Wire up Firebase console settings for phone and email/password providers, including a reCAPTCHA domain.
2. Design UI for phone code entry plus email/password forms inside `apps/food-diary/src/app/[locale]/auth/login/page.tsx` so it remains a single card with consistent spacing and translations.
3. Expose helper hooks similar to `useAuthButtons` that handle the new flows, battle-test the disabled/loading states, and reuse `mergeGuestEntriesAfterGoogleSignIn` by passing `user.uid`/`guestEntryIds` prior to the credential exchange.
4. Add translations and messaging for the new buttons, inputs, and error states under `apps/food-diary/messages/{en,nl}/auth.json`.
5. Ensure the navigation flow (e.g., `router.push`) stays inside the existing login component so hitting the new options still lands the user on `/dashboard` after success.
6. Update tests or storybook stories to cover the new authentication options if applicable.

## 6. Acceptance Criteria

- The login card now surfaces four options: continue as guest, Google login, phone verification, and email/password sign-in.
- Phone login runs a two-step flow (send SMS → verify code) and reroutes the verified user to `/dashboard` with their guest diary entries migrated.
- Email/password signup and login both work, handle errors, and merge guest data after credential creation or sign-in.
- Password reset is available via `sendPasswordResetEmail`.
- Translations exist for every new label, placeholder, and error key introduced by the phone/email flows.
- The merge helpers handle the new credentials, and the server action (`mergeGuestEntries`) remains a fallback when Firestore rules block client-side writes.

## 7. Notes

- Consider reusing the existing `mergeGuestEntriesAfterGoogleSignIn` helper for all future social/credential flows since it only needs a `User` and the prior guest ID.
- The UI could slide open a mini-form when the user taps "Continue with phone" or "Email & password" instead of replacing the entire card content.
- Keep accessibility in mind for the SMS code input (auto-focus, obvious labels) and for the password fields (show/hide toggles).
