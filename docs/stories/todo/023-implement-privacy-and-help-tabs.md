# User Story 023: Implement Privacy and Help Tabs

## 1. Title

Add Privacy and Help tabs to profile dialogs (registered + guest), with access to the privacy page, issue reporting, and donation link.

## 2. Goal

Make privacy information and support actions easy to find from the same profile/guest tab UI, including for anonymous users.

## 3. Description

As a **registered user**, I want a dedicated **Privacy** tab and a **Help** tab in my profile dialog so I can quickly read privacy details, report issues, and optionally donate.

As a **guest user**, I want the same **Privacy** and **Help** tabs in guest mode so I can access privacy information and support options without creating an account.

As a developer, I need this story to extend the tab foundation from Story 021 without duplicating GDPR core mechanics from Story 020.

## 4. Scope

This story covers:

- Adding a **Privacy** tab to both `ProfileDialog` and `GuestModeDialog`.
- Adding a **Help** tab to both `ProfileDialog` and `GuestModeDialog`.
- Ensuring the privacy page is reachable from these tabs for both auth states.
- Adding lightweight issue-report and donation entry points.

This story does **not** re-implement:

- Cookie consent/export/erasure logic from Story 020.
- Core tabs infrastructure and affirmations logic from Story 021.

## 5. Technical Details

### 5.1 Privacy Tab

- **Dialogs:**
  - `apps/food-diary/src/components/DashboardHeader/partials/ProfileDialog.tsx`
  - `apps/food-diary/src/components/DashboardHeader/partials/GuestModeDialog.tsx`
- **Tab Label:** `Privacy`
- **Behavior:**
  - Show short privacy summary text.
  - Provide clear CTA link/button to open `/[locale]/privacy`.
  - Works for both registered and guest users.
- **Accessibility:** keyboard reachable in tab order; CTA is an accessible link/button.

### 5.2 Help Tab

- **Dialogs:** same as §5.1.
- **Tab Label:** `Help`
- **Behavior:**
  - Provide `Report an issue` action (external issue URL, contact form route, or mailto as configured).
  - Provide `Buy us a coffee` (donation) action using configured external URL.
  - Open external links safely (`target="_blank"`, `rel="noopener noreferrer"` when appropriate).
- **Guest parity:** actions are available to guests and registered users alike.

### 5.3 i18n

- Add strings in both locales (`en`, `nl`) under `dashboard.profile` and `dashboard.guestMode`:
  - `tabs.privacy`, `tabs.help`
  - privacy tab summary + CTA
  - help tab title/description + issue + donate labels
- Reuse shared keys where practical to avoid duplication.

### 5.4 Configuration

- Add configurable URLs (e.g., env or constants) for:
  - Issue reporting endpoint
  - Donation endpoint
- Provide safe defaults for local/dev if production URLs are missing.

## 6. Steps to Implement

1. **Add tab labels and content translations** in `messages/en/dashboard.json` and `messages/nl/dashboard.json`.
2. **Create tab partials**:
   - `PrivacyTab.tsx`
   - `HelpTab.tsx`
3. **Wire tabs into both dialogs** using the existing tabs component from Story 021.
4. **Connect privacy CTA** to `/[locale]/privacy` route.
5. **Connect help actions** to configured issue + donation URLs.
6. **Validate keyboard navigation and external link safety** in both dialogs.

## 7. Acceptance Criteria

- [ ] `ProfileDialog` includes `Privacy` and `Help` tabs.
- [ ] `GuestModeDialog` includes `Privacy` and `Help` tabs.
- [ ] Privacy tab provides a clear route to `/[locale]/privacy` for both user types.
- [ ] Help tab includes `Report an issue` action.
- [ ] Help tab includes `Buy us a coffee` action.
- [ ] All new labels/content are available in both `en` and `nl`.
- [ ] No duplication of Story 020 core GDPR mechanics.
- [ ] No duplication of Story 021 core tabs/affirmations mechanics.

## 8. Dependencies

- **Depends on Story 021** for tabbed dialog foundation.
- **Aligns with Story 020** for GDPR policy/content expectations, but does not own consent/export/erasure mechanics.

## 9. Out of Scope

- Building a full in-app ticketing/helpdesk system.
- Donation payment processing implementation inside the app.
- Rewriting privacy policy legal content itself.
