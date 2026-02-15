import { useTranslations } from "next-intl";

import { TextArea } from "@repo/ui";

interface CoachChatTextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholderKey: "placeholders.foodEaten" | "placeholders.description";
  helperTextKey?: "placeholders.foodEatenAi";
}

export function CoachChatTextInput({
  value,
  onChange,
  placeholderKey,
  helperTextKey,
}: CoachChatTextInputProps): React.JSX.Element {
  const t = useTranslations("entry");

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
    </>
  );
}
