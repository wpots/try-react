# User Story 013: Implement Diary Entry Overview

## 1. Title

Create the diary entry overview screen to display entries grouped by day as cards with image thumbnails.

## 2. Goal

To implement a user interface that displays all saved diary entries in an organized manner, grouped by day and presented as cards. Entries with images should display thumbnails. The overview should fetch entries from Firestore and support filtering/sorting.

## 3. Description

As a developer, I need to create the diary entry overview screen, which will be the main screen of the application. This screen should fetch diary entries from Firestore, group them by date, and display each day's entries as a set of cards. Entries with images should show thumbnails. The screen should be fully translated and use shared UI components.

## 4. Technical Details

- **React Component:** `EntryOverview.tsx` in `apps/food-diary/src/components/`
- **Entry Card Component:** `EntryCard.tsx` for displaying individual entries
- **Data Fetching:** Server Action `fetchDiaryEntries(userId)` in `apps/food-diary/src/app/actions.ts`
- **Data Grouping:** Group entries by date (JavaScript date manipulation)
- **Image Display:** Show Cloudinary image thumbnails for entries with images
- **i18n:** All text translated using next-intl

## 5. Steps to Implement

1. **Create Fetch Entries Server Action:**
   - In `apps/food-diary/src/app/actions.ts`, create:
     ```typescript
     "use server";
     
     import { db, auth } from '@/lib/firebase';
     import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
     
     export async function fetchDiaryEntries() {
       try {
         const user = auth.currentUser;
         if (!user) {
           return { success: false, error: 'NOT_AUTHENTICATED', entries: [] };
         }
         
         const entriesRef = collection(db, 'diaryEntries');
         const q = query(
           entriesRef,
           where('userId', '==', user.uid),
           orderBy('date', 'desc'),
           orderBy('time', 'desc')
         );
         
         const querySnapshot = await getDocs(q);
         const entries = querySnapshot.docs.map(doc => ({
           entryId: doc.id,
           ...doc.data(),
         }));
         
         return { success: true, entries };
       } catch (error) {
         console.error('Error fetching entries:', error);
         return { success: false, error: 'FETCH_FAILED', entries: [] };
       }
     }
     ```

2. **Create EntryCard Component:**
   - Create `apps/food-diary/src/components/EntryCard.tsx`
   - Display entry information:
     - Entry type, date, time
     - Food eaten
     - Image thumbnail (if available)
     - Emotions (as chips)
     - Location, company
     - Description (truncated)
     - Behavior (as chips)
     - Skipped meal indicator
   - Use shared UI components for styling
   - Make card clickable (navigate to edit page later)

3. **Create EntryOverview Component:**
   - Create `apps/food-diary/src/components/EntryOverview.tsx`
   - Add `"use client"` directive (needed for data fetching)
   - Use `useEffect` to fetch entries on mount
   - Group entries by date using `reduce`:
     ```typescript
     const groupedEntries = entries.reduce((acc, entry) => {
       const dateKey = entry.date.toDate().toISOString().split('T')[0];
       if (!acc[dateKey]) {
         acc[dateKey] = [];
       }
       acc[dateKey].push(entry);
       return acc;
     }, {} as Record<string, typeof entries>);
     ```

4. **Render Overview with Grouped Entries:**
   - Map over grouped entries (by day)
   - For each day, render date header (formatted, translated)
   - Map over entries for that day and render `EntryCard` components
   - Use Tailwind Grid or Stack for layout

5. **Add Image Thumbnails:**
   - In `EntryCard`, display image if `imageUrl` exists
   - Use Next.js `Image` component for optimization
   - Show placeholder if no image

6. **Add Loading State:**
   - Show loading skeleton/spinner while fetching entries
   - Handle empty state (no entries)

7. **Add Translations:**
   - Update `nl.json` and `en.json`:
     ```json
     {
       "overview": {
         "title": "Food Diary",
         "noEntries": "No entries yet. Create your first entry!",
         "loading": "Loading entries...",
         "today": "Today",
         "yesterday": "Yesterday"
       },
       "entryCard": {
         "skippedMeal": "Skipped Meal",
         "viewDetails": "View Details"
       }
     }
     ```

8. **Add Date Formatting:**
   - Format dates using `Intl.DateTimeFormat` or date-fns
   - Show relative dates (Today, Yesterday) or formatted dates
   - Use locale-aware date formatting

9. **Render EntryOverview in Main Page:**
   - Update `apps/food-diary/src/app/[locale]/page.tsx`
   - Import and render `EntryOverview` component
   - Add page layout with header/navigation

10. **Add Empty State:**
    - Show message when no entries exist
    - Add link/button to create first entry

11. **Test Overview Screen:**
    - Verify entries are fetched correctly
    - Verify entries are grouped by date
    - Verify image thumbnails display
    - Test with entries from different days
    - Test empty state
    - Test loading state
    - Verify translations work

## 6. Acceptance Criteria

- `fetchDiaryEntries` server action created and functional
- `EntryCard` component created to display individual entries
- `EntryOverview` component created to display all entries
- Entries are fetched from Firestore for current user
- Entries are grouped by date correctly
- Entries are displayed as cards under date headers
- Image thumbnails display for entries with images
- Date headers are formatted and translated
- Loading state is shown while fetching
- Empty state is shown when no entries exist
- Overview screen is rendered on main page (`/[locale]`)
- All text is translated (Dutch and English)
- Layout is responsive

## 7. Notes

- This story implements the main diary entry overview screen
- Consider adding filtering and sorting in future stories
- Image thumbnails should be optimized (use Next.js Image component)
- Date grouping should handle timezone correctly
- Consider adding pagination for users with many entries
- Entry cards should be accessible (keyboard navigation, screen readers)
- Consider adding edit/delete functionality to entry cards in future stories
