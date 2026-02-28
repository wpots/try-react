"use client";

import { useCallback, useState } from "react";

import { saveDiaryEntryFromInput } from "@/app/actions";
import type { SaveDiaryEntryFromInputResult } from "@/app/actions";
import { signInAnonymously } from "@/lib/auth";

import { getDefaultEntryType } from "../utils/getDefaultEntryType";

import type { WizardEntry } from "../index";
import type { User } from "firebase/auth";
import type { useTranslations } from "next-intl";

type EntryTranslations = ReturnType<typeof useTranslations>;

interface UseCoachChatPersistenceArgs {
  entryId?: string;
  user: User | null;
  t: EntryTranslations;
}

export interface UseCoachChatPersistenceResult {
  isSaving: boolean;
  saveError: string | null;
  persistEntry: (finalEntry: WizardEntry) => Promise<SaveDiaryEntryFromInputResult>;
}

export function useCoachChatPersistence({
  entryId,
  user,
  t,
}: UseCoachChatPersistenceArgs): UseCoachChatPersistenceResult {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const persistEntry = useCallback(
    async (finalEntry: WizardEntry): Promise<SaveDiaryEntryFromInputResult> => {
      setIsSaving(true);
      setSaveError(null);

      try {
        const activeUser = user ?? (await signInAnonymously());
        const entryType = finalEntry.entryType ?? getDefaultEntryType(finalEntry.date, finalEntry.time ?? "00:00");

        const result = await saveDiaryEntryFromInput({
          entryId,
          userId: activeUser.uid,
          entryType,
          foodEaten: finalEntry.foodEaten,
          description: finalEntry.description,
          emotions: finalEntry.emotions,
          location: finalEntry.location ?? "home",
          company: finalEntry.company ?? "alone",
          behavior: finalEntry.behavior,
          date: finalEntry.date,
          time: finalEntry.time,
          locationOther: finalEntry.locationOther,
          companyOther: finalEntry.companyOther,
          behaviorOther: finalEntry.behaviorOther,
          isBookmarked: finalEntry.isBookmarked,
          imageUrl: finalEntry.imageUrl,
          imagePublicId: finalEntry.imagePublicId,
        });

        return result;
      } catch (error) {
        console.error("Error saving diary entry:", error);
        const message = error instanceof Error ? error.message : t("errors.saveFailed");
        setSaveError(message);
        return { success: false, error: message };
      } finally {
        setIsSaving(false);
      }
    },
    [entryId, t, user],
  );

  return {
    isSaving,
    saveError,
    persistEntry,
  };
}
