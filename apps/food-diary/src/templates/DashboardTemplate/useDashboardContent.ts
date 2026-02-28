import { useEffect, useMemo, useState } from "react";

import { deleteDiaryEntry } from "@/app/actions";
import type { ClientDiaryEntry as DiaryEntry } from "@/app/actions";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "@/i18n/navigation";
import { mapFirestoreDiaryEntryToClient } from "@/lib/diaryEntries";
import { getDiaryEntriesByUser } from "@/lib/firestore/helpers";

import {
  canNavigateForward,
  fromDateKey,
  getMonthGridDates,
  getWeekDates,
  isFutureDay,
  toDateKey,
  navigatePeriod,
} from "./utils/dateUtils";
import { sortEntriesByTime } from "./utils/entryDisplayUtils";

import type { DashboardViewMode } from "./index";

export interface UseDashboardContentResult {
  canNavigateNext: boolean;
  dayEntries: DiaryEntry[];
  entriesByDate: Record<string, DiaryEntry[]>;
  hasDeleteError: boolean;
  hasLoadError: boolean;
  isBookmarked: (entryId: string) => boolean;
  isDeleting: (entryId: string) => boolean;
  isExpanded: (entryId: string) => boolean;
  isLoading: boolean;
  isUnauthenticated: boolean;
  onDeleteEntry: (entryId: string) => void;
  monthGridDates: ReturnType<typeof getMonthGridDates>;
  onEditEntry: (entryId: string) => void;
  onGoToToday: () => void;
  onNavigateNext: () => void;
  onNavigatePrevious: () => void;
  onSelectDate: (date: Date) => void;
  onSelectViewMode: (viewMode: DashboardViewMode) => void;
  onToggleBookmark: (entryId: string) => void;
  onToggleExpanded: (entryId: string) => void;
  selectedDate: Date;
  today: Date;
  viewMode: DashboardViewMode;
  weekDates: Date[];
}

function getToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function mapEntriesByDate(entries: DiaryEntry[]): Record<string, DiaryEntry[]> {
  const groupedEntries: Record<string, DiaryEntry[]> = {};

  for (const entry of entries) {
    const parsedDate = fromDateKey(entry.date);

    if (!parsedDate) {
      continue;
    }

    const dateKey = toDateKey(parsedDate);
    const previous = groupedEntries[dateKey] ?? [];

    groupedEntries[dateKey] = [...previous, entry];
  }

  for (const dateKey of Object.keys(groupedEntries)) {
    groupedEntries[dateKey] = sortEntriesByTime(groupedEntries[dateKey] ?? []);
  }

  return groupedEntries;
}

