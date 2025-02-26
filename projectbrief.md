# Project Brief: Food Diary Web Application

## 1. Project Title

Food Diary Web Application

## 2. Project Purpose

To create a user-friendly web application that empowers individuals to track their eating habits, including food intake, emotions, and contextual details. This application serves as a personal tool for reflection, self-awareness, and health monitoring related to dietary patterns.

## 3. Target Users

Individuals who are interested in:

- Monitoring their daily food consumption.
- Understanding the relationship between their eating habits and emotions.
- Tracking eating patterns in different locations and social contexts.
- Gaining insights into their dietary behavior for personal health improvement.

## 4. Key Features

- **Food Diary Entry Creation:** Users can easily log their meals and snacks with detailed information.
  - Fields include: 'Food Eaten', 'Emotions' (multi-select chips), 'Location' (select field), 'Company' (select field), 'Description', 'Behavior' (multi-select chips), 'Skipped Meal' (toggle switch), 'Date', 'Time', and 'Entry Type' (select field).
- **Guest User Access:** Users can start using the diary without creating an account, allowing for immediate access and trial.
- **Optional User Accounts:** Users have the option to create persistent accounts using Google or Facebook login via Firebase Authentication.
- **Data Persistence:** All diary entries, whether from guest users or registered users, are securely stored in Google Firestore. Guest user data will be merged upon account creation.
- **Diary Entry Overview:** A clear and organized overview screen displays all recorded entries, grouped by day and presented as cards for easy review.
- **Deployment on Vercel:** The application will be deployed on Vercel for easy access and scalability.

## 5. Technologies Used

- **Frontend:** React 19, React MUI (Material UI)
- **Backend & Data:** React 19 Server Actions, Google Firebase (Authentication, Firestore)
- **Deployment:** Vercel

## 6. Project Goals

- Develop a functional and user-friendly food diary web application.
- Implement all core features as described.
- Ensure data persistence and user data security.
- Create comprehensive project documentation for future development and maintenance.
