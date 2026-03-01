# User Story 021: Implement User Profile with Core Tabs

## 1. Title

Rebuild the profile and guest mode dialogs into tabbed interfaces with Settings, Data & Account, and Affirmations tabs (core tab foundation).

## 2. Goal

To replace the current flat layout in both the **ProfileDialog** (registered users) and the **GuestModeDialog** (anonymous users) with a consistent tabbed interface. Both dialogs will share the same `Tabs` component from `@repo/ui`, with tab content adapted per auth state. This also introduces a new shared `Tabs` component in `@repo/ui`.

## 3. Description

As a **registered user**, I want my profile to be split into logical sections so I can:

- Change my **language** preference in the Settings tab.
- **Wipe my data** or **delete my account** in the Data & Account tab.
- **Add, edit, and remove my own affirmations** that appear on the dashboard hero — in the Affirmations tab.

As a **guest user**, I want the guest mode dialog to use the same tabbed layout so I can:

- Change my **language** preference in the Settings tab.
- **Log in with Google** to keep my data, or **wipe guest data** in the Data & Account tab.
- See an explanation that personal affirmations require a real account — in the Affirmations tab.

As a developer, I need a reusable, accessible `Tabs` component built with React Aria that can be used across the app, and a Firestore-backed mechanism for persisting user-defined affirmations.

## 4. Technical Details

### 4.1 New Shared Tabs Component

- **Package:** `@repo/ui`
- **Location:** `packages/ui/src/components/Tabs/`
- **React Aria:** Use `useTabList`, `useTab`, `useTabPanel` from `react-aria` / `react-aria-components`
- **Component Structure:** `Tabs.tsx`, `index.ts` (types + re-export), `Tabs.stories.tsx`, `Tabs.test.tsx`
- **Props:** Accepts `items` array with `{ id, label, content }`, optional `defaultSelectedKey`, `onSelectionChange`, `orientation`
- **Styling:** Tailwind with design tokens. Active tab uses `--color-ds-primary` underline/indicator, inactive uses `--color-ds-on-surface-secondary`

### 4.2 Profile Dialog Refactor (Registered Users)

- **File:** `apps/food-diary/src/components/DashboardHeader/partials/ProfileDialog.tsx`
- Replace current flat layout with the new `Tabs` component containing three tabs:
  1. **Settings** — language selector (extracted from current dialog)
  2. **Data & Account** — wipe data + delete account actions (extracted from current dialog)
  3. **Affirmations** — add/manage custom affirmations (new)

### 4.3 Guest Mode Dialog Refactor (Anonymous Users)

- **File:** `apps/food-diary/src/components/DashboardHeader/partials/GuestModeDialog.tsx`
- Replace current flat layout with the same `Tabs` component containing three tabs:
  1. **Settings** — language selector (currently not in guest dialog — new addition for guests)
  2. **Data & Account** — Google login/merge prompt + wipe guest data (extracted from current dialog)
  3. **Affirmations** — disabled state with a prompt to create an account to unlock personal affirmations

### 4.4 Custom Affirmations

- **Firestore:** Extend the `/users/{userId}` document with an optional `customAffirmations` field:
  ```typescript
  customAffirmations?: string[] // max 20 items, each max 280 chars
  ```
- **Schema:** Add `customAffirmations` to `firestoreUserSchema` in `src/lib/firestore/schemas.ts`
- **Affirmation Pool:** Update `getAffirmationPool()` in `src/templates/DashboardTemplate/utils/getAffirmationPool.ts` to merge built-in affirmations with user-defined ones
- **Persistence:** Use a server action `saveCustomAffirmations(userId, affirmations)` for writes
- **Validation:** Zod schema enforces max 20 items, each trimmed string max 280 chars, no empty strings

### 4.5 i18n

- **Namespace:** Extend `dashboard.profile` and `dashboard.guestMode` with new keys for tabs and affirmation management
- **Locales:** `en` and `nl` message files

## 5. Steps to Implement

### Phase A: Shared Tabs Component

1. **Install React Aria Tab dependencies (if not already present):**

   ```bash
   # react-aria-components likely already covers Tabs — verify first
   pnpm --filter @repo/ui add react-aria-components
   ```

2. **Create `Tabs` component:**
   - Create `packages/ui/src/components/Tabs/Tabs.tsx`
   - Use `TabList`, `Tab`, `TabPanel`, `Tabs` from `react-aria-components`
   - Style tab bar with horizontal layout, bottom-border active indicator
   - Support `aria-label` for accessibility
   - Ensure keyboard navigation (arrow keys to switch tabs)

