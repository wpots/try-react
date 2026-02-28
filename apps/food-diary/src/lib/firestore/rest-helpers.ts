/**
 * Firestore REST API helpers — server-side Firestore access using the user's
 * Firebase ID token as Bearer auth.  No service-account credentials needed;
 * Google's Firestore servers verify the token and enforce security rules.
 */

import { createDiaryEntrySchema } from "@/lib/firestore/schemas";
import { diaryEntryBehavior, diaryEntryCompany, diaryEntryLocations, diaryEntryTypes } from "@/lib/firestore/types";
import type { ClientDiaryEntry, CreateDiaryEntryInput } from "@/lib/firestore/types";
import { getLocalDateKey } from "@/lib/getLocalDateKey";

// ─── Constants ────────────────────────────────────────────────────────────────

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
/** Full resource path prefix used in document names and batch-write operations. */
const FS_ROOT = `projects/${PROJECT_ID}/databases/(default)/documents`;
/** REST API base URL for collection / document operations. */
const FS_API = `https://firestore.googleapis.com/v1/${FS_ROOT}`;

// ─── JWT uid extraction ───────────────────────────────────────────────────────

/**
 * Decodes the ID-token payload (no signature check) and returns the Firebase
 * UID.  We only use this to build query filters; Firestore itself verifies the
 * token and enforces security rules, so a tampered token cannot bypass access
 * control.
 */
export function extractUidFromIdToken(idToken: string): string | null {
  try {
    const payload = idToken.split(".")[1];
    if (!payload) return null;
    // Firebase ID tokens use base64url encoding
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Record<string, unknown>;
    const uid = decoded["user_id"] ?? decoded["sub"];
    return typeof uid === "string" ? uid : null;
  } catch {
    return null;
  }
}

// ─── Firestore REST value types ───────────────────────────────────────────────

type FSValue =
  | { stringValue: string }
  | { integerValue: string }
  | { doubleValue: number }
  | { booleanValue: boolean }
  | { timestampValue: string }
  | { nullValue: null }
  | { arrayValue: { values?: FSValue[] } }
  | { mapValue: { fields?: Record<string, FSValue> } };

type FSFields = Record<string, FSValue>;

interface FSDocument {
  name: string;
  fields?: FSFields;
}

interface FSQueryResult {
  document?: FSDocument;
}

// ─── Value serialisers / deserialisers ────────────────────────────────────────

function toFSValue(value: unknown): FSValue {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") {
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
  if (typeof value === "string") return { stringValue: value };
  if (value instanceof Date) return { timestampValue: value.toISOString() };
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(toFSValue) } };
  }
  if (typeof value === "object") {
    const fields: FSFields = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v !== undefined) fields[k] = toFSValue(v);
    }
    return { mapValue: { fields } };
  }
  return { nullValue: null };
}

function fromFSValue(value: FSValue): unknown {
  if ("stringValue" in value) return value.stringValue;
  if ("integerValue" in value) return parseInt(value.integerValue, 10);
  if ("doubleValue" in value) return value.doubleValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("nullValue" in value) return null;
  if ("timestampValue" in value) return new Date(value.timestampValue);
  if ("arrayValue" in value) return (value.arrayValue.values ?? []).map(fromFSValue);
  if ("mapValue" in value) {
    const obj: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value.mapValue.fields ?? {})) {
      obj[k] = fromFSValue(v);
    }
    return obj;
  }
  return null;
}

function toFSFields(data: Record<string, unknown>): FSFields {
  const fields: FSFields = {};
  for (const [k, v] of Object.entries(data)) {
    if (v !== undefined) fields[k] = toFSValue(v);
  }
  return fields;
}

function fromFSDocument(doc: FSDocument): { id: string; data: Record<string, unknown> } {
  const nameParts = doc.name.split("/");
  const id = nameParts[nameParts.length - 1]!;
  const data: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(doc.fields ?? {})) {
    data[k] = fromFSValue(v);
  }
  return { id, data };
}

// ─── HTTP helpers ─────────────────────────────────────────────────────────────

async function fsGet(idToken: string, path: string): Promise<FSDocument | null> {
  const res = await fetch(`${FS_API}${path}`, {
    headers: { Authorization: `Bearer ${idToken}` },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Firestore GET ${res.status}: ${await res.text()}`);
  return res.json() as Promise<FSDocument>;
}

/** Creates a document with a server-generated ID and returns the new doc ID. */
async function fsCreate(idToken: string, collection: string, data: Record<string, unknown>): Promise<string> {
  const res = await fetch(`${FS_API}/${collection}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields: toFSFields(data) }),
  });
  if (!res.ok) throw new Error(`Firestore POST ${res.status}: ${await res.text()}`);
  const doc = (await res.json()) as FSDocument;
  const parts = doc.name.split("/");
  return parts[parts.length - 1]!;
}

/**
 * Patches a document using an explicit updateMask so that fields not listed
 * are LEFT UNTOUCHED (e.g. `createdAt`).  Fields in the mask that are absent
 * from `data` will be DELETED from the stored document (used for `skippedMeal`
 * and optional string fields).
 */
