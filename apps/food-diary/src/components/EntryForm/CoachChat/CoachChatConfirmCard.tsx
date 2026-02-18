"use client";

import { useTranslations } from "next-intl";

import type { WizardEntry } from "../index";
import type { DiaryEntry } from "@/lib/diaryEntries";
import { DayEntryCard } from "@/templates/DashboardTemplate/partials/DayEntryCard";
import { getEntryMoods } from "@/templates/DashboardTemplate/utils/moodUtils";
import { EntryFormButton } from "../partials/EntryFormButton";

interface CoachChatConfirmCardProps {
  entry: WizardEntry;
  isSaving: boolean;
  saveError: string | null;
  onBack: () => void;
  onSubmit: () => void;
}

function toPreviewEntry(entry: WizardEntry): DiaryEntry {
  return {
    id: "coach-chat-preview",
    userId: "coach-chat-preview",
    entryType: entry.entryType ?? "moment",
    foodEaten: entry.foodEaten,
    emotions: entry.emotions,
    location: entry.location ?? "home",
    company: entry.company ?? "alone",
    description: entry.description,
    behavior: entry.behavior,
    skippedMeal: entry.skippedMeal ?? false,
    isBookmarked: entry.isBookmarked,
    date: entry.date,
    time: entry.time,
    locationOther: entry.locationOther,
    companyOther: entry.companyOther,
    behaviorOther: entry.behaviorOther,
    createdAt: entry.date,
    updatedAt: entry.date,
    imageUrl: entry.imageUrl,
    imagePublicId: entry.imagePublicId,
  };
}

export function CoachChatConfirmCard({
  entry,
  isSaving,
  saveError,
  onBack,
  onSubmit,
}: CoachChatConfirmCardProps): React.JSX.Element {
  const tEntry = useTranslations("entry");
  const tDashboard = useTranslations("dashboard");
  const previewEntry = toPreviewEntry(entry);

  function translateEntry(key: string): string {
    return tEntry(key);
  }

  function translateDashboard(key: string): string {
    return tDashboard(key);
  }

  function resolveEmotionLabel(emotionKey: string): string {
    try {
      return tEntry(`emotions.${emotionKey}`);
    } catch {
      return emotionKey;
    }
  }

  const entryMoods = getEntryMoods(previewEntry, resolveEmotionLabel);

  return (
    <div className="space-y-ds-s">
      <DayEntryCard
        entry={previewEntry}
        entryMoods={entryMoods}
        isBookmarked={previewEntry.isBookmarked}
        isDeleting={false}
        isExpanded={false}
        showActionButtons={false}
        forceExpanded
        translateDashboard={translateDashboard}
        translateEntry={translateEntry}
      />
      {saveError ? (
        <p className="text-sm text-ds-danger">{saveError}</p>
      ) : null}
      <div className="flex justify-end gap-ds-s">
        <EntryFormButton variant="outline" onClick={onBack}>
          {tEntry("form.edit")}
        </EntryFormButton>
        <EntryFormButton onClick={onSubmit} disabled={isSaving}>
          {isSaving ? tEntry("saving") : tEntry("form.submit")}
        </EntryFormButton>
      </div>
    </div>
  );
}
