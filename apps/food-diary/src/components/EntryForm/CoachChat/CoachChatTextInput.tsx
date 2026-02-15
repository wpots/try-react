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
  const ariaLabel =
    placeholderKey === "placeholders.foodEaten"
      ? t("coach.foodEaten")
      : t("coach.description");

  return (
    <>
      <TextArea
        value={value}
        onChange={(valueOrEvent) =>
          onChange(
            typeof valueOrEvent === "string"
              ? valueOrEvent
              : (valueOrEvent?.target?.value ?? ""),
          )}
        placeholder={t(placeholderKey)}
        aria-label={ariaLabel}
      />
      {helperTextKey ? (
        <p className="mt-ds-xs text-xs text-ds-on-surface-secondary">
          {t(helperTextKey)}
        </p>
      ) : null}
    </>
  );
}
