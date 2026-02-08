# User Story 007: Design Firestore Data Model

## 1. Title

Design and document the complete Firestore data model including diary entries, users, and analysis quota.

## 2. Goal

To define the complete data structure for Firestore collections, including all fields for diary entries, user profiles, and the new analysis quota tracking system for AI image analysis.

## 3. Description

As a developer, I need to design the Firestore data model that will store all application data. This includes diary entries with image support, user profiles, and a quota tracking system for limiting AI image analyses to 3 per user per day.

## 4. Technical Details

- **Collections:** `users`, `diaryEntries`, `userAnalysisQuota`
- **Data Types:** Strings, Arrays, Booleans, Timestamps, Numbers
- **Indexes:** May need composite indexes for queries (e.g., userId + date)
- **Security Rules:** Basic rules structure (detailed implementation in later stories)

## 5. Steps to Implement

1. **Document Users Collection:**
   ```
   /users/{userId}
   ```
   - `userId` (String): Firebase Authentication UID (same as document ID)
   - `email` (String, optional): User email (if available from social auth)
   - `displayName` (String, optional): User display name
   - `photoURL` (String, optional): User profile photo URL
   - `createdAt` (Timestamp): Account creation timestamp
   - `lastLoginAt` (Timestamp): Last login timestamp

2. **Document Diary Entries Collection:**
   ```
   /diaryEntries/{entryId}
   ```
   - `entryId` (String): Auto-generated document ID
   - `userId` (String): User ID (Firebase UID or Guest UID)
   - `entryType` (String): "breakfast", "lunch", "dinner", "snack", "moment", "thought"
   - `foodEaten` (String): Description of food consumed
   - `emotions` (Array of Strings): Selected emotion chips (e.g., ["happy", "stressed"])
   - `location` (String): "home", "work", "restaurant", "friend's house", "on the road", "family event"
   - `company` (String): "family", "friends", "alone", "colleagues", "kids", "partner"
   - `description` (String): Additional notes/description
   - `behavior` (Array of Strings): Selected behavior chips
   - `skippedMeal` (Boolean): Whether meal was skipped
   - `date` (Timestamp): Date of the entry (Firestore Timestamp)
   - `time` (String): Time in "HH:mm" format
   - `imageUrl` (String, optional): Cloudinary URL of food photo
   - `imagePublicId` (String, optional): Cloudinary public_id for image management
   - `createdAt` (Timestamp): Entry creation timestamp (auto-generated)
   - `updatedAt` (Timestamp): Entry last update timestamp (auto-updated)

3. **Document User Analysis Quota Collection:**
   ```
   /userAnalysisQuota/{userId}
   ```
   - `userId` (String): User ID (same as document ID)
   - `date` (String): Current date in "YYYY-MM-DD" format
   - `count` (Number): Number of AI analyses used today (0-3)
   - `lastReset` (Timestamp): Last time quota was reset (for daily reset logic)
   - `lastAnalysisAt` (Timestamp, optional): Timestamp of last analysis

4. **Create TypeScript Type Definitions:**
   - Create `apps/food-diary/src/types/firestore.ts`
   - Define interfaces:
     ```typescript
     export interface User {
       userId: string;
       email?: string;
       displayName?: string;
       photoURL?: string;
       createdAt: Timestamp;
       lastLoginAt: Timestamp;
     }
     
     export interface DiaryEntry {
       entryId?: string;
       userId: string;
       entryType: "breakfast" | "lunch" | "dinner" | "snack" | "moment" | "thought";
       foodEaten: string;
       emotions: string[];
       location: string;
       company: string;
       description: string;
       behavior: string[];
       skippedMeal: boolean;
       date: Timestamp;
       time: string;
       imageUrl?: string;
       imagePublicId?: string;
       createdAt: Timestamp;
       updatedAt: Timestamp;
     }
     
     export interface UserAnalysisQuota {
       userId: string;
       date: string; // "YYYY-MM-DD"
       count: number; // 0-3
       lastReset: Timestamp;
       lastAnalysisAt?: Timestamp;
     }
     ```

5. **Document Query Patterns:**
   - Fetch entries by user: `where("userId", "==", userId)`
   - Fetch entries by date range: `where("date", ">=", startDate)`
   - Order entries: `orderBy("date", "desc")`
   - Check analysis quota: `doc(db, "userAnalysisQuota", userId)`

6. **Document Index Requirements:**
   - Composite index may be needed for: `userId` + `date` (descending)
   - Firestore will prompt to create indexes when needed

7. **Create Helper Functions (Optional):**
   - Create `apps/food-diary/src/lib/firestore-helpers.ts`
   - Add helper functions for common operations:
     - `getDiaryEntriesByUser(userId)`
     - `getDiaryEntriesByDateRange(userId, startDate, endDate)`
     - `getAnalysisQuota(userId)`
     - `incrementAnalysisQuota(userId)`

8. **Document Security Rules Structure:**
   - Users can only read/write their own entries
   - Users can only read/write their own quota
   - Guest users have same permissions as registered users
   - (Detailed security rules implementation in later story)

## 6. Acceptance Criteria

- Users collection structure documented with all fields
- Diary Entries collection structure documented with all fields (including image fields)
- User Analysis Quota collection structure documented
- TypeScript interfaces created for all collections
- Query patterns documented
- Helper functions created (optional but recommended)
- Data model follows Firestore best practices
- All fields have appropriate types
- Optional fields are marked as optional in TypeScript
- Date format for quota tracking is documented ("YYYY-MM-DD")

## 7. Notes

- This story focuses on design and documentation - actual Firestore setup happens in implementation stories
- Image fields (`imageUrl`, `imagePublicId`) are optional - entries can exist without images
- Analysis quota resets daily based on `date` field comparison
- Consider adding indexes early to avoid query errors during development
- Security rules should be implemented before production deployment
- Timestamp fields use Firestore Timestamp type (not JavaScript Date)
