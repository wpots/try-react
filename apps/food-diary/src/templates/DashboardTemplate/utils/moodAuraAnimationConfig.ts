import type { MoodZone } from "../index";

interface MoodAuraAnimationConfig {
  basePulseDuration: number;
  dotCount: number;
  dotOpacityRange: readonly [number, number];
  durationRange: readonly [number, number];
  riseRange: readonly [number, number];
  swayRange: readonly [number, number];
}

const CONFIG_BY_ZONE: Record<MoodZone, MoodAuraAnimationConfig> = {
  1: {
    basePulseDuration: 4.4,
    dotCount: 12,
    dotOpacityRange: [0.36, 0.64],
    durationRange: [4.8, 7.2],
    riseRange: [92, 168],
    swayRange: [10, 20],
  },
  2: {
    basePulseDuration: 3,
    dotCount: 14,
    dotOpacityRange: [0.34, 0.62],
    durationRange: [3.6, 5.8],
    riseRange: [84, 150],
    swayRange: [12, 22],
  },
  3: {
    basePulseDuration: 5.6,
    dotCount: 10,
    dotOpacityRange: [0.26, 0.5],
    durationRange: [5.2, 8],
    riseRange: [76, 132],
    swayRange: [8, 16],
  },
  4: {
    basePulseDuration: 5.8,
    dotCount: 12,
    dotOpacityRange: [0.3, 0.56],
    durationRange: [5.6, 8.6],
    riseRange: [92, 160],
    swayRange: [8, 14],
  },
  5: {
    basePulseDuration: 3.8,
    dotCount: 16,
    dotOpacityRange: [0.34, 0.68],
    durationRange: [3.4, 5.4],
    riseRange: [86, 156],
    swayRange: [10, 18],
  },
};

export function getMoodAuraAnimationConfig(
  zone: MoodZone,
): MoodAuraAnimationConfig {
  return CONFIG_BY_ZONE[zone];
}
