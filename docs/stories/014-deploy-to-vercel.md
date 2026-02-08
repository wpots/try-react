# User Story 014: Deploy to Vercel

## 1. Title

Configure and deploy the monorepo application to Vercel with all required environment variables.

## 2. Goal

To deploy the Food Diary monorepo application to Vercel, ensuring Turborepo builds correctly, all environment variables are configured, and the application is accessible online.

## 3. Description

As a developer, I need to deploy the React Food Diary application to Vercel. This involves configuring the monorepo for Vercel deployment, setting up Turborepo build settings, configuring all environment variables (Firebase, Cloudinary, Gemini), and ensuring the deployment process works correctly.

## 4. Technical Details

- **Platform:** Vercel
- **Monorepo:** Turborepo with pnpm workspaces
- **Build Command:** Turborepo build command
- **Output Directory:** `apps/food-diary/.next`
- **Environment Variables:** Firebase, Cloudinary, Gemini API keys
- **Framework Preset:** Next.js

## 5. Steps to Implement

1. **Prepare for Deployment:**
   - Ensure all code changes are committed to Git repository
   - Create Vercel account or log in at [https://vercel.com/](https://vercel.com/)
   - Ensure repository is pushed to GitHub/GitLab/Bitbucket

2. **Create Vercel Project:**
   - Go to Vercel dashboard and click "Add New Project"
   - Select the Git repository for the food diary application
   - Vercel should detect it's a monorepo

3. **Configure Monorepo Settings:**
   - Set Root Directory: `apps/food-diary` (or configure Turborepo)
   - Set Build Command: `cd ../.. && pnpm build` (or use Turborepo command)
   - Set Output Directory: `.next`
   - Set Install Command: `pnpm install`
   - Framework Preset: Next.js

4. **Configure Turborepo (if needed):**
   - Ensure `turbo.json` has correct build pipeline
   - Vercel should detect Turborepo automatically
   - May need to configure `vercel.json` for monorepo:
     ```json
     {
       "buildCommand": "cd ../.. && pnpm turbo build --filter=food-diary",
       "installCommand": "cd ../.. && pnpm install",
       "framework": "nextjs"
     }
     ```

5. **Configure Environment Variables:**
   - In Vercel project settings, navigate to "Environment Variables"
   - Add Firebase variables:
     - `NEXT_PUBLIC_FIREBASE_API_KEY`
     - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
     - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
     - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
     - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
     - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - Add Cloudinary variables:
     - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
     - `CLOUDINARY_API_KEY`
     - `CLOUDINARY_API_SECRET`
   - Add Gemini variable:
     - `GEMINI_API_KEY`
   - Add next-intl variable:
     - `NEXT_PUBLIC_DEFAULT_LOCALE` (value: "nl")
   - Set variables for Production, Preview, and Development environments

6. **Configure Build Settings:**
   - Ensure Node.js version is set (18.x or 20.x)
   - Ensure pnpm is enabled in Vercel settings
   - Check that build command includes Turborepo

7. **Deploy to Vercel:**
   - Vercel should automatically start deployment after configuration
   - If not, trigger manual deployment from "Deployments" tab
   - Monitor build logs for errors

8. **Verify Deployment:**
   - Once deployment completes, Vercel provides a URL (e.g., `https://food-diary-app.vercel.app`)
   - Open URL in browser to access deployed application
   - Test core functionality:
     - User authentication (guest, Google, Facebook)
     - Create diary entry
     - Upload image
     - AI analysis (if quota available)
     - View entry overview
   - Check Vercel deployment logs for any errors

9. **Configure Custom Domain (Optional):**
   - Add custom domain in Vercel project settings
   - Configure DNS records as instructed by Vercel

10. **Set Up Continuous Deployment:**
    - Verify automatic deployments are enabled
    - Test by making a small change and pushing to main branch
    - Verify new deployment is triggered automatically

11. **Configure Firestore Security Rules:**
    - Update Firestore security rules for production
    - Ensure rules allow authenticated users to read/write their own data
    - Test rules in Firebase Console

12. **Test Production Environment:**
    - Test all features in production environment
    - Verify environment variables are loaded correctly
    - Test image uploads to Cloudinary
    - Test Gemini API calls
    - Verify translations work
    - Check performance and loading times

## 6. Acceptance Criteria

- Food Diary application is successfully deployed to Vercel
- Monorepo builds correctly using Turborepo
- All environment variables are configured in Vercel:
  - Firebase variables (6 variables)
  - Cloudinary variables (3 variables)
  - Gemini API key
  - Default locale
- Application is accessible via Vercel-provided URL
- All core features work in production:
  - User authentication
  - Diary entry creation
  - Image upload
  - AI analysis
  - Entry overview
- No errors in Vercel deployment logs
- Continuous deployment is configured and working
- Firestore security rules are configured for production

## 7. Notes

- This story covers the deployment of the application to Vercel
- Keep all API keys and secrets secure - never commit them to Git
- Use Vercel environment variables for all sensitive configuration
- Monorepo deployment may require specific Vercel configuration
- Test thoroughly in production before sharing with users
- Monitor Vercel usage and costs (stays within free tier)
- Consider setting up error monitoring (e.g., Sentry) for production
- Vercel provides analytics and performance monitoring - use these tools
- Ensure Cloudinary and Gemini free tier limits are not exceeded
