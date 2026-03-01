# User Story 013: Implement Diary Entry Overview

## 1. Title

Create the diary entry overview screen to display entries grouped by day as cards.

## 2. Goal

To implement a user interface that displays all saved diary entries in an organized manner, grouped by day and presented as cards. The overview should fetch entries from Firestore and support clear day/week/month navigation.

## 3. Description

As a developer, I need to create the diary entry overview screen, which is available as the authenticated dashboard screen. This screen should fetch diary entries from Firestore, group them by date, and display each day's entries as cards. Image thumbnails are intentionally out of scope. The screen should be fully translated and use shared UI components.

## 4. Technical Details

- **Overview Surface:** `DashboardTemplate` in `apps/food-diary/src/templates/DashboardTemplate/`
- **Entry Card Component:** `DayEntryCard.tsx` for displaying individual entries in day view
- **Data Fetching:** Firestore helper `getDiaryEntriesByUser(userId)` in `apps/food-diary/src/lib/firestore/helpers.ts`
- **Data Grouping:** Group entries by local date key for day/week/month views
- **Image Display:** Not supported (intentional product decision)
- **i18n:** All text translated using next-intl

## 5. Steps to Implement

1. **Fetch Entries for Authenticated User:**
  - Use Firestore helper `getDiaryEntriesByUser(userId)`.
  - Keep server action support available, but dashboard flow may load via client helper.

2. **Display Entry Cards in Day View:**
  - Use `DayEntryCard` to display entry information:
    - Entry type and time
    - Moods/emotions
    - Location and company
    - Notes/description
    - Behavior state
  - Support edit/delete and card expansion interactions.

3. **Render Overview in Dashboard Template:**
  - Use `DashboardTemplate` as overview surface.
  - Provide day/week/month view modes.
  - Group entries by local date key.

4. **Add Loading and Empty States:**
  - Show loading state while entries are fetched.
  - Show empty state messaging when no entries exist in selected period/day.

5. **Add Translations:**
  - Ensure all dashboard and card text is translated in Dutch and English.

6. **Add Date Formatting:**
  - Use locale-aware formatting via `Intl.DateTimeFormat`.
  - Show date labels for selected day/week/month periods.

7. **Routing and Main Access:**
  - Overview is accessed via authenticated `/[locale]/dashboard` route.
  - Home route may redirect authenticated users to dashboard.

8. **Testing:**
  - Verify entries are fetched correctly.
  - Verify grouping by date and period navigation.
  - Test empty and loading states.
  - Verify translations work.

## 6. Acceptance Criteria

- Entries are fetched from Firestore for current user
- Entries are grouped by date correctly
- Entries are displayed as cards in day view
- Date labels are formatted and translated
- Loading state is shown while fetching
- Empty state is shown when no entries exist
- Overview is available from authenticated dashboard route (`/[locale]/dashboard`)
- All text is translated (Dutch and English)
- Layout is responsive
- No image/thumbnail support is required (intentional)

## 7. Notes

- This story implements the diary entry overview through the dashboard surface.
- Day/week/month navigation is included.
- Date grouping handles local date keys.
- Image and thumbnail rendering are intentionally out of scope.
- Filtering/sorting and pagination can be added in future stories.
- Entry cards should remain accessible (keyboard navigation, screen readers).
