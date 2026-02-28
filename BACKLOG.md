# Backlog

Items identified during architecture review (2026-02-26).

## Warning Priority

- [x] **Deduplicate helper functions** — Extract `parseEntryDate`, `withLegacySkippedMealBehavior` from `lib/firestore/helpers.ts` + `converters.ts` into shared `lib/firestore/utils.ts`. Consolidate `toDateKey` / `getLocalDateKey`. _(PR #9, merged)_
- [x] **Merge wipe actions** — `wipeGuestEntries` and `wipeUserEntries` share identical logic. Consolidate into single `wipeEntries(userId)` action. _(PR #8, merged)_
- [x] **Wrap Firebase SDK exports** — Stop re-exporting raw Firebase symbols from `lib/firebase.ts`. Wrap behind project-defined functions. _(PR #10, merged)_
- [x] **i18n auth error messages** — `getFirebaseAuthErrorMessage.ts` returns hardcoded English. Return translation keys instead. _(PR #11, open)_

## Suggestion Priority

- [x] **Cleanup** — Remove empty `src/utils/classnames/` directory. Move `lib/aboutContent.ts` to content/i18n message files. _(PR #6, merged)_

## Developer Experience

- [x] **Add CI quality checks** — Add `pnpm lint`, `pnpm typecheck`, `pnpm build` as pre-commit hooks or CI pipeline steps. Ensure all PRs pass quality gates before merge. _(PR #12, open)_
