# Backlog

Items identified during architecture review (2026-02-26).

## Warning Priority

- [ ] **Deduplicate helper functions** — Extract `parseEntryDate`, `withLegacySkippedMealBehavior` from `lib/firestore/helpers.ts` + `converters.ts` into shared `lib/firestore/utils.ts`. Consolidate `toDateKey` / `getLocalDateKey`.
- [ ] **Merge wipe actions** — `wipeGuestEntries` and `wipeUserEntries` share identical logic. Consolidate into single `wipeEntries(userId)` action.
- [ ] **Wrap Firebase SDK exports** — Stop re-exporting raw Firebase symbols from `lib/firebase.ts`. Wrap behind project-defined functions.
- [ ] **i18n auth error messages** — `getFirebaseAuthErrorMessage.ts` returns hardcoded English. Return translation keys instead.

## Suggestion Priority

- [ ] **Cleanup** — Remove empty `src/utils/classnames/` directory. Move `lib/aboutContent.ts` to content/i18n message files.

## Developer Experience

- [ ] **Add CI quality checks** — Add `pnpm lint`, `pnpm typecheck`, `pnpm build` as pre-commit hooks or CI pipeline steps. Ensure all PRs pass quality gates before merge.
