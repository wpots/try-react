"use server";

import { auth, db } from "@/firebase";
import { serverTimestamp, addDoc } from "firebase/firestore";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

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

export const fetchDiaryEntries = async () => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    return [];
  }
  const entriesQuery = query(collection(db, "diaryEntries"), where("userId", "==", userId), orderBy("date", "desc"));
  const querySnapshot = await getDocs(entriesQuery);
  const entries: DiaryEntry[] = querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: userId,
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
  return entries;
};

export const saveDiaryEntry = async (prevState: unknown, formData: FormData) => {
  const userId = auth.currentUser?.uid;

  if (!userId) {
    console.error("User not authenticated.");
    return { error: "User not authenticated" };
  }

  try {
    const docRef = await addDoc(collection(db, "diaryEntries"), {
      userId: userId,
      foodEaten: formData.get("foodEaten"),
      description: formData.get("description"),
      date: formData.get("date"),
      time: formData.get("time"),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log("Document written with ID: ", docRef.id);
    return { success: true };
  } catch (error) {
    console.error("Error adding document: ", error);
    return { error: "Failed to save entry" };
  }
};
