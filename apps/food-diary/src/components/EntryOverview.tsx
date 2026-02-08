"use client";

import React, { useState, useEffect } from "react";
import { fetchDiaryEntries, DiaryEntry } from "@/app/actions";
import { OverviewCard } from "@repo/ui";

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
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Diary Entries Overview</h2>
      {Object.entries(groupedEntries).map(([date, entries]) => (
        <section key={date} className="space-y-2">
          <h3 className="text-lg font-medium">{date}</h3>
          {entries.map(entry => (
            <OverviewCard
              key={entry.id}
              title={entry.foodEaten}
              subtitle={`${entry.entryType} - ${entry.time}`}
              description={entry.description}
            />
          ))}
        </section>
      ))}
    </div>
  );
};

export default EntryOverview;
