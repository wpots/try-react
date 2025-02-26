# User Story 009: Implement Diary Entry Overview

## 1. Title

Create the diary entry overview screen to display entries grouped by day as cards.

## 2. Goal

To implement a user interface to display the saved diary entries in an organized manner, grouped by day and presented as cards, allowing users to review their entries.

## 3. Description

As a junior developer, I need to create the diary entry overview screen, which will be the main screen of the application. This screen should fetch diary entries from Firestore, group them by date, and display each day's entries as a set of cards, making it easy for users to review their food diary history.

## 4. Technical Details

- **React Component:** Create a new React component `EntryOverview.tsx` in `src/components/`.
- **Data Fetching:** Implement a Server Action or client-side function to fetch diary entries from Firestore for the current user.
- **Data Grouping:** Group the fetched diary entries by date.
- **UI Display:**
  - Use MUI components to display the overview.
  - Display entries grouped by day.
  - For each day, render a date header.
  - Under each date header, display diary entries for that day as `EntryCard` components (create a new `EntryCard` component if not already created).
  - Use MUI `Card` component for `EntryCard` to display individual entries.
- **Data Presentation in `EntryCard`:** Decide which fields to display in the `EntryCard` component to provide a concise overview of each diary entry (e.g., time, entry type, food eaten, emotions).

## 5. Steps to Implement

1. **Create `EntryOverview` Component:**
   - Create a new file `src/components/EntryOverview.tsx`.
   - Define a functional React component `EntryOverview`.
2. **Create `EntryCard` Component (if not already exists):**
   - Create a new file `src/components/EntryCard.tsx` if it doesn't exist.
   - Define a functional component `EntryCard` to display a single diary entry.
   - Decide which props `EntryCard` will receive to display entry details.
   - Use MUI `Card`, `CardContent`, `Typography`, etc., to structure the `EntryCard` UI.
3. **Implement Data Fetching Function:**

   - In `EntryOverview.tsx`, create a function (Server Action or client-side) to fetch diary entries from Firestore.
   - If using Server Action, define it within `EntryOverview.tsx` or in `src/app/actions.ts`.
   - Fetch entries from the `diaryEntries` collection for the current user, ordered by date (descending).
   - Example (Server Action in `EntryOverview.tsx`):

     ```typescript
     // src/components/EntryOverview.tsx
     "use server";

     import { auth, db } from "@/firebase";
     import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

     const fetchDiaryEntries = async () => {
       const userId = auth.currentUser?.uid;
       if (!userId) {
         return []; // Or handle unauthenticated state
       }
       const entriesQuery = query(
         collection(db, "diaryEntries"),
         where("userId", "==", userId),
         orderBy("date", "desc") // Or 'createdAt' if date is not a Timestamp
       );
       const querySnapshot = await getDocs(entriesQuery);
       const entries = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
       return entries;
     };
     ```

4. **Implement Data Grouping by Date:**
   - In `EntryOverview.tsx`, after fetching entries, implement logic to group them by date.
   - You can use JavaScript's `reduce` to group entries by date.
   - Format dates for display (e.g., "MMMM dd, yyyy").
5. **Render Overview with Grouped Entries:**
   - In `EntryOverview.tsx`, in the component's `return` statement:
     - Map over the grouped entries (by day).
     - For each day, render a date header (e.g., using MUI `Typography` with `variant="h6"`).
     - Map over the entries for that day and render `EntryCard` components for each entry, passing entry data as props.
     - Use MUI `Grid` or `Stack` to structure the layout.
6. **Render `EntryOverview` in Main Page:**
   - Open `src/app/page.tsx`.
   - Import and render the `EntryOverview` component in the main page to display it as the application's home screen.
7. **Verify in Browser:**
   - Run `npm run dev` and navigate to the application root (`http://localhost:5173`).
   - You should see the diary entry overview screen.
   - If you have diary entries in Firestore, they should be fetched, grouped by day, and displayed as cards under date headers.
   - Ensure `EntryCard` components display relevant entry information correctly.

## 6. Acceptance Criteria

- `EntryOverview.tsx` component is created in `src/components/`.
- `EntryCard.tsx` component is created (or existing one is used) to display individual diary entries.
- Data fetching function (Server Action or client-side) is implemented to retrieve diary entries from Firestore for the current user.
- Diary entries are correctly grouped by date in `EntryOverview` component.
- Entries are displayed on the overview screen, grouped by day, with date headers and `EntryCard` components for each entry.
- `EntryOverview` component is rendered on the main application page (`/`).
- Diary entry data is fetched from Firestore and displayed in the overview screen without errors.

## 7. Notes

- This user story implements the main diary entry overview screen, allowing users to view their saved entries.
- Consider adding features like filtering, sorting, and pagination to the overview screen in future user stories for enhanced data review.
- Styling and layout can be further refined for better visual presentation.
