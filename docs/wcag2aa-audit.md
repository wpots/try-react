# WCAG 2 AA Accessibility Audit — Food Diary

**Date:** 2026-03-01  
**Scope:** `apps/food-diary` + `packages/ui`  
**Standard:** WCAG 2.1 Level A + AA  
**Method:** Manual static code review

---

## Summary

| Severity                                          | Count |
| ------------------------------------------------- | ----- |
| Critical (Level A failures)                       | 3     |
| Significant (Level AA failures / likely failures) | 4     |
| Minor / Best Practice                             | 3     |

---

## Critical — Level A Failures

### 1. Skip link target broken on authenticated pages

**SC 2.4.1 Bypass Blocks (Level A)**

The `SkipLink` component in `apps/food-diary/src/app/[locale]/layout.tsx` links to `#main-content`, but the `<main>` element on both the Dashboard and Entry pages has no matching `id`.

| File                                                                                                        | Issue                                                                               |
| ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| [DashboardTemplate.tsx](../apps/food-diary/src/templates/DashboardTemplate/DashboardTemplate.tsx#L115)      | `<main className="bg-ds-surface-muted min-h-screen">` — missing `id="main-content"` |
| [CreateEntryTemplate.tsx](../apps/food-diary/src/templates/CreateEntryTemplate/CreateEntryTemplate.tsx#L38) | `<main className="flex h-dvh flex-col">` — missing `id="main-content"`              |

The skip link works correctly on the landing page (`LandingPage.tsx` passes `id="main-content"` to its `<main>`) and on the login page, but fails on every authenticated view.

**Fix:** Add `id="main-content"` to the `<main>` element in both templates.

---

### 2. Button focus ring references an undefined CSS token

**SC 2.4.7 Focus Visible (Level AA) / SC 1.4.11 Non-text Contrast (Level AA)**

Two bugs compound to break the focus ring on every `Button`:

**Bug A — Wrong Tailwind class name** ([Button.tsx](../packages/ui/src/components/Button/Button.tsx#L13)):

```tsx
// current (broken)
"focus-visible:ring-focus-ring";

// should be
"focus-visible:ring-ds-focus-ring";
```

**Bug B — Undefined internal token** ([colors.css](../packages/ui/src/styles/tokens/colors.css#L82)):

```css
/* current — references a token that doesn't exist */
--color-ds-focus-ring: var(--__colors-brand-primary);

/* should be */
--color-ds-focus-ring: var(--__colors-sky-500);
```

`--__colors-brand-primary` is never declared in `colors.css`; the correct primitive token for brand primary is `--__colors-sky-500: #5fa9d1`. Because of both bugs, `Button` focus rings resolve to an unset value — the native browser default outline is suppressed by `focus-visible:outline-none` — leaving focused buttons with no visible indicator.

**Fix:** Correct the Tailwind class in `Button.tsx` and the token reference in `colors.css`.

---

### 3. Form validation errors not programmatically linked to inputs

**SC 3.3.1 Error Identification (Level A) / SC 1.3.1 Info and Relationships (Level A)**

`TraditionalForm.tsx` renders error messages with `role="alert"`, which announces errors reactively. However, inputs are missing `aria-invalid="true"` and `aria-describedby` pointing to the error element. Screen readers cannot correlate which error belongs to which field when the user navigates by form control.

Example pattern currently used:

```tsx
<TextArea aria-label={t("form.foodEaten")} ... />
{validationErrors.foodEaten && (
  <Typography role="alert">{validationErrors.foodEaten}</Typography>
)}
```

**Fix:** Add `id` to the error message element and wire it up:

```tsx
<TextArea
  aria-label={t("form.foodEaten")}
  aria-invalid={!!validationErrors.foodEaten}
  aria-describedby={validationErrors.foodEaten ? "food-eaten-error" : undefined}
  ...
/>
{validationErrors.foodEaten && (
  <Typography id="food-eaten-error" role="alert">{validationErrors.foodEaten}</Typography>
)}
```

Apply the same pattern to all validated fields in `TraditionalForm.tsx` (`entryType`, `foodEaten`).

---

## Significant — Level AA Failures / Likely Failures

### 4. Authenticated pages lack individual page titles

**SC 2.4.2 Page Titled (Level A)**

Only the root `[locale]/layout.tsx` exports metadata with `title: "Food Diary"`. No sub-page exports `metadata` or `generateMetadata`, meaning the browser tab and screen reader page announcement is always just "Food Diary" regardless of context.

Pages with no title override:

- Dashboard (`/dashboard`)
- Create entry (`/entry/create`)
- Edit entry (`/entry/[id]`)
- Login (`/auth/login`)

Although login page has its own `page.tsx`, it does not export metadata.

**Fix:** Add `export const metadata` or `export async function generateMetadata` in each page file with a descriptive title, e.g. `"Dashboard — Food Diary"`.

---

### 5. `<nav>` landmarks have no accessible name

**SC 2.4.6 Headings and Labels (Level AA) / ARIA Landmark best practice**

The `Navigation` component renders a bare `<nav>` with no `aria-label`:

```tsx
// packages/ui/src/components/Navigation/Navigation.tsx
<nav className={className} {...props}>
```

`HeaderNav` calls it without passing an `aria-label`:

```tsx
<Navigation className="hidden md:block">
```

When multiple `<nav>` regions exist on a page (page header nav + any supplemental navigation), screen readers will announce both as just "navigation". Users cannot distinguish between them.

**Fix:** Pass a localised `aria-label` to `Navigation` in `HeaderNav`:

```tsx
<Navigation aria-label={cms("mainNavLabel")} className="hidden md:block">
```

Add the `mainNavLabel` translation key to `messages/en/landing.json` and `messages/nl/landing.json`.

---

### 6. Potential color contrast failures

**SC 1.4.3 Contrast Minimum (Level AA) — 4.5:1 for normal text, 3:1 for large text**

Two design tokens are candidates for contrast failures when used as text colours:

| Token                              | Hex       | On white (approx. ratio) | Status                                    |
| ---------------------------------- | --------- | ------------------------ | ----------------------------------------- |
| `--color-ds-brand-support` (sage)  | `#93b19a` | ≈ 2.1:1                  | **Fails** normal + large text             |
| `--color-ds-brand-neutral` (slate) | `#788c90` | ≈ 3.1:1                  | **Fails** normal text, marginal for large |

These tokens are not used directly as text colours in code as far as could be determined from a static review, but they are exposed as Tailwind utilities (`text-ds-brand-support`, `text-ds-brand-neutral`) and could be — or become — used as such.

Additionally, `HeaderNav.tsx` uses `text-ds-text-strong` and `text-ds-text-muted` which are **not defined** in the design token system or the Tailwind `@theme` block. These silently resolve to the browser default colour, defeating any design intent.

**Fix:**

1. Audit rendered pages with a browser contrast checker (e.g. axe DevTools or Lighthouse) to confirm actual usage.
2. Remove or replace `text-ds-text-strong` / `text-ds-text-muted` with defined tokens (`text-ds-on-surface` / `text-ds-on-surface-secondary`).
3. If `--color-ds-brand-support` or `--color-ds-brand-neutral` are used as text colours, darken them or restrict use to decorative contexts only.

---

### 7. `PageIndicator` has a hardcoded, non-localised ARIA label

**SC 2.5.3 Label in Name (Level AA)**

```tsx
// apps/food-diary/src/components/PageIndicator/PageIndicator.tsx:14
aria-label="Page indicator"
```

The label is hardcoded English. Dutch users will see the Dutch interface but their screen reader announces "Page indicator" in English.

**Fix:** Inject the label via props and pass a translated string at the call site.

---

## Minor / Best Practice

### 8. CSS animations have no `prefers-reduced-motion` override

**WCAG 2.1 SC 2.3.3 Animation from Interactions (Level AAA) / best practice**

Four utility animations in `packages/ui/src/styles/utilities/animations.css` (`typing-dot`, `message-in`, `fade-in`, `slide-up`) and the `dashboard-hero-float` keyframe in `apps/food-diary/src/app/globals.css` have no `@media (prefers-reduced-motion: reduce)` overrides.

While SC 2.3.3 is AAA, suppressing unnecessary motion for users who have opted into reduced-motion is widely expected. The `dashboard-hero-float` animation (infinite 6 s float) is the most prominent case.

**Fix:** Add a global rule in `packages/ui/src/styles/utilities/animations.css` and in the food-diary `globals.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

### 9. Duplicate heading in DashboardTemplate

**SC 2.4.6 Headings and Labels (Level AA)**

`DashboardTemplate.tsx` renders `tDashboard("title")` twice: once inside `DashboardHero` (the visual heading at the top) and once in the main content section as a `<Typography variant="heading" size="base">`. This produces two identical headings ("Food diary" or equivalent) at different heading levels in close proximity. Screen reader users navigating by heading list will encounter a confusing duplicate.

**Fix:** Remove or replace the second heading with a visually-distinct but semantically descriptive label (e.g., the current period label), or make it `aria-hidden="true"` if it is intentionally redundant for visual layout only.

---

### 10. `window.confirm` in unsaved-changes guard

**SC 3.2.1 On Focus / general accessibility**

`CreateEntryTemplate.tsx` uses `window.confirm()` to guard navigation when unsaved changes exist. Native browser dialogs have inconsistent screen reader support and cannot be styled to match the application; some assistive technologies suppress them entirely.

**Fix:** Replace with a React Aria `Dialog` component (already available in the design system) for a fully accessible, styled confirmation modal.

---

## What Works Well

- `lang` attribute is dynamically set from the locale on `<html>` ✓
- `SkipLink` component exists and is correctly implemented in `[locale]/layout.tsx` ✓
- React Aria is used throughout interactive components, providing keyboard navigation and ARIA attributes out of the box ✓
- `aria-hidden="true"` consistently applied to decorative icons (Lucide Icons) ✓
- Dynamic `aria-label` on toggle buttons updates correctly with state (`BookmarkToggleButton`) ✓
- Icon-only buttons (toolbar navigation, FAB) all receive `aria-label` ✓
- `RouterProvider` from React Aria is wired up, enabling link navigation via keyboard ✓
- Fonts are loaded with `display: swap` avoiding invisible text during load ✓

---

## Recommended Fix Priority

| #   | Finding                                                             | SC            | Level | Effort |
| --- | ------------------------------------------------------------------- | ------------- | ----- | ------ |
| 2   | Fix focus ring token + class name                                   | 2.4.7, 1.4.11 | AA    | XS     |
| 1   | Add `id="main-content"` to Dashboard + Entry `<main>`               | 2.4.1         | A     | XS     |
| 7   | Localise `PageIndicator` aria-label                                 | 2.5.3         | AA    | XS     |
| 6   | Fix undefined `text-ds-text-*` tokens in HeaderNav                  | 1.4.3         | AA    | S      |
| 3   | Link form errors to inputs with `aria-invalid` + `aria-describedby` | 3.3.1, 1.3.1  | A     | S      |
| 5   | Add `aria-label` to `<nav>` landmark                                | 2.4.6         | AA    | S      |
| 4   | Add per-page `<title>` metadata                                     | 2.4.2         | A     | S      |
| 8   | Add `prefers-reduced-motion` overrides                              | Best practice | —     | S      |
| 9   | Remove duplicate heading in Dashboard                               | 2.4.6         | AA    | S      |
| 10  | Replace `window.confirm` with React Aria Dialog                     | Best practice | —     | M      |
