# User Story 010: Deploy to Vercel

## 1. Title

Configure and deploy the application to Vercel.

## 2. Goal

To deploy the Food Diary web application to the Vercel platform, making it accessible online.

## 3. Description

As a junior developer, I need to deploy the React Food Diary application to Vercel so that it can be accessed by users on the internet. This involves configuring the project for Vercel deployment, connecting it to a Git repository, and deploying the application.

## 4. Technical Details

- **Vercel Account:** Ensure a Vercel account is set up and ready.
- **Git Repository:** The project code should be in a Git repository (e.g., on GitHub, GitLab, or Bitbucket).
- **Vercel CLI (Optional):** Vercel CLI can be used for deployment, but deployment can also be done directly from the Vercel website.
- **Environment Variables:** Firebase configuration details (API keys, project ID, etc.) need to be set as environment variables in the Vercel project settings.
- **Deployment Process:**
  - Connect Vercel project to the Git repository.
  - Configure environment variables in Vercel project settings.
  - Trigger deployment (either automatically on code push or manually).
  - Verify successful deployment and application accessibility via the Vercel-provided URL.

## 5. Steps to Implement

1. **Prepare for Deployment:**
   - Ensure all code changes are committed to a Git repository (e.g., GitHub).
   - Create a Vercel account or log in to an existing one at [https://vercel.com/](https://vercel.com/).
2. **Create Vercel Project:**
   - Go to the Vercel dashboard and click on "Add New Project".
   - Select the Git repository for your Food Diary application.
3. **Configure Environment Variables:**
   - In the Vercel project settings, navigate to "Environment Variables".
   - Add the necessary Firebase configuration variables as environment variables. These should include:
     - `apiKey`
     - `authDomain`
     - `projectId`
     - `storageBucket`
     - `messagingSenderId`
     - `appId`
     - (Any other Firebase config variables used in your `firebase.ts` file)
   - Ensure the variable names match those used in your React application's Firebase configuration.
4. **Deploy to Vercel:**
   - Vercel should automatically start the deployment process after you configure the project and connect the repository.
   - If automatic deployment is not triggered, or to trigger a manual deployment, go to the "Deployments" tab in your Vercel project and click "Deploy".
5. **Verify Deployment:**
   - Once the deployment is complete, Vercel will provide a deployment URL (e.g., `https://food-diary-app-vercel.vercel.app`).
   - Open this URL in your browser to access the deployed Food Diary application.
   - Test the application to ensure it is working correctly, including user authentication and data saving to Firestore.
   - Check the Vercel deployment logs for any errors during the deployment or runtime.

## 6. Acceptance Criteria

- The Food Diary application is successfully deployed to Vercel.
- Firebase configuration environment variables are correctly set up in Vercel project settings.
- The deployed application is accessible via the Vercel-provided URL.
- All core features of the application (user authentication, diary entry creation and saving, overview screen) are functional in the deployed environment.
- No errors during deployment process or in application runtime logs on Vercel.

## 7. Notes

- This user story covers the deployment of the application to Vercel.
- Ensure you keep your Firebase configuration details secure and use environment variables in Vercel project settings instead of hardcoding them in the code.
- Vercel provides features for continuous deployment, so any future code pushes to the connected Git repository can automatically trigger new deployments.
