# User Story 004: Setup next-intl for Internationalization

## 1. Title

Configure next-intl for Dutch and English language support with translation files.

## 2. Goal

To set up internationalization (i18n) in the food-diary application using next-intl, supporting Dutch (default) and English languages with JSON translation files.

## 3. Description

As a developer, I need to configure next-intl in the Next.js application to support multiple languages. All user-facing text will be extracted to JSON translation files, and users will be able to switch between Dutch (default) and English. The application will use Next.js 16 proxy-based locale detection and routing.

## 4. Technical Details

- **Library:** next-intl ^4.8.2
- **Locales:** Dutch (`nl`) - default, English (`en`)
- **Translation Files:** `apps/food-diary/messages/en/*.json` and `nl/*.json` (namespace-per-file)
- **Proxy:** Locale detection and routing via Next.js 16 `proxy.ts`
- **Routing:** Locale-aware routes (`/[locale]/...`) with `localePrefix: "as-needed"`
- **Default Locale:** Dutch (`nl`)

## 5. Steps Implemented

1. **Installed next-intl:**
   - `pnpm add next-intl` in `apps/food-diary/`

2. **Created Translation Files (namespace-per-file):**
   - `apps/food-diary/messages/en/` and `nl/` directories
   - Each locale contains: `about.json`, `auth.json`, `common.json`, `dashboard.json`, `home.json`, `landing.json`, `nav.json`, `entry/`
   - Barrel export via `index.ts` per locale

3. **Created i18n Configuration:**
   - `apps/food-diary/src/i18n/config.ts` — exports `locales`, `defaultLocale`, and `AppLocale` type
   - `apps/food-diary/src/i18n/navigation.ts` — locale-aware navigation helpers
   - `apps/food-diary/src/i18n/request.ts` — server-side request configuration

4. **Created Proxy (Next.js 16):**
   - `apps/food-diary/src/proxy.ts` using `createMiddleware` from `next-intl/middleware`
   - Configured with `localePrefix: "as-needed"` and `localeDetection: false`

     ```typescript
     import createMiddleware from "next-intl/middleware";
     import { defaultLocale, locales } from "@/i18n/config";

     export default createMiddleware({
       locales,
       defaultLocale,
       localePrefix: "as-needed",
       localeDetection: false,
     });

     export const config = {
       matcher: ["/((?!api|_next|_vercel|__|.*\\..*).*)"],
     };
     ```

5. **Updated App Router Structure:**
   - Created `apps/food-diary/src/app/[locale]/` with `layout.tsx`, `page.tsx`
   - Sub-routes: `auth/`, `auth-test/`, `dashboard/`, `entry/`
   - `layout.tsx` wraps children with `NextIntlClientProvider`

6. **Root Layout:**
   - `apps/food-diary/src/app/layout.tsx` uses `getLocale()` to set `<html lang>`
   - `/` serves Dutch content by default (via `localePrefix: "as-needed"`)

7. **Created Language Switcher Component:**
   - `apps/food-diary/src/components/LanguageSwitcher/` with custom `useLanguageSwitcher` hook
   - Uses `useLocale`, `useRouter().replace()` with locale option, and `useTransition` for pending state
   - Integrated in `HeaderNav`

8. **Updated Next.js Config:**
   - No conflicting i18n config; next-intl + proxy handles everything

9. **useTranslations Hook:**
   - Widely used across: `page.tsx`, `LandingPage.tsx`, `DashboardTemplate.tsx`, `CreateEntryTemplate.tsx`, `PageHero.tsx`, `Logo.tsx`, `EntryFormHeader.tsx`, `auth/login/page.tsx`, and more

## 6. Acceptance Criteria

- [x] `next-intl` package installed in `apps/food-diary/`
- [x] Translation files created per namespace under `apps/food-diary/messages/nl/` and `en/`
- [x] `apps/food-diary/src/i18n/config.ts` created with locale configuration
- [x] `apps/food-diary/src/proxy.ts` created with next-intl middleware (Next.js 16 proxy pattern)
- [x] App router restructured to `apps/food-diary/src/app/[locale]/`
- [x] Root layout updated to use `NextIntlClientProvider`
- [x] `LanguageSwitcher` component created and functional
- [x] Default locale is Dutch (`nl`)
- [x] `/` serves Dutch content by default (`localePrefix: "as-needed"`)
- [x] Translations can be accessed via `useTranslations` hook
- [x] Language switching works correctly
- [x] All user-facing text is ready to be moved to translation files (continued in later stories)

## 7. Notes

- Next.js 16 uses `proxy.ts` instead of `middleware.ts` for request proxying — this is the correct pattern
- Translation files are organized by namespace (one JSON per feature/page) rather than flat per-locale files
- `localePrefix: "as-needed"` means `/nl` prefix is hidden for the default locale; only `/en` shows a prefix
- `localeDetection: false` ensures consistent behaviour — locale is determined by URL, not browser headers
- Language switcher is integrated in the main navigation (`HeaderNav`)
