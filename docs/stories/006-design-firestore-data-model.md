# User Story 006: Design Firestore Data Model

## 1. Title

Design the Firestore data model for users and diary entries.

## 2. Goal

To define the data structure in Firestore for storing user information and food diary entries, ensuring efficient data organization and retrieval.

## 3. Description

As a junior developer, I need to design the Firestore data model based on the project requirements and clarifications. This includes defining collections, documents, and fields for users and diary entries to ensure that the data is structured logically and can be easily accessed and managed.

## 4. Technical Details

- **Firestore Collections:** Define collections for `users` and `diaryEntries`.
- **Data Model for Users:**
  - Collection: `users`
  - Document ID: User UID from Firebase Authentication.
  - Fields (initially):
    - `userId`: String (Firebase Authentication UID).
    - (Future fields can be added for user profile information).
- **Data Model for Diary Entries:**
  - Collection: `diaryEntries`
  - Document ID: Auto-generated unique ID for each entry.
  - Fields:
    - `userId`: String (Firebase UID or Guest User ID).
    - `entryType`: String (e.g., "breakfast", "lunch", "dinner", "snack", "moment", "thought").
    - `foodEaten`: String.
    - `emotions`: Array of Strings (selected emoticons).
    - `location`: String (e.g., "home", "work", "restaurant", "friend's house", "on the road", "family event").
    - `company`: String (e.g., "family", "friends", "alone", "colleagues", "kids", "partner").
    - `description`: String.
    - `behavior`: Array of Strings (selected behaviors).
    - `skippedMeal`: Boolean.
    - `date`: Timestamp (Firestore Timestamp for date).
    - `time`: String (e.g., "HH:mm").
    - `createdAt`: Timestamp (Firestore Timestamp, auto-generated on creation).
    - `updatedAt`: Timestamp (Firestore Timestamp, auto-updated on modification).

## 5. Steps to Implement

1. **Document Data Model in `architecture.md`:**
   - Open `architecture.md` and update the "2.1. Firebase Services" -> "Google Firestore" -> "Data Model" section to accurately reflect the designed data model for `users` and `diaryEntries` collections as described in "4. Technical Details".
   - Ensure the field names and data types are clearly documented.
   - Example update in `architecture.md`:
     ````markdown
     ### 2.1. Firebase Services

     - **Google Firestore:**
       - NoSQL document database for storing application data.
       - Collections:
         - `users`: Stores user profiles (initially, just user IDs).
           - Data Model:
             ```
             /users/{userId}
             ```
             - `userId` (String): Firebase Authentication UID.
         - `diaryEntries`: Stores all diary entries with detailed fields.
           - Data Model:
             ```
             /diaryEntries/{entryId}
             ```
             - `userId` (String): User ID (Firebase UID or Guest User ID).
             - `entryType` (String): "breakfast", "lunch", "dinner", "snack", "moment", "thought".
             - `foodEaten` (String).
             - `emotions` (Array of Strings): Selected emoticons.
             - `location` (String): "home", "work", "restaurant", "friend's house", "on the road", "family event".
             - `company` (String): "family", "friends", "alone", "colleagues", "kids", "partner".
             - `description` (String).
             - `behavior` (Array of Strings): Selected behaviors.
             - `skippedMeal` (Boolean).
             - `date` (Timestamp): Firestore Timestamp for date.
             - `time` (String): "HH:mm".
             - `createdAt` (Timestamp): Firestore Timestamp (auto-generated).
             - `updatedAt` (Timestamp): Firestore Timestamp (auto-updated).
     ````
2. **Review Data Model:**
   - Review the designed data model to ensure it meets the requirements for storing all necessary information for diary entries and user profiles.
   - Consider data types for each field and ensure they are appropriate for the intended data.
   - Think about potential future data requirements and if the model is flexible enough to accommodate them.

## 6. Acceptance Criteria

- The Firestore data model for `users` and `diaryEntries` collections is clearly defined, including collection names, document IDs, and fields with data types.
- The data model is documented in `architecture.md` under the "Google Firestore" section.
- The designed data model is reviewed and confirmed to be suitable for the application's data storage needs.

## 7. Notes

- This user story focuses on designing the data model. Implementation of data saving and retrieval will be covered in subsequent user stories.
- Firestore security rules will be defined later to secure data access.
- Consider adding indexes to Firestore collections in the future if needed for optimized querying and data retrieval performance.
