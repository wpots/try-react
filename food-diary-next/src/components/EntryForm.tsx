"use client";

import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useFormState } from "react-dom";
import { saveDiaryEntry } from "@/app/actions";
import Button from "@mui/material/Button";
import { ChangeEvent } from "react";

const EntryForm = () => {
  const [foodEaten, setFoodEaten] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [state, formAction] = useFormState(saveDiaryEntry, null);

  return (
    <Box component="form" action={formAction} noValidate sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="foodEaten"
        label="Food Eaten"
        name="foodEaten"
        value={foodEaten}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setFoodEaten(e.target.value)}
      />
      <TextField
        margin="normal"
        fullWidth
        id="description"
        label="Description"
        name="description"
        multiline
        rows={4}
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <TextField
        margin="normal"
        fullWidth
        id="date"
        label="Date"
        name="date"
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
      />
      <TextField
        margin="normal"
        fullWidth
        id="time"
        label="Time"
        name="time"
        type="text"
        value={time}
        onChange={e => setTime(e.target.value)}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Save Entry
      </Button>
      {state?.error && <p style={{ color: "red" }}>{state.error}</p>}
      {state?.success && <p style={{ color: "green" }}>Entry saved successfully!</p>}
    </Box>
  );
};

export default EntryForm;
