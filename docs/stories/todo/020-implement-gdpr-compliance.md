# User Story 020: Implement GDPR Compliance

## 1. Title

Implement GDPR compliance: privacy policy, cookie consent, data export, and right to erasure.

## 2. Goal

Ensure the Food Diary app meets GDPR requirements for users in the EU (particularly relevant given the Dutch locale), covering lawful data processing, informed consent, data subject rights, and transparent data practices.

## 3. Description

As a user, I want to be informed about how my personal data is collected and used, give or withdraw consent for optional tracking, download a copy of my data, and permanently delete my account and all associated data — so that I maintain control over my personal information.

As a developer/operator, I need documented retention policies, clear consent mechanisms, and auditable data handling to meet GDPR obligations.

## 4. Scope

This story covers the minimum viable GDPR surface for a public web app that:

- Stores personal diary entries (food, mood, emotion, location context) in Firestore.
- Authenticates users via Firebase (anonymous guest + Google OAuth).
- Uses Google Analytics 4 (story 016) which requires explicit cookie consent.
- Is accessible to Dutch (`nl`) and English (`en`) users.

---

## 5. Technical Details

### 5.1 Privacy Policy Page

- **Route:** `/[locale]/privacy` (static, no auth required)
- **Component:** `PrivacyPage` in `apps/food-diary/src/app/[locale]/privacy/page.tsx`
- **Content (cover at minimum):**
  - Who is the data controller (name/contact).
  - What data is collected (entry content, mood, timestamps, Firebase UID, email if Google auth).
  - Legal basis for processing (legitimate interest / consent / contract).
  - Data retention period (see §5.5).
  - Third-party processors: Firebase (Google), Cloudinary (if applicable), Google Analytics.
  - Data subject rights: access, rectification, erasure, portability, objection.
  - How to exercise rights (in-app or via contact email).
  - Cookie usage.
- **i18n:** Full Dutch and English translations in `messages/nl/privacy.json` and `messages/en/privacy.json`.
- **Link:** Footer and registration/auth screen must link to `/privacy`.

### 5.2 Cookie Consent Banner

> Dependency: Story 016 (Google Analytics) must be complete or in parallel.

- **Trigger:** Show on first visit before any GA4 script loads.
- **Options:** "Accept all" / "Reject non-essential" (no granular categories needed at MVP).
- **Storage:** Consent choice stored in `localStorage` key `cookie_consent` with value `"granted"` or `"denied"`.
- **GA4 Integration:** GA4 should only initialise/send data after consent is `"granted"`. Use `gtag('consent', 'update', ...)` pattern.
- **Implementation:** `CookieConsentBanner` client component in `packages/ui/src/components/CookieConsentBanner/`.
- **Accessibility:** Banner must be keyboard-accessible and meet WCAG AA contrast.
- **i18n:** Translations under `messages/[locale]/consent.json`.

### 5.3 Data Export (Right to Portability)

- **Location:** Profile/account dialog (already exists for guest wipe).
- **Trigger:** "Download my data" button in authenticated user profile dialog.
- **Mechanism:** Server action `exportUserData(userId)` in `apps/food-diary/src/app/actions/userData.ts`.
- **Output:** JSON file download via `Response` with `Content-Disposition: attachment`.
- **Included data:** All Firestore diary entries for the user, basic auth profile (display name, email, UID, created date).
- **Excluded:** Internal system fields, raw Firebase tokens.
- **i18n:** Button label and confirmation message in `messages/[locale]/profile.json`.

### 5.4 Right to Erasure (Account Deletion)

> Partial implementation exists via `wipeEntries` action and guest wipe flow.

- **Complete the flow for authenticated (Google) users:**
  - Delete all Firestore entries via `wipeEntries(userId)`.
  - Delete Firebase Auth account via `admin.auth().deleteUser(uid)` in a server action.
  - Sign out client session after deletion.
  - Redirect to home with a confirmation message.
- **Confirmation step:** Two-step confirmation dialog ("This will permanently delete all your data. This cannot be undone.") before executing.
- **Location:** Authenticated user profile dialog.
- **i18n:** All strings in `messages/[locale]/profile.json`.

### 5.5 Data Retention Policy

- Define retention explicitly in the privacy policy page.
- Suggested policy: diary entries are retained until the user deletes them or the account is deleted; no automatic expiry.
- Guest data: retained until `wipeGuestEntries` is called or guest session is abandoned (document the expectation, no automated cleanup required at MVP).

### 5.6 Consent at Sign-Up / Auth

- On the auth screen, add a disclaimer line beneath the sign-in options:  
  _"By continuing, you agree to our [Privacy Policy](/privacy)."_
- This satisfies GDPR Art. 13 (information at collection point) without requiring a separate checkbox for core auth.
- i18n key: `auth.privacyDisclaimer`.

---

## 6. Steps to Implement

1. **Privacy Policy page**
   - Write content for `messages/en/privacy.json` and `messages/nl/privacy.json`.
   - Create `app/[locale]/privacy/page.tsx` rendering the policy with next-intl rich-text.
   - Add `/privacy` link to footer and auth screen.

2. **Cookie Consent Banner**
   - Create `CookieConsentBanner` component in `@repo/ui`.
   - Add Storybook story for the banner.
   - Integrate with GA4 initialisation logic (conditional on consent).
   - Place banner in root layout with hydration guard.

3. **Data Export**
   - Implement `exportUserData` server action.
   - Wire "Download my data" button in authenticated profile dialog.
   - Test JSON output completeness.

4. **Account Deletion (complete the flow)**
   - Add server action using Firebase Admin SDK to delete auth record.
   - Update profile dialog with two-step confirmation flow.
   - Ensure both entry wipe and auth deletion occur atomically (best effort; log any partial failure).

5. **Auth screen disclaimer**
   - Add `auth.privacyDisclaimer` i18n key in both locales.
   - Render below sign-in button(s) in `AuthForm` / auth template.

6. **QA checklist**
   - [ ] Cookie consent persists across page reloads.
   - [ ] GA4 does not fire before consent is granted.
   - [ ] Privacy policy renders correctly in both locales.
   - [ ] Data export produces valid JSON with all user entries.
   - [ ] Account deletion removes auth record and all Firestore entries.
   - [ ] Deletion flow works for both guest and Google users.
   - [ ] All new UI strings are translated in `nl` and `en`.

---

## 7. Out of Scope (MVP)

- Cookie preference centre with granular categories (analytics / marketing / functional).
- Data Processing Agreement (DPA) template — handled externally.
- Automated data retention expiry jobs.
- GDPR-compliant audit logging.
- Age verification / COPPA compliance.

---

## 8. Acceptance Criteria

- A `/privacy` page exists and is accessible without authentication, in both locales.
- GA4 only fires after the user grants cookie consent.
- An authenticated user can download their diary data as a JSON file.
- An authenticated user can permanently delete their account and all data from within the app.
- The auth screen contains a visible link to the privacy policy.
- All user-facing strings exist in both `nl` and `en` translation files.
