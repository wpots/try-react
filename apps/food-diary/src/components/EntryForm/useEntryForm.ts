import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import { signInAnonymously } from "@/lib/auth";
import { saveDiaryEntry } from "@/lib/diaryEntries";
import {
  getInitialEntryFormValues,
  getInitialSaveState,
  type EntryFormValues,
} from "./helpers";
import type { SaveState } from "./index";

export interface UseEntryFormResult {
  formValues: EntryFormValues;
  isSaving: boolean;
  onFieldChange: (field: keyof EntryFormValues, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  saveState: SaveState;
}

export function useEntryForm(): UseEntryFormResult {
  const t = useTranslations("createEntry");
  const { user } = useAuth();
  const [formValues, setFormValues] = useState<EntryFormValues>(
    getInitialEntryFormValues(),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>(getInitialSaveState());

  const handleFieldChange = (
    field: keyof EntryFormValues,
    value: string,
  ): void => {
    setFormValues((previousValues) => ({
      ...previousValues,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    setIsSaving(true);
    setSaveState(getInitialSaveState());

    try {
      const activeUser = user ?? (await signInAnonymously());

      await saveDiaryEntry({
        userId: activeUser.uid,
        foodEaten: formValues.foodEaten,
        description: formValues.description,
        date: formValues.date,
        time: formValues.time,
      });

      setSaveState({ success: true, error: null });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t("errors.saveFailed");
      setSaveState({ success: false, error: message });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    formValues,
    isSaving,
    onFieldChange: handleFieldChange,
    onSubmit: handleSubmit,
    saveState,
  };
}
