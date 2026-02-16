"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";

import { useRouter } from "@/i18n/navigation";

import type { EntryFormProps, WizardEntry } from "./index";
import { CoachChat } from "./CoachChat/CoachChat";
import { TraditionalForm } from "./Form/TraditionalForm";
import { EntryFormHeader } from "./partials/EntryFormHeader";
import { useCoachChatController } from "./useCoachChatController";
import { hasUnsavedEntryChanges } from "./utils/hasUnsavedEntryChanges";

export function EntryForm({
  initialMode = "chat",
  isBookmarked,
  onBookmarkChange,
  onComplete,
  onDirtyChange,
}: EntryFormProps): React.JSX.Element {
  const router = useRouter();

  const handleComplete = useCallback(() => {
    if (onComplete) {
      onComplete();
      return;
    }

    router.push("/dashboard");
  }, [onComplete, router]);

  const controller = useCoachChatController({
    initialMode,
    onComplete: handleComplete,
  });
  const initialEntryRef = useRef<WizardEntry>(controller.entry);
  const previousBookmarkedPropRef = useRef(isBookmarked);

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
        inputSkippedMeal: controller.inputSkippedMeal,
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
      controller.inputSkippedMeal,
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
    <div className="flex h-full flex-col">
      <EntryFormHeader
        currentStepIndex={controller.currentStepIndex}
        mode={controller.mode}
        totalSteps={controller.filteredSteps.length}
        onSwitchMode={() => controller.setMode(controller.mode === "chat" ? "form" : "chat")}
      />

      {controller.mode === "form" ? (
        <TraditionalForm
          initialEntry={controller.entry}
          onComplete={controller.handleTraditionalComplete}
          onEntryChange={controller.setEntry}
        />
      ) : (
        <CoachChat controller={controller} />
      )}
    </div>
  );
}
