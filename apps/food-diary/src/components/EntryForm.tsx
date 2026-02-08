"use client";

import React, { useState } from "react";
import { useFormState } from "react-dom";
import { saveDiaryEntry } from "@/app/actions";
import { ChangeEvent } from "react";
import { Button, TextField } from "@repo/ui";

const EntryForm = () => {
  const [foodEaten, setFoodEaten] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [state, formAction] = useFormState(saveDiaryEntry, null);

  return (
    <form action={formAction} noValidate className="mt-4 flex flex-col gap-4">
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
        name="time"
        type="time"
        value={time}
        onChange={e => setTime(e.target.value)}
      />
      <Button type="submit" className="mt-2 w-full">
        Save Entry
      </Button>
      {state?.error && <p style={{ color: "red" }}>{state.error}</p>}
      {state?.success && <p style={{ color: "green" }}>Entry saved successfully!</p>}
    </form>
  );
};

export default EntryForm;
