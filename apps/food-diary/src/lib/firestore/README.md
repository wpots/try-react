# Firestore Data Model (Story 007)

## Collections

### `/users/{userId}`

- `userId` (`string`): Firebase Auth UID (matches document ID)
- `email` (`string`, optional)
- `displayName` (`string`, optional)
- `photoURL` (`string`, optional)
- `createdAt` (`Timestamp`)
- `lastLoginAt` (`Timestamp`)

### `/diaryEntries/{entryId}`

- `entryId` (`string`): Firestore document ID
- `userId` (`string`)
- `entryType` (`"breakfast" | "lunch" | "dinner" | "snack" | "moment" | "thought"`)
- `foodEaten` (`string`)
- `emotions` (`string[]`)
- `location` (`"home" | "work" | "restaurant" | "friend's house" | "on the road" | "family event"`)
- `company` (`"family" | "friends" | "alone" | "colleagues" | "kids" | "partner"`)
- `description` (`string`)
- `behavior` (`("restricted" | "binged" | "threw up")[]`)
- `skippedMeal` (`boolean`)
- `date` (`Timestamp`)
- `time` (`string`, `"HH:mm"`)
- `imageUrl` (`string`, optional)
- `imagePublicId` (`string`, optional)
- `createdAt` (`Timestamp`)
- `updatedAt` (`Timestamp`)

### `/userAnalysisQuota/{userId}`

- `userId` (`string`): document ID
- `date` (`string`): `"YYYY-MM-DD"`
- `count` (`number`): `0..3`
- `lastReset` (`Timestamp`)
- `lastAnalysisAt` (`Timestamp`, optional)

## Query Patterns

- Entries by user:
  - `where("userId", "==", userId)`
- Entries by user in date range:
  - `where("userId", "==", userId)`
  - `where("date", ">=", startDate)`
  - `where("date", "<=", endDate)`
  - `orderBy("date", "desc")`
- Quota lookup:
  - `doc(db, "userAnalysisQuota", userId)`

## Index Requirements

- Composite index recommended:
  - Collection: `diaryEntries`
  - Fields: `userId` (`ASC`), `date` (`DESC`)

Firestore may prompt additional index creation links depending on query usage.

## Validation Flow (RAC + Zod)

- Client form fields use RAC validation for immediate UX feedback.
- Server actions parse incoming payloads with Zod from
  `src/lib/firestore/schemas.ts`.
- Firestore writes happen only after successful Zod parse.

## Security Rules Structure (High-Level)

- Users can read/write only their own `/users/{userId}` document.
- Users can read/write only entries where `resource.data.userId == request.auth.uid`.
- Users can read/write only their own `/userAnalysisQuota/{userId}` document.
- Guest users authenticated by Firebase Auth (anonymous) follow the same
  per-UID ownership checks.

Detailed production security rules are implemented in later stories.

## Component Usage Mapping (Downstream Stories)

- Form container:
  - `Form` from `react-aria-components`
  - `Button` from `@repo/ui`
- Core entry fields:
  - `TextField` for `foodEaten`, `description`, `time`
  - `DatePicker` for `date`
  - `Select` for `entryType`, `location`, `company`
  - `TagGroup` for `emotions`, `behavior`
  - `Switch` for `skippedMeal`
- Image + AI flow:
  - `FileTrigger` as default picker
  - `DropZone` optional for desktop drag-and-drop
  - `Button` for analyze/retry
  - read-only text preview for AI result before save
