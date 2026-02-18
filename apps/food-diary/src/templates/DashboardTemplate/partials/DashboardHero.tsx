"use client";

import { Card, Icon, Label, useMotionEnabled } from "@repo/ui";

import { Quote } from "@/components/Quote";

import { AverageMoodAura } from "./AverageMoodAura";
import { DashboardHeroWave } from "./DashboardHeroWave";
import { useDeviceTiltOffset } from "../useDeviceTiltOffset";

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
  const isMotionEnabled = useMotionEnabled();
  const {
    tiltX,
    tiltY,
    canRequestPermission,
    permissionState,
    requestPermission,
  } = useDeviceTiltOffset({
    isEnabled: isMotionEnabled,
    maxGamma: 18,
  });

  const handleHeroInteraction = (): void => {
    if (
      !isMotionEnabled ||
      !canRequestPermission ||
      permissionState !== "prompt"
    ) {
      return;
    }

    void requestPermission();
  };

  return (
    <section
      onClick={handleHeroInteraction}
      className={
        "relative min-h-80 overflow-hidden border-b-1 border-ds-border-subtle " +
        "bg-gradient-to-br from-ds-brand-primary/40 " +
        "via-ds-surface-primary-soft to-ds-surface-muted/20 p-ds-xxl"
      }
    >
      {averageMood ? <AverageMoodAura zone={averageMood.zone} /> : null}
      <DashboardHeroWave
        zone={averageMood?.zone ?? null}
        tiltX={tiltX}
        tiltY={tiltY}
        isMotionEnabled={isMotionEnabled}
      />
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
                  <span className="grayscale brightness-110 text-xl" aria-hidden="true">
                    <Icon name={averageMood.iconName} />
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
