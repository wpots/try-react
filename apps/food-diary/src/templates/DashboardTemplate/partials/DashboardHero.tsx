"use client";

import { Button, Card, Icon, Label, useMotionEnabled } from "@repo/ui";

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

function formatTiltValue(value: number): string {
  const safeValue = Math.abs(value) < 0.005 ? 0 : value;
  return safeValue.toFixed(2);
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
    tiltOffset,
    hasTiltSignal,
    permissionState,
    canRequestPermission,
    requestPermission,
  } = useDeviceTiltOffset({
    isEnabled: isMotionEnabled,
    maxGamma: 18,
  });

  const showEnableTiltButton =
    isMotionEnabled &&
    canRequestPermission &&
    permissionState !== "granted" &&
    permissionState !== "unsupported";

  let tiltStatusKey: string | null = null;
  let tiltStatusClassName = "font-ds-label-sm text-ds-on-surface-secondary";

  if (!isMotionEnabled) {
    tiltStatusKey = "hero.tilt.motionDisabled";
  } else if (permissionState === "denied") {
    tiltStatusKey = "hero.tilt.denied";
    tiltStatusClassName = "font-ds-label-sm text-ds-danger";
  } else if (permissionState === "unsupported") {
    tiltStatusKey = "hero.tilt.unsupported";
  } else if (permissionState === "granted" && !hasTiltSignal) {
    tiltStatusKey = "hero.tilt.noSignal";
    tiltStatusClassName = "font-ds-label-sm text-ds-warning-strong";
  } else if (permissionState === "granted") {
    tiltStatusKey = "hero.tilt.enabled";
    tiltStatusClassName = "font-ds-label-sm text-ds-success";
  } else if (showEnableTiltButton) {
    tiltStatusKey = "hero.tilt.prompt";
  }

  const showTiltPanel = showEnableTiltButton || tiltStatusKey != null;

  const handleEnableTilt = (): void => {
    void requestPermission();
  };

  return (
    <section
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
          {showTiltPanel ? (
            <div className="mt-ds-s flex w-fit flex-col gap-ds-xs rounded-ds-md border border-ds-border-subtle bg-ds-surface px-ds-s py-ds-xs">
              <Label>{translateDashboard("hero.tilt.label")}</Label>
              {showEnableTiltButton ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleEnableTilt}
                >
                  {translateDashboard("hero.tilt.enable")}
                </Button>
              ) : null}
              {tiltStatusKey != null ? (
                <p className={tiltStatusClassName}>
                  {translateDashboard(tiltStatusKey)}
                </p>
              ) : null}
              <p className="font-ds-label-sm text-ds-on-surface-secondary">
                x {formatTiltValue(tiltX)} | y {formatTiltValue(tiltY)} |
                mix {formatTiltValue(tiltOffset)}
              </p>
            </div>
          ) : null}
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
