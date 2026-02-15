import { Card } from "@repo/ui";

import type { WizardEntry } from "../index";
import { getCmsText } from "../utils/cms";
import {
  behaviorOptions,
  companyOptions,
  locationOptions,
} from "../utils/options";
import { EntryFormButton } from "../partials/EntryFormButton";

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

  const locationLabel = entry.location
    ? entry.location === "anders"
      ? entry.locationOther || t("locations.anders")
      : t(
          locationOptions.find((o) => o.value === entry.location)?.labelKey ??
            "locations.anders",
        )
    : "-";
  const companyLabel = entry.company
    ? entry.company === "anders"
      ? entry.companyOther || t("company.anders")
      : t(
          companyOptions.find((o) => o.value === entry.company)?.labelKey ??
            "company.anders",
        )
    : "-";
  const behaviorLabel =
    entry.behavior?.length > 0
      ? entry.behavior
          .map((value) =>
            value === "anders"
              ? entry.behaviorOther || t("behaviors.anders")
              : t(
                  behaviorOptions.find((o) => o.value === value)?.labelKey ??
                    "behaviors.anders",
                ),
          )
          .join(", ")
      : "-";

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
          <strong>{t("coach.location")}:</strong> {locationLabel}
        </li>
        <li>
          <strong>{t("coach.company")}:</strong> {companyLabel}
        </li>
        <li>
          <strong>{t("coach.foodEaten")}:</strong> {entry.foodEaten || "-"}
        </li>
        <li>
          <strong>{t("coach.behavior")}:</strong> {behaviorLabel}
        </li>
      </ul>
      {saveError ? <p className="text-sm text-ds-danger">{saveError}</p> : null}
      <div className="mt-ds-m flex justify-end gap-ds-s">
        <EntryFormButton variant="outline" onClick={onBack}>
          {t("form.edit")}
        </EntryFormButton>
        <EntryFormButton onClick={onSubmit} disabled={isSaving}>
          {isSaving ? t("saving") : t("form.submit")}
        </EntryFormButton>
      </div>
    </Card>
  );
}
