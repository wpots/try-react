"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button, Card, Form, Text, TextField } from "@repo/ui";
import { useAuth } from "@/contexts/AuthContext";
import { signInAnonymously } from "@/lib/auth";
import { saveDiaryEntry } from "@/lib/diaryEntries";
import type { SaveState } from "./index";

function EntryForm() {
  const t = useTranslations("createEntry");
  const { user } = useAuth();
  const [foodEaten, setFoodEaten] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>({
    success: false,
    error: null,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSaving(true);
    setSaveState({ success: false, error: null });

    try {
      const activeUser = user ?? (await signInAnonymously());

      await saveDiaryEntry({
        userId: activeUser.uid,
        foodEaten,
        description,
        date,
        time,
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

  return (
    <Card>
      <Form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        <TextField
          label={t("fields.foodEaten")}
          required
          id="foodEaten"
          name="foodEaten"
          value={foodEaten}
          onChange={setFoodEaten}
        />
        <TextField
          label={t("fields.description")}
          id="description"
          name="description"
          value={description}
          onChange={setDescription}
        />
        <TextField
          label={t("fields.date")}
          id="date"
          name="date"
          type="date"
          value={date}
          onChange={setDate}
        />
        <TextField
          label={t("fields.time")}
          id="time"
          type="time"
          value={time}
          onChange={setTime}
        />
        <Button type="submit" className="mt-2 w-full" disabled={isSaving}>
          {isSaving ? t("saving") : t("saveEntry")}
        </Button>
        {saveState.error ? <Text tone="danger">{saveState.error}</Text> : null}
        {saveState.success ? <Text>{t("saveSuccess")}</Text> : null}
      </Form>
    </Card>
  );
}

export default EntryForm;
