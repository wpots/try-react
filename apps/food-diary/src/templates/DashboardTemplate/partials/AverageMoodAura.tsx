"use client";

import { cn, useMotionEnabled } from "@repo/ui";
import { motion } from "framer-motion";

import { getMoodAuraAnimationConfig } from "../utils/moodAuraAnimationConfig";
import {
  getMoodAuraGlowClass,
  getMoodAuraParticleClass,
} from "../utils/moodClassUtils";

import type { MoodZone } from "../index";

interface AverageMoodAuraProps {
  zone: MoodZone;
}

interface DotSpec {
  delay: number;
  duration: number;
  opacityPeak: number;
  positionClassName: string;
  rise: number;
  sizeClassName: string;
  sway: number;
}

const DOT_SIZE_CLASSES = ["h-1 w-1", "h-1.5 w-1.5", "h-2 w-2"] as const;
const DOT_POSITION_CLASSES = [
  "left-0",
  "left-1/12",
  "left-1/6",
  "left-1/4",
  "left-1/3",
  "left-5/12",
  "left-1/2",
  "left-7/12",
  "left-2/3",
  "left-3/4",
  "left-5/6",
  "right-1/12",
  "right-0",
] as const;

function getNoise(seed: number): number {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function interpolate(min: number, max: number, ratio: number): number {
  return min + (max - min) * ratio;
}

function getDotSpecs(zone: MoodZone): DotSpec[] {
  const config = getMoodAuraAnimationConfig(zone);
  const dots: DotSpec[] = [];

  for (let index = 0; index < config.dotCount; index += 1) {
    const seed = zone * 100 + index;
    const durationSeed = getNoise(seed + 1);
    const delaySeed = getNoise(seed + 2);
    const riseSeed = getNoise(seed + 4);
    const swaySeed = getNoise(seed + 5);
    const opacitySeed = getNoise(seed + 6);
    const sizeSeed = getNoise(seed + 7);
    const positionSeed = getNoise(seed + 8);
    const sizeIndex = Math.floor(sizeSeed * DOT_SIZE_CLASSES.length);
    const positionIndex = Math.floor(positionSeed * DOT_POSITION_CLASSES.length);

    dots.push({
      delay: delaySeed * 2.2,
      duration: interpolate(
        config.durationRange[0],
        config.durationRange[1],
        durationSeed,
      ),
      opacityPeak: interpolate(
        config.dotOpacityRange[0],
        config.dotOpacityRange[1],
        opacitySeed,
      ),
      positionClassName:
        DOT_POSITION_CLASSES[positionIndex] ?? DOT_POSITION_CLASSES[0],
      rise: interpolate(config.riseRange[0], config.riseRange[1], riseSeed),
      sizeClassName: DOT_SIZE_CLASSES[sizeIndex] ?? DOT_SIZE_CLASSES[0],
      sway: interpolate(config.swayRange[0], config.swayRange[1], swaySeed),
    });
  }

  return dots;
}

export function AverageMoodAura({
  zone,
}: AverageMoodAuraProps): React.JSX.Element {
  const prefersReducedMotion = !useMotionEnabled();
  const config = getMoodAuraAnimationConfig(zone);
  const dots = getDotSpecs(zone);
  const glowClassName = getMoodAuraGlowClass(zone);
  const particleClassName = getMoodAuraParticleClass(zone);
  const pulseDuration = prefersReducedMotion
    ? config.basePulseDuration * 1.4
    : config.basePulseDuration;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      <motion.span
        className={cn(
          "absolute inset-x-0 bottom-0 h-2/3 rounded-ds-2xl blur-2xl",
          glowClassName,
        )}
        animate={{
          opacity: prefersReducedMotion
            ? [0.14, 0.22, 0.14]
            : [0.18, 0.3, 0.18],
          scale: prefersReducedMotion ? [0.98, 1.04, 0.98] : [0.95, 1.12, 0.95],
        }}
        transition={{
          duration: pulseDuration,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
      <motion.span
        className={cn(
          "absolute inset-x-0 bottom-0 h-1/2 rounded-ds-2xl blur-xl",
          glowClassName,
        )}
        animate={{
          opacity: prefersReducedMotion
            ? [0.1, 0.18, 0.1]
            : [0.12, 0.24, 0.12],
          scale: prefersReducedMotion
            ? [0.99, 1.02, 0.99]
            : [0.98, 1.06, 0.98],
          y: prefersReducedMotion ? [0, -6, 0] : [0, -10, 0],
        }}
        transition={{
          duration: pulseDuration,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      {dots.map((dot, index) => (
        <motion.span
          key={`dot-${index}-${dot.duration}`}
          className={cn(
            "absolute bottom-0 rounded-ds-full",
            dot.sizeClassName,
            dot.positionClassName,
            particleClassName,
          )}
          animate={{
            opacity: [0, dot.opacityPeak, dot.opacityPeak * 0.9, 0],
            scale: [0.5, 1, 0.9],
            x: [0, dot.sway, -dot.sway * 0.6, 0],
            y: [0, -dot.rise * 0.6, -dot.rise],
          }}
          transition={{
            delay: dot.delay,
            duration: prefersReducedMotion ? dot.duration * 1.35 : dot.duration,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
}
