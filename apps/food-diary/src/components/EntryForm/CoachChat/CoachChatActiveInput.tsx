import { ChipSelector, DateInput, TimeInput } from "@repo/ui";
import { useTranslations } from "next-intl";


import { CoachChatActions } from "./CoachChatActions";
import { CoachChatConfirmCard } from "./CoachChatConfirmCard";
import { CoachChatFollowupInput } from "./CoachChatFollowupInput";
import { EntryFormButton } from "../partials/EntryFormButton";
import { getDefaultEntryType } from "../utils/getDefaultEntryType";
import { entryTypeOptions } from "../utils/options";

import type { UseCoachChatControllerResult } from "../useCoachChatController";
import type { WizardStep } from "../utils/steps";

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
  return options.map(option => ({
    value: option.value,
    label: translate(option.labelKey),
  }));
}

function getCurrentStep(currentStepIndex: number, filteredSteps: WizardStep[]): WizardStep | undefined {
  return filteredSteps[currentStepIndex];
}

export function CoachChatActiveInput({
  controller,
}: CoachChatActiveInputProps): React.JSX.Element | null {
  const t = useTranslations("entry");

  const {
    completed,
    currentStepIndex,
    entry,
    filteredSteps,
    inputChips,
    inputEmotions,
    inputBookmarked,
    inputOtherText,
    inputText,
    isSaving,
    isTyping,
    mode,
    saveError,
    setEntry,
    setInputChips,
    setInputEmotions,
    setInputOtherText,
    setInputText,
    setInputBookmarked,
    handleSkip,
    handleStepBack,
    handleSubmitBehavior,
    handleSubmitBookmark,
    handleSubmitCompany,
    handleSubmitConfirm,
    handleSubmitDatetime,
    handleSubmitDescription,
    handleSubmitEmotions,
    handleSubmitEntryType,
    handleSubmitFood,
    handleSubmitLocation,
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
    const selected = inputChips.length > 0 ? inputChips : entry.entryType ? [entry.entryType] : [suggestedType];

    return (
      <InputShell>
        <ChipSelector
          options={toOptions(entryTypeOptions, t)}
          selectedValues={selected}
          onSelectedValuesChange={setInputChips}
          selectionMode="single"
        />
        <div className="mt-ds-m flex justify-end">
          <EntryFormButton onClick={handleSubmitEntryType}>{t("form.confirm")}</EntryFormButton>
        </div>
      </InputShell>
    );
  }

  if (step.key === "datetime") {
    return (
      <InputShell>
        <div className="flex flex-col gap-ds-s">
          <div className="flex gap-ds-s">
            <DateInput
              value={entry.date}
              onChange={date => setEntry({ ...entry, date })}
              containerClassName="flex-1"
              aria-label="Date"
            />
            <TimeInput
              value={entry.time ?? ""}
              onChange={time => setEntry({ ...entry, time })}
              containerClassName="w-32"
              aria-label="Time"
            />
          </div>
          <CoachChatActions
            onBack={handleStepBack}
            onConfirm={handleSubmitDatetime}
          />
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
        inputBookmarked={inputBookmarked}
        inputOtherText={inputOtherText}
        inputText={inputText}
        setInputChips={setInputChips}
        setInputEmotions={setInputEmotions}
        setInputBookmarked={setInputBookmarked}
        setInputOtherText={setInputOtherText}
        setInputText={setInputText}
        onSkip={handleSkip}
        onStepBack={handleStepBack}
        onSubmitBehavior={handleSubmitBehavior}
        onSubmitBookmark={handleSubmitBookmark}
        onSubmitCompany={handleSubmitCompany}
        onSubmitDescription={handleSubmitDescription}
        onSubmitEmotions={handleSubmitEmotions}
        onSubmitFood={handleSubmitFood}
        onSubmitLocation={handleSubmitLocation}
      />
    </InputShell>
  );
}
