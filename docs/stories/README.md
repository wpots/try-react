# User Story Alignment and Roadmap

Last updated: February 28, 2026.

This file is the source of truth for story status against the current codebase.
Original story files are kept as historical implementation specs.

Story files are organized into two subdirectories:
- `done/` — stories with status `done`
- `todo/` — stories with status `partial`, `superseded`, or `not-started`

## Status Legend

- `done`: implemented and in active use.
- `partial`: implemented in part, or implemented with architectural gaps.
- `not-started`: no production path yet.
- `superseded`: original story assumptions changed and need rewrite.

## Story Status Matrix

| ID | Story | Status | Notes |
| --- | --- | --- | --- |
| 001 | Setup Turborepo + pnpm monorepo | done | Monorepo structure and turbo tasks are in place. |
| 002 | Setup shared UI package | done | `@repo/ui` is active and used broadly in app flows; Storybook foundations catalog is being expanded. |
| 003 | Setup Firebase | done | Firebase auth and Firestore are integrated in app runtime. |
| 004 | Setup next-intl | partial | i18n works, but routing behavior differs from original assumptions (as-needed locale prefix, no locale auto-detection). |
| 005 | Implement guest auth | done | Guest auth exists and is used in auth and entry flows. |
| 006 | Implement Google/Facebook login | partial | Google flow is implemented; Facebook is not in scope. Treat as Google-only going forward. |
| 007 | Design Firestore data model | done | Model, schemas, converters, and helpers exist under `src/lib/firestore/`. |
| 008 | Build shared form components | done | Equivalent component set exists (`DateInput`, `ChipSelector`, `EmotionPicker`, etc.) and is showcased in Storybook foundation galleries. |
| 009.1 | Diary entry form part 1 | superseded | Form exists, but product evolved to dual-mode chat + form architecture. |
| 009.2 | Diary entry form part 2 | superseded | Complex fields exist, but flow/UX moved beyond original linear form spec. |
| 010 | Image upload + Cloudinary | not-started | No wired upload UI/action path in entry flow. |
| 011 | Gemini food analysis | not-started | No analysis action/UI; quota helpers exist only at data-layer level. |
| 012.1 | Save entry server action part 1 | partial | Server action exists, but primary entry save path still uses client Firestore helpers. |
| 012.2 | Save entry server action part 2 | not-started | Advanced validation/error architecture from this story is not complete. |
| 013 | Diary entry overview | partial | Dashboard is richer than original overview spec, but not all original requirements (for example image thumbnail flow) are delivered. |
| 014 | Deploy to Vercel | partial | Story exists but deployment status/runbook evidence is not codified in repo docs. |
| 015 | Cloudinary + Gemini end-to-end | not-started | Blocked by 010 + 011 not being implemented end-to-end. |

## Major Drift From Original Story Set

- Product direction shifted from "basic entry form + simple overview" to:
  - chat-first coached entry flow,
  - richer day/week/month dashboard,
  - mood-based visualization and affirmations,
  - profile/guest data management dialogs.
- Entry CRUD architecture drifted from server-action-first to mostly client-side
  Firestore access.
- Image and AI stories remained in planned state while schema support was added
  early.
- Design-system documentation scope has grown beyond original stories via
  Storybook foundation stories and ordered IA (`Foundations`, `Components`).

## Active In-Progress Changes (Observed)

- `apps/storybook/.storybook/preview.ts`
  - Adds Storybook sort order with explicit grouping:
    `Foundations` -> `Components` -> wildcard.
- `packages/ui/src/stories/foundations/Primitives.stories.tsx`
  - Adds visual gallery for core primitives (`Button`, `TextField`, `Select`,
    `TextArea`, `Switch`, `Card`).
- `packages/ui/src/stories/foundations/SemanticTokens.stories.tsx`
  - Adds semantic token showcase for colors, spacing, radius, shadow, and
    typography utilities.

Impact on roadmap:

- This work improves design-system clarity and onboarding.
- It does not change product feature priorities (entry data architecture, media
  flow, and production hardening remain top priorities).

## New Workstreams Needed (Beyond Original Stories)

1. Security and architecture hardening
   - Move diary entry read/write/delete onto server-owned actions.
   - Resolve user identity from trusted server context.
   - Remove client fallbacks that mutate Firestore directly.
2. Persistence consistency
   - Persist dashboard bookmark toggles instead of local-only state.
3. Quality baseline
   - Fix current lint failures.
   - Introduce real tests (unit + integration + key end-to-end path).
4. Deployment and operations
   - Document Vercel environment and production verification steps in-repo.

## Roadmap (Prioritized)

### Phase 1: Stabilize Current Product

- Complete story 012.1 as the default architecture (not optional path).
- Implement story 012.2 validation and user-safe error UX.
- Add missing persistence for bookmark toggles.
- Clear lint errors and enforce lint in CI.

### Phase 2: Deliver Media + AI Scope

- Implement story 010 (Cloudinary upload).
- Implement story 011 (Gemini analysis + quota UX).
- Implement story 015 (full photo-to-entry flow and failure states).

### Phase 3: Production Readiness

- Finalize story 014 with explicit runbook and release checklist.
- Add regression coverage for:
  - guest auth + Google merge,
  - create/edit/delete entry,
  - dashboard rendering and state transitions,
  - media/AI edge cases.

## Suggested Story Refactor

Create a new story set after story 015 that reflects current architecture:

- 016: Server-owned entry CRUD and auth trust boundary.
- 017: Bookmark persistence and dashboard consistency.
- 018: Test harness and CI quality gate.
- 019: Deployment runbook and operational checks.
