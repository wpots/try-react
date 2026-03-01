# User Story 010: Implement AI Food Image Analysis with Gemini

## 1. Title

Implement AI-powered food image analysis using Google Gemini Flash API to pre-fill diary entry form fields.

## 2. Goal

Allow users to take or select a food photo, send it to Google Gemini Flash for analysis, and pre-fill diary entry form fields with the result. The image is used transiently for analysis only — it is **not** uploaded or stored anywhere. A daily quota of 3 analyses per user prevents excessive API costs.

## 3. Description

As a user I want to snap a photo of my food and have AI suggest the food name, meal type, and description so I can log entries faster while keeping full control over the final data.

The photo never leaves the analysis flow — no cloud storage, no persisted URLs. This avoids triggering behaviour around food photography while still giving the user a convenient shortcut.

## 4. Technical Details

| Aspect               | Detail                                                                                               |
| -------------------- | ---------------------------------------------------------------------------------------------------- |
| **AI Service**       | Google Gemini Flash API (multimodal)                                                                 |
| **SDK**              | `@google/generative-ai`                                                                              |
| **API Key**          | `GEMINI_API_KEY` env var (server-side only)                                                          |
| **Server Action**    | `analyzeFoodImage(base64Image, userId)` in `apps/food-diary/src/app/actions/`                        |
| **Quota Tracking**   | Firestore `userAnalysisQuota` collection                                                             |
| **Quota Limit**      | 3 analyses per user per day                                                                          |
| **Quota Helpers**    | `checkAnalysisQuota(userId)`, `incrementAnalysisQuota(userId)` in `apps/food-diary/src/lib/quota.ts` |
| **Client Component** | `FoodPhotoAnalyzer.tsx` in `apps/food-diary/src/components/EntryForm/`                               |
| **Image Handling**   | Client reads file → converts to base64 → sends to server action. No upload to external storage.      |

## 5. Steps to Implement

### 5.1 Install Dependencies

```bash
# in apps/food-diary/
pnpm add @google/generative-ai
pnpm add browser-image-compression   # keep images small before base64 encoding
```

### 5.2 Configure Environment

Add to `.env.local`:

```
GEMINI_API_KEY=your_gemini_api_key
```

### 5.3 Create Quota Helpers

Create `apps/food-diary/src/lib/quota.ts`:

```typescript
import { db } from "@/firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";

const DAILY_LIMIT = 3;

export async function checkAnalysisQuota(userId: string): Promise<{ allowed: boolean; remaining: number }> {
  const today = new Date().toISOString().split("T")[0];
  const ref = doc(db, "userAnalysisQuota", userId);
  const snap = await getDoc(ref);

  if (!snap.exists() || snap.data().date !== today) {
    return { allowed: true, remaining: DAILY_LIMIT };
  }

  const count = snap.data().count ?? 0;
  return { allowed: count < DAILY_LIMIT, remaining: DAILY_LIMIT - count };
}

export async function incrementAnalysisQuota(userId: string): Promise<void> {
  const today = new Date().toISOString().split("T")[0];
  const ref = doc(db, "userAnalysisQuota", userId);
  const snap = await getDoc(ref);

  if (!snap.exists() || snap.data().date !== today) {
    await setDoc(ref, {
      userId,
      date: today,
      count: 1,
      lastReset: serverTimestamp(),
      lastAnalysisAt: serverTimestamp(),
    });
  } else {
    await updateDoc(ref, {
      count: snap.data().count + 1,
      lastAnalysisAt: serverTimestamp(),
    });
  }
}
```

### 5.4 Create Server Action

Create `apps/food-diary/src/app/actions/analyze-food-image/index.ts`:

