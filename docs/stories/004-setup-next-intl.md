# User Story 004: Setup next-intl for Internationalization

## 1. Title

Configure next-intl for Dutch and English language support with translation files.

## 2. Goal

To set up internationalization (i18n) in the food-diary application using next-intl, supporting Dutch (default) and English languages with JSON translation files.

## 3. Description

As a developer, I need to configure next-intl in the Next.js application to support multiple languages. All user-facing text will be extracted to JSON translation files, and users will be able to switch between Dutch (default) and English. The application will use middleware-based locale detection and routing.

## 4. Technical Details

- **Library:** next-intl
- **Locales:** Dutch (`nl`) - default, English (`en`)
- **Translation Files:** `apps/food-diary/messages/en.json` and `nl.json`
- **Middleware:** Locale detection and routing via Next.js middleware
- **Routing:** Locale-aware routes (`/[locale]/...`)
- **Default Locale:** Dutch (`nl`)

## 5. Steps to Implement

1. **Install next-intl:**
   - In `apps/food-diary/`, run `pnpm add next-intl`

2. **Create Translation Files:**
   - Create `apps/food-diary/messages/` directory
   - Create `apps/food-diary/messages/nl.json` (Dutch translations)
   - Create `apps/food-diary/messages/en.json` (English translations)
   - Add initial translations for common UI elements:
     ```json
     {
       "common": {
         "appName": "Food Diary",
         "save": "Save",
         "cancel": "Cancel",
         "delete": "Delete",
         "edit": "Edit"
       }
     }
     ```

3. **Create i18n Configuration:**
   - Create `apps/food-diary/src/i18n/config.ts`
   - Define locales: `['nl', 'en']`
   - Set default locale: `'nl'`
   - Export configuration object

4. **Create Middleware:**
   - Create `apps/food-diary/src/middleware.ts`
   - Import `createMiddleware` from `next-intl/middleware`
   - Import i18n config
   - Export middleware with locale detection:
     ```typescript
     import createMiddleware from 'next-intl/middleware';
     import { locales, defaultLocale } from './i18n/config';
     
     export default createMiddleware({
       locales,
       defaultLocale
     });
     
     export const config = {
       matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
     };
     ```

5. **Update App Router Structure:**
   - Create `apps/food-diary/src/app/[locale]/` directory
   - Move existing `page.tsx`, `layout.tsx` to `[locale]/` directory
   - Update `layout.tsx` to use `next-intl`:
     ```typescript
     import { NextIntlClientProvider } from 'next-intl';
     import { getMessages } from 'next-intl/server';
     
     export default async function LocaleLayout({
       children,
       params: { locale }
     }) {
       const messages = await getMessages();
       
       return (
         <html lang={locale}>
           <body>
             <NextIntlClientProvider messages={messages}>
               {children}
             </NextIntlClientProvider>
           </body>
         </html>
       );
     }
     ```

6. **Create Root Layout Redirect:**
   - Keep or create `apps/food-diary/src/app/layout.tsx` that redirects to default locale
   - Or use middleware to handle root redirect

7. **Create Language Switcher Component:**
   - Create `apps/food-diary/src/components/LanguageSwitcher.tsx`
   - Use `useLocale` and `useRouter` from `next-intl`
   - Create dropdown or button group to switch between `nl` and `en`
   - Update URL to new locale when switching

8. **Update Next.js Config:**
   - In `apps/food-diary/next.config.ts`, ensure no conflicting i18n config
   - next-intl handles routing, so remove any Next.js built-in i18n config

9. **Add Translation Hook Usage Example:**
   - Update a component to use `useTranslations` hook:
     ```typescript
     import { useTranslations } from 'next-intl';
     
     const t = useTranslations('common');
     // Use: t('appName')
     ```

10. **Test Locale Switching:**
    - Run `pnpm dev` from root
    - Navigate to `/` - should redirect to `/nl` (default)
    - Navigate to `/en` - should show English translations
    - Test language switcher component
    - Verify translations are loaded correctly

## 6. Acceptance Criteria

- `next-intl` package installed in `apps/food-diary/`
- `apps/food-diary/messages/nl.json` and `en.json` created with initial translations
- `apps/food-diary/src/i18n/config.ts` created with locale configuration
- `apps/food-diary/src/middleware.ts` created with next-intl middleware
- App router restructured to `apps/food-diary/src/app/[locale]/`
- Root layout updated to use `NextIntlClientProvider`
- `LanguageSwitcher` component created and functional
- Default locale is Dutch (`nl`)
- Application redirects `/` to `/nl`
- Translations can be accessed via `useTranslations` hook
- Language switching works correctly
- All user-facing text is ready to be moved to translation files (will be done in later stories)

## 7. Notes

- This story sets up the i18n infrastructure - actual translation of all UI text will happen in later stories
- Middleware handles locale detection from URL, browser preferences, or default locale
- Translation files should be organized by feature/page for maintainability
- Consider adding TypeScript types for translation keys in the future
- Language switcher should be added to the main layout/navigation
