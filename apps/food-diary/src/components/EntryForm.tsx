"use client";

import React, { useState } from "react";
import { ChangeEvent } from "react";
import { Button, TextField } from "@repo/ui";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "@/i18n/navigation";
import { saveDiaryEntry } from "@/lib/diaryEntries";

interface SaveState {
  success: boolean;
  error: string | null;
}

const EntryForm = () => {
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

    if (!user) {
      setSaveState({ success: false, error: "User not authenticated" });
      return;
    }

    setIsSaving(true);
    setSaveState({ success: false, error: null });

    try {
      await saveDiaryEntry({
        userId: user.uid,
        foodEaten,
        description,
        date,
        time,
      });
      setSaveState({ success: true, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save entry";
      setSaveState({ success: false, error: message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-4 flex flex-col gap-4">
      <TextField
        label="Food Eaten"
        required
        id="foodEaten"
        name="foodEaten"
        value={foodEaten}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setFoodEaten(e.target.value)}
      />
      <TextField
        label="Description"
        id="description"
        name="description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <TextField
        label="Date"
        id="date"
        name="date"
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
      />
      <TextField
        label="Time"
        id="time"
        type="time"
        value={time}
        onChange={e => setTime(e.target.value)}
      />
      <Button type="submit" className="mt-2 w-full" disabled={!user || isSaving}>
        {isSaving ? "Saving..." : "Save Entry"}
      </Button>
      {!user ? (
        <p>
          Sign in first. <Link href="/auth/login">Go to login</Link>
        </p>
      ) : null}
      {saveState.error && <p style={{ color: "red" }}>{saveState.error}</p>}
      {saveState.success && <p style={{ color: "green" }}>Entry saved successfully!</p>}
    </form>
  );
};

export default EntryForm;
