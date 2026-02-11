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
- Using AI-powered food recognition for quick diary entry creation.

## 4. Key Features

- **Food Diary Entry Creation:** Users can easily log their meals and snacks with detailed information.
  - Fields include: 'Food Eaten', 'Emotions' (multi-select chips), 'Location' (select field), 'Company' (select field), 'Description', 'Behavior' (multi-select chips), 'Skipped Meal' (toggle switch), 'Date', 'Time', and 'Entry Type' (select field).
  - **Image Upload:** Users can upload photos of their food, which are stored on Cloudinary (resized to small format, within free tier limits).
  - **AI-Powered Food Analysis:** Users can upload a food photo and receive AI-generated analysis (food identification, meal type suggestions, description) using Google Gemini Flash. Limited to 3 analyses per user per day to manage API costs.
- **Internationalization (i18n):** The application supports both Dutch (default) and English languages. All user-facing text is translatable via JSON translation files.
- **Guest User Access:** Users can start using the diary without creating an account, allowing for immediate access and trial.
- **Optional User Accounts:** Users have the option to create persistent accounts using Google login via Firebase Authentication.
- **Data Persistence:** All diary entries, whether from guest users or registered users, are securely stored in Google Firestore. Guest user data will be merged upon account creation.
- **Diary Entry Overview:** A clear and organized overview screen displays all recorded entries, grouped by day and presented as cards for easy review. Entries with images display thumbnails.
- **Deployment on Vercel:** The application will be deployed on Vercel for easy access and scalability.

## 5. Technologies Used

- **Monorepo:** Turborepo with pnpm workspaces for managing multiple applications and shared packages.
- **Frontend:** React 19, Next.js 15/16 (App Router), TypeScript (strict mode), Tailwind CSS 4.
- **UI Components:** Shared component library (`@repo/ui`) built with React Aria primitives and shadcn-style Tailwind components. No external UI libraries (MUI removed).
- **Internationalization:** next-intl for i18n support (Dutch and English).
- **Backend & Data:** React 19 Server Actions, Google Firebase (Authentication, Firestore).
- **Image Storage:** Cloudinary (free tier) for storing resized food photos.
- **AI Analysis:** Google Gemini Flash API for food image analysis (free tier: 15 RPM, 1M tokens/day).
- **Deployment:** Vercel

## 6. Project Structure

The project is organized as a monorepo:

```
try-react/
├── apps/
│   └── food-diary/          # Next.js 16 application
├── packages/
│   └── ui/                  # Shared React Aria + Tailwind component library
├── turbo.json               # Turborepo configuration
├── pnpm-workspace.yaml      # pnpm workspace configuration
├── package.json             # Root package.json
└── docs/
    └── stories/             # User stories and implementation guides
```

## 7. Project Goals

- Develop a functional and user-friendly food diary web application.
- Implement all core features as described, including i18n, image upload, and AI analysis.
- Ensure data persistence and user data security.
- Maintain a scalable monorepo structure for future expansion.
- Create comprehensive project documentation for future development and maintenance.
- Keep all services within free tier limits (Cloudinary, Gemini Flash).
