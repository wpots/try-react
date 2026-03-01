"use client";

import {
  Typography,
  ChipSelector,
  DateInput,
  EmotionPicker,
  Select,
  TextArea,
  TimeInput,
  ToggleButtonGroup,
} from "@repo/ui";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { FormButton } from "@/components/FormButton";

import { FormSection } from "./FormSection";
import { EntryFormButton } from "../partials/EntryFormButton";
import {
  areEntryBehaviors,
  behaviorOptions,
  companyOptions,
  entryTypeOptions,
  isEntryCompany,
  isEntryLocation,
  isEntryType,
  locationOptions,
} from "../utils/options";

import type { TraditionalFormProps } from "../index";

function toOptions(
  options: { value: string; labelKey: string }[],
  translate: (key: string) => string,
): { value: string; label: string }[] {
  return options.map(option => ({
    value: option.value,
    label: translate(option.labelKey),
  }));
}

export function TraditionalForm({
  canDelete = false,
  deleteError,
  initialEntry,
  isDeleting = false,
  onComplete,
  onDelete,
  onEntryChange,
}: TraditionalFormProps): React.JSX.Element {
  const t = useTranslations("entry");
  const [entry, setEntry] = useState(initialEntry);
  const [submitted, setSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setEntry(initialEntry);
  }, [initialEntry]);

  useEffect(() => {
    if (!onEntryChange) {
      return;
    }

    onEntryChange(entry);
  }, [entry, onEntryChange]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const errors: Record<string, string> = {};

    if (!entry.entryType) {
      errors.entryType = t("errors.validationEntryType");
    }
    const hasSkippedMealBehavior = entry.behavior.includes("skipped meal");
    const needsFoodEaten = entry.entryType !== "moment" && !hasSkippedMealBehavior;
    if (needsFoodEaten && !entry.foodEaten.trim()) {
      errors.foodEaten = t("errors.validationFoodEaten");
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    onComplete(entry);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-ds-l">
        <div className="text-center">
          <div className="mx-auto mb-ds-m flex h-14 w-14 items-center justify-center rounded-ds-full bg-ds-success/20">
            <span className="text-2xl" aria-hidden="true">
              ✓
            </span>
          </div>
          <p className="font-ds-heading-md text-ds-on-surface-strong">{t("form.complete")}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-ds-l pt-ds-xl">
      <FormSection label={t("form.entryType")} required>
        <ChipSelector
          options={toOptions(entryTypeOptions, t)}
          selectedValues={entry.entryType ? [entry.entryType] : []}
          onSelectedValuesChange={values => {
            const selected = values[0];
            const entryType = selected && isEntryType(selected) ? selected : null;
            setEntry({ ...entry, entryType });
            if (validationErrors.entryType) {
              setValidationErrors(prev => ({ ...prev, entryType: "" }));
            }
          }}
          selectionMode="single"
        />
        {validationErrors.entryType ? (
          <p className="text-sm text-ds-danger" role="alert">{validationErrors.entryType}</p>
        ) : null}
      </FormSection>

      {entry.entryType !== "moment" && !entry.behavior.includes("skipped meal") ? (
        <FormSection label={t("form.foodEaten")} required>
          <TextArea
            value={entry.foodEaten}
            onChange={value => {
              setEntry({ ...entry, foodEaten: value });
              if (validationErrors.foodEaten) {
                setValidationErrors(prev => ({ ...prev, foodEaten: "" }));
              }
            }}
            placeholder={t("placeholders.foodEaten")}
            aria-label={t("form.foodEaten")}
          />
          {validationErrors.foodEaten ? (
            <p className="text-sm text-ds-danger" role="alert">{validationErrors.foodEaten}</p>
          ) : null}
        </FormSection>
      ) : null}

      <FormSection label={t("form.datetime")}>
        <div className="flex gap-ds-s">
          <DateInput
            value={entry.date}
            onChange={value => setEntry({ ...entry, date: value })}
            aria-label={t("form.datetime")}
          />
          <TimeInput
            value={entry.time}
            onChange={value => setEntry({ ...entry, time: value })}
            aria-label={t("form.datetime")}
          />
        </div>
      </FormSection>

      <FormSection label={t("form.location")}>
        <div className="grid gap-ds-s md:grid-cols-2">
          <div className="flex flex-col gap-ds-s">
            <Select
              placeholder={t("placeholders.location")}
              options={toOptions(locationOptions, t)}
              selectedKey={entry.location ?? null}
              onSelectedKeyChange={key => {
                const selected = key ?? "";
                const location = selected && isEntryLocation(selected) ? selected : null;
                setEntry({
                  ...entry,
                  location,
                  locationOther: selected === "anders" ? entry.locationOther : undefined,
                });
              }}
              aria-label={t("coach.location")}
            />
            {entry.location === "anders" ? (
              <TextArea
                value={entry.locationOther ?? ""}
                onChange={value =>
                  setEntry({
                    ...entry,
                    locationOther: value,
                  })
                }
                placeholder={t("placeholders.other")}
                aria-label={t("coach.location")}
              />
            ) : null}
          </div>

          <div className="flex flex-col gap-ds-s">
            <Select
              placeholder={t("placeholders.company")}
              options={toOptions(companyOptions, t)}
              selectedKey={entry.company ?? null}
              onSelectedKeyChange={key => {
                const selected = key ?? "";
                const company = selected && isEntryCompany(selected) ? selected : null;
                setEntry({
                  ...entry,
                  company,
                  companyOther: selected === "anders" ? entry.companyOther : undefined,
                });
              }}
              aria-label={t("coach.company")}
            />
            {entry.company === "anders" ? (
              <TextArea
                value={entry.companyOther ?? ""}
                onChange={value =>
                  setEntry({
                    ...entry,
                    companyOther: value,
                  })
                }
                placeholder={t("placeholders.other")}
                aria-label={t("coach.company")}
              />
            ) : null}
          </div>
        </div>
      </FormSection>

      <FormSection label={t("form.emotions")}>
        <EmotionPicker
          selectedKeys={entry.emotions}
          onSelectedKeysChange={keys => setEntry({ ...entry, emotions: keys })}
          getLabel={key => t(`emotions.${key}`)}
        />
      </FormSection>

      <FormSection label={t("form.description")} optional>
        <TextArea
          value={entry.description}
          onChange={value => setEntry({ ...entry, description: value })}
          placeholder={t("placeholders.description")}
          aria-label={t("form.description")}
        />
      </FormSection>

      <FormSection label={t("form.behavior")} optional hint={t("hints.behavior")}>
        <ChipSelector
          options={toOptions(behaviorOptions, t)}
          selectedValues={entry.behavior}
          onSelectedValuesChange={values => {
            const behavior = areEntryBehaviors(values) ? values : [];
            setEntry({
              ...entry,
              behavior,
              behaviorOther: behavior.includes("anders") ? entry.behaviorOther : undefined,
            });
          }}
          selectionMode="multiple"
        />
        {entry.behavior.includes("anders") ? (
          <div className="mt-ds-s">
            <TextArea
              value={entry.behaviorOther ?? ""}
              onChange={value =>
                setEntry({
                  ...entry,
                  behaviorOther: value,
                })
              }
              placeholder={t("placeholders.other")}
              aria-label={t("form.behavior")}
            />
          </div>
        ) : null}
      </FormSection>

      <FormSection label={t("form.bookmark")}>
        <ToggleButtonGroup
          options={[
            { value: "yes", label: t("form.yes") },
            { value: "no", label: t("form.no") },
          ]}
          selectedValue={entry.isBookmarked ? "yes" : "no"}
          onSelectedValueChange={value => {
            setEntry({ ...entry, isBookmarked: value === "yes" });
          }}
          aria-label={t("form.bookmark")}
        />
      </FormSection>

      <div className="flex justify-end">
        <EntryFormButton type="submit">{t("form.submit")}</EntryFormButton>
      </div>

      {canDelete ? (
        <div className="flex justify-end pt-ds-xl border-t-1 border-ds-border-subtle">
          <FormButton
            className="h-auto px-0 py-0 text-ds-danger hover:bg-transparent hover:text-ds-danger"
            disabled={isDeleting}
            onClick={onDelete}
            type="button"
            variant="link"
          >
            {isDeleting ? t("form.deleting") : t("form.delete")}
          </FormButton>
        </div>
      ) : null}

      {deleteError ? (
        <Typography variant="body" size="sm" className="text-ds-danger">
          {deleteError}
        </Typography>
      ) : null}
    </form>
  );
}
