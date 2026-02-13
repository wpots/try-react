import { useTranslations } from "next-intl";

import { Button, ChipSelector } from "@repo/ui";

import { getDefaultEntryType } from "../utils/getDefaultEntryType";
import {
  entryTypeOptions,
} from "../utils/options";
import type { WizardStep } from "../utils/steps";
import type { UseCoachChatControllerResult } from "../useCoachChatController";
import { CoachChatConfirmCard } from "./CoachChatConfirmCard";
import { CoachChatFollowupInput } from "./CoachChatFollowupInput";

interface CoachChatActiveInputProps {
  controller: UseCoachChatControllerResult;
}

function InputShell({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="animate-message-in border-t border-ds-border-subtle bg-ds-surface px-ds-l pb-ds-l pt-ds-m">
      {children}
    </div>
  );
}

function toOptions(
  options: { value: string; labelKey: string }[],
  translate: (key: string) => string,
): { value: string; label: string }[] {
  return options.map((option) => ({
    value: option.value,
    label: translate(option.labelKey),
  }));
}

function getCurrentStep(
  currentStepIndex: number,
  filteredSteps: WizardStep[],
): WizardStep | undefined {
  return filteredSteps[currentStepIndex];
}

export function CoachChatActiveInput({
  controller,
}: CoachChatActiveInputProps): React.JSX.Element | null {
  const t = useTranslations("createEntry");
  const {
    completed,
    currentStepIndex,
    entry,
    filteredSteps,
    inputChips,
    inputEmotions,
    inputSkippedMeal,
    inputText,
    isSaving,
    isTyping,
    mode,
    saveError,
    setEntry,
    setInputChips,
    setInputEmotions,
    setInputSkippedMeal,
    setInputText,
    handleSkip,
    handleStepBack,
    handleSubmitBehavior,
    handleSubmitCompany,
    handleSubmitConfirm,
    handleSubmitDatetime,
    handleSubmitDescription,
    handleSubmitEmotions,
    handleSubmitEntryType,
    handleSubmitFood,
    handleSubmitLocation,
    handleSubmitSkippedMeal,
  } = controller;

  if (completed || isTyping || mode !== "chat") {
    return null;
  }

  const step = getCurrentStep(currentStepIndex, filteredSteps);
  if (!step) {
    return null;
  }

  if (step.key === "entryType") {
    const now = new Date();
    const fallbackTime = now.toTimeString().slice(0, 5);
    const suggestedType = getDefaultEntryType(entry.date, entry.time || fallbackTime);
    const selected =
      inputChips.length > 0 ? inputChips : entry.entryType ? [entry.entryType] : [suggestedType];

    return (
      <InputShell>
        <ChipSelector
          options={toOptions(entryTypeOptions, t)}
          selectedValues={selected}
          onSelectedValuesChange={setInputChips}
          selectionMode="single"
        />
        <div className="mt-ds-m flex justify-end">
          <Button variant="default" onClick={handleSubmitEntryType}>
            {t("form.confirm")}
          </Button>
        </div>
      </InputShell>
    );
  }

  if (step.key === "datetime") {
    return (
      <InputShell>
        <div className="flex flex-col gap-ds-s">
          <div className="flex gap-ds-s">
            <input
              type="date"
              value={entry.date}
              onChange={(event) => setEntry({ ...entry, date: event.target.value })}
              className="flex-1 rounded-md border border-ds-border bg-ds-surface-elevated px-ds-m py-ds-s text-ds-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring/20"
            />
            <input
              type="time"
              value={entry.time}
              onChange={(event) => setEntry({ ...entry, time: event.target.value })}
              className="w-32 rounded-md border border-ds-border bg-ds-surface-elevated px-ds-m py-ds-s text-ds-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring/20"
            />
          </div>
          <div className="flex justify-end">
            <Button variant="default" onClick={handleSubmitDatetime}>
              {t("form.confirm")}
            </Button>
          </div>
        </div>
      </InputShell>
    );
  }

  if (step.key === "confirm") {
    return (
      <InputShell>
        <CoachChatConfirmCard
          entry={entry}
          isSaving={isSaving}
          saveError={saveError}
          onBack={handleStepBack}
          onSubmit={handleSubmitConfirm}
        />
      </InputShell>
    );
  }

  return (
    <InputShell>
      <CoachChatFollowupInput
        step={step}
        inputChips={inputChips}
        inputEmotions={inputEmotions}
        inputSkippedMeal={inputSkippedMeal}
        inputText={inputText}
        setInputChips={setInputChips}
        setInputEmotions={setInputEmotions}
        setInputSkippedMeal={setInputSkippedMeal}
        setInputText={setInputText}
        onSkip={handleSkip}
        onSubmitBehavior={handleSubmitBehavior}
        onSubmitCompany={handleSubmitCompany}
        onSubmitDescription={handleSubmitDescription}
        onSubmitEmotions={handleSubmitEmotions}
        onSubmitFood={handleSubmitFood}
        onSubmitLocation={handleSubmitLocation}
        onSubmitSkippedMeal={handleSubmitSkippedMeal}
      />
    </InputShell>
  );
}
