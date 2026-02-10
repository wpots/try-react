import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import { fetchDiaryEntries } from "@/lib/diaryEntries";
import type { EntryOverviewItem } from "./index";

export interface UseEntryOverviewResult {
  entries: EntryOverviewItem[];
  title: string;
}

export function useEntryOverview(): UseEntryOverviewResult {
  const t = useTranslations("home");
  const { user } = useAuth();
  const [entries, setEntries] = useState<EntryOverviewItem[]>([]);

  useEffect(() => {
    const loadEntries = async (): Promise<void> => {
      if (!user) {
        setEntries([]);
        return;
      }

      const fetchedEntries = await fetchDiaryEntries(user.uid);
      setEntries(fetchedEntries);
    };

    void loadEntries();
  }, [user]);

  return {
    entries,
    title: t("entriesOverviewTitle"),
  };
}
