# User Story 011: Implement Gemini Food Analysis

## 1. Title

Implement AI-powered food image analysis using Google Gemini Flash API with daily quota limit (3 analyses per user per day).

## 2. Goal

To analyze uploaded food images using Google Gemini Flash API, extract food information (name, meal type, description), and pre-fill the diary entry form. The system must enforce a limit of 3 analyses per user per day.

## 3. Description

As a developer, I need to implement AI image analysis that calls Google Gemini Flash API when a user uploads a food photo. The analysis should identify food items, suggest meal type, and generate a description. This analysis is limited to 3 per user per day to manage API costs. The quota is tracked in Firestore and checked before each analysis.

## 4. Technical Details

- **AI Service:** Google Gemini Flash API (multimodal)
- **API Key:** Stored in environment variable `GEMINI_API_KEY`
- **Quota Tracking:** Firestore `userAnalysisQuota` collection
- **Quota Limit:** 3 analyses per user per day
- **Server Action:** `analyzeFoodImage(imageUrl, userId)` in `apps/food-diary/src/app/actions.ts`
- **Quota Helpers:** `checkAnalysisQuota(userId)`, `incrementAnalysisQuota(userId)`

## 5. Steps to Implement

1. **Install Gemini SDK:**
   - In `apps/food-diary/`, install:
     ```bash
     pnpm add @google/generative-ai
     ```

2. **Configure Gemini API:**
   - Add environment variable to `.env.local`:
     ```
     GEMINI_API_KEY=your_gemini_api_key
     ```
   - Get API key from Google AI Studio

3. **Create Quota Check Helper:**
   - In `apps/food-diary/src/lib/quota.ts`, create:
     ```typescript
     import { db } from './firebase';
     import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
     
     export async function checkAnalysisQuota(userId: string): Promise<{ allowed: boolean; count: number }> {
       const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
       const quotaRef = doc(db, 'userAnalysisQuota', userId);
       const quotaDoc = await getDoc(quotaRef);
       
       if (!quotaDoc.exists()) {
         // First analysis today
         return { allowed: true, count: 0 };
       }
       
       const quota = quotaDoc.data();
       if (quota.date !== today) {
         // New day, reset quota
         return { allowed: true, count: 0 };
       }
       
       return {
         allowed: quota.count < 3,
         count: quota.count,
       };
     }
     ```

4. **Create Quota Increment Helper:**
   - In `apps/food-diary/src/lib/quota.ts`, add:
     ```typescript
     export async function incrementAnalysisQuota(userId: string): Promise<void> {
       const today = new Date().toISOString().split('T')[0];
       const quotaRef = doc(db, 'userAnalysisQuota', userId);
       const quotaDoc = await getDoc(quotaRef);
       
       if (!quotaDoc.exists() || quotaDoc.data()?.date !== today) {
         // New day or first analysis
         await setDoc(quotaRef, {
           userId,
           date: today,
           count: 1,
           lastReset: serverTimestamp(),
           lastAnalysisAt: serverTimestamp(),
         });
       } else {
         // Increment existing quota
         await updateDoc(quotaRef, {
           count: quotaDoc.data().count + 1,
           lastAnalysisAt: serverTimestamp(),
         });
       }
     }
     ```

