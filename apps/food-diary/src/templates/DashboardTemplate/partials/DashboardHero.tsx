"use client";

import { Label, Card } from "@repo/ui";

import { Quote } from "@/components/Quote";

import { AverageMoodAura } from "./AverageMoodAura";
import { DashboardHeroWave } from "./DashboardHeroWave";

import type { DashboardMoodSummary } from "../index";

interface DashboardHeroProps {
  affirmation: string;
  averageMood: DashboardMoodSummary | null;
  dateLabel: string;
  title: string;
  translateDashboard: (key: string) => string;
}

export function DashboardHero({
  affirmation,
  averageMood,
  dateLabel,

  translateDashboard,
}: DashboardHeroProps): React.JSX.Element {
  return (
    <section
      className={
        "relative min-h-80 overflow-hidden border-b-1 border-ds-border-subtle " +
        "bg-gradient-to-br from-ds-brand-primary/40 " +
        "via-ds-surface-primary-soft to-ds-surface-muted/20 p-ds-xxl"
      }
    >
      {averageMood ? <AverageMoodAura zone={averageMood.zone} /> : null}
      <DashboardHeroWave zone={averageMood?.zone ?? null} />
      <div className="relative z-10 grid gap-ds-l">
        <div>
          <Label>{dateLabel}</Label>
          <Quote className="py-ds-xl text-left">{affirmation}</Quote>
        </div>

        <div>
          {averageMood ? (
            <>
              <Label>{translateDashboard("hero.averageMood")}</Label>
              <div className="mt-ds-xs flex w-full items-center p-ds-m">
                <Card
                  className={
                    "h-12 w-fit flex-row gap-ds-xs bg-ds-surface " +
                    "font-ds-display-base"
                  }
                >
                  <span className="font-openmoji grayscale brightness-110 text-xl" aria-hidden="true">
                    {averageMood.emoji}
                  </span>
                  {averageMood.label}
                </Card>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
