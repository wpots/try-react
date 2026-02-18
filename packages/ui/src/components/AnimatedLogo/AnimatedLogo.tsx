"use client";

import { useRef } from "react";
import { PEBBLE_PATH } from "../../assets/pebblePath";
import { cn } from "../../lib/utils";
import type { AnimatedLogoProps, AnimatedLogoVariant } from "./index";
import { useAnimatedLogoMotion } from "./useAnimatedLogoMotion";

const PEBBLE_FILL: Record<AnimatedLogoVariant, string> = {
  default: "fill-ds-brand-support/40",
  strong: "fill-ds-brand-primary-strong/20",
};
const DEFAULT_GLOW_OPACITY = 0.08;

interface PebbleConfig {
  id: string;
  tx: number;
  ty: number;
  baseScale: number;
  rotate: number;
  speed: number;
  phase: number;
}

const PEBBLES: PebbleConfig[] = [
  {
    id: "pebble-1",
    tx: 100,
    ty: -500,
    baseScale: 1,
    rotate: 0,
    speed: 0.7,
    phase: 0,
  },
  {
    id: "pebble-2",
    tx: 400,
    ty: -300,
    baseScale: 1.01,
    rotate: 0,
    speed: 0.9,
    phase: 2.1,
  },
  {
    id: "pebble-3",
    tx: 0,
    ty: 0,
    baseScale: 1.02,
    rotate: 0,
    speed: 0.55,
    phase: 4.3,
  },
];

function buildTransform(
  tx: number,
  ty: number,
  scale: number,
  rotate: number,
): string {
  return `translate(${tx}, ${ty}) scale(${scale}) rotate(${rotate} 2000 2000)`;
}

export function AnimatedLogo({
  className,
  variant = "default",
  motionMode = "auto",
  ...rest
}: AnimatedLogoProps): React.JSX.Element {
  const fillClass = PEBBLE_FILL[variant];
  const svgRef = useRef<SVGSVGElement>(null);

  useAnimatedLogoMotion({
    motionMode,
    pebbles: PEBBLES,
    svgRef,
  });

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center [container-type:inline-size]",
        className,
      )}
      {...rest}
    >
      <div
        className="relative flex size-full items-center justify-center rotate-290 -skew-y-15"
        aria-hidden="true"
      >
        <svg
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-400 -800 5200 5600"
          className="size-full overflow-visible"
        >
          <defs>
            <filter id="pebble-blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="120" />
            </filter>
          </defs>

          {PEBBLES.map(pebble => (
            <g
              key={`${pebble.id}-glow`}
              id={`${pebble.id}-glow`}
              opacity={`${DEFAULT_GLOW_OPACITY}`}
              transform={buildTransform(
                pebble.tx,
                pebble.ty,
                pebble.baseScale,
                pebble.rotate,
              )}
              className="will-change-transform"
            >
              <path
                d={PEBBLE_PATH}
                className={fillClass}
                filter="url(#pebble-blur)"
              />
            </g>
          ))}

          {PEBBLES.map(pebble => (
            <g
              key={pebble.id}
              id={pebble.id}
              transform={buildTransform(
                pebble.tx,
                pebble.ty,
                pebble.baseScale,
                pebble.rotate,
              )}
              className="will-change-transform"
            >
              <path d={PEBBLE_PATH} className={fillClass} fillRule="evenodd" />
            </g>
          ))}
        </svg>
      </div>
      <span
        className={
          "pointer-events-none absolute inset-0 flex items-center " +
          "justify-center font-ds-script-2xl font-ds-script-fluid " +
          "text-ds-on-surface/5"
        }
        aria-hidden
      >
        Try
      </span>
    </div>
  );
}