5. **Create Gemini Analysis Server Action:**
   - In `apps/food-diary/src/app/actions.ts`, create:
     ```typescript
     "use server";
     
     import { GoogleGenerativeAI } from '@google/generative-ai';
     import { checkAnalysisQuota, incrementAnalysisQuota } from '@/lib/quota';
     
     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
     
     export async function analyzeFoodImage(imageUrl: string, userId: string) {
       try {
         // Check quota
         const quota = await checkAnalysisQuota(userId);
         if (!quota.allowed) {
           return {
             success: false,
             error: 'DAILY_LIMIT_REACHED',
             message: 'You have reached your daily limit of 3 AI analyses.',
           };
         }
         
         // Fetch image
         const imageResponse = await fetch(imageUrl);
         const imageBuffer = await imageResponse.arrayBuffer();
         const base64Image = Buffer.from(imageBuffer).toString('base64');
         
         // Call Gemini API
         const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
         const prompt = `Analyze this food image and return a JSON object with:
         - foodName: The name of the food item(s)
         - mealType: One of "breakfast", "lunch", "dinner", "snack"
         - description: A brief description of the food
         - estimatedPortion: Estimated portion size (optional)
         
         Return only valid JSON, no markdown.`;
         
         const result = await model.generateContent([
           prompt,
           {
             inlineData: {
               data: base64Image,
               mimeType: 'image/jpeg',
             },
           },
         ]);
         
         const response = await result.response;
         const text = response.text();
         
         // Parse JSON response
         const analysis = JSON.parse(text);
         
         // Increment quota
         await incrementAnalysisQuota(userId);
         
         return {
           success: true,
           data: {
             foodName: analysis.foodName || '',
             mealType: analysis.mealType || 'snack',
             description: analysis.description || '',
             estimatedPortion: analysis.estimatedPortion || '',
           },
         };
       } catch (error) {
         console.error('Error analyzing image:', error);
         return {
           success: false,
           error: 'ANALYSIS_FAILED',
           message: 'Failed to analyze image. Please try again.',
         };
       }
     }
     ```

6. **Update ImageUploader Component:**
   - Add "Analyze with AI" button after image upload
   - Call `analyzeFoodImage` server action when clicked
   - Show loading state during analysis
   - Handle quota limit error (show message to user)
   - Return analysis results to parent component

7. **Update EntryForm to Use Analysis:**
   - In `EntryForm.tsx`, handle analysis results
   - Pre-fill form fields:
     - `foodEaten` from `analysis.foodName`
     - `entryType` from `analysis.mealType`
     - `description` from `analysis.description`
   - Show success message when analysis completes
   - Show quota limit message if limit reached

8. **Add Translations:**
   - Update `nl.json` and `en.json`:
     ```json
     {
       "entryForm": {
         "analyzeWithAI": "Analyze with AI",
         "analyzing": "Analyzing...",
         "analysisComplete": "Analysis complete!",
         "analysisError": "Failed to analyze image",
         "quotaLimitReached": "You have reached your daily limit of 3 AI analyses. You can still upload images and enter details manually.",
         "quotaRemaining": "AI analyses remaining today: {count}",
         "quotaRemaining_other": "AI analyses remaining today: {count}"
       }
     }
     ```

9. **Add Quota Display:**
   - Show remaining quota count in form
   - Update quota display after each analysis
   - Hide analyze button if quota is 0

10. **Test AI Analysis:**
    - Upload food image
    - Click "Analyze with AI"
    - Verify analysis results pre-fill form
    - Test quota limit (make 3 analyses, verify 4th is blocked)
    - Test quota reset (check next day)
    - Test error handling for failed analyses

## 6. Acceptance Criteria

- `@google/generative-ai` package installed
- `GEMINI_API_KEY` environment variable configured
- `checkAnalysisQuota` function created and functional
- `incrementAnalysisQuota` function created and functional
- `analyzeFoodImage` server action created and functional
- Quota is checked before each analysis
- Quota is incremented after successful analysis
- Analysis results pre-fill form fields (foodEaten, entryType, description)
- Daily limit of 3 analyses is enforced
- Quota resets daily based on date comparison
- Error handling for failed analyses is implemented
- Quota limit message is shown when limit reached
- Translations added for AI analysis UI
- Quota remaining count is displayed

## 7. Notes

- Gemini Flash free tier: 15 requests per minute, 1M tokens per day
- Quota tracking uses Firestore `userAnalysisQuota` collection (from story 007)
- Analysis happens server-side for API key security
- Consider caching analysis results to avoid duplicate API calls
- Quota is per user (guest users have separate quotas)
- Analysis is optional - users can still upload images without analysis
- If analysis fails, user can still manually enter food details
