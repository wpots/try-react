import { useCallback, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "@/i18n/navigation";
import { deleteDiaryEntry, fetchDiaryEntries } from "@/app/actions";
import type { ClientDiaryEntry as DiaryEntry } from "@/app/actions";

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
  const [expandedState, setExpandedState] = useState<Record<string, boolean>>(
    {},
  );
  const [bookmarkState, setBookmarkState] = useState<Record<string, boolean>>(
    {},
  );
  const [deletingState, setDeletingState] = useState<Record<string, boolean>>(
    {},
  );

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
        const nextEntries = await fetchDiaryEntries(userId);

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
    setBookmarkState((previousState) => {
      const nextState: Record<string, boolean> = {};

      for (const entry of entries) {
        nextState[entry.id] = previousState[entry.id] ?? entry.isBookmarked;
      }

      return nextState;
    });
  }, [entries]);

  const entriesByDate = useMemo(() => mapEntriesByDate(entries), [entries]);

  const dayEntries = useMemo(() => {
    return entriesByDate[toDateKey(selectedDate)] ?? [];
  }, [entriesByDate, selectedDate]);

  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate]);

  const monthGridDates = useMemo(
    () => getMonthGridDates(selectedDate),
    [selectedDate],
  );

  const canNavigateNext = useMemo(() => {
    return canNavigateForward(viewMode, selectedDate, today);
  }, [selectedDate, today, viewMode]);

  const handleNavigatePrevious = useCallback(() => {
    setSelectedDate((previousDate) =>
      navigatePeriod(viewMode, previousDate, "prev"),
    );
  }, [viewMode]);

  const handleNavigateNext = useCallback(() => {
    if (!canNavigateNext) {
      return;
    }

    setSelectedDate((previousDate) =>
      navigatePeriod(viewMode, previousDate, "next"),
    );
  }, [canNavigateNext, viewMode]);

  const handleGoToToday = useCallback(() => {
    setSelectedDate(today);
  }, [today]);

  const handleSelectViewMode = useCallback((nextMode: DashboardViewMode) => {
    setViewMode(nextMode);
  }, []);

  const handleSelectDate = useCallback(
    (date: Date) => {
      if (isFutureDay(date, today)) {
        return;
      }

      setSelectedDate(date);
      setViewMode("day");
    },
    [today],
  );

  const handleToggleExpanded = useCallback((entryId: string) => {
    setExpandedState((previousState) => ({
      ...previousState,
      [entryId]: !previousState[entryId],
    }));
  }, []);

  const handleToggleBookmark = useCallback((entryId: string) => {
    setBookmarkState((previousState) => ({
      ...previousState,
      [entryId]: !previousState[entryId],
    }));
  }, []);

  const handleDeleteEntry = useCallback(
    (entryId: string) => {
      if (!userId) {
        return;
      }

      setDeletingState((previousState) => ({
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

          setEntries((previousEntries) =>
            previousEntries.filter((entry) => entry.id !== entryId),
          );

          setExpandedState((previousState) => {
            const nextState = { ...previousState };
            delete nextState[entryId];
            return nextState;
          });
          setBookmarkState((previousState) => {
            const nextState = { ...previousState };
            delete nextState[entryId];
            return nextState;
          });
        } catch {
          setHasDeleteError(true);
        } finally {
          setDeletingState((previousState) => {
            const nextState = { ...previousState };
            delete nextState[entryId];
            return nextState;
          });
        }
      })();
    },
    [userId],
  );

  const handleEditEntry = useCallback(
    (entryId: string) => {
      const params = new URLSearchParams({
        entryId,
        from: "dashboard",
        mode: "form",
      });

      router.push(`/entry/create?${params.toString()}`);
    },
    [router],
  );

  const isExpanded = useCallback(
    (entryId: string) => Boolean(expandedState[entryId]),
    [expandedState],
  );

  const isBookmarked = useCallback(
    (entryId: string) => Boolean(bookmarkState[entryId]),
    [bookmarkState],
  );

  const isDeleting = useCallback(
    (entryId: string) => Boolean(deletingState[entryId]),
    [deletingState],
  );

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
