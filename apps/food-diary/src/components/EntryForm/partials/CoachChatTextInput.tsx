import { Button, TextArea } from "@repo/ui";

import { getCmsText } from "../utils/cms";

interface CoachChatTextInputProps {
  cms: Record<string, unknown>;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholderKey: "placeholders.foodEaten" | "placeholders.description";
  submitLabelKey?: "form.confirm" | "form.skip";
  helperTextKey?: "placeholders.foodEatenAi";
  isDisabled?: boolean;
}

export function CoachChatTextInput({
  cms,
  value,
  onChange,
  onSubmit,
  placeholderKey,
  submitLabelKey = "form.confirm",
  helperTextKey,
  isDisabled,
}: CoachChatTextInputProps): React.JSX.Element {
  function t(key: string): string {
    return getCmsText(cms, key);
  }

  return (
    <>
      <TextArea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={t(placeholderKey)}
      />
      {helperTextKey ? (
        <p className="mt-ds-xs text-xs text-ds-on-surface-secondary">
          {t(helperTextKey)}
        </p>
      ) : null}
      <div className="mt-ds-m flex justify-end">
        <Button variant="default" onClick={onSubmit} disabled={isDisabled}>
          {t(submitLabelKey)}
        </Button>
      </div>
    </>
  );
}
