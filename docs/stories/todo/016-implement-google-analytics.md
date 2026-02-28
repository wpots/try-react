# User Story 016: Implement Google Analytics

## 1. Title

Integrate Google Analytics 4 (GA4) into the Food Diary app for user behaviour tracking.

## 2. Goal

To understand how users interact with the app — which pages they visit, where they drop off, and how core flows (entry creation, image upload, auth) are used — using Google Analytics 4.

## 3. Description

As a developer/product owner, I want to add GA4 event tracking to the Food Diary app so that I can make data-driven decisions about UX improvements, feature prioritisation, and onboarding flows.

Because this is a Next.js app with SSR/SSG, tracking must handle both server- and client-rendered pages correctly. GA4 must only load after cookie consent is given (GDPR). Guest users and authenticated users should be distinguishable where possible.

## 4. Technical Details

- **Analytics provider:** Google Analytics 4 (GA4)
- **Integration method:** `@next/third-parties` (official Next.js GA helper, lighter than manual `<Script>`)
- **Consent:** Must respect browser cookie consent — do not load GA until consent is granted
- **Environment variable:** `NEXT_PUBLIC_GA_MEASUREMENT_ID` (e.g. `G-XXXXXXXXXX`)
- **Event tracking strategy:**
  - Page views: automatic via GA4 enhanced measurement
  - Custom events: entry creation, image upload, AI analysis trigger, auth method used
- **User identity:** Use GA4 User-ID feature when a real (non-guest) user is logged in; do not send PII

## 5. Steps to Implement

1. **Create GA4 Property:**
   - Log in to [analytics.google.com](https://analytics.google.com)
   - Create a new GA4 property for the Food Diary app
   - Copy the Measurement ID (`G-XXXXXXXXXX`)

2. **Add environment variable:**

   ```bash
   # apps/food-diary/.env.local
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

   Add to Vercel environment variables for production.

3. **Install helper (optional but recommended):**

   ```bash
   pnpm --filter food-diary add @next/third-parties
   ```

4. **Add GA4 script to root layout:**

   ```tsx
   // apps/food-diary/src/app/[locale]/layout.tsx
   import { GoogleAnalytics } from "@next/third-parties/google";

   export default function RootLayout({ children }) {
     return (
       <html>
         <body>{children}</body>
         {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
           <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
         )}
       </html>
     );
   }
   ```

5. **Add cookie consent gate:**
   - Conditionally render `<GoogleAnalytics>` only after user grants consent
   - Consider a minimal consent banner or integrate with an existing solution
   - Store consent in `localStorage` (`ga_consent: 'granted' | 'denied'`)

6. **Create analytics utility:**

   ```ts
   // apps/food-diary/src/lib/analytics.ts
   export const trackEvent = (name: string, params?: Record<string, string | number>) => {
     if (typeof window === "undefined") return;
     window.gtag?.("event", name, params);
   };
   ```

7. **Instrument key events:**
   - `entry_created` — after successful diary entry save
   - `image_uploaded` — after Cloudinary upload
   - `ai_analysis_triggered` — when Gemini analysis is requested
   - `auth_method_used` — on successful sign-in (`{ method: 'google' | 'guest' }`)

8. **Set User-ID for authenticated users:**

   ```ts
   // After sign-in, once auth context resolves
   window.gtag?.("config", GA_ID, { user_id: user.uid });
   ```

   Do not send email or display name.

9. **Validate in GA4 DebugView:**
   - Enable `debug_mode` via browser extension or URL parameter
   - Verify events appear in real-time in GA4 DebugView

10. **Update Vercel environment variables** (see Story 014).

## 6. Acceptance Criteria

- [ ] GA4 Measurement ID is stored as environment variable, never hardcoded
- [ ] GA4 script does not load unless cookie consent is granted
- [ ] Page views are tracked automatically across all routes
- [ ] At minimum `entry_created` and `auth_method_used` custom events fire correctly
- [ ] No PII (email, name) is sent to GA4
- [ ] Works in production on Vercel

## 7. Notes / References

- [Next.js `@next/third-parties` docs](https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries#google-analytics)
- [GA4 User-ID guide](https://support.google.com/analytics/answer/9213390)
- [GA4 DebugView](https://support.google.com/analytics/answer/7201382)
- GDPR note: GA4 anonymises IPs by default, but consent is still required in the EU
