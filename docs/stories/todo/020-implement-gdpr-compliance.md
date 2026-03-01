# User Story 020: Implement GDPR Compliance (Core Data Rights)

## 1. Title

Implement GDPR compliance core flows: cookie consent, data export, right to erasure, and retention policy.

## 2. Goal

Ensure the Food Diary app meets GDPR requirements for users in the EU (particularly relevant given the Dutch locale), covering informed consent, data subject rights, and retention transparency.

## 3. Description

As a user, I want to give or withdraw consent for optional tracking, download a copy of my data, and permanently delete my account and all associated data — so that I maintain control over my personal information.

As a developer/operator, I need clear consent mechanisms, user data-rights flows, and documented retention policies to meet GDPR obligations.

## 4. Scope

This story covers the minimum viable GDPR surface for a public web app that:

- Stores personal diary entries (food, mood, emotion, location context) in Firestore.
- Authenticates users via Firebase (anonymous guest + Google OAuth).
- Uses Google Analytics 4 (story 016) which requires explicit cookie consent.
- Is accessible to Dutch (`nl`) and English (`en`) users.

---

## 5. Technical Details

### 5.1 Cookie Consent Banner

> Dependency: Story 016 (Google Analytics) must be complete or in parallel.

- **Trigger:** Show on first visit before any GA4 script loads.
- **Options:** "Accept all" / "Reject non-essential" (no granular categories needed at MVP).
- **Storage:** Consent choice stored in `localStorage` key `cookie_consent` with value `"granted"` or `"denied"`.
- **GA4 Integration:** GA4 should only initialise/send data after consent is `"granted"`. Use `gtag('consent', 'update', ...)` pattern.
- **Implementation:** `CookieConsentBanner` client component in `packages/ui/src/components/CookieConsentBanner/`.
- **Accessibility:** Banner must be keyboard-accessible and meet WCAG AA contrast.
- **i18n:** Translations under `messages/[locale]/consent.json`.

### 5.2 Data Export (Right to Portability)

- **Location:** Profile/account dialog (already exists for guest wipe).
- **Trigger:** "Download my data" button in authenticated user profile dialog.
- **Mechanism:** Server action `exportUserData(userId)` in `apps/food-diary/src/app/actions/userData.ts`.
- **Output:** JSON file download via `Response` with `Content-Disposition: attachment`.
- **Included data:** All Firestore diary entries for the user, basic auth profile (display name, email, UID, created date).
- **Excluded:** Internal system fields, raw Firebase tokens.
- **i18n:** Button label and confirmation message in `messages/[locale]/profile.json`.

### 5.3 Right to Erasure (Account Deletion)

> Partial implementation exists via `wipeEntries` action and guest wipe flow.

- **Complete the flow for authenticated (Google) users:**
  - Delete all Firestore entries via `wipeEntries(userId)`.
  - Delete Firebase Auth account via `admin.auth().deleteUser(uid)` in a server action.
  - Sign out client session after deletion.
  - Redirect to home with a confirmation message.
- **Confirmation step:** Two-step confirmation dialog ("This will permanently delete all your data. This cannot be undone.") before executing.
- **Location:** Authenticated user profile dialog.
- **i18n:** All strings in `messages/[locale]/profile.json`.

### 5.4 Data Retention Policy

- Define retention explicitly in privacy documentation and in-app copy where relevant.
- Suggested policy: diary entries are retained until the user deletes them or the account is deleted; no automatic expiry.
- Guest data: retained until `wipeGuestEntries` is called or guest session is abandoned (document the expectation, no automated cleanup required at MVP).

### 5.5 Scope Boundary (No UX Navigation Work)

- Privacy page route/discoverability and profile-tab navigation are implemented in Story 023.
- This story owns GDPR core mechanics only: consent state, export, erasure, and retention policy.

---

## 6. Steps to Implement

1. **Cookie Consent Banner**
   - Create `CookieConsentBanner` component in `@repo/ui`.
   - Add Storybook story for the banner.
   - Integrate with GA4 initialisation logic (conditional on consent).
   - Place banner in root layout with hydration guard.

2. **Data Export**
   - Implement `exportUserData` server action.
   - Wire "Download my data" button in authenticated profile dialog.
   - Test JSON output completeness.

3. **Account Deletion (complete the flow)**
   - Add server action using Firebase Admin SDK to delete auth record.
   - Update profile dialog with two-step confirmation flow.
   - Ensure both entry wipe and auth deletion occur atomically (best effort; log any partial failure).

4. **QA checklist**
   - [ ] Cookie consent persists across page reloads.
   - [ ] GA4 does not fire before consent is granted.
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
- Privacy page route and profile/guest tab discoverability (Story 023).

---

## 8. Acceptance Criteria

- GA4 only fires after the user grants cookie consent.
- An authenticated user can download their diary data as a JSON file.
- An authenticated user can permanently delete their account and all data from within the app.
- Retention behavior is documented and reflected in user-facing copy.
