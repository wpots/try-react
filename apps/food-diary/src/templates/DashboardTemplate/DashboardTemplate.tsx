"use client";
import { useCallback, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AuthButtons } from "@/components/AuthButtons";
import type { DiaryEntry } from "@/lib/diaryEntries";
import { DayView } from "./partials/DayView";
import { DashboardHero } from "./partials/DashboardHero";
import { DashboardToolbar } from "./partials/DashboardToolbar";
import { FloatingAddButton } from "./partials/FloatingAddButton";
import { MonthView } from "./partials/MonthView";
import { WeekView } from "./partials/WeekView";
import type { DashboardMonthCell, DashboardMood, DashboardWeekDay } from "./index";
import { useDashboardContent } from "./useDashboardContent";
import { pickAffirmation } from "./utils/affirmationUtils";
import { isFutureDay, isSameDay, toDateKey } from "./utils/dateUtils";
import { getAffirmationPool } from "./utils/getAffirmationPool";
import { getAverageMoodZone, getEntryMoods, getMoodSummary } from "./utils/moodUtils";
import { getHeroDateLabel, getPeriodLabel } from "./utils/periodLabelUtils";
import { Container, Section, Typography } from "@repo/ui";
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
  const translateDashboard = useCallback((key: string): string => tDashboard(key), [tDashboard]);
  const translateEntry = useCallback((key: string): string => tEntry(key), [tEntry]);
  const resolveEmotionLabel = useCallback(
    (emotionKey: string): string => {
      try {
        return tEntry(`emotions.${emotionKey}`);
      } catch {
        return emotionKey;
      }
    },
    [tEntry],
  );
  const resolveEntryMoods = useCallback(
    (entry: DiaryEntry): DashboardMood[] => getEntryMoods(entry, resolveEmotionLabel),
    [resolveEmotionLabel],
  );
  const averageMood = useMemo(() => {
    const zone = getAverageMoodZone(dashboardState.dayEntries);
    return getMoodSummary(zone, translateDashboard);
  }, [dashboardState.dayEntries, translateDashboard]);
  const affirmationPool = useMemo(() => getAffirmationPool(translateDashboard), [translateDashboard]);
  const affirmation = useMemo(
    () => pickAffirmation(toDateKey(dashboardState.selectedDate), affirmationPool),
    [affirmationPool, dashboardState.selectedDate],
  );
  const heroDateLabel = useMemo(
    () => getHeroDateLabel(dashboardState.selectedDate, locale),
    [dashboardState.selectedDate, locale],
  );
  const periodLabel = useMemo(
    () => getPeriodLabel(dashboardState.viewMode, dashboardState.selectedDate, locale),
    [dashboardState.selectedDate, dashboardState.viewMode, locale],
  );
  const weekdayLabels = useMemo(() => getWeekdayLabels(translateDashboard), [translateDashboard]);
  const weekDays = useMemo<DashboardWeekDay[]>(() => {
    return dashboardState.weekDates.map(date => {
      const dateKey = toDateKey(date);
      return {
        date,
        dateKey,
        entries: dashboardState.entriesByDate[dateKey] ?? [],
        isFuture: isFutureDay(date, dashboardState.today),
        isToday: isSameDay(date, dashboardState.today),
      };
    });
  }, [dashboardState.entriesByDate, dashboardState.today, dashboardState.weekDates]);

  const monthCells = useMemo<DashboardMonthCell[]>(() => {
    return dashboardState.monthGridDates.map(gridDate => {
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
  }, [dashboardState.entriesByDate, dashboardState.monthGridDates, dashboardState.today, resolveEntryMoods]);
  if (dashboardState.isLoading) {
    return <p>{tDashboard("loading")}</p>;
  }
  if (dashboardState.isUnauthenticated) {
    return (
      <>
        <section className="grid gap-ds-m pb-32">
          <h1 className="font-ds-heading-sm text-ds-on-surface">{tDashboard("title")}</h1>
          <p className="font-ds-body-base text-ds-on-surface-secondary">{tDashboard("authRequired")}</p>
          <AuthButtons redirectPath="/dashboard" />
        </section>
        <FloatingAddButton ariaLabel={tDashboard("addEntry")} />
      </>
    );
  }
  return (
    <>
      <main>
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
                isExpanded={dashboardState.isExpanded}
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