3. **Create `Tabs/index.ts`:**
   - Export `Tabs` component
   - Export `TabsProps` type extending relevant React Aria props

4. **Update package exports:**
   - Add `Tabs` export to `packages/ui/src/index.ts`

5. **Add Storybook story:**
   - Create `packages/ui/src/stories/Tabs.stories.tsx`
   - Showcase default, with icons, disabled tab, controlled selection

6. **Add test file:**
   - Create `packages/ui/src/components/Tabs/Tabs.test.tsx`
   - Test rendering, tab switching, keyboard nav, ARIA attributes

### Phase B: Profile Dialog Refactor

7. **Add translation keys** to `messages/en/dashboard.json` and `messages/nl/dashboard.json`:

   ```json
   {
     "profile": {
       "tabs": {
         "settings": "Settings",
         "dataAccount": "Data & Account",
         "affirmations": "Affirmations"
       },
       "affirmations": {
         "title": "Your affirmations",
         "description": "Add personal affirmations that will appear on your dashboard alongside the built-in ones.",
         "placeholder": "Write an affirmation...",
         "add": "Add",
         "remove": "Remove",
         "saving": "Saving...",
         "saved": "Saved",
         "empty": "You haven't added any personal affirmations yet.",
         "limit": "You can add up to {max} affirmations.",
         "tooLong": "Affirmation must be {max} characters or fewer.",
         "duplicate": "This affirmation already exists."
       }
     }
   }
   ```

8. **Create shared tab partials** (reused by both dialogs where applicable):
   - Create `apps/food-diary/src/components/DashboardHeader/partials/SettingsTab.tsx`
     - Language selector — shared by both ProfileDialog and GuestModeDialog
   - Create `apps/food-diary/src/components/DashboardHeader/partials/ProfileDataTab.tsx`
     - Wipe data + delete account — for registered users only
   - Create `apps/food-diary/src/components/DashboardHeader/partials/GuestDataTab.tsx`
     - Google login/merge + wipe guest data — for guests only
   - Create `apps/food-diary/src/components/DashboardHeader/partials/AffirmationsTab.tsx`
     - Full CRUD for registered users; locked state with login prompt for guests
     - Accept `isGuest` prop to switch between modes

9. **Refactor `ProfileDialog.tsx`:**
   - Import `Tabs` from `@repo/ui`
   - Import `SettingsTab`, `ProfileDataTab`, `AffirmationsTab`
   - Replace flat content with `Tabs` containing three panels
   - Keep dialog shell (ModalOverlay, Modal, Dialog, Heading, close button)

10. **Refactor `GuestModeDialog.tsx`:**
    - Import `Tabs` from `@repo/ui`
    - Import `SettingsTab`, `GuestDataTab`, `AffirmationsTab`
    - Replace flat content with `Tabs` containing three panels
    - Keep dialog shell (ModalOverlay, Modal, Dialog, Heading, close button)
    - Pass `isGuest={true}` to `AffirmationsTab`

### Phase C: Custom Affirmations Feature

11. **Extend Firestore user schema:**
    - In `apps/food-diary/src/lib/firestore/schemas.ts`, add to `firestoreUserSchema`:
      ```typescript
      customAffirmations: z.array(z.string().trim().min(1).max(280)).max(20).optional(),
      ```
    - Update `FirestoreUserSchema` type (auto-inferred)

12. **Update Firestore README:**
    - Add `customAffirmations` (`string[]`, optional, max 20) to `/users/{userId}` documentation

13. **Create server action for saving affirmations:**
    - Create `apps/food-diary/src/app/actions/saveCustomAffirmations.ts`
    - Accept `string[]`, validate with Zod, write to user document
    - Resolve `userId` from server auth context

14. **Create server action for fetching affirmations:**
    - Create `apps/food-diary/src/app/actions/fetchCustomAffirmations.ts`
    - Read from `/users/{userId}` document, return `string[]`

15. **Build `AffirmationsTab` component:**
    - Client component (`"use client"`)
    - Accept `isGuest: boolean` prop
    - **Registered user mode (`isGuest=false`):**
      - List existing custom affirmations with remove button per item
      - Text input + "Add" button for new affirmations
      - Client-side validation (max length, duplicate check, limit check)
      - Call `saveCustomAffirmations` server action on add/remove
      - Show save state feedback (saving/saved)
    - **Guest mode (`isGuest=true`):**
      - Show locked state: title, description, and a "Log in with Google" prompt
      - No CRUD controls
    - Use `useTranslations("dashboard.profile.affirmations")` for registered, `useTranslations("dashboard.guestMode.affirmations")` for guest

