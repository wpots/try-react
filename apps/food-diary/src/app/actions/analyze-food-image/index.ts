"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

import { extractUidFromIdToken, restGetUserContext } from "@/lib/firestore/rest-helpers";
import { checkAnalysisQuota, incrementAnalysisQuota } from "@/lib/quota";

function getGenAI() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY environment variable is not set");
  return new GoogleGenerativeAI(key);
}

export type AnalysisErrorCode = "NOT_AUTHENTICATED" | "DAILY_LIMIT_REACHED" | "ANALYSIS_FAILED";

export interface AnalyzeFoodImageData {
  foodName: string;
  mealType: string;
  description: string;
}

export interface AnalyzeFoodImageResult {
  success: boolean;
  error?: AnalysisErrorCode;
  message?: string;
  data?: AnalyzeFoodImageData;
  remaining?: number;
}

function buildAnalysisPrompt(
  locale: string,
  userContext?: { company?: string; location?: string; behaviour?: string } | null,
): string {
  const contextLines: string[] = [];
  if (userContext?.company) contextLines.push(`- Company / workplace type: ${userContext.company}`);
  if (userContext?.location) contextLines.push(`- Location: ${userContext.location}`);
  if (userContext?.behaviour) contextLines.push(`- Eating behaviour / dietary preferences: ${userContext.behaviour}`);

  const contextSection =
    contextLines.length > 0 ? `\nUser context:\n${contextLines.join("\n")}\n` : "";

  return `Analyze this food image and return a JSON object with:
- foodName: name of the food item(s)
- mealType: one of "breakfast", "lunch", "dinner", "snack"
- description: brief, neutral description of the food

Rules:
- Do NOT mention amounts, quantities, weights, portion sizes, or calorie estimates.
- Keep the description factual and short (one sentence).
- If multiple items are visible, list them by name without counting.
- Return ALL text values (foodName, description) in the language with BCP 47 locale code "${locale}".
${contextSection}
Return only valid JSON, no markdown.`;
}

export async function analyzeFoodImage(idToken: string, base64Image: string, locale = "en"): Promise<AnalyzeFoodImageResult> {
  // 1. Verify authentication
  const userId = extractUidFromIdToken(idToken);
  if (!userId) {
    return {
      success: false,
      error: "NOT_AUTHENTICATED",
      message: "Authentication required.",
    };
  }

  // 2. Enforce daily quota
  const quota = await checkAnalysisQuota(idToken, userId);
  if (!quota.allowed) {
    return {
      success: false,
      error: "DAILY_LIMIT_REACHED",
      message: "You have reached your daily limit of 6 AI analyses.",
      remaining: 0,
    };
  }

  try {
    // 3. Load user context (non-blocking; omit gracefully on error)
    let userContext: { company?: string; location?: string; behaviour?: string } | null = null;
    try {
      userContext = await restGetUserContext(idToken, userId);
    } catch {
      // User context is optional — continue without it if the read fails
    }

    // 4. Call Gemini Flash
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent([
      buildAnalysisPrompt(locale, userContext),
      { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
    ]);

    const rawText = result.response.text();
    let analysis: { foodName?: string; mealType?: string; description?: string };
    try {
      analysis = JSON.parse(rawText) as typeof analysis;
    } catch {
      // Gemini sometimes wraps JSON in markdown fences; strip and retry
      const stripped = rawText
        .replace(/^```(?:json)?\n?/i, "")
        .replace(/\n?```$/, "")
        .trim();
      analysis = JSON.parse(stripped) as typeof analysis;
    }
    // 5. Increment quota only on success
    await incrementAnalysisQuota(idToken, userId);

    return {
      success: true,
      data: {
        foodName: analysis.foodName ?? "",
        mealType: analysis.mealType ?? "snack",
        description: analysis.description ?? "",
      },
      remaining: quota.remaining - 1,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Gemini analysis failed:", message);
    return {
      success: false,
      error: "ANALYSIS_FAILED",
      message: `Failed to analyze image: ${message}`,
    };
  }
}