export function useDashboardContent(): UseDashboardContentResult {
  const router = useRouter();
  const { loading, user } = useAuth();
  const userId = user?.uid;

  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [entriesLoading, setEntriesLoading] = useState(false);
  const [hasDeleteError, setHasDeleteError] = useState(false);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [viewMode, setViewMode] = useState<DashboardViewMode>("day");
  const [selectedDate, setSelectedDate] = useState<Date>(getToday);
  const [expandedState, setExpandedState] = useState<Record<string, boolean>>({});
  const [bookmarkState, setBookmarkState] = useState<Record<string, boolean>>({});
  const [deletingState, setDeletingState] = useState<Record<string, boolean>>({});

  const today = useMemo(() => getToday(), []);

  useEffect(() => {
    let isCancelled = false;

    async function loadEntries(): Promise<void> {
      if (!userId) {
        setEntries([]);
        setEntriesLoading(false);
        setHasDeleteError(false);
        setHasLoadError(false);
        return;
      }

      setEntriesLoading(true);
      setHasDeleteError(false);
      setHasLoadError(false);

      try {
        const firestoreEntries = await getDiaryEntriesByUser(userId);
        const nextEntries = firestoreEntries.map(mapFirestoreDiaryEntryToClient);

        if (!isCancelled) {
          setEntries(nextEntries);
        }
      } catch {
        if (!isCancelled) {
          setHasLoadError(true);
          setEntries([]);
        }
      } finally {
        if (!isCancelled) {
          setEntriesLoading(false);
        }
      }
    }

    void loadEntries();

    return () => {
      isCancelled = true;
    };
  }, [userId]);

  useEffect(() => {
    setBookmarkState(previousState => {
      const nextState: Record<string, boolean> = {};

      for (const entry of entries) {
        nextState[entry.id] = previousState[entry.id] ?? entry.isBookmarked;
      }

      return nextState;
    });
  }, [entries]);

  const entriesByDate = mapEntriesByDate(entries);
  const dayEntries = entriesByDate[toDateKey(selectedDate)] ?? [];
  const weekDates = getWeekDates(selectedDate);
  const monthGridDates = getMonthGridDates(selectedDate);
  const canNavigateNext = canNavigateForward(viewMode, selectedDate, today);

  function handleNavigatePrevious(): void {
    setSelectedDate(previousDate => navigatePeriod(viewMode, previousDate, "prev"));
  }

  function handleNavigateNext(): void {
    if (!canNavigateNext) {
      return;
    }
    setSelectedDate(previousDate => navigatePeriod(viewMode, previousDate, "next"));
  }

  function handleGoToToday(): void {
    setSelectedDate(today);
  }

  function handleSelectViewMode(nextMode: DashboardViewMode): void {
    setViewMode(nextMode);
  }

  function handleSelectDate(date: Date): void {
    if (isFutureDay(date, today)) {
      return;
    }
    setSelectedDate(date);
    setViewMode("day");
  }

  function handleToggleExpanded(entryId: string): void {
    setExpandedState(previousState => ({
      ...previousState,
      [entryId]: !previousState[entryId],
    }));
  }

  function handleToggleBookmark(entryId: string): void {
    setBookmarkState(previousState => ({
      ...previousState,
      [entryId]: !previousState[entryId],
    }));
  }

  function handleDeleteEntry(entryId: string): void {
    if (!userId) {
      return;
    }

    setDeletingState(previousState => ({
      ...previousState,
      [entryId]: true,
    }));
    setHasDeleteError(false);

    void (async () => {
      try {
        const result = await deleteDiaryEntry(userId, entryId);

        if (!result.success) {
          setHasDeleteError(true);
          return;
        }

        setEntries(previousEntries => previousEntries.filter(entry => entry.id !== entryId));

        setExpandedState(previousState => {
          const nextState = { ...previousState };
          delete nextState[entryId];
          return nextState;
        });
        setBookmarkState(previousState => {
          const nextState = { ...previousState };
          delete nextState[entryId];
          return nextState;
        });
      } catch {
        setHasDeleteError(true);
      } finally {
        setDeletingState(previousState => {
          const nextState = { ...previousState };
          delete nextState[entryId];
          return nextState;
        });
      }
    })();
  }

  function handleEditEntry(entryId: string): void {
    const params = new URLSearchParams({
      entryId,
      from: "dashboard",
      mode: "form",
    });
    router.push(`/entry/create?${params.toString()}`);
  }

  function isExpanded(entryId: string): boolean {
    return Boolean(expandedState[entryId]);
  }

  function isBookmarked(entryId: string): boolean {
    return Boolean(bookmarkState[entryId]);
  }

  function isDeleting(entryId: string): boolean {
    return Boolean(deletingState[entryId]);
  }

  return {
    canNavigateNext,
    dayEntries,
    entriesByDate,
    hasDeleteError,
    hasLoadError,
    isBookmarked,
    isDeleting,
    isExpanded,
    isLoading: loading || entriesLoading,
    isUnauthenticated: !loading && !user,
    monthGridDates,
    onDeleteEntry: handleDeleteEntry,
    onEditEntry: handleEditEntry,
    onGoToToday: handleGoToToday,
    onNavigateNext: handleNavigateNext,
    onNavigatePrevious: handleNavigatePrevious,
    onSelectDate: handleSelectDate,
    onSelectViewMode: handleSelectViewMode,
    onToggleBookmark: handleToggleBookmark,
    onToggleExpanded: handleToggleExpanded,
    selectedDate,
    today,
    viewMode,
    weekDates,
  };
}
