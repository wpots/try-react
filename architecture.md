# Architecture: Food Diary (Current State)

Last updated: February 18, 2026.

This document describes what is implemented today, not the originally planned
target architecture.

## 1. Monorepo Architecture

The repository uses Turborepo + pnpm workspaces.

```text
try-react/
├── apps/
│   ├── food-diary/          # Next.js 16 app
│   └── storybook/           # Storybook app
├── packages/
│   └── ui/                  # Shared UI package (@repo/ui)
├── docs/
│   └── stories/             # Story specs + alignment roadmap
├── architecture.md
└── projectbrief.md
```

Storybook information architecture is currently being expanded with:

- `Foundations/*` stories for semantic tokens and primitive galleries.
- `Components/*` stories for reusable UI component documentation.

## 2. Product Surface Implemented

### 2.1 Main User Flows

- Landing page with product marketing sections and localized content.
- Authentication flow:
  - Guest login (Firebase anonymous auth)
  - Google login
  - Guest-to-Google merge path
- Dashboard:
  - Day/Week/Month views
  - Entry cards with mood badges
  - Edit/delete entry flows
  - Guest/profile dialogs for account actions
- Entry creation/edit:
  - Chat-first "coach" flow
  - Traditional form mode
  - Conditional question flow
  - Save to Firestore

### 2.2 Route Structure (`apps/food-diary/src/app`)

- `/[locale]/page.tsx` - landing/home.
- `/[locale]/auth/login/page.tsx` - auth options.
- `/[locale]/dashboard/page.tsx` - dashboard shell.
- `/[locale]/entry/create/page.tsx` - create/edit entry.
- `/[locale]/layout.tsx` - locale provider + auth provider.
- `layout.tsx` - root html/body and font setup.

## 3. Frontend and i18n

### 3.1 Stack

- React 19
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- next-intl
- Firebase Web SDK
- Shared components from `@repo/ui`

### 3.2 Internationalization

- Locales: `nl` (default), `en`.
- Locale prefix strategy: `"as-needed"` with locale detection disabled.
- Message files are feature-split:
  - `messages/nl/*.json`
  - `messages/nl/entry/*.json`
  - same shape for `en`.

## 4. Data Architecture (Current)

### 4.1 Firebase Services

- Firebase Authentication: anonymous + Google sign-in.
- Firestore: primary persistence for diary entries and quota records.

### 4.2 Firestore Model

Implemented model and validation live under:

- `apps/food-diary/src/lib/firestore/types.ts`
- `apps/food-diary/src/lib/firestore/schemas.ts`
- `apps/food-diary/src/lib/firestore/helpers.ts`
- `apps/food-diary/src/lib/firestore/converters.ts`

Collections currently modeled:

- `diaryEntries`
- `userAnalysisQuota`
- `users`

### 4.3 Data Access Pattern (Important)

Current writes/reads for entry CRUD are mainly performed through client-side
helpers in `apps/food-diary/src/lib/diaryEntries.ts`, which call Firestore
helpers directly from client components.

Server actions exist under `apps/food-diary/src/app/actions/`, but only some
flows rely on them today:

- Used: `mergeGuestEntries`, `wipeGuestEntries`, `wipeUserEntries`
- Present but not the primary path for entry UI:
  - `saveDiaryEntry`
  - `fetchDiaryEntries`

## 5. Features Planned But Not Implemented

Not implemented in the current UI flow:

- Cloudinary image upload workflow
- Gemini food analysis workflow
- End-to-end quota-driven analysis UX

Schema support for `imageUrl` and `imagePublicId` exists, but upload and
analysis actions/UI are not wired as shipped features.

## 6. Known Gaps and Risks

- Server-owned auth for diary mutations is not fully enforced yet.
- Entry save/fetch architecture is split between client Firestore calls and
  server actions.
- Dashboard bookmark toggle is currently local UI state, not persisted.
- Automated test coverage is minimal (`test` scripts are placeholders).
- Workspace lint currently fails on several files.
- Build can fail in offline environments because `next/font/google` fetches
  external font resources at build time.

## 7. Target Near-Term Architecture

### Phase 1: Stabilize Core Data Flow

- Move entry CRUD to server actions as the default runtime path.
- Resolve user identity from trusted server context for writes.
- Remove fallback client-side mutation paths that bypass server boundaries.

### Phase 2: Complete Media + AI Flow

- Implement Cloudinary upload action + UI.
- Implement Gemini analysis action + quota UX.
- Persist image metadata in create/edit and dashboard display paths.

### Phase 3: Quality and Operations

- Add meaningful test coverage (unit + integration + key end-to-end paths).
- Fix lint debt and codify CI quality gates.
- Confirm deployment runbook and production checks.

## 8. User Story Alignment

Source of truth for implementation-vs-story status is now:

- `docs/stories/README.md`

**next-intl:**

- `NEXT_PUBLIC_DEFAULT_LOCALE` (default: "nl")

#### Deployment Process

1. Connect Vercel project to Git repository (GitHub/GitLab/Bitbucket)
2. Configure Turborepo build settings in Vercel dashboard
3. Set environment variables in Vercel project settings
4. Vercel automatically builds and deploys on code push to main branch
5. Monorepo builds handled by Turborepo, caching optimized builds

### 5.3. Guest User ID Generation and Management

- For guest users, Firebase Anonymous Authentication generates a unique UID
- Guest UID stored in Firebase Auth and used as `userId` in Firestore `diaryEntries` collection
- Upon user registration (Google login), guest entries are merged with the user's account:
  - Server Action `mergeGuestEntries(guestId, userId)` updates all guest entries with new authenticated userId
  - Guest account can be deleted or kept for reference

## 6. Design System & Styling

### 6.1. Tailwind CSS 4

- **Configuration:** CSS-first via `@theme` directive in `globals.css`
- **Design Tokens:** Colors, spacing, typography defined as CSS variables
- **No Config File:** No `tailwind.config.ts` - all customization in CSS
- **Mobile-First:** Responsive design using Tailwind breakpoints

### 6.2. Shared UI Components

- Built with React Aria for accessibility (keyboard navigation, ARIA attributes, screen reader support)
- Styled with Tailwind utilities following design tokens
- Each component follows project rules:
  - Types defined in `index.ts`
  - Props extend `React.ComponentProps<Element>`
  - Server Components by default (client components only when needed)
  - Comprehensive Jest and Storybook tests

This architecture document provides a high-level overview of the technical structure of the Food Diary Web Application. Further details will be elaborated in the user stories and implementation phases.
