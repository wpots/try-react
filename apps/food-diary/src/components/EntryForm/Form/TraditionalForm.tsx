"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import {
  Card,
  ChipSelector,
  DateInput,
  EmotionPicker,
  Select,
  Switch,
  TextArea,
  TimeInput,
  ToggleButtonGroup,
} from "@repo/ui";

import type { TraditionalFormProps } from "../index";
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
import { FormSection } from "./FormSection";

function toOptions(
  options: { value: string; labelKey: string }[],
  translate: (key: string) => string,
): { value: string; label: string }[] {
  return options.map(option => ({
    value: option.value,
    label: translate(option.labelKey),
  }));
}

export function TraditionalForm({ initialEntry, onComplete, onEntryChange }: TraditionalFormProps): React.JSX.Element {
  const t = useTranslations("entry");
  const [entry, setEntry] = useState(initialEntry);
  const [submitted, setSubmitted] = useState(false);

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
    if (!entry.entryType) {
      return;
    }
    const needsFoodEaten = entry.entryType !== "moment" && !(entry.skippedMeal ?? false);
    if (needsFoodEaten && !entry.foodEaten.trim()) {
      return;
    }

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
    <div className="flex-1 overflow-y-auto px-ds-l py-ds-xl">
      <Card className="mx-auto max-w-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-ds-l">
          <FormSection label={t("form.entryType")} required>
            <ChipSelector
              options={toOptions(entryTypeOptions, t)}
              selectedValues={entry.entryType ? [entry.entryType] : []}
              onSelectedValuesChange={values => {
                const selected = values[0];
                const entryType = selected && isEntryType(selected) ? selected : null;
                setEntry({ ...entry, entryType });
              }}
              selectionMode="single"
            />
          </FormSection>

          {(entry.entryType === "breakfast" || entry.entryType === "lunch" || entry.entryType === "dinner") && (
            <FormSection label={t("form.skippedMeal")}>
              <Switch
                isSelected={entry.skippedMeal ?? false}
                onChange={isSelected => setEntry({ ...entry, skippedMeal: isSelected })}
                aria-label={t("form.skippedMeal")}
              />
            </FormSection>
          )}

          {entry.entryType !== "moment" && !(entry.skippedMeal ?? false) && (
            <FormSection label={t("form.foodEaten")} required>
              <TextArea
                value={entry.foodEaten}
                onChange={value => setEntry({ ...entry, foodEaten: value })}
                placeholder={t("placeholders.foodEaten")}
                aria-label={t("form.foodEaten")}
              />
            </FormSection>
          )}

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

          <FormSection
            label={t("form.behavior")}
            optional
            hint={t("hints.behavior")}
          >
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
        </form>
      </Card>
    </div>
  );
}
