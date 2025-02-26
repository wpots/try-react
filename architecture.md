# Architecture: Food Diary Web Application

## 1. Frontend Architecture (React 19 with Server Actions and MUI)

### 1.1. Technology Stack

- **React 19:** A JavaScript library for building user interfaces. React 19 introduces Server Actions, which will be used for backend interactions.
- **React MUI (Material UI):** A React UI framework that provides a rich set of pre-built components, ensuring a consistent and modern user interface.
- **JavaScript/JSX:** Primary languages for frontend development.
- **Client-side State Management:** React's built-in `useState`, `useReducer`, and `useContext` will be used for managing component-level and application-level state as needed. For simpler state management, component level state will suffice.

### 1.2. Component Structure (Tentative)

- **`src/components/`**: Directory for reusable React components.
  - `EntryForm.tsx`: Component for creating and editing food diary entries. Includes all input fields (Food Eaten, Emotions, Location, Company, Description, Behavior, Skipped Meal, Date, Time, Entry Type) using MUI components.
  - `EntryCard.tsx`: Component to display a single diary entry in the overview screen.
  - `EntryOverview.tsx`: Component to display all diary entries, grouped by day, using `EntryCard` components.
  - `AuthButtons.tsx`: Component for Google and Facebook login buttons, and guest login option.
  - `Layout.tsx`: Layout component to structure the overall page layout (e.g., header, footer, main content area).
- **`src/app/`**: Directory for application routes and page components (using React 19's app directory structure).
  - `page.tsx`: Main page component, likely to house the `EntryOverview` component.
  - `entry/create/page.tsx`: Page for creating a new diary entry, containing the `EntryForm` component.
  - `auth/login/page.tsx`: Page for login options (`AuthButtons`).

### 1.3. Server Actions for Backend Interaction

- Server Actions will be defined within React components (e.g., in `EntryForm.tsx`).
- Actions will handle:
  - Saving new diary entries to Firestore.
  - Fetching diary entries from Firestore for the overview screen.
  - Potentially handling user authentication related tasks if needed on the server-side (though client-side auth is preferred for now).

## 2. Backend Architecture (Firebase)

### 2.1. Firebase Services

- **Firebase Authentication:**
  - Used for user authentication:
    - Google Login
    - Facebook Login
    - Guest Authentication
  - Client-side implementation using Firebase SDK.
- **Google Firestore:**
  - NoSQL document database for storing application data.
  - Collections:
    - `users`: Stores user profiles (initially, just user IDs).
    - `diaryEntries`: Stores all diary entries with fields as defined in the project brief and clarifications.
  - Data Model:
    - **Users Collection:**
      ```
      /users/{userId}
      ```
      - `userId` (String): Firebase Authentication UID.
    - **Diary Entries Collection:**
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

### 2.2. API Endpoints (Server Actions)

- Server Actions in React components will act as API endpoints.
- Functions like `saveDiaryEntry(formData)` and `fetchDiaryEntries(userId)` will be implemented as Server Actions to interact with Firestore.

## 3. Deployment Architecture (Vercel)

### 3.1. Vercel Platform

- Application will be deployed on Vercel, a platform optimized for React applications.
- Vercel provides:
  - Serverless functions (for Server Actions).
  - Automatic deployments from Git repository.
  - Global CDN for fast content delivery.

### 3.2. Configuration

- **Environment Variables:** Firebase configuration details (API keys, project ID, etc.) will be set as environment variables in Vercel project settings.
- **Deployment Process:**
  - Connect Vercel project to the GitHub repository containing the food diary application code.
  - Vercel will automatically build and deploy the application on every code push to the main branch.

### 3.3. Guest User ID Generation and Management (To be refined)

- For guest users, a unique ID needs to be generated and stored (e.g., in local storage).
- This guest ID will be used as `userId` in Firestore `diaryEntries` collection.
- Upon user registration (Google/Facebook login), guest entries will be merged with the user's account entries based on this guest ID (implementation details to be defined in user stories).

This architecture document provides a high-level overview of the technical structure of the Food Diary Web Application. Further details will be elaborated in the user stories and implementation phases.
