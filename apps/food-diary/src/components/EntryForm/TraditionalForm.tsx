"use client";

import { useState } from "react";

import { Card, ChipSelector, EmotionPicker, TextArea } from "@repo/ui";

import type { TraditionalFormProps } from "./index";
import { FormSection } from "./FormSection";
import { EntryFormButton } from "./partials/EntryFormButton";
import { getCmsText } from "./utils/cms";
import {
  areEntryBehaviors,
  behaviorOptions,
  companyOptions,
  entryTypeOptions,
  isEntryCompany,
  isEntryLocation,
  isEntryType,
  locationOptions,
} from "./utils/options";

function toOptions(
  options: { value: string; labelKey: string }[],
  translate: (key: string) => string,
): { value: string; label: string }[] {
  return options.map((option) => ({
    value: option.value,
    label: translate(option.labelKey),
  }));
}

export function TraditionalForm({
  cms,
  initialEntry,
  onComplete,
}: TraditionalFormProps): React.JSX.Element {
  const [entry, setEntry] = useState(initialEntry);
  const [submitted, setSubmitted] = useState(false);

  function t(key: string): string {
    return getCmsText(cms, key);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!entry.entryType) {
      return;
    }
    const needsFoodEaten = entry.entryType !== "moment";
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
            <span className="text-2xl" aria-hidden="true">✓</span>
          </div>
          <p className="font-ds-heading-md text-ds-on-surface-strong">
            {t("coach.complete")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-ds-l py-ds-xl">
      <Card className="mx-auto max-w-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-ds-l">
          <FormSection label={t("coach.entryType")} required>
            <ChipSelector
              options={toOptions(entryTypeOptions, t)}
              selectedValues={
                entry.entryType ? [entry.entryType] : []
              }
              onSelectedValuesChange={(values) => {
                const selected = values[0];
                const entryType =
                  selected && isEntryType(selected) ? selected : null;
                setEntry({ ...entry, entryType });
              }}
              selectionMode="single"
            />
          </FormSection>

          {entry.entryType !== "moment" && (
            <FormSection label={t("coach.foodEaten")} required>
              <TextArea
                value={entry.foodEaten}
                onChange={(event) =>
                  setEntry({ ...entry, foodEaten: event.target.value })
                }
                placeholder={t("placeholders.foodEaten")}
              />
            </FormSection>
          )}

          <FormSection label={t("coach.datetime")}>
            <div className="flex gap-ds-s">
              <input
                type="date"
                value={entry.date}
                onChange={(event) =>
                  setEntry({ ...entry, date: event.target.value })
                }
                className="flex-1 rounded-md border border-ds-border bg-ds-surface px-ds-m py-ds-s text-ds-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring/20"
              />
              <input
                type="time"
                value={entry.time}
                onChange={(event) =>
                  setEntry({ ...entry, time: event.target.value })
                }
                className="w-36 rounded-md border border-ds-border bg-ds-surface px-ds-m py-ds-s text-ds-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring/20"
              />
            </div>
          </FormSection>

          <FormSection label={t("coach.location")}>
            <ChipSelector
              options={toOptions(locationOptions, t)}
              selectedValues={entry.location ? [entry.location] : []}
              onSelectedValuesChange={(values) => {
                const selected = values[0];
                const location =
                  selected && isEntryLocation(selected) ? selected : null;
                setEntry({
                  ...entry,
                  location,
                  locationOther:
                    selected === "anders" ? entry.locationOther : undefined,
                });
              }}
              selectionMode="single"
            />
            {entry.location === "anders" ? (
              <div className="mt-ds-s">
                <TextArea
                  value={entry.locationOther ?? ""}
                  onChange={(event) =>
                    setEntry({
                      ...entry,
                      locationOther: event.target.value,
                    })
                  }
                  placeholder={t("placeholders.other")}
                />
              </div>
            ) : null}
          </FormSection>

          <FormSection label={t("coach.company")}>
            <ChipSelector
              options={toOptions(companyOptions, t)}
              selectedValues={entry.company ? [entry.company] : []}
              onSelectedValuesChange={(values) => {
                const selected = values[0];
                const company =
                  selected && isEntryCompany(selected) ? selected : null;
                setEntry({
                  ...entry,
                  company,
                  companyOther:
                    selected === "anders" ? entry.companyOther : undefined,
                });
              }}
              selectionMode="single"
            />
            {entry.company === "anders" ? (
              <div className="mt-ds-s">
                <TextArea
                  value={entry.companyOther ?? ""}
                  onChange={(event) =>
                    setEntry({
                      ...entry,
                      companyOther: event.target.value,
                    })
                  }
                  placeholder={t("placeholders.other")}
                />
              </div>
            ) : null}
          </FormSection>

          <FormSection label={t("coach.emotions")}>
            <EmotionPicker
              selectedKeys={entry.emotions}
              onSelectedKeysChange={(keys) =>
                setEntry({ ...entry, emotions: keys })
              }
              getLabel={(key) => t(`emotions.${key}`)}
            />
          </FormSection>

          <FormSection label={t("coach.description")} optional>
            <TextArea
              value={entry.description}
              onChange={(event) =>
                setEntry({ ...entry, description: event.target.value })
              }
              placeholder={t("placeholders.description")}
            />
          </FormSection>

          <FormSection
            label={t("coach.behavior")}
            optional
            hint={t("hints.behavior")}
          >
            <ChipSelector
              options={toOptions(behaviorOptions, t)}
              selectedValues={entry.behavior}
              onSelectedValuesChange={(values) => {
                const behavior = areEntryBehaviors(values) ? values : [];
                setEntry({
                  ...entry,
                  behavior,
                  behaviorOther: behavior.includes("anders")
                    ? entry.behaviorOther
                    : undefined,
                });
              }}
              selectionMode="multiple"
            />
            {entry.behavior.includes("anders") ? (
              <div className="mt-ds-s">
                <TextArea
                  value={entry.behaviorOther ?? ""}
                  onChange={(event) =>
                    setEntry({
                      ...entry,
                      behaviorOther: event.target.value,
                    })
                  }
                  placeholder={t("placeholders.other")}
                />
              </div>
            ) : null}
          </FormSection>

          <div className="flex justify-end">
            <EntryFormButton type="submit">
              {t("form.submit")}
            </EntryFormButton>
          </div>
        </form>
      </Card>
    </div>
  );
}
