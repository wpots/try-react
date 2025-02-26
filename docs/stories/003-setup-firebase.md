# User Story 003: Setup Firebase

## 1. Title

Set up Firebase project, Firebase Authentication, and Firestore, and initialize Firebase in the React app.

## 2. Goal

To configure Firebase for the Food Diary application, including setting up a Firebase project, enabling Firebase Authentication and Firestore, and initializing the Firebase SDK in the React application.

## 3. Description

As a junior developer, I need to set up Firebase for the project to handle user authentication and data storage. This involves creating a Firebase project, enabling the necessary Firebase services (Authentication and Firestore), obtaining the Firebase configuration, and initializing Firebase within the React application.

## 4. Technical Details

- **Firebase Project:** A new Firebase project will be created for the Food Diary application.
- **Firebase Services:**
  - Firebase Authentication: Enabled for user authentication (Google, Facebook, Guest).
  - Firestore: Enabled as the NoSQL database for storing diary entries and user data.
- **Firebase SDK:** The Firebase JavaScript SDK will be used in the React application to interact with Firebase services.

## 5. Steps to Implement

1. **Create Firebase Project:**
   - Go to the Firebase Console ([https://console.firebase.google.com/](https://console.firebase.google.com/)) and create a new project.
   - Follow the project creation steps, providing a project name (e.g., "food-diary-app") and accepting the default settings.
2. **Enable Authentication:**
   - In the Firebase project console, navigate to "Authentication" in the left sidebar.
   - Click on "Get started" and enable "Google" and "Facebook" sign-in methods. You will need to configure the OAuth client IDs and secrets for Google and Facebook later if you want to fully implement these providers, but for now just enabling them is sufficient.
   - Enable "Guest" sign-in method (if available, otherwise check Firebase documentation for guest/anonymous auth).
3. **Enable Firestore:**
   - In the Firebase project console, navigate to "Firestore Database" in the left sidebar.
   - Click on "Create database".
   - Choose "Start in production mode" for now (you can adjust security rules later).
   - Select a location for your Firestore database.
4. **Get Firebase Configuration:**
   - In the Firebase project console, go to "Project settings" (gear icon next to "Project Overview" in the top left).
   - Scroll down to the "Your apps" section and click on the "Web" icon (`</>`).
   - Register your app with a nickname (e.g., "food-diary-web-app").
   - In the "Add Firebase SDK" step, you will see the Firebase configuration object. Copy this configuration object (it's a JavaScript object).
5. **Install Firebase SDK in React App:**
   - Open your terminal in the React project directory (`/Users/wietekepots/Try-React/food-diary`).
   - Run the following command to install the Firebase SDK:
     ```bash
     npm install firebase
     ```
6. **Initialize Firebase in React App:**

   - Create a new file `src/firebase.ts` (or `src/firebase/firebase.ts`).
   - Paste the copied Firebase configuration object into this file.
   - Initialize Firebase using `initializeApp` and export the initialized Firebase app and the Firebase services you will use (auth, firestore).

     ```typescript
     // src/firebase.ts
     import { initializeApp } from "firebase/app";
     import { getAuth } from "firebase/auth";
     import { getFirestore } from "firebase/firestore";

     const firebaseConfig = {
       // Your Firebase configuration object from step 4 goes here
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_STORAGE_BUCKET",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID",
     };

     const app = initializeApp(firebaseConfig);
     export const auth = getAuth(app);
     export const db = getFirestore(app);
     export default app;
     ```

   - **Important:** Replace the placeholder `YOUR_...` values in `firebaseConfig` with your actual Firebase configuration values copied from the Firebase Console.

7. **Verify Firebase Initialization:**

   - In `src/App.tsx`, import `firebaseApp` from `src/firebase.ts` and log it to the console to verify that Firebase is initialized without errors.

     ```typescript
     // src/App.tsx
     import React from "react";
     import Button from "@mui/material/Button";
     import firebaseApp from "./firebase"; // or './firebase/firebase'

     function App() {
       console.log("Firebase initialized:", firebaseApp); // Add this line
       return (
         <>
           <Button variant="contained" color="primary">
             Hello MUI
           </Button>
         </>
       );
     }

     export default App;
     ```

   - Run the development server (`npm run dev`) and check the browser console. You should see a message "Firebase initialized:" followed by the Firebase app object, indicating successful initialization.

## 6. Acceptance Criteria

- A new Firebase project is created, and Firebase Authentication and Firestore are enabled.
- Firebase JavaScript SDK is installed in the React project.
- Firebase is successfully initialized in the React application using the correct configuration.
- No errors during Firebase initialization, verified by console log in `App.tsx`.

## 7. Notes

- Ensure you keep your Firebase configuration details secure and do not expose them in public repositories. Consider using environment variables for sensitive configuration values in production.
- Security rules for Firestore will be configured in a later user story to protect your database.
