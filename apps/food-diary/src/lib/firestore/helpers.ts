import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  mapDiaryEntrySnapshot,
  toDiaryEntryWriteData,
} from "@/lib/firestore/converters";
import {
  createDiaryEntrySchema,
  userAnalysisQuotaSchema,
} from "@/lib/firestore/schemas";
import type {
  CreateDiaryEntryInput,
  DiaryEntry,
  UserAnalysisQuota,
} from "@/lib/firestore/types";

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getQuotaDocumentReference(userId: string) {
  return doc(db, "userAnalysisQuota", userId);
}

export async function createDiaryEntry(
  input: CreateDiaryEntryInput,
): Promise<string> {
  const parsed = createDiaryEntrySchema.parse(input);
  const payload = toDiaryEntryWriteData(parsed);
  const documentReference = await addDoc(collection(db, "diaryEntries"), payload);

  return documentReference.id;
}

export async function getDiaryEntriesByUser(userId: string): Promise<DiaryEntry[]> {
  const entriesQuery = query(
    collection(db, "diaryEntries"),
    where("userId", "==", userId),
    orderBy("date", "desc"),
  );
  const querySnapshot = await getDocs(entriesQuery);

  return querySnapshot.docs.map((snapshot) => mapDiaryEntrySnapshot(snapshot));
}

export async function getDiaryEntriesByDateRange(
  userId: string,
  startDate: Date,
  endDate: Date,
): Promise<DiaryEntry[]> {
  const entriesQuery = query(
    collection(db, "diaryEntries"),
    where("userId", "==", userId),
    where("date", ">=", Timestamp.fromDate(startDate)),
    where("date", "<=", Timestamp.fromDate(endDate)),
    orderBy("date", "desc"),
  );
  const querySnapshot = await getDocs(entriesQuery);

  return querySnapshot.docs.map((snapshot) => mapDiaryEntrySnapshot(snapshot));
}

export async function getAnalysisQuota(
  userId: string,
): Promise<UserAnalysisQuota> {
  const quotaDocRef = getQuotaDocumentReference(userId);
  const snapshot = await getDoc(quotaDocRef);

  if (!snapshot.exists()) {
    return {
      userId,
      date: toDateKey(new Date()),
      count: 0,
      lastReset: Timestamp.now(),
    };
  }

  const parsed = userAnalysisQuotaSchema.parse({
    userId: snapshot.id,
    ...snapshot.data(),
  });

  return parsed;
}

export async function incrementAnalysisQuota(
  userId: string,
): Promise<UserAnalysisQuota> {
  const quotaDocRef = getQuotaDocumentReference(userId);

  return runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(quotaDocRef);
    const now = new Date();
    const dateKey = toDateKey(now);

    if (!snapshot.exists()) {
      const quota: UserAnalysisQuota = {
        userId,
        date: dateKey,
        count: 1,
        lastReset: Timestamp.now(),
        lastAnalysisAt: Timestamp.now(),
      };
      transaction.set(quotaDocRef, quota);
      return quota;
    }

    const current = userAnalysisQuotaSchema.parse({
      userId: snapshot.id,
      ...snapshot.data(),
    });

    const shouldReset = current.date !== dateKey;
    if (!shouldReset && current.count >= 3) {
      return current;
    }

    const nextCount = shouldReset ? 1 : current.count + 1;

    const nextQuota: UserAnalysisQuota = {
      userId,
      date: dateKey,
      count: nextCount,
      lastReset: shouldReset ? Timestamp.now() : current.lastReset,
      lastAnalysisAt: Timestamp.now(),
    };

    transaction.set(quotaDocRef, nextQuota, { merge: true });
    return nextQuota;
  });
}

export async function migrateGuestEntries(
  guestId: string,
  userId: string,
): Promise<number> {
  const entriesQuery = query(
    collection(db, "diaryEntries"),
    where("userId", "==", guestId),
  );
  const querySnapshot = await getDocs(entriesQuery);

  const updates = querySnapshot.docs.map((snapshot) =>
    updateDoc(doc(db, "diaryEntries", snapshot.id), {
      userId,
    }),
  );

  await Promise.all(updates);

  return querySnapshot.docs.length;
}
