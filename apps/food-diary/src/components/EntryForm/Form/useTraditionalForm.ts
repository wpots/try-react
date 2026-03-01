"use client";

import { useTranslations } from "next-intl";
import { type SubmitEvent, useEffect, useState } from "react";

import { areEntryBehaviors, isEntryCompany, isEntryLocation, isEntryType } from "../utils/options";
import { applyPrefill, validateEntry } from "../utils/validation";

import type { TraditionalFormProps } from "../index";

type UseTraditionalFormProps = Pick<TraditionalFormProps, "initialEntry" | "onComplete" | "onEntryChange">;

export function useTraditionalForm({ initialEntry, onComplete, onEntryChange }: UseTraditionalFormProps) {
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

  useEffect(() => {
    setValidationErrors({});
  }, [entry]);

  const handleEntryTypeChange = (values: string[]) => {
    const selected = values[0];
    const entryType = selected && isEntryType(selected) ? selected : null;
    setEntry({ ...entry, entryType });
  };

  const handleFoodEatenChange = (value: string) => {
    setEntry({ ...entry, foodEaten: value });
  };

  const handleLocationChange = (key: string | null) => {
    const location = key && isEntryLocation(key) ? key : null;
    setEntry({
      ...entry,
      location,
      locationOther: key === "anders" ? entry.locationOther : undefined,
    });
  };

  const handleCompanyChange = (key: string | null) => {
    const company = key && isEntryCompany(key) ? key : null;
    setEntry({
      ...entry,
      company,
      companyOther: key === "anders" ? entry.companyOther : undefined,
    });
  };

  const handleBehaviorChange = (values: string[]) => {
    const behavior = areEntryBehaviors(values) ? values : [];
    setEntry({
      ...entry,
      behavior,
      behaviorOther: behavior.includes("anders") ? entry.behaviorOther : undefined,
    });
  };

  const handleBookmarkChange = (value: string) => {
    setEntry({ ...entry, isBookmarked: value === "yes" });
  };

  const handlePrefill = (data: { foodName: string; mealType: string; description: string }): void => {
    setEntry(prev => applyPrefill(prev, data));
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = validateEntry(entry, t);

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    onComplete(entry);
    setSubmitted(true);
  };

  return {
    t,
    entry,
    setEntry,
    submitted,
    validationErrors,
    handleEntryTypeChange,
    handleFoodEatenChange,
    handleLocationChange,
    handleCompanyChange,
    handleBehaviorChange,
    handleBookmarkChange,
    handlePrefill,
    handleSubmit,
  };
}
