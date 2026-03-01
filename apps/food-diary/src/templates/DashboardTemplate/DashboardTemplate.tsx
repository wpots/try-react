"use client";
import { Container, Section, Typography } from "@repo/ui";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";

import { DashboardHeader } from "@/components/DashboardHeader";
import { useRouter } from "@/i18n/navigation";
import type { DiaryEntry } from "@/lib/diaryEntries";

import { DashboardHero } from "./partials/DashboardHero";
import { DashboardToolbar } from "./partials/DashboardToolbar";
import { DayView } from "./partials/DayView";
import { FloatingAddButton } from "./partials/FloatingAddButton";
import { MonthView } from "./partials/MonthView";
import { WeekView } from "./partials/WeekView";
import { useDashboardContent } from "./useDashboardContent";
import { pickAffirmation } from "./utils/affirmationUtils";
import { isFutureDay, isSameDay, toDateKey } from "./utils/dateUtils";
import { getAffirmationPool } from "./utils/getAffirmationPool";
import { getAverageMoodZone, getEntryMoods, getMoodSummary } from "./utils/moodUtils";
import { getHeroDateLabel, getPeriodLabel } from "./utils/periodLabelUtils";

import type { DashboardMonthCell, DashboardMood, DashboardWeekDay } from "./index";

function getWeekdayLabels(translate: (key: string) => string): string[] {
  return [
    translate("weekdays.mon"),
    translate("weekdays.tue"),
    translate("weekdays.wed"),
    translate("weekdays.thu"),
    translate("weekdays.fri"),
    translate("weekdays.sat"),
    translate("weekdays.sun"),
  ];
}

export function DashboardTemplate(): React.JSX.Element {
  const locale = useLocale();
  const tDashboard = useTranslations("dashboard");
  const tEntry = useTranslations("entry");
  const dashboardState = useDashboardContent();
  function translateDashboard(key: string): string {
    return tDashboard(key);
  }
  function getDashboardRawMessage(key: string): unknown {
    return tDashboard.raw(key);
  }
  function translateEntry(key: string): string {
    return tEntry(key);
  }
  function resolveEmotionLabel(emotionKey: string): string {
    try {
      return tEntry(`emotions.${emotionKey}`);
    } catch {
      return emotionKey;
    }
  }
  function resolveEntryMoods(entry: DiaryEntry): DashboardMood[] {
    return getEntryMoods(entry, resolveEmotionLabel);
  }
  const averageMood = getMoodSummary(getAverageMoodZone(dashboardState.dayEntries), translateDashboard);
  const affirmationPool = getAffirmationPool(translateDashboard, getDashboardRawMessage);
  const affirmation = pickAffirmation(toDateKey(dashboardState.selectedDate), affirmationPool);
  const heroDateLabel = getHeroDateLabel(dashboardState.selectedDate, locale);
  const periodLabel = getPeriodLabel(dashboardState.viewMode, dashboardState.selectedDate, locale);
  const weekdayLabels = getWeekdayLabels(translateDashboard);
  const router = useRouter();

  useEffect(() => {
    if (dashboardState.isUnauthenticated) {
      router.replace("/auth/login");
    }
  }, [dashboardState.isUnauthenticated, router]);

  const weekDays: DashboardWeekDay[] = dashboardState.weekDates.map(date => {
    const dateKey = toDateKey(date);
    return {
      date,
      dateKey,
      entries: dashboardState.entriesByDate[dateKey] ?? [],
      isFuture: isFutureDay(date, dashboardState.today),
      isToday: isSameDay(date, dashboardState.today),
    };
  });

  const monthCells: DashboardMonthCell[] = dashboardState.monthGridDates.map(gridDate => {
    const dateKey = toDateKey(gridDate.date);
    const entries = dashboardState.entriesByDate[dateKey] ?? [];
    return {
      date: gridDate.date,
      dateKey,
      entries,
      isCurrentMonth: gridDate.isCurrentMonth,
      isFuture: isFutureDay(gridDate.date, dashboardState.today),
      isToday: isSameDay(gridDate.date, dashboardState.today),
      moods: entries.flatMap(entry => resolveEntryMoods(entry)),
    };
  });

  if (dashboardState.isLoading) {
    return (
      <>
        <DashboardHeader />
        <p>{tDashboard("loading")}</p>
      </>
    );
  }

  if (dashboardState.isUnauthenticated) {
    return <DashboardHeader />;
  }
  return (
    <>
      <DashboardHeader />
      <main id="main-content" className="bg-ds-surface-muted min-h-screen">
        <DashboardHero
          affirmation={affirmation}
          averageMood={averageMood}
          dateLabel={heroDateLabel}
          title={tDashboard("title")}
          translateDashboard={translateDashboard}
        />
        <DashboardToolbar
          canNavigateNext={dashboardState.canNavigateNext}
          onGoToToday={dashboardState.onGoToToday}
          onNavigateNext={dashboardState.onNavigateNext}
          onNavigatePrevious={dashboardState.onNavigatePrevious}
          onSelectViewMode={dashboardState.onSelectViewMode}
          periodLabel={periodLabel}
          translateDashboard={translateDashboard}
          viewMode={dashboardState.viewMode}
        />
        {dashboardState.hasLoadError ? (
          <p className="font-ds-body-sm text-ds-danger">{tDashboard("loadError")}</p>
        ) : null}
        {dashboardState.hasDeleteError ? (
          <p className="font-ds-body-sm text-ds-danger">{tDashboard("entry.deleteFailed")}</p>
        ) : null}
        <Section variant="neutral">
          <Container size="wide">
            <Typography variant="heading" size="base" className="mb-ds-xl">
              {tDashboard("title")}
            </Typography>
            {dashboardState.viewMode === "day" ? (
              <DayView
                entries={dashboardState.dayEntries}
                getEntryMoods={resolveEntryMoods}
                isBookmarked={dashboardState.isBookmarked}
                isDeleting={dashboardState.isDeleting}
                isExpanded={dashboardState.isExpanded}
                onDeleteEntry={dashboardState.onDeleteEntry}
                onEditEntry={dashboardState.onEditEntry}
                onToggleBookmark={dashboardState.onToggleBookmark}
                onToggleExpanded={dashboardState.onToggleExpanded}
                translateDashboard={translateDashboard}
                translateEntry={translateEntry}
              />
            ) : null}
            {dashboardState.viewMode === "week" ? (
              <WeekView
                days={weekDays}
                getEntryMoods={resolveEntryMoods}
                translateDashboard={translateDashboard}
                translateEntry={translateEntry}
                weekdayLabels={weekdayLabels}
              />
            ) : null}
            {dashboardState.viewMode === "month" ? (
              <MonthView
                cells={monthCells}
                locale={locale}
                onSelectDate={dashboardState.onSelectDate}
                translateDashboard={translateDashboard}
                weekdayLabels={weekdayLabels}
              />
            ) : null}
          </Container>
        </Section>
        <FloatingAddButton ariaLabel={tDashboard("addEntry")} />
      </main>
    </>
  );
}
