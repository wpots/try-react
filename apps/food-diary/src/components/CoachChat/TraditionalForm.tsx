"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button, Card, ChipSelector, EmotionPicker, TextArea } from "@repo/ui";

import { FormSection } from "./FormSection";
import type { WizardEntry } from "./types";

export interface TraditionalFormProps {
  initialEntry: WizardEntry;
  onSwitchToChat: () => void;
  onComplete: (entry: WizardEntry) => void;
}

export function TraditionalForm({
  initialEntry,
  onSwitchToChat,
  onComplete,
}: TraditionalFormProps): React.JSX.Element {
  const t = useTranslations("createEntry");
  const [entry, setEntry] = useState<WizardEntry>(initialEntry);
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
            <span className="text-2xl" aria-hidden="true">
              ✓
            </span>
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
        <p className="font-ds-heading-sm text-ds-on-surface-strong">
          {t("title")}
        </p>
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
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-ds-l"
          >
            <FormSection
              label={t("coach.foodEaten")}
              required
            >
              <TextArea
                value={entry.foodEaten}
                onChange={(event) =>
                  setEntry({ ...entry, foodEaten: event.target.value })
                }
                placeholder={t("placeholders.foodEaten")}
              />
            </FormSection>

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
                options={[
                  { value: "home", label: t("locations.home") },
                  { value: "work", label: t("locations.work") },
                  { value: "restaurant", label: t("locations.restaurant") },
                  { value: "friend's house", label: t("locations.friends") },
                  { value: "on the road", label: t("locations.onTheRoad") },
                  { value: "family event", label: t("locations.familyEvent") },
                ]}
                selectedValues={
                  entry.location ? [entry.location] : []
                }
                onSelectedValuesChange={(values) =>
                  setEntry({ ...entry, location: values[0] ?? null })
                }
                selectionMode="single"
              />
            </FormSection>

            <FormSection label={t("coach.company")}>
              <ChipSelector
                options={[
                  { value: "alone", label: t("company.alone") },
                  { value: "partner", label: t("company.partner") },
                  { value: "family", label: t("company.family") },
                  { value: "friends", label: t("company.friends") },
                  { value: "colleagues", label: t("company.colleagues") },
                  { value: "kids", label: t("company.kids") },
                ]}
                selectedValues={
                  entry.company ? [entry.company] : []
                }
                onSelectedValuesChange={(values) =>
                  setEntry({ ...entry, company: values[0] ?? null })
                }
                selectionMode="single"
              />
            </FormSection>

            <FormSection label={t("coach.emotions")}>
              <EmotionPicker
                selectedKeys={entry.emotions}
                onSelectedKeysChange={(keys) =>
                  setEntry({ ...entry, emotions: keys })
                }
              />
            </FormSection>

            <FormSection
              label={t("coach.description")}
              optional
            >
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
                options={[
                  {
                    value: "restricted",
                    label: t("behaviors.restricted"),
                  },
                  {
                    value: "binged",
                    label: t("behaviors.binged"),
                  },
                  {
                    value: "overate",
                    label: t("behaviors.overate"),
                  },
                  {
                    value: "threw up",
                    label: t("behaviors.threwUp"),
                  },
                ]}
                selectedValues={entry.behavior}
                onSelectedValuesChange={(values) =>
                  setEntry({ ...entry, behavior: values })
                }
                selectionMode="multiple"
                variant="gentle"
              />
            </FormSection>

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="solid"
              >
                {t("form.submit")}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

