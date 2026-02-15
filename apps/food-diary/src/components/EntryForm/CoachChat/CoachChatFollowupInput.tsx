import { useTranslations } from "next-intl";

import { ChipSelector, EmotionPicker, TextArea } from "@repo/ui";

import { EntryFormButton } from "../partials/EntryFormButton";
import { behaviorOptions, companyOptions, locationOptions } from "../utils/options";
import type { WizardStep } from "../utils/steps";
import { CoachChatActions } from "./CoachChatActions";
import { CoachChatTextInput } from "./CoachChatTextInput";

interface CoachChatFollowupInputProps {
  step: WizardStep;
  inputChips: string[];
  inputEmotions: string[];
  inputSkippedMeal: boolean | null;
  inputOtherText: string;
  inputText: string;
  setInputChips: (value: string[]) => void;
  setInputEmotions: (value: string[]) => void;
  setInputSkippedMeal: (value: boolean | null) => void;
  setInputOtherText: (value: string) => void;
  setInputText: (value: string) => void;
  onSkip: () => void;
  onStepBack: () => void;
  onSubmitBehavior: () => void;
  onSubmitCompany: () => void;
  onSubmitDescription: () => void;
  onSubmitEmotions: () => void;
  onSubmitFood: () => void;
  onSubmitLocation: () => void;
  onSubmitSkippedMeal: () => void;
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

interface SkipButtonProps {
  label: string;
  onSkip: () => void;
}

function SkipButton({ label, onSkip }: SkipButtonProps): React.JSX.Element {
  return (
    <EntryFormButton variant="link" onClick={onSkip}>
      {label}
    </EntryFormButton>
  );
}

export function CoachChatFollowupInput({
  step,
  inputChips,
  inputEmotions,
  inputSkippedMeal,
  inputOtherText,
  inputText,
  setInputChips,
  setInputEmotions,
  setInputSkippedMeal,
  setInputOtherText,
  setInputText,
  onSkip,
  onStepBack,
  onSubmitBehavior,
  onSubmitCompany,
  onSubmitDescription,
  onSubmitEmotions,
  onSubmitFood,
  onSubmitLocation,
  onSubmitSkippedMeal,
}: CoachChatFollowupInputProps): React.JSX.Element | null {
  const t = useTranslations("entry");

  const skipAction = step.optional ? (
    <SkipButton label={t("form.skip")} onSkip={onSkip} />
  ) : null;

  if (step.key === "skippedMeal") {
    return (
      <>
        <div className="flex items-center gap-ds-s">
          <EntryFormButton
            variant={inputSkippedMeal === false ? "default" : "outline"}
            onClick={() => setInputSkippedMeal(false)}
          >
            {t("form.no")}
          </EntryFormButton>
          <EntryFormButton
            variant={inputSkippedMeal === true ? "default" : "outline"}
            onClick={() => setInputSkippedMeal(true)}
          >
            {t("form.yes")}
          </EntryFormButton>
        </div>
        <CoachChatActions
          onBack={onStepBack}
          onConfirm={onSubmitSkippedMeal}
          confirmDisabled={inputSkippedMeal == null}
        >
          {skipAction}
        </CoachChatActions>
      </>
    );
  }

  if (step.key === "location") {
    const isOtherSelected = inputChips[0] === "anders";
    const isConfirmDisabled =
      inputChips.length === 0 ||
      (isOtherSelected && !inputOtherText.trim());

    return (
      <>
        <ChipSelector
          options={toOptions(locationOptions, t)}
          selectedValues={inputChips}
          onSelectedValuesChange={setInputChips}
          selectionMode="single"
        />
        {isOtherSelected ? (
          <div className="mt-ds-s">
            <TextArea
              value={inputOtherText}
              onChange={(event) => setInputOtherText(event.target.value)}
              placeholder={t("placeholders.other")}
              className="min-h-[80px] w-full rounded-md border border-ds-border bg-ds-surface px-ds-m py-ds-s text-ds-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring/20"
            />
          </div>
        ) : null}
        <CoachChatActions
          onBack={onStepBack}
          onConfirm={onSubmitLocation}
          confirmDisabled={isConfirmDisabled}
        >
          {skipAction}
        </CoachChatActions>
      </>
    );
  }

  if (step.key === "company") {
    const isOtherSelected = inputChips[0] === "anders";
    const isConfirmDisabled =
      inputChips.length === 0 ||
      (isOtherSelected && !inputOtherText.trim());

    return (
      <>
        <ChipSelector
          options={toOptions(companyOptions, t)}
          selectedValues={inputChips}
          onSelectedValuesChange={setInputChips}
          selectionMode="single"
        />
        {isOtherSelected ? (
          <div className="mt-ds-s">
            <TextArea
              value={inputOtherText}
              onChange={(event) => setInputOtherText(event.target.value)}
              placeholder={t("placeholders.other")}
              className="min-h-[80px] w-full rounded-md border border-ds-border bg-ds-surface px-ds-m py-ds-s text-ds-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring/20"
            />
          </div>
        ) : null}
        <CoachChatActions
          onBack={onStepBack}
          onConfirm={onSubmitCompany}
          confirmDisabled={isConfirmDisabled}
        >
          {skipAction}
        </CoachChatActions>
      </>
    );
  }

  if (step.key === "foodEaten") {
    return (
      <>
        <CoachChatTextInput
          value={inputText}
          onChange={setInputText}
          placeholderKey="placeholders.foodEaten"
          helperTextKey="placeholders.foodEatenAi"
        />
        <CoachChatActions
          onBack={onStepBack}
          onConfirm={onSubmitFood}
          confirmDisabled={!inputText.trim()}
        >
          {skipAction}
        </CoachChatActions>
      </>
    );
  }

  if (step.key === "emotions") {
    return (
      <>
        <EmotionPicker
          selectedKeys={inputEmotions}
          onSelectedKeysChange={setInputEmotions}
          getLabel={(key) => t(`emotions.${key}`)}
        />
        <CoachChatActions
          onBack={onStepBack}
          onConfirm={onSubmitEmotions}
          confirmDisabled={inputEmotions.length === 0}
        >
          {skipAction}
        </CoachChatActions>
      </>
    );
  }

  if (step.key === "description") {
    return (
      <>
        <CoachChatTextInput
          value={inputText}
          onChange={setInputText}
          placeholderKey="placeholders.description"
        />
        <CoachChatActions
          onBack={onStepBack}
          onConfirm={onSubmitDescription}
          confirmDisabled={!inputText.trim()}
        >
          {skipAction}
        </CoachChatActions>
      </>
    );
  }

  if (step.key === "behavior") {
    const isConfirmDisabled =
      inputChips.includes("anders") && !inputOtherText.trim();

    return (
      <>
        <ChipSelector
          options={toOptions(behaviorOptions, t)}
          selectedValues={inputChips}
          onSelectedValuesChange={setInputChips}
          selectionMode="multiple"
        />
        {inputChips.includes("anders") ? (
          <div className="mt-ds-s">
            <TextArea
              value={inputOtherText}
              onChange={(event) => setInputOtherText(event.target.value)}
              placeholder={t("placeholders.other")}
              className="min-h-[80px] w-full rounded-md border border-ds-border bg-ds-surface px-ds-m py-ds-s text-ds-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring/20"
            />
          </div>
        ) : null}
        <CoachChatActions
          onBack={onStepBack}
          onConfirm={onSubmitBehavior}
          confirmDisabled={isConfirmDisabled}
        >
          {skipAction}
        </CoachChatActions>
      </>
    );
  }

  return null;
}
