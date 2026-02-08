import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

const EntryForm = () => {
  const [foodEaten, setFoodEaten] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Form submitted:", { foodEaten, description, date, time }); // Basic submit handling
    // ... (Saving data to Firestore will be in the next user story)
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="foodEaten"
        label="Food Eaten"
        name="foodEaten"
        value={foodEaten}
        onChange={e => setFoodEaten(e.target.value)}
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
    </Box>
  );
};

export default EntryForm;
