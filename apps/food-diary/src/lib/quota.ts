/**
 * Analysis quota helpers — server-side Firestore access using the user's
 * Firebase ID token as Bearer auth. Limits users to 10 AI analyses per day.
 */

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
const FS_ROOT = `projects/${PROJECT_ID}/databases/(default)/documents`;
const FS_API = `https://firestore.googleapis.com/v1/${FS_ROOT}`;

export const DAILY_ANALYSIS_LIMIT = 10;

interface QuotaDoc {
  date: string;
  count: number;
}

type FSStringValue = { stringValue: string };
type FSIntegerValue = { integerValue: string };

interface QuotaFSFields {
  date?: FSStringValue;
  count?: FSIntegerValue;
}

async function getQuotaDoc(idToken: string, userId: string): Promise<QuotaDoc | null> {
  const res = await fetch(`${FS_API}/userAnalysisQuota/${userId}`, {
    headers: { Authorization: `Bearer ${idToken}` },
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Firestore GET quota ${res.status}: ${await res.text()}`);

  const doc = (await res.json()) as { fields?: QuotaFSFields };
  const date = doc.fields?.date?.stringValue ?? "";
  const count = parseInt(doc.fields?.count?.integerValue ?? "0", 10);
  return { date, count };
}

export async function checkAnalysisQuota(
  idToken: string,
  userId: string,
): Promise<{ allowed: boolean; remaining: number }> {
  const today = new Date().toISOString().split("T")[0]!;
  const quota = await getQuotaDoc(idToken, userId);

  if (!quota || quota.date !== today) {
    return { allowed: true, remaining: DAILY_ANALYSIS_LIMIT };
  }

  return {
    allowed: quota.count < DAILY_ANALYSIS_LIMIT,
    remaining: Math.max(0, DAILY_ANALYSIS_LIMIT - quota.count),
  };
}

export async function incrementAnalysisQuota(idToken: string, userId: string): Promise<void> {
  const today = new Date().toISOString().split("T")[0]!;
  const quota = await getQuotaDoc(idToken, userId);

  const isNewDay = !quota || quota.date !== today;
  const newCount = isNewDay ? 1 : quota.count + 1;

  const body = {
    fields: {
      userId: { stringValue: userId },
      date: { stringValue: today },
      count: { integerValue: String(newCount) },
      lastAnalysisAt: { timestampValue: new Date().toISOString() },
    },
  };

  const maskFields = ["userId", "date", "count", "lastAnalysisAt"];
  const mask = maskFields.map(f => `updateMask.fieldPaths=${encodeURIComponent(f)}`).join("&");

  const res = await fetch(`${FS_API}/userAnalysisQuota/${userId}?${mask}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`Firestore PATCH quota ${res.status}: ${await res.text()}`);
}
