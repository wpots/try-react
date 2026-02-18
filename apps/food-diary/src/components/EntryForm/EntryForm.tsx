"use client";

import { Container, Section } from "@repo/ui";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "@/i18n/navigation";
import { deleteDiaryEntry, fetchDiaryEntryById, type DiaryEntry } from "@/lib/diaryEntries";

import { CoachChat } from "./CoachChat/CoachChat";
import { TraditionalForm } from "./Form/TraditionalForm";
import { EntryFormHeader } from "./partials/EntryFormHeader";
import { useCoachChatController } from "./useCoachChatController";
import { hasUnsavedEntryChanges } from "./utils/hasUnsavedEntryChanges";

import type { EntryFormProps, WizardEntry } from "./index";

function mapDiaryEntryToWizardEntry(entry: DiaryEntry): WizardEntry {
  return {
    behavior: entry.behavior,
    behaviorOther: entry.behaviorOther,
    company: entry.company,
    companyOther: entry.companyOther,
    date: entry.date,
    description: entry.description,
    emotions: entry.emotions,
    entryType: entry.entryType,
    foodEaten: entry.foodEaten,
    imagePublicId: entry.imagePublicId,
    imageUrl: entry.imageUrl,
    isBookmarked: entry.isBookmarked,
    location: entry.location,
    locationOther: entry.locationOther,
    time: entry.time,
  };
}

export function EntryForm({
  entryId,
  initialMode = "chat",
  isBookmarked,
  onBookmarkChange,
  onComplete,
  onDirtyChange,
}: EntryFormProps): React.JSX.Element {
  const router = useRouter();
  const { loading: isAuthLoading, user } = useAuth();
  const t = useTranslations("entry");
  const userId = user?.uid;
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleComplete = useCallback(() => {
    if (onComplete) {
      onComplete();
      return;
    }

    router.push("/dashboard");
  }, [onComplete, router]);

  const controller = useCoachChatController({
    entryId,
    initialMode,
    onComplete: handleComplete,
  });
  const initialEntryRef = useRef<WizardEntry>(controller.entry);
  const previousBookmarkedPropRef = useRef(isBookmarked);

  const handleDelete = useCallback(async (): Promise<void> => {
    const selectedEntryId = entryId?.trim() ?? "";

    if (!selectedEntryId) {
      return;
    }

    if (!window.confirm(t("form.deleteConfirm"))) {
      return;
    }

    if (!userId) {
      setDeleteError(t("errors.notAuthenticated"));
      return;
    }

    setDeleteError(null);
    setIsDeleting(true);

    try {
      const hasDeleted = await deleteDiaryEntry(userId, selectedEntryId);

      if (!hasDeleted) {
        setDeleteError(t("errors.deleteFailed"));
        return;
      }

      handleComplete();
    } catch {
      setDeleteError(t("errors.deleteFailed"));
    } finally {
      setIsDeleting(false);
    }
  }, [entryId, handleComplete, t, userId]);

  useEffect(() => {
    if (!entryId || isAuthLoading || !userId) {
      return;
    }

    const authenticatedUserId = userId;
    const selectedEntryId = entryId;
    let isCanceled = false;

    async function loadEntry(): Promise<void> {
      const existingEntry = await fetchDiaryEntryById(authenticatedUserId, selectedEntryId);

      if (!existingEntry || isCanceled) {
        return;
      }

      const mappedEntry = mapDiaryEntryToWizardEntry(existingEntry);
      initialEntryRef.current = mappedEntry;
      controller.setEntry(mappedEntry);
    }

    void loadEntry();

    return () => {
      isCanceled = true;
    };
  }, [controller.setEntry, entryId, isAuthLoading, userId]);

  const isDirty = useMemo(
    () =>
      hasUnsavedEntryChanges({
        initialEntry: initialEntryRef.current,
        currentEntry: controller.entry,
        currentStepIndex: controller.currentStepIndex,
        inputText: controller.inputText,
        inputChips: controller.inputChips,
        inputEmotions: controller.inputEmotions,
        inputBookmarked: controller.inputBookmarked,
        inputOtherText: controller.inputOtherText,
        messages: controller.messages,
      }),
    [
      controller.currentStepIndex,
      controller.entry,
      controller.inputChips,
      controller.inputBookmarked,
      controller.inputEmotions,
      controller.inputOtherText,
      controller.inputText,
      controller.messages,
    ],
  );

  useEffect(() => {
    if (!onDirtyChange) {
      return;
    }

    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    if (isBookmarked == null) {
      previousBookmarkedPropRef.current = isBookmarked;
      return;
    }

    if (previousBookmarkedPropRef.current === isBookmarked) {
      return;
    }

    previousBookmarkedPropRef.current = isBookmarked;

    if (controller.entry.isBookmarked === isBookmarked) {
      return;
    }

    controller.setEntry({
      ...controller.entry,
      isBookmarked,
    });
  }, [controller.entry, controller.setEntry, isBookmarked]);

  useEffect(() => {
    if (!onBookmarkChange) {
      return;
    }

    onBookmarkChange(controller.entry.isBookmarked);
  }, [controller.entry.isBookmarked, onBookmarkChange]);

  return (
    <Section spacing="none" className="min-h-0 flex-1">
      <Container size="narrow" className="flex h-full min-h-0 flex-col">
        <EntryFormHeader
          currentStepIndex={controller.currentStepIndex}
          mode={controller.mode}
          totalSteps={controller.filteredSteps.length}
          onSwitchMode={() => controller.setMode(controller.mode === "chat" ? "form" : "chat")}
        />

        {controller.mode === "form" ? (
          <TraditionalForm
            canDelete={Boolean(entryId)}
            deleteError={deleteError}
            initialEntry={controller.entry}
            isDeleting={isDeleting}
            onComplete={controller.handleTraditionalComplete}
            onDelete={handleDelete}
            onEntryChange={controller.setEntry}
          />
        ) : (
          <CoachChat controller={controller} />
        )}
      </Container>
    </Section>
  );
}
