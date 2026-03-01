"use server";

import { GoogleGenerativeAI, type Content } from "@google/generative-ai";

import { extractUidFromIdToken } from "@/lib/firestore/rest-helpers";
import { checkAnalysisQuota, incrementAnalysisQuota } from "@/lib/quota";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

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
  /** Raw JSON text returned by Gemini — carry this as the first model turn when opening chat. */
  initialModelResponse?: string;
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export interface ChatAboutPhotoData {
  reply: string;
  updatedData?: Partial<AnalyzeFoodImageData>;
}

export interface ChatAboutPhotoResult {
  success: boolean;
  error?: AnalysisErrorCode;
  data?: ChatAboutPhotoData;
}

const ANALYSIS_PROMPT = `Analyze this food image and return a JSON object with:
- foodName: name of the food item(s)
- mealType: one of "breakfast", "lunch", "dinner", "snack"
- description: brief, neutral description of the food

Rules:
- Do NOT mention amounts, quantities, weights, portion sizes, or calorie estimates.
- Keep the description factual and short (one sentence).
- If multiple items are visible, list them by name without counting.

Return only valid JSON, no markdown.`;

const CHAT_PROMPT = `You are a helpful food diary assistant continuing a conversation about a food photo.
Respond in valid JSON (no markdown) with this shape:
{
  "reply": "your conversational response — friendly and brief",
  "updatedData": { "foodName": "...", "mealType": "...", "description": "..." }
}
Only include "updatedData" when the user is asking you to correct or change one of those fields.
Rules for all field values:
- Never mention amounts, quantities, weights, portion sizes, or calorie estimates.
- Keep descriptions factual and short (one sentence).
- mealType must be one of: breakfast, lunch, dinner, snack.`;

export async function analyzeFoodImage(idToken: string, base64Image: string): Promise<AnalyzeFoodImageResult> {
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
      message: "You have reached your daily limit of 10 AI analyses.",
      remaining: 0,
    };
  }

  try {
    // 3. Call Gemini Flash
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent([
      ANALYSIS_PROMPT,
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
    // 4. Increment quota only on success
    await incrementAnalysisQuota(idToken, userId);

    return {
      success: true,
      data: {
        foodName: analysis.foodName ?? "",
        mealType: analysis.mealType ?? "snack",
        description: analysis.description ?? "",
      },
      remaining: quota.remaining - 1,
      initialModelResponse: rawText,
    };
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return {
      success: false,
      error: "ANALYSIS_FAILED",
      message: "Failed to analyze image. Please try again.",
    };
  }
}

/**
 * Send a follow-up chat message about an already-analysed food photo.
 * The caller must pass the compressed base64 image and the full conversation
 * history (starting from the initial model response) so the server can
 * reconstruct the Gemini chat session statelessly.
 */
export async function chatAboutPhoto(
  idToken: string,
  base64Image: string,
  initialModelResponse: string,
  history: ChatMessage[],
  message: string,
): Promise<ChatAboutPhotoResult> {
  const userId = extractUidFromIdToken(idToken);
  if (!userId) {
    return { success: false, error: "NOT_AUTHENTICATED" };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Reconstruct the Gemini session:
    //   turn 0 (user)  → original image + analysis prompt
    //   turn 1 (model) → initial JSON analysis
    //   turn 2+ (user/model) → subsequent conversation turns
    const geminiHistory: Content[] = [
      {
        role: "user",
        parts: [{ text: ANALYSIS_PROMPT }, { inlineData: { data: base64Image, mimeType: "image/jpeg" } }],
      },
      {
        role: "model",
        parts: [{ text: initialModelResponse }],
      },
      ...history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      })),
    ];

    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessage([{ text: `${CHAT_PROMPT}\n\nUser: ${message}` }]);
    const text = result.response.text();

    let parsed: { reply?: string; updatedData?: Partial<AnalyzeFoodImageData> };
    try {
      parsed = JSON.parse(text) as typeof parsed;
    } catch {
      // Gemini sometimes wraps JSON in markdown; strip fences and retry
      const stripped = text
        .replace(/^```(?:json)?\n?/i, "")
        .replace(/\n?```$/, "")
        .trim();
      parsed = JSON.parse(stripped) as typeof parsed;
    }

    return {
      success: true,
      data: {
        reply: parsed.reply ?? text,
        updatedData: parsed.updatedData,
      },
    };
  } catch (error) {
    console.error("Chat failed:", error);
    return { success: false, error: "ANALYSIS_FAILED" };
  }
}