16. **Update affirmation pool logic:**
    - In `getAffirmationPool.ts`, accept optional `customAffirmations: string[]` parameter
    - Append custom affirmations after built-in pool
    - In `DashboardTemplate.tsx`, fetch user's custom affirmations and pass them down
    - Handle empty/undefined gracefully (backwards compatible)

17. **Update Firestore security rules:**
    - In `firestore.rules`, ensure `/users/{userId}` write rules allow the `customAffirmations` field
    - Validate array length and string constraints in rules if desired

### Phase D: Testing & Polish

18. **Test tab navigation in both dialogs:**
    - Verify keyboard navigation between tabs (Arrow Left/Right)
    - Verify correct ARIA roles (`tablist`, `tab`, `tabpanel`)
    - Verify focus management

19. **Test affirmation CRUD:**
    - Add an affirmation → appears in list and persists after reload
    - Remove an affirmation → removed from list and Firestore
    - Hit 20-item limit → add button disabled, limit message shown
    - Exceed 280 chars → validation error shown
    - Custom affirmation appears in dashboard hero rotation

20. **Test backwards compatibility:**
    - Users with no `customAffirmations` field → dashboard shows only built-in affirmations
    - Guest users → affirmations tab shows locked state with login prompt

21. **Test guest mode dialog tabs:**
    - Settings tab shows language selector and it works
    - Data & Account tab shows Google login + wipe guest data (same features, new layout)
    - Affirmations tab shows locked prompt explaining login is needed
    - No regressions in Google merge or wipe guest data flows

## 6. Acceptance Criteria

- [ ] `Tabs` component exists in `@repo/ui` with React Aria accessibility (keyboard nav, ARIA roles)
- [ ] `Tabs` component styled with Tailwind design tokens and exported from package index
- [ ] `Tabs` has a Storybook story and test file
- [ ] **Profile dialog** (registered users) uses `Tabs` with three tabs: Settings, Data & Account, Affirmations
- [ ] **Guest mode dialog** (anonymous users) uses `Tabs` with three tabs: Settings, Data & Account, Affirmations
- [ ] **Settings tab** contains the language selector — shared by both dialogs
- [ ] **Profile Data & Account tab** contains wipe data and delete account actions (existing features, relocated)
- [ ] **Guest Data & Account tab** contains Google login/merge and wipe guest data (existing features, relocated)
- [ ] **Affirmations tab (registered)** allows adding up to 20 custom affirmations (max 280 chars each)
- [ ] **Affirmations tab (guest)** shows locked state with login prompt
- [ ] Custom affirmations persisted in Firestore `/users/{userId}.customAffirmations`
- [ ] Custom affirmations merged into dashboard hero affirmation rotation
- [ ] All labels and text are translated in both `en` and `nl`
- [ ] Validation enforced client-side (UX) and server-side (Zod schema)
- [ ] No regressions in existing profile features (language switch, wipe data, delete account)
- [ ] No regressions in existing guest mode features (Google login/merge, wipe guest data)

## 7. Notes

- Both `ProfileDialog` and `GuestModeDialog` currently use flat layouts. This refactor gives them a consistent tabbed structure, separates concerns, and makes both dialogs extensible for follow-up tabs.
- The `SettingsTab` (language selector) is shared between both dialogs. This also means guest users gain the ability to switch language from their dialog — currently only available in the profile dialog.
- The `AffirmationsTab` uses an `isGuest` prop to toggle between full CRUD and a locked prompt, keeping it a single component with two modes.
- React Aria's `Tabs` from `react-aria-components` provides full keyboard and screen reader support out of the box.
- The 20-affirmation limit and 280-char max are intentionally modest to keep Firestore document size small and prevent abuse.
- Guest users don't have a `/users/{userId}` document, so the Affirmations tab shows a locked state with a prompt to log in with Google. This is intentional — it serves as a gentle nudge to convert.
- The affirmation merge logic should be deterministic — `pickAffirmation` already uses a hash-based index, so it will naturally distribute across the larger pool.
- Privacy and Help tabs are intentionally out of scope here and are tracked in Story 023 to avoid duplicate implementation scope.