async function fsPatchWithMask(
  idToken: string,
  path: string,
  data: Record<string, unknown>,
  maskFields: string[],
): Promise<void> {
  const mask = maskFields.map(f => `updateMask.fieldPaths=${encodeURIComponent(f)}`).join("&");
  const res = await fetch(`${FS_API}${path}?${mask}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields: toFSFields(data) }),
  });
  if (!res.ok) throw new Error(`Firestore PATCH ${res.status}: ${await res.text()}`);
}

async function fsDelete(idToken: string, path: string): Promise<void> {
  const res = await fetch(`${FS_API}${path}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${idToken}` },
  });
  // 404 is acceptable — the document may already be gone
  if (!res.ok && res.status !== 404) {
    throw new Error(`Firestore DELETE ${res.status}: ${await res.text()}`);
  }
}

async function fsRunQuery(idToken: string, structuredQuery: unknown): Promise<FSDocument[]> {
  const res = await fetch(`${FS_API}:runQuery`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ structuredQuery }),
  });
  if (!res.ok) throw new Error(`Firestore runQuery ${res.status}: ${await res.text()}`);
  const results = (await res.json()) as FSQueryResult[];
  return results.flatMap(r => (r.document ? [r.document] : []));
}

/** Deletes up to 500 documents per batch. Safe to call with an empty array. */
async function fsBatchDelete(idToken: string, docPaths: string[]): Promise<void> {
  if (docPaths.length === 0) return;

  const BATCH_SIZE = 500;
  for (let i = 0; i < docPaths.length; i += BATCH_SIZE) {
    const chunk = docPaths.slice(i, i + BATCH_SIZE);
    const res = await fetch(`${FS_API}:batchWrite`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        writes: chunk.map(p => ({ delete: `${FS_ROOT}/${p}` })),
      }),
    });
    if (!res.ok) throw new Error(`Firestore batchWrite ${res.status}: ${await res.text()}`);
  }
}

// ─── Entry-specific helpers ───────────────────────────────────────────────────

function parseEntryDate(date: string, time: string): Date {
  const combined = `${date}T${time}:00`;
  const parsed = new Date(combined);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

/**
 * Fields that `adminUpdateDiaryEntry` always writes (or deletes).  Any field
 * in this mask that is absent from the PATCH body will be removed from the
 * stored document, which is how we clean up the legacy `skippedMeal` field and
 * clear optional string fields when they have been removed.
 */
const ENTRY_UPDATE_MASK = [
  "userId",
  "entryType",
  "foodEaten",
  "emotions",
  "location",
  "company",
  "description",
  "behavior",
  "skippedMeal", // intentionally absent from body → gets deleted
  "isBookmarked",
  "date",
  "time",
  "locationOther",
  "companyOther",
  "behaviorOther",
  "imageUrl",
  "imagePublicId",
  "updatedAt",
  // NOTE: "createdAt" intentionally NOT in mask so it is preserved
];

function entryInputToData(parsed: ReturnType<typeof createDiaryEntrySchema.parse>): Record<string, unknown> {
  return {
    userId: parsed.userId,
    entryType: parsed.entryType,
    foodEaten: parsed.foodEaten,
    emotions: parsed.emotions,
    location: parsed.location,
    company: parsed.company,
    description: parsed.description,
    behavior: parsed.behavior,
    isBookmarked: parsed.isBookmarked,
    date: parseEntryDate(parsed.date, parsed.time),
    time: parsed.time,
    updatedAt: new Date(),
    // Optional fields: include only when set so the PATCH mask deletes them
    // when they are absent
    ...(parsed.locationOther !== undefined && { locationOther: parsed.locationOther }),
    ...(parsed.companyOther !== undefined && { companyOther: parsed.companyOther }),
    ...(parsed.behaviorOther !== undefined && { behaviorOther: parsed.behaviorOther }),
    ...(parsed.imageUrl !== undefined && { imageUrl: parsed.imageUrl }),
    ...(parsed.imagePublicId !== undefined && { imagePublicId: parsed.imagePublicId }),
  };
}

function withLegacyBehavior(behavior: string[], skippedMeal?: boolean): string[] {
  if (!skippedMeal || behavior.includes("skipped meal")) return behavior;
  return [...behavior, "skipped meal"];
}

function docDataToClientEntry(id: string, data: Record<string, unknown>): ClientDiaryEntry {
  const dateRaw = data.date;
  const dateObj = dateRaw instanceof Date ? dateRaw : new Date();
  const createdAtRaw = data.createdAt;
  const createdAtObj = createdAtRaw instanceof Date ? createdAtRaw : new Date();
  const updatedAtRaw = data.updatedAt;
  const updatedAtObj = updatedAtRaw instanceof Date ? updatedAtRaw : new Date();

  const rawBehavior = Array.isArray(data.behavior) ? (data.behavior as string[]) : [];
  const behavior = withLegacyBehavior(rawBehavior, data.skippedMeal as boolean | undefined).filter(
    (b): b is ClientDiaryEntry["behavior"][number] => (diaryEntryBehavior as readonly string[]).includes(b),
  );

  return {
    id,
    userId: String(data.userId ?? ""),
    entryType: (diaryEntryTypes as readonly string[]).includes(data.entryType as string)
      ? (data.entryType as ClientDiaryEntry["entryType"])
      : "moment",
    foodEaten: String(data.foodEaten ?? ""),
    emotions: Array.isArray(data.emotions) ? (data.emotions as string[]) : [],
    location: (diaryEntryLocations as readonly string[]).includes(data.location as string)
      ? (data.location as ClientDiaryEntry["location"])
      : "home",
    company: (diaryEntryCompany as readonly string[]).includes(data.company as string)
      ? (data.company as ClientDiaryEntry["company"])
      : "alone",
    description: String(data.description ?? ""),
    behavior,
    isBookmarked: Boolean(data.isBookmarked),
    date: getLocalDateKey(dateObj),
    time: String(data.time ?? "00:00"),
    locationOther: data.locationOther as string | undefined,
    companyOther: data.companyOther as string | undefined,
    behaviorOther: data.behaviorOther as string | undefined,
    imageUrl: data.imageUrl as string | undefined,
    imagePublicId: data.imagePublicId as string | undefined,
    createdAt: createdAtObj.toISOString(),
    updatedAt: updatedAtObj.toISOString(),
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function restCreateDiaryEntry(idToken: string, input: CreateDiaryEntryInput): Promise<string> {
  const parsed = createDiaryEntrySchema.parse(input);
  const data = { ...entryInputToData(parsed), createdAt: new Date() };
  return fsCreate(idToken, "diaryEntries", data);
}

export async function restUpdateDiaryEntry(
  idToken: string,
  entryId: string,
  input: CreateDiaryEntryInput,
): Promise<void> {
  const parsed = createDiaryEntrySchema.parse(input);
  const data = entryInputToData(parsed);
  // fsPatchWithMask will delete `skippedMeal` (in mask, absent from body) and
  // delete any optional fields that were removed by the user.
  await fsPatchWithMask(idToken, `/diaryEntries/${entryId}`, data, ENTRY_UPDATE_MASK);
}

export async function restGetDiaryEntryById(idToken: string, entryId: string): Promise<ClientDiaryEntry | null> {
  const doc = await fsGet(idToken, `/diaryEntries/${entryId}`);
  if (!doc) return null;
  const { id, data } = fromFSDocument(doc);
  return docDataToClientEntry(id, data);
}

export async function restGetDiaryEntriesByUser(idToken: string, userId: string): Promise<ClientDiaryEntry[]> {
  const docs = await fsRunQuery(idToken, {
    from: [{ collectionId: "diaryEntries" }],
    where: {
      fieldFilter: {
        field: { fieldPath: "userId" },
        op: "EQUAL",
        value: { stringValue: userId },
      },
    },
  });

  return docs
    .map(doc => {
      const { id, data } = fromFSDocument(doc);
      return docDataToClientEntry(id, data);
    })
    .sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date);
      return (b.time ?? "00:00").localeCompare(a.time ?? "00:00");
    });
}

export async function restDeleteDiaryEntry(idToken: string, entryId: string): Promise<void> {
  await fsDelete(idToken, `/diaryEntries/${entryId}`);
}

/**
 * Migrates all diary entries from `guestId` to `userId`.
 *
 * ⚠️  This requires Firestore security rules that allow the authenticated user
 * to read documents owned by `guestId` (e.g. during anonymous → Google
 * sign-in migration).  If the rules are strict, this will return 0 and the
 * caller should fall back to client-side migration.
 */
export async function restMigrateGuestEntries(guestId: string, idToken: string, userId: string): Promise<number> {
  const docs = await fsRunQuery(idToken, {
    from: [{ collectionId: "diaryEntries" }],
    where: {
      fieldFilter: {
        field: { fieldPath: "userId" },
        op: "EQUAL",
        value: { stringValue: guestId },
      },
    },
  });

  if (docs.length === 0) return 0;

  // Update each document's userId to the new authenticated user.
  // The update mask only touches `userId` — all other fields are preserved.
  await Promise.all(
    docs.map(doc => {
      const parts = doc.name.split("/");
      const entryId = parts[parts.length - 1]!;
      return fsPatchWithMask(idToken, `/diaryEntries/${entryId}`, { userId }, ["userId"]);
    }),
  );

  return docs.length;
}

export async function restDeleteUserData(idToken: string, userId: string): Promise<number> {
  const docs = await fsRunQuery(idToken, {
    from: [{ collectionId: "diaryEntries" }],
    where: {
      fieldFilter: {
        field: { fieldPath: "userId" },
        op: "EQUAL",
        value: { stringValue: userId },
      },
    },
  });

  const entryPaths = docs.map(doc => {
    const parts = doc.name.split("/");
    return `diaryEntries/${parts[parts.length - 1]!}`;
  });

  await Promise.all([fsBatchDelete(idToken, entryPaths), fsDelete(idToken, `/userAnalysisQuota/${userId}`)]);

  return docs.length;
}
