"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button, Card, ChipSelector, EmotionPicker, TextArea } from "@repo/ui";

import type { TraditionalFormProps } from "./index";
import { FormSection } from "./FormSection";
import {
  areEntryBehaviors,
  behaviorOptions,
  companyOptions,
  isEntryCompany,
  isEntryLocation,
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
  initialEntry,
  onSwitchToChat,
  onComplete,
}: TraditionalFormProps): React.JSX.Element {
  const t = useTranslations("createEntry");
  const [entry, setEntry] = useState(initialEntry);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!entry.foodEaten.trim()) {
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
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-ds-border-subtle bg-ds-surface/80 px-ds-l py-ds-m">
        <p className="font-ds-heading-sm text-ds-on-surface-strong">{t("title")}</p>
        <button
          type="button"
          onClick={onSwitchToChat}
          className="flex items-center gap-ds-xs text-sm font-medium text-ds-on-surface-secondary hover:text-ds-interactive"
        >
          {t("form.switchToChat")}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-ds-l py-ds-xl">
        <Card className="mx-auto max-w-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-ds-l">
            <FormSection label={t("coach.foodEaten")} required>
              <TextArea value={entry.foodEaten} onChange={(event) => setEntry({ ...entry, foodEaten: event.target.value })} placeholder={t("placeholders.foodEaten")} />
            </FormSection>

            <FormSection label={t("coach.datetime")}>
              <div className="flex gap-ds-s">
                <input
                  type="date"
                  value={entry.date}
                  onChange={(event) => setEntry({ ...entry, date: event.target.value })}
                  className="flex-1 rounded-md border border-ds-border bg-ds-surface px-ds-m py-ds-s text-ds-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring/20"
                />
                <input
                  type="time"
                  value={entry.time}
                  onChange={(event) => setEntry({ ...entry, time: event.target.value })}
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
                  setEntry({ ...entry, location });
                }}
                selectionMode="single"
              />
            </FormSection>

            <FormSection label={t("coach.company")}>
              <ChipSelector
                options={toOptions(companyOptions, t)}
                selectedValues={entry.company ? [entry.company] : []}
                onSelectedValuesChange={(values) => {
                  const selected = values[0];
                  const company =
                    selected && isEntryCompany(selected) ? selected : null;
                  setEntry({ ...entry, company });
                }}
                selectionMode="single"
              />
            </FormSection>

            <FormSection label={t("coach.emotions")}>
              <EmotionPicker
                selectedKeys={entry.emotions}
                onSelectedKeysChange={(keys) => setEntry({ ...entry, emotions: keys })}
              />
            </FormSection>

            <FormSection label={t("coach.description")} optional>
              <TextArea value={entry.description} onChange={(event) => setEntry({ ...entry, description: event.target.value })} placeholder={t("placeholders.description")} />
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
                  setEntry({ ...entry, behavior });
                }}
                selectionMode="multiple"
                variant="gentle"
              />
            </FormSection>

            <div className="flex justify-end">
              <Button type="submit" variant="default">
                {t("form.submit")}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
