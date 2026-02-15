import { Button, Card } from "@repo/ui";

import type { WizardEntry } from "../index";
import { getCmsText } from "../utils/cms";

interface CoachChatConfirmCardProps {
  cms: Record<string, unknown>;
  entry: WizardEntry;
  isSaving: boolean;
  saveError: string | null;
  onBack: () => void;
  onSubmit: () => void;
}

export function CoachChatConfirmCard({
  cms,
  entry,
  isSaving,
  saveError,
  onBack,
  onSubmit,
}: CoachChatConfirmCardProps): React.JSX.Element {
  function t(key: string): string {
    return getCmsText(cms, key);
  }

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
        <Button variant="outline" size="sm" onClick={onBack}>
          {t("form.edit")}
        </Button>
        <Button variant="default" size="sm" onClick={onSubmit} disabled={isSaving}>
          {isSaving ? t("saving") : t("form.submit")}
        </Button>
      </div>
    </Card>
  );
}
