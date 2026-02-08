"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { fetchDiaryEntries, type DiaryEntry } from "@/lib/diaryEntries";
import { OverviewCard } from "@repo/ui";
import { useAuth } from "@/contexts/AuthContext";

const EntryOverview = () => {
  const t = useTranslations("home");
  const { user } = useAuth();
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    const loadEntries = async () => {
      if (!user) {
        setDiaryEntries([]);
        return;
      }

      const entries = await fetchDiaryEntries(user.uid);
      setDiaryEntries(entries);
    };

    void loadEntries();
  }, [user]);

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
      <h2 className="text-2xl font-semibold">{t("entriesOverviewTitle")}</h2>
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
