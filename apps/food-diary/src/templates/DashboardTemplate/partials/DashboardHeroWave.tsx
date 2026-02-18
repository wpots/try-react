"use client";

import { cn, useMotionEnabled } from "@repo/ui";
import { motion } from "framer-motion";

import { useDeviceTiltOffset } from "../useDeviceTiltOffset";

import type { MoodZone } from "../index";

interface DashboardHeroWaveProps {
  zone: MoodZone | null;
}

interface WaveLayerProps {
  className: string;
  duration: number;
  path: string;
  tiltX: number;
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
  className,
  duration,
  path,
  tiltX,
  isMotionEnabled,
}: WaveLayerProps): React.JSX.Element {
  return (
    <motion.div
      className="absolute inset-0"
      animate={{ x: tiltX }}
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
  zone,
}: DashboardHeroWaveProps): React.JSX.Element {
  const isMotionEnabled = useMotionEnabled();
  const tiltOffset = useDeviceTiltOffset({ isEnabled: isMotionEnabled });
  const waveTone = getWaveTone(zone);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-ds-xxl overflow-hidden opacity-60 md:h-ds-3xl"
    >
      <WaveLayer
        className={waveTone.primary}
        duration={24}
        path={PRIMARY_WAVE_PATH}
        tiltX={isMotionEnabled ? tiltOffset * 24 : 0}
        isMotionEnabled={isMotionEnabled}
      />
      <WaveLayer
        className={waveTone.secondary}
        duration={32}
        path={SECONDARY_WAVE_PATH}
        tiltX={isMotionEnabled ? tiltOffset * 14 : 0}
        isMotionEnabled={isMotionEnabled}
      />
      <WaveLayer
        className={waveTone.tertiary}
        duration={40}
        path={TERTIARY_WAVE_PATH}
        tiltX={isMotionEnabled ? tiltOffset * 8 : 0}
        isMotionEnabled={isMotionEnabled}
      />
    </div>
  );
}
