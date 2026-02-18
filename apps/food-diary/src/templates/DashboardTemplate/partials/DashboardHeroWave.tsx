"use client";

import { cn } from "@repo/ui";
import { motion } from "framer-motion";

import type { MoodZone } from "../index";

interface DashboardHeroWaveProps {
  isMotionEnabled: boolean;
  tiltX: number;
  tiltY: number;
  zone: MoodZone | null;
}

interface WaveLayerProps {
  baseY: number;
  className: string;
  duration: number;
  path: string;
  tiltX: number;
  tiltY: number;
  tiltSkewY: number;
  isMotionEnabled: boolean;
}

interface WaveTone {
  primary: string;
  secondary: string;
  tertiary: string;
}

const PRIMARY_WAVE_PATH =
  "M0 18C20 10 40 10 60 18C80 26 100 26 120 18C140 10 160 10 180 18C200 26 220 26 240 18C260 10 280 10 300 18C320 26 340 26 360 18V48H0Z";
const SECONDARY_WAVE_PATH =
  "M0 22C30 14 60 14 90 22C120 30 150 30 180 22C210 14 240 14 270 22C300 30 330 30 360 22V48H0Z";
const TERTIARY_WAVE_PATH =
  "M0 20C24 12 48 12 72 20C96 28 120 28 144 20C168 12 192 12 216 20C240 28 264 28 288 20C312 12 336 12 360 20V48H0Z";
const PRIMARY_TILT_X_MULTIPLIER = 14;
const SECONDARY_TILT_X_MULTIPLIER = 8;
const TERTIARY_TILT_X_MULTIPLIER = 5;
const PRIMARY_TILT_Y_MULTIPLIER = 16;
const SECONDARY_TILT_Y_MULTIPLIER = 10;
const TERTIARY_TILT_Y_MULTIPLIER = 6;
const PRIMARY_TILT_SKEW_Y_MULTIPLIER = 8;
const SECONDARY_TILT_SKEW_Y_MULTIPLIER = 5.5;
const TERTIARY_TILT_SKEW_Y_MULTIPLIER = 3.5;
const PRIMARY_BASE_Y = 14;
const SECONDARY_BASE_Y = 16;
const TERTIARY_BASE_Y = 18;

const WAVE_TONES: Record<MoodZone, WaveTone> = {
  1: {
    primary: "text-ds-danger/20",
    secondary: "text-ds-danger/30",
    tertiary: "text-ds-danger/14",
  },
  2: {
    primary: "text-ds-warning-strong/20",
    secondary: "text-ds-warning-strong/30",
    tertiary: "text-ds-warning-strong/14",
  },
  3: {
    primary: "text-ds-brand-support/20",
    secondary: "text-ds-brand-support/30",
    tertiary: "text-ds-brand-support/14",
  },
  4: {
    primary: "text-ds-surface-primary/20",
    secondary: "text-ds-surface-primary/30",
    tertiary: "text-ds-surface-primary/14",
  },
  5: {
    primary: "text-ds-success/20",
    secondary: "text-ds-success/30",
    tertiary: "text-ds-success/14",
  },
};

const DEFAULT_WAVE_TONE: WaveTone = {
  primary: "text-ds-brand-support/20",
  secondary: "text-ds-brand-support/30",
  tertiary: "text-ds-brand-support/14",
};

function getWaveTone(zone: MoodZone | null): WaveTone {
  if (zone == null) {
    return DEFAULT_WAVE_TONE;
  }

  return WAVE_TONES[zone];
}

function WaveLayer({
  baseY,
  className,
  duration,
  path,
  tiltX,
  tiltY,
  tiltSkewY,
  isMotionEnabled,
}: WaveLayerProps): React.JSX.Element {
  return (
    <motion.div
      className="absolute -top-ds-l inset-x-0 -bottom-ds-xxl origin-center transform-gpu"
      animate={{
        skewY: tiltSkewY,
        x: tiltX,
        y: baseY + tiltY,
      }}
      transition={{
        type: "spring",
        stiffness: 70,
        damping: 20,
        mass: 0.6,
      }}
    >
      <motion.div
        className="absolute inset-0 flex"
        animate={isMotionEnabled ? { x: ["0%", "-100%"] } : { x: "0%" }}
        transition={
          isMotionEnabled
            ? {
                duration,
                ease: "linear",
                repeat: Infinity,
              }
            : undefined
        }
      >
        <svg
          viewBox="0 0 360 48"
          preserveAspectRatio="none"
          className={cn("h-full w-full shrink-0 mix-blend-multiply", className)}
          aria-hidden="true"
        >
          <path d={path} fill="currentColor" />
        </svg>
        <svg
          viewBox="0 0 360 48"
          preserveAspectRatio="none"
          className={cn("h-full w-full shrink-0 mix-blend-multiply", className)}
          aria-hidden="true"
        >
          <path d={path} fill="currentColor" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

export function DashboardHeroWave({
  isMotionEnabled,
  tiltX,
  tiltY,
  zone,
}: DashboardHeroWaveProps): React.JSX.Element {
  const waveTone = getWaveTone(zone);
  const resolvedTiltX = -tiltX;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-ds-3xl overflow-hidden opacity-60 md:h-ds-4xl"
    >
      <WaveLayer
        baseY={PRIMARY_BASE_Y}
        className={waveTone.primary}
        duration={24}
        path={PRIMARY_WAVE_PATH}
        tiltX={isMotionEnabled ? resolvedTiltX * PRIMARY_TILT_X_MULTIPLIER : 0}
        tiltY={isMotionEnabled ? tiltY * PRIMARY_TILT_Y_MULTIPLIER : 0}
        tiltSkewY={
          isMotionEnabled ? resolvedTiltX * PRIMARY_TILT_SKEW_Y_MULTIPLIER : 0
        }
        isMotionEnabled={isMotionEnabled}
      />
      <WaveLayer
        baseY={SECONDARY_BASE_Y}
        className={waveTone.secondary}
        duration={32}
        path={SECONDARY_WAVE_PATH}
        tiltX={isMotionEnabled ? resolvedTiltX * SECONDARY_TILT_X_MULTIPLIER : 0}
        tiltY={isMotionEnabled ? tiltY * SECONDARY_TILT_Y_MULTIPLIER : 0}
        tiltSkewY={
          isMotionEnabled
            ? resolvedTiltX * SECONDARY_TILT_SKEW_Y_MULTIPLIER
            : 0
        }
        isMotionEnabled={isMotionEnabled}
      />
      <WaveLayer
        baseY={TERTIARY_BASE_Y}
        className={waveTone.tertiary}
        duration={40}
        path={TERTIARY_WAVE_PATH}
        tiltX={isMotionEnabled ? resolvedTiltX * TERTIARY_TILT_X_MULTIPLIER : 0}
        tiltY={isMotionEnabled ? tiltY * TERTIARY_TILT_Y_MULTIPLIER : 0}
        tiltSkewY={
          isMotionEnabled ? resolvedTiltX * TERTIARY_TILT_SKEW_Y_MULTIPLIER : 0
        }
        isMotionEnabled={isMotionEnabled}
      />
    </div>
  );
}