```typescript
"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkAnalysisQuota, incrementAnalysisQuota } from "@/lib/quota";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeFoodImage(base64Image: string, userId: string) {
  // 1. Enforce quota
  const quota = await checkAnalysisQuota(userId);
  if (!quota.allowed) {
    return {
      success: false as const,
      error: "DAILY_LIMIT_REACHED",
      message: "You have reached your daily limit of 3 AI analyses.",
    };
  }

  try {
    // 2. Call Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze this food image and return a JSON object with:
- foodName: name of the food item(s)
- mealType: one of "breakfast", "lunch", "dinner", "snack"
- description: brief, neutral description of the food

Rules:
- Do NOT mention amounts, quantities, weights, portion sizes, or calorie estimates.
- Keep the description factual and short (one sentence).
- If multiple items are visible, list them by name without counting.

Return only valid JSON, no markdown.`;

    const result = await model.generateContent([prompt, { inlineData: { data: base64Image, mimeType: "image/jpeg" } }]);

    const text = result.response.text();
    const analysis = JSON.parse(text);

    // 3. Increment quota only after success
    await incrementAnalysisQuota(userId);

    return {
      success: true as const,
      data: {
        foodName: analysis.foodName ?? "",
        mealType: analysis.mealType ?? "snack",
        description: analysis.description ?? "",
      },
      remaining: quota.remaining - 1,
    };
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return {
      success: false as const,
      error: "ANALYSIS_FAILED",
      message: "Failed to analyze image. Please try again.",
    };
  }
}
```

### 5.5 Create `FoodPhotoAnalyzer` Client Component

Create `apps/food-diary/src/components/EntryForm/FoodPhotoAnalyzer.tsx`:

- Use RAC `FileTrigger` to pick / capture an image (camera on mobile).
- Client-side compress with `browser-image-compression` (max 400 px, ≤ 1 MB) to keep the base64 payload small.
- Convert to base64 and call `analyzeFoodImage`.
- Show inline image preview while analysis runs.
- On success, call parent callback with pre-fill data; clear the preview.
- On quota limit, show a human-friendly message and disable the trigger.
- On error, show a retry option.

### 5.6 Integrate with EntryForm

- Add `FoodPhotoAnalyzer` above or beside the form fields in `TraditionalForm`.
- On analysis result, pre-fill `foodEaten`, `entryType`, and `description`.
- User can still edit all fields after pre-fill.
- Form submission does **not** include any image data.

### 5.7 Add Translations

Add keys to `messages/en/entry/form.json` and `messages/nl/entry/form.json`:

```jsonc
// English
{
  "analyzePhoto": "Analyze food photo",
  "analyzing": "Analyzing…",
  "analysisComplete": "Analysis complete! Review the suggested values below.",
  "analysisError": "Could not analyze the photo. You can try again or fill in the details manually.",
  "quotaLimitReached": "You've used all 3 AI analyses for today. You can still enter details manually.",
  "quotaRemaining": "{count, plural, one {# analysis} other {# analyses}} remaining today",
}
```

### 5.8 Update Firestore Rules

Allow read/write on `userAnalysisQuota/{userId}` for the owning user:

```
match /userAnalysisQuota/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

### 5.9 Test

1. Select or capture a photo → verify Gemini returns structured data and form fields pre-fill.
2. Complete 3 analyses → verify the 4th is blocked with a clear message.
3. Verify quota resets the next calendar day.
4. Simulate Gemini failure → verify user can continue manually.
5. Submit entry → verify **no** image data is persisted in Firestore.
6. Test with both guest and authenticated users.

## 6. Acceptance Criteria

- [ ] `@google/generative-ai` installed; `GEMINI_API_KEY` configured server-side.
- [ ] `FoodPhotoAnalyzer` component lets user pick/capture a photo via RAC `FileTrigger`.
- [ ] Image is compressed client-side (≤ 400 px, ≤ 1 MB) before sending to server action.
- [ ] `analyzeFoodImage` server action calls Gemini and returns typed results.
- [ ] Analysis pre-fills `foodEaten`, `entryType`, and `description` in the form.
- [ ] Daily quota of 3 analyses per user is enforced in Firestore.
- [ ] Quota remaining count is shown; trigger is disabled at 0.
- [ ] Failing analysis shows an error and allows manual entry.
- [ ] **No image data is uploaded to external storage or persisted in Firestore.**
- [ ] Translations added for EN and NL.
- [ ] Firestore security rules cover `userAnalysisQuota`.
- [ ] No regressions in guest and authenticated entry save flows.

## 7. Notes

- **Why no image storage?** Storing food photos can reinforce unhealthy monitoring behaviour. The photo is used only as a transient input for AI analysis.
- Gemini Flash free tier: 15 requests/min, 1 M tokens/day — well within our 3-per-user-per-day limit.
- Guest users get their own quota keyed by anonymous UID.
- Consider caching analysis results in component state so navigating away and back doesn't burn another quota.
- This story replaces the former stories 010 (Cloudinary upload), 011 (Gemini analysis), and 015 (end-to-end integration). Cloudinary is no longer needed.
