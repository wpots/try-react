# User Story 024: Store Custom User Context in Profile Modal

## 1. Title

Extend the profile modal with a **Context** tab where registered users can store personal context fields (company, location, eating behaviour) alongside their affirmations.

## 2. Goal

Allow registered users to enrich their profile with structured context — company, location, and eating behaviour — so the app (and the Gemini food analysis) can personalise responses and suggestions based on who the user is and how they eat.

## 3. Description

As a **registered user**, I want to provide some personal context in my profile so that:

- My **company** (or workplace type) can be considered when suggesting meals (e.g., office lunches, remote eating).
- My **location** can be used to contextualise cuisine suggestions and regional eating habits.
- My **eating behaviour** (e.g., vegetarian, intermittent fasting, high-protein diet) helps the AI tailor food analysis feedback.

As a **developer**, I need these fields to be stored in the `/users/{userId}` Firestore document and made available to the Gemini food analysis prompt context.

## 4. Technical Details

### 4.1 New `Context` Tab in ProfileDialog

- **Tab label:** `Context` (i18n key: `profile.tabs.context`)
- **Location:** Add as a 4th tab in `ProfileDialog`, next to Settings, Data & Account, and Affirmations (Story 021)
- **Guest mode:** Show a locked/disabled state in `GuestModeDialog` prompting the user to log in, similar to the Affirmations tab pattern

### 4.2 Form Fields

| Field       | Type                | Constraints            | i18n key                    |
| ----------- | ------------------- | ---------------------- | --------------------------- |
| `company`   | `string` (optional) | max 100 chars, trimmed | `profile.context.company`   |
| `location`  | `string` (optional) | max 100 chars, trimmed | `profile.context.location`  |
| `behaviour` | `string` (optional) | max 280 chars, trimmed | `profile.context.behaviour` |

All fields are optional. The tab auto-saves on blur or via an explicit "Save" button (per UX preference).

### 4.3 Firestore Schema Extension

Extend the `/users/{userId}` document with:

```typescript
userContext?: {
  company?: string   // max 100 chars
  location?: string  // max 100 chars
  behaviour?: string // max 280 chars
}
```

- **Schema file:** `apps/food-diary/src/lib/firestore/schemas.ts`
- Add `userContext` to `firestoreUserSchema` using Zod:
  ```typescript
  userContext: z.object({
    company: z.string().trim().max(100).optional(),
    location: z.string().trim().max(100).optional(),
    behaviour: z.string().trim().max(280).optional(),
  }).optional(),
  ```

### 4.4 Server Actions

- **Save:** `apps/food-diary/src/app/actions/saveUserContext.ts`
  - Accept `{ company?, location?, behaviour? }`, validate with Zod, write to user document
  - Resolve `userId` from server auth context
- **Fetch:** Read from the existing user document fetch — no new action required if context is already loaded with the user profile

### 4.5 Gemini Integration

- In `apps/food-diary/src/app/actions/analyseFood.ts` (or equivalent), pass `userContext` into the Gemini prompt as additional context.
- Example prompt addendum:
  ```
  User context:
  - Company / workplace type: {{company}}
  - Location: {{location}}
  - Eating behaviour / dietary preferences: {{behaviour}}
  ```
