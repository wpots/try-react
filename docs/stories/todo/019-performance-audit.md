# User Story 019: Performance Audit

## 1. Title

Integrate Lighthouse CI and bundle analysis for automated performance auditing.

## 2. Goal

To catch performance regressions before they ship by enforcing Lighthouse score budgets on every PR, and to give developers local visibility into JavaScript bundle composition via a bundle analyzer script.

## 3. Description

As a developer, I want automated performance checks to run as part of the CI pipeline so that any PR that regresses Performance, Accessibility, Best Practices, or SEO scores is flagged before merging. Additionally, I want a `pnpm analyze` command to inspect the Next.js bundle locally, helping make informed decisions about code splitting and heavy dependencies.

This story is a pre-ship quality gate and complements Story 018 (runtime monitoring, Sentry, health checks), which operates after deployment.

## 4. Technical Details

- **Lighthouse CI:** [`@lhci/cli`](https://github.com/GoogleChrome/lighthouse-ci) run via a dedicated GitHub Actions workflow
- **Score budgets (minimum thresholds):**
  - Performance: 90
  - Accessibility: 90
  - Best Practices: 90
  - SEO: 90
- **Target URL:** locally-served production build inside CI (`pnpm build && pnpm start`) or Vercel preview URL (after Story 014 lands)
- **PR integration:** Lighthouse CI uploads results to temporary public storage (`--upload.target=temporary-public-storage`) so a summary link appears in PR checks
- **Bundle Analyzer:** [`@next/bundle-analyzer`](https://www.npmjs.com/package/@next/bundle-analyzer) wrapped in a `pnpm analyze` script
- **Scope:** `apps/food-diary` only

## 5. Steps to Implement

### 5.1 Lighthouse CI

1. **Install Lighthouse CI:**

   ```bash
   pnpm add -D @lhci/cli --filter food-diary
   ```

2. **Create `lighthouserc.js` in `apps/food-diary/`:**

   ```js
   /** @type {import('@lhci/types').LhrConfig} */
   export default {
     ci: {
       collect: {
         startServerCommand: "pnpm start",
         startServerReadyPattern: "ready on",
         url: ["http://localhost:3000/", "http://localhost:3000/nl"],
         numberOfRuns: 1,
       },
       assert: {
         preset: "lighthouse:no-pwa",
         assertions: {
           "categories:performance": ["error", { minScore: 0.9 }],
           "categories:accessibility": ["error", { minScore: 0.9 }],
           "categories:best-practices": ["error", { minScore: 0.9 }],
           "categories:seo": ["error", { minScore: 0.9 }],
         },
       },
       upload: {
         target: "temporary-public-storage",
       },
     },
   };
   ```

3. **Add a Lighthouse CI script to `apps/food-diary/package.json`:**

   ```json
   "lhci": "lhci autorun"
   ```

4. **Create `.github/workflows/lighthouse.yml`:**

   ```yaml
   name: Lighthouse CI

   on:
     pull_request:
       branches: [main]

   jobs:
     lighthouse:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4

         - uses: pnpm/action-setup@v4
           with:
             version: 9

         - uses: actions/setup-node@v4
           with:
             node-version: "20"
             cache: "pnpm"

         - name: Install dependencies
           run: pnpm install --frozen-lockfile

         - name: Build food-diary
           run: pnpm --filter food-diary build
           env:
             # Lighthouse build: use stub/public-safe env values
             NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.NEXT_PUBLIC_FIREBASE_API_KEY }}
             NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${{ secrets.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN }}
             NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_PROJECT_ID }}
             NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${{ secrets.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET }}
             NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID }}
             NEXT_PUBLIC_FIREBASE_APP_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_APP_ID }}
             NEXT_PUBLIC_DEFAULT_LOCALE: nl

         - name: Run Lighthouse CI
           run: pnpm --filter food-diary lhci
   ```

5. **Add required GitHub secrets** (same set as Story 014 Vercel deployment secrets):
   - `NEXT_PUBLIC_FIREBASE_*` variables for the build step

### 5.2 Bundle Analyzer

1. **Install bundle analyzer:**

   ```bash
   pnpm add -D @next/bundle-analyzer --filter food-diary
   ```

2. **Wrap `next.config.ts` with the analyzer:**

   ```ts
   import bundleAnalyzer from "@next/bundle-analyzer";

   const withBundleAnalyzer = bundleAnalyzer({
     enabled: process.env.ANALYZE === "true",
   });

   const nextConfig = {
     // ... existing config
   };

   export default withBundleAnalyzer(nextConfig);
   ```

3. **Add analyze script to `apps/food-diary/package.json`:**

   ```json
   "analyze": "ANALYZE=true next build"
   ```

4. **Run locally when needed:**
   ```bash
   pnpm --filter food-diary analyze
   ```
   This opens two browser tabs: client bundle and server bundle treemaps.

## 6. Acceptance Criteria

- [ ] A PR that drops any Lighthouse score below 90 causes the CI workflow to fail with a clear error.
- [ ] A PR that keeps scores at or above threshold passes the Lighthouse CI check.
- [ ] Lighthouse results summary link is visible in the PR checks tab.
- [ ] `pnpm --filter food-diary analyze` builds successfully and opens bundle treemap views.
- [ ] The analyzer does not affect normal `next build` output (guarded by `ANALYZE=true`).

## 7. Notes

- These are **build-time audits**, not runtime metrics. For runtime Web Vitals and error monitoring see Story 018.
- If Vercel preview deployments are set up (Story 014), the `collect.url` in `lighthouserc.js` can be pointed at the preview URL instead of the local server, making CI faster.
- Consider relaxing the Performance threshold to 85 for the initial PR if the app is not yet image-optimised (Stories 010/011 are in progress).
