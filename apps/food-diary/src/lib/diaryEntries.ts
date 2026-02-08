import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export interface DiaryEntry {
  id: string;
  userId: string;
  entryType: string;
  foodEaten: string;
  emotions: string[];
  location: string;
  company: string;
  description: string;
  behavior: string[];
  skippedMeal: boolean;
  date: string;
  time: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaveDiaryEntryInput {
  userId: string;
  foodEaten: string;
  description: string;
  date: string;
  time: string;
}

export async function fetchDiaryEntries(userId: string): Promise<DiaryEntry[]> {
  const currentUserId = auth.currentUser?.uid;

  if (!currentUserId || currentUserId !== userId) {
    return [];
  }

  const entriesQuery = query(
    collection(db, "diaryEntries"),
    where("userId", "==", userId),
    orderBy("date", "desc"),
  );

  const querySnapshot = await getDocs(entriesQuery);

  return querySnapshot.docs.map((docSnapshot) => {
    const data = docSnapshot.data();

    return {
      id: docSnapshot.id,
      userId,
      entryType: typeof data.entryType === "string" ? data.entryType : "",
      foodEaten: typeof data.foodEaten === "string" ? data.foodEaten : "",
      emotions: Array.isArray(data.emotions)
        ? data.emotions.filter((emotion) => typeof emotion === "string")
        : [],
      location: typeof data.location === "string" ? data.location : "",
      company: typeof data.company === "string" ? data.company : "",
      description: typeof data.description === "string" ? data.description : "",
      behavior: Array.isArray(data.behavior)
        ? data.behavior.filter((item) => typeof item === "string")
        : [],
      skippedMeal: typeof data.skippedMeal === "boolean" ? data.skippedMeal : false,
      date: typeof data.date === "string" ? data.date : "",
      time: typeof data.time === "string" ? data.time : "",
      createdAt: "",
      updatedAt: "",
    };
  });
}

export async function saveDiaryEntry(input: SaveDiaryEntryInput): Promise<void> {
  const currentUserId = auth.currentUser?.uid;

  if (!currentUserId || currentUserId !== input.userId) {
    throw new Error("User not authenticated");
  }

  await addDoc(collection(db, "diaryEntries"), {
    userId: input.userId,
    foodEaten: input.foodEaten,
    description: input.description,
    date: input.date,
    time: input.time,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}
