# Project Brief: Food Diary Web Application

Last updated: February 18, 2026.

## 1. Purpose

Build a localized, low-friction food and mood diary that helps people reflect on
eating moments and emotional patterns over time.

## 2. Target Users

People who want to:

- Log food-related moments quickly.
- Track emotions and context around eating behavior.
- Review patterns daily, weekly, and monthly.
- Start without signup and optionally convert to a Google account.

## 3. Current Product Scope (Implemented)

### 3.1 Authentication

- Guest login via Firebase anonymous auth.
- Google login via Firebase.
- Guest-to-registered transition with entry merge flow.

### 3.2 Diary Entry Experience

- Create/edit entries through:
  - Chat-first coach flow.
  - Traditional form mode.
- Captured fields include:
  - Entry type, date/time, location, company.
  - Food eaten, emotions, description, behavior.
  - Optional "other" details for location/company/behavior.
  - Bookmark flag.
- Delete entry flow from form and dashboard.

### 3.3 Dashboard Experience

- Day/Week/Month views.
- Mood badges and average mood summary.
- Entry cards with expandable details.
- Edit and delete actions.
- Guest/profile dialogs for data wipe and account deletion flows.

### 3.4 Internationalization

- Dutch (`nl`) and English (`en`) supported via next-intl.
- Translation content is split by feature namespace.

### 3.5 Platform Foundation

- Turborepo + pnpm monorepo.
- Shared UI package (`@repo/ui`) with Storybook.
- Firestore schema/helpers/converters with Zod validation layer.

## 4. Roadmap Scope (Not Fully Implemented Yet)

- Cloudinary image upload flow (UI + action + metadata lifecycle).
- Gemini image analysis flow with daily quota UX.
- Unified server-action-first data mutation architecture.
- Production hardening:
  - stronger server auth boundaries for writes,
  - broader test coverage,
  - lint/build quality gates and CI reliability.

## 5. Technology

- React 19
- Next.js 16 App Router
- TypeScript
- Tailwind CSS 4
- next-intl
- Firebase Auth + Firestore
- Shared UI package: `@repo/ui`

## 6. Success Criteria for Next Iteration

- Align implementation with user stories and updated roadmap.
- Close critical architecture gaps in data ownership/security.
- Deliver image + AI flow or explicitly de-scope it.
- Improve reliability with tests and clean lint baseline.

## 7. Related Documentation

- `architecture.md` - current architecture and technical gaps.
- `docs/stories/README.md` - story-by-story status and roadmap alignment.
