import { useTranslations } from "next-intl";

import { Button, Card } from "@repo/ui";

import type { WizardEntry } from "../index";

interface CoachChatConfirmCardProps {
  entry: WizardEntry;
  isSaving: boolean;
  saveError: string | null;
  onBack: () => void;
  onSubmit: () => void;
}

export function CoachChatConfirmCard({
  entry,
  isSaving,
  saveError,
  onBack,
  onSubmit,
}: CoachChatConfirmCardProps): React.JSX.Element {
  const t = useTranslations("createEntry");

  return (
    <Card className="space-y-ds-s">
      <p className="text-sm text-ds-on-surface-secondary">{t("coach.confirm")}</p>
      <ul className="space-y-ds-xs text-sm">
        <li>
          <strong>{t("fields.type")}:</strong>{" "}
          {entry.entryType ? t(`entryTypes.${entry.entryType}`) : "-"}
        </li>
        <li>
          <strong>{t("fields.datetime")}:</strong> {entry.date} {entry.time}
        </li>
        <li>
          <strong>{t("coach.location")}:</strong>{" "}
          {entry.location ? t(`locations.${entry.location}`) : "-"}
        </li>
        <li>
          <strong>{t("coach.company")}:</strong>{" "}
          {entry.company ? t(`company.${entry.company}`) : "-"}
        </li>
        <li>
          <strong>{t("coach.foodEaten")}:</strong> {entry.foodEaten || "-"}
        </li>
      </ul>
      {saveError ? <p className="text-sm text-ds-danger">{saveError}</p> : null}
      <div className="mt-ds-m flex justify-end gap-ds-s">
        <Button variant="outline" size="sm" onPress={onBack}>
          {t("form.edit")}
        </Button>
        <Button variant="solid" size="sm" onPress={onSubmit} isDisabled={isSaving}>
          {isSaving ? t("saving") : t("form.submit")}
        </Button>
      </div>
    </Card>
  );
}
