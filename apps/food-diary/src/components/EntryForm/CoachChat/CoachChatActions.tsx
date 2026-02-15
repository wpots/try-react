import { useTranslations } from "next-intl";

import { EntryFormButton } from "../partials/EntryFormButton";

interface CoachChatActionsProps {
  onBack: () => void;
  onConfirm: () => void;
  children?: React.ReactNode;
  confirmDisabled?: boolean;
  confirmLabelKey?: "form.confirm" | "form.skip";
}

export function CoachChatActions({
  onBack,
  onConfirm,
  children,
  confirmDisabled,
  confirmLabelKey = "form.confirm",
}: CoachChatActionsProps): React.JSX.Element {
  const t = useTranslations("entry");

  return (
    <div className="mt-ds-m flex flex-wrap items-center justify-between gap-ds-s">
      {children}
      <div className="flex items-center gap-ds-s ml-auto">
        <EntryFormButton variant="outline" onClick={onBack}>
          {t("form.back")}
        </EntryFormButton>
        <EntryFormButton onClick={onConfirm} disabled={confirmDisabled}>
          {t(confirmLabelKey)}
        </EntryFormButton>
      </div>
    </div>
  );
}
