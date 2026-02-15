import { ChipSelector, EmotionPicker, TextArea } from "@repo/ui";

import { getCmsText } from "../utils/cms";
import { behaviorOptions, companyOptions, locationOptions } from "../utils/options";
import type { WizardStep } from "../utils/steps";
import { EntryFormButton } from "../partials/EntryFormButton";
import { CoachChatTextInput } from "./CoachChatTextInput";

interface CoachChatFollowupInputProps {
  cms: Record<string, unknown>;
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
    <EntryFormButton variant="link" onClick={onSkip} className="mt-ds-m">
      {label}
    </EntryFormButton>
  );
}

interface StepBackButtonProps {
  label: string;
  onStepBack: () => void;
}

function StepBackButton({ label, onStepBack }: StepBackButtonProps): React.JSX.Element {
  return (
    <EntryFormButton variant="link" onClick={onStepBack}>
      {label}
    </EntryFormButton>
  );
}

export function CoachChatFollowupInput({
  cms,
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
}: CoachChatFollowupInputProps): React.JSX.Element {
  function t(key: string): string {
    return getCmsText(cms, key);
  }

  return (
    <>
      {step.key === "skippedMeal" ? (
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
          <div className="mt-ds-m flex items-center justify-between">
            <StepBackButton label={t("form.back")} onStepBack={onStepBack} />
            <EntryFormButton onClick={onSubmitSkippedMeal} disabled={inputSkippedMeal == null}>
              {t("form.confirm")}
            </EntryFormButton>
          </div>
          {step.optional ? <SkipButton label={t("form.skip")} onSkip={onSkip} /> : null}
        </>
      ) : null}
      {step.key === "location" ? (
        <>
          <ChipSelector
            options={toOptions(locationOptions, t)}
            selectedValues={inputChips}
            onSelectedValuesChange={setInputChips}
            selectionMode="single"
          />
          {inputChips[0] === "anders" ? (
            <div className="mt-ds-s">
              <TextArea
                value={inputOtherText}
                onChange={e => setInputOtherText(e.target.value)}
                placeholder={t("placeholders.other")}
                className="min-h-[80px] w-full rounded-md border border-ds-border bg-ds-surface px-ds-m py-ds-s text-ds-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring/20"
              />
            </div>
          ) : null}
          <div className="mt-ds-m flex items-center justify-between">
            <StepBackButton label={t("form.back")} onStepBack={onStepBack} />
            <EntryFormButton
              onClick={onSubmitLocation}
              disabled={inputChips.length === 0 || (inputChips[0] === "anders" && !inputOtherText.trim())}
            >
              {t("form.confirm")}
            </EntryFormButton>
          </div>
          {step.optional ? <SkipButton label={t("form.skip")} onSkip={onSkip} /> : null}
        </>
      ) : null}
      {step.key === "company" ? (
        <>
          <ChipSelector
            options={toOptions(companyOptions, t)}
            selectedValues={inputChips}
            onSelectedValuesChange={setInputChips}
            selectionMode="single"
          />
          {inputChips[0] === "anders" ? (
            <div className="mt-ds-s">
              <TextArea
                value={inputOtherText}
                onChange={e => setInputOtherText(e.target.value)}
                placeholder={t("placeholders.other")}
                className="min-h-[80px] w-full rounded-md border border-ds-border bg-ds-surface px-ds-m py-ds-s text-ds-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring/20"
              />
            </div>
          ) : null}
          <div className="mt-ds-m flex items-center justify-between">
            <StepBackButton label={t("form.back")} onStepBack={onStepBack} />
            <EntryFormButton
              onClick={onSubmitCompany}
              disabled={inputChips.length === 0 || (inputChips[0] === "anders" && !inputOtherText.trim())}
            >
              {t("form.confirm")}
            </EntryFormButton>
          </div>
          {step.optional ? <SkipButton label={t("form.skip")} onSkip={onSkip} /> : null}
        </>
      ) : null}
      {step.key === "foodEaten" ? (
        <>
          <div className="mb-ds-s">
            <StepBackButton label={t("form.back")} onStepBack={onStepBack} />
          </div>
          <CoachChatTextInput
            cms={cms}
            value={inputText}
            onChange={setInputText}
            onSubmit={onSubmitFood}
            placeholderKey="placeholders.foodEaten"
            helperTextKey="placeholders.foodEatenAi"
            isDisabled={!inputText.trim()}
          />
          {step.optional ? <SkipButton label={t("form.skip")} onSkip={onSkip} /> : null}
        </>
      ) : null}
      {step.key === "emotions" ? (
        <>
          <EmotionPicker
            selectedKeys={inputEmotions}
            onSelectedKeysChange={setInputEmotions}
            getLabel={key => t(`emotions.${key}`)}
          />
          <div className="mt-ds-m flex items-center justify-between">
            <StepBackButton label={t("form.back")} onStepBack={onStepBack} />
            <EntryFormButton onClick={onSubmitEmotions} disabled={inputEmotions.length === 0}>
              {t("form.confirm")}
            </EntryFormButton>
          </div>
          {step.optional ? <SkipButton label={t("form.skip")} onSkip={onSkip} /> : null}
        </>
      ) : null}
      {step.key === "description" ? (
        <>
          <div className="mb-ds-s">
            <StepBackButton label={t("form.back")} onStepBack={onStepBack} />
          </div>
          <CoachChatTextInput
            cms={cms}
            value={inputText}
            onChange={setInputText}
            onSubmit={onSubmitDescription}
            placeholderKey="placeholders.description"
            submitLabelKey={inputText.trim() ? "form.confirm" : "form.skip"}
          />
          {step.optional ? <SkipButton label={t("form.skip")} onSkip={onSkip} /> : null}
        </>
      ) : null}
      {step.key === "behavior" ? (
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
                onChange={e => setInputOtherText(e.target.value)}
                placeholder={t("placeholders.other")}
                className="min-h-[80px] w-full rounded-md border border-ds-border bg-ds-surface px-ds-m py-ds-s text-ds-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring/20"
              />
            </div>
          ) : null}
          <div className="mt-ds-m flex items-center justify-between">
            <StepBackButton label={t("form.back")} onStepBack={onStepBack} />
            <EntryFormButton
              onClick={onSubmitBehavior}
              disabled={inputChips.includes("anders") && !inputOtherText.trim()}
            >
              {t("form.confirm")}
            </EntryFormButton>
          </div>
          {step.optional ? <SkipButton label={t("form.skip")} onSkip={onSkip} /> : null}
        </>
      ) : null}
    </>
  );
}