- Only include fields present (don't send `undefined` values to the prompt).

### 4.6 i18n

Extend `messages/en/dashboard.json` and `messages/nl/dashboard.json`:

```json
{
  "profile": {
    "tabs": {
      "context": "Context"
    },
    "context": {
      "title": "Your context",
      "description": "Help personalise your food analysis by sharing a bit about yourself.",
      "company": {
        "label": "Company / workplace",
        "placeholder": "e.g. tech startup, hospital, remote freelancer"
      },
      "location": {
        "label": "Location",
        "placeholder": "e.g. Amsterdam, Netherlands"
      },
      "behaviour": {
        "label": "Eating behaviour",
        "placeholder": "e.g. vegetarian, intermittent fasting, high-protein"
      },
      "save": "Save context",
      "saving": "Saving...",
      "saved": "Saved",
      "tooLong": "{field} must be {max} characters or fewer."
    }
  }
}
```

## 5. Steps to Implement

### Phase A: Schema & Data Layer

1. **Extend Firestore schema:**
   - Add `userContext` to `firestoreUserSchema` in `src/lib/firestore/schemas.ts`
   - Update inferred `FirestoreUser` type

2. **Create `saveUserContext` server action:**
   - File: `apps/food-diary/src/app/actions/saveUserContext.ts`
   - Validate input with Zod, partial update Firestore user document
   - Return `{ success: boolean; error?: string }`

3. **Update Firestore README:**
   - Document `userContext` in `/users/{userId}` field reference

4. **Update Firestore security rules:**
   - Ensure `/users/{userId}` write rules permit the `userContext` field
   - Optionally validate field lengths in rules

### Phase B: UI — Context Tab

5. **Create `ContextTab` component:**
   - File: `apps/food-diary/src/components/DashboardHeader/partials/ContextTab.tsx`
   - Client component (`"use client"`)
   - Accept `isGuest: boolean` and optional `initialValues: UserContext` props
   - **Registered user mode:**
     - Three text inputs for `company`, `location`, `behaviour`
     - Client-side validation (max lengths)
     - Call `saveUserContext` on save
     - Show save state feedback (saving / saved / error)
   - **Guest mode:**
     - Locked state with a "Log in to save personal context" prompt

6. **Add `Context` tab to `ProfileDialog`:**
   - Import `ContextTab` and add as a 4th tab after Affirmations
   - Pass `initialValues` loaded from user document

7. **Add locked `Context` tab to `GuestModeDialog`:**
   - Add 4th tab with `ContextTab isGuest={true}`

8. **Add translation keys** to `en` and `nl` message files

### Phase C: Gemini Integration

9. **Pass `userContext` to Gemini analysis prompt:**
   - In the food analysis server action, read `userContext` from the authenticated user's Firestore document
   - Conditionally append each present field to the analysis prompt text
   - Ensure missing or empty fields are gracefully omitted

### Phase D: Testing & Polish

10. **Test ContextTab UI:**
    - Save all three fields → persisted in Firestore, saved feedback shown
    - Reload → values pre-filled from Firestore
    - Exceed max length → validation error shown
    - Guest view → locked state shown, no inputs rendered

11. **Test Gemini prompt enrichment:**
    - User with context set → prompt includes context fields
    - User without context → prompt is unchanged (no placeholder noise)

12. **Test backwards compatibility:**
    - Existing users without `userContext` field → no errors, context tab shows empty fields

## 6. Acceptance Criteria

- [ ] `userContext` field (`company`, `location`, `behaviour`) added to `firestoreUserSchema`
- [ ] `saveUserContext` server action validates with Zod and writes to Firestore
- [ ] `ContextTab` component exists with registered and guest modes
- [ ] **Profile dialog** (registered users) has a **Context** tab as the 4th tab
- [ ] **Guest mode dialog** shows a locked Context tab prompting login
- [ ] All fields are optional; saving with empty fields clears the stored value
- [ ] Client-side validation enforces max lengths before save
- [ ] Gemini food analysis includes user context fields when present
- [ ] All new strings are translated in both `en` and `nl`
- [ ] Existing users without `userContext` see empty fields — no regressions
- [ ] Firestore security rules permit the `userContext` field

## 7. Notes

- This story depends on Story 021 (profile tabs refactor) being complete, as the Context tab slots into the same `Tabs` component introduced there.
- The three fields are intentionally free-text to maximise flexibility. A future story could introduce structured pickers (country dropdown, dietary presets) if needed.
- The `behaviour` field is the most impactful for Gemini — it allows users to declare dietary preferences that would otherwise require re-stating in every diary entry.
- `company` and `location` are lower-value for AI but useful for potential future features (e.g., meal suggestions by region, office vs remote eating patterns).
- Auto-save on blur is preferred over a submit button to reduce friction, but the implementation can start with an explicit "Save" button for simplicity.
