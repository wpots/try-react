"use server";

import { auth, db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

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

export async function fetchDiaryEntries(
  userIdFromClient?: string,
): Promise<DiaryEntry[]> {
  const userId = auth.currentUser?.uid ?? userIdFromClient;
  if (!userId) {
    return [];
  }

  const entriesQuery = query(
    collection(db, "diaryEntries"),
    where("userId", "==", userId),
    orderBy("date", "desc"),
  );

  const querySnapshot = await getDocs(entriesQuery);

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      userId,
      entryType: data.entryType || "",
      foodEaten: data.foodEaten || "",
      emotions: data.emotions || [],
      location: data.location || "",
      company: data.company || "",
      description: data.description || "",
      behavior: data.behavior || [],
      skippedMeal: data.skippedMeal || false,
      date: data.date || "",
      time: data.time || "",
      createdAt: data.createdAt || "",
      updatedAt: data.updatedAt || "",
    };
  });
}
