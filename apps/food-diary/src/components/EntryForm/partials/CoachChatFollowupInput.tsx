import { Button, ChipSelector, EmotionPicker, TextArea } from "@repo/ui";

import { getCmsText } from "../utils/cms";
import { behaviorOptions, companyOptions, locationOptions } from "../utils/options";
import type { WizardStep } from "../utils/steps";
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
  return options.map((option) => ({
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
    <button
      type="button"
      onClick={onSkip}
      className="mb-ds-s flex items-center gap-ds-xs text-sm text-ds-on-surface-secondary hover:text-ds-interactive"
    >
      {label}
    </button>
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
      {step.optional ? (
        <SkipButton label={t("form.skip")} onSkip={onSkip} />
      ) : null}
      {step.key === "skippedMeal" ? (
        <div className="flex items-center gap-ds-s">
          <Button
            variant={inputSkippedMeal === false ? "default" : "outline"}
            onClick={() => setInputSkippedMeal(false)}
          >
            {t("form.no")}
          </Button>
          <Button
            variant={inputSkippedMeal === true ? "default" : "outline"}
            onClick={() => setInputSkippedMeal(true)}
          >
            {t("form.yes")}
          </Button>
          <div className="flex-1" />
          <Button
            variant="default"
            onClick={onSubmitSkippedMeal}
            disabled={inputSkippedMeal == null}
          >
            {t("form.confirm")}
          </Button>
        </div>
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
                onChange={(e) => setInputOtherText(e.target.value)}
                placeholder={t("placeholders.other")}
                className="min-h-[80px] w-full rounded-md border border-ds-border bg-ds-surface px-ds-m py-ds-s text-ds-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring/20"
              />
            </div>
          ) : null}
          <div className="mt-ds-m flex justify-end">
            <Button
              variant="default"
              onClick={onSubmitLocation}
              disabled={
                inputChips.length === 0 ||
                (inputChips[0] === "anders" && !inputOtherText.trim())
              }
            >
              {t("form.confirm")}
            </Button>
          </div>
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
                onChange={(e) => setInputOtherText(e.target.value)}
                placeholder={t("placeholders.other")}
                className="min-h-[80px] w-full rounded-md border border-ds-border bg-ds-surface px-ds-m py-ds-s text-ds-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring/20"
              />
            </div>
          ) : null}
          <div className="mt-ds-m flex justify-end">
            <Button
              variant="default"
              onClick={onSubmitCompany}
              disabled={
                inputChips.length === 0 ||
                (inputChips[0] === "anders" && !inputOtherText.trim())
              }
            >
              {t("form.confirm")}
            </Button>
          </div>
        </>
      ) : null}
      {step.key === "foodEaten" ? (
        <CoachChatTextInput
          cms={cms}
          value={inputText}
          onChange={setInputText}
          onSubmit={onSubmitFood}
          placeholderKey="placeholders.foodEaten"
          helperTextKey="placeholders.foodEatenAi"
          isDisabled={!inputText.trim()}
        />
      ) : null}
      {step.key === "emotions" ? (
        <>
          <EmotionPicker
            selectedKeys={inputEmotions}
            onSelectedKeysChange={setInputEmotions}
            getLabel={(key) => t(`emotions.${key}`)}
          />
          <div className="mt-ds-m flex justify-end">
            <Button
              variant="default"
              onClick={onSubmitEmotions}
              disabled={inputEmotions.length === 0}
            >
              {t("form.confirm")}
            </Button>
          </div>
        </>
      ) : null}
      {step.key === "description" ? (
        <CoachChatTextInput
          cms={cms}
          value={inputText}
          onChange={setInputText}
          onSubmit={onSubmitDescription}
          placeholderKey="placeholders.description"
          submitLabelKey={inputText.trim() ? "form.confirm" : "form.skip"}
        />
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
                onChange={(e) => setInputOtherText(e.target.value)}
                placeholder={t("placeholders.other")}
                className="min-h-[80px] w-full rounded-md border border-ds-border bg-ds-surface px-ds-m py-ds-s text-ds-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring/20"
              />
            </div>
          ) : null}
          <div className="mt-ds-m flex justify-end">
            <Button
              variant="default"
              onClick={onSubmitBehavior}
              disabled={
                inputChips.includes("anders") && !inputOtherText.trim()
              }
            >
              {t("form.confirm")}
            </Button>
          </div>
        </>
      ) : null}
    </>
  );
}
