"use client";

import React, { useState, useEffect } from "react";
import EntryCard from "./EntryCard";
import { fetchDiaryEntries, DiaryEntry } from "@/app/actions";
import { Typography, Box } from "@mui/material";

const EntryOverview = () => {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    const loadEntries = async () => {
      const entries = await fetchDiaryEntries();
      setDiaryEntries(entries);
    };

    loadEntries();
  }, []);

  // Group entries by date
  const groupedEntries = diaryEntries.reduce((acc: { [key: string]: DiaryEntry[] }, entry) => {
    const date = entry.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {});

  return (
    <div>
      <h2>Diary Entries Overview</h2>
      {Object.entries(groupedEntries).map(([date, entries]) => (
        <Box key={date} sx={{ mb: 2 }}>
          <Typography variant="h6" component="h3">
            {date}
          </Typography>
          {entries.map(entry => (
            <EntryCard
              key={entry.id}
              foodEaten={entry.foodEaten}
              description={entry.description}
              time={entry.time}
              entryType={entry.entryType}
            />
          ))}
        </Box>
      ))}
    </div>
  );
};

export default EntryOverview;
