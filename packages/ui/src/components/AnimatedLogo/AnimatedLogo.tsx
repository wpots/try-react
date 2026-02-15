"use client";

import { useEffect, useRef } from "react";
import { PEBBLE_PATH } from "../../assets/pebblePath";
import { cn } from "../../lib/utils";
import type { AnimatedLogoProps } from "./index";

const PEBBLE_FILL: Record<NonNullable<AnimatedLogoProps["variant"]>, string> = {
  default: "fill-ds-brand-support/40",
  strong: "fill-ds-brand-primary-strong/30",
};

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
  { id: "pebble-1", tx: 100, ty: -500, baseScale: 1, rotate: 0, speed: 0.7, phase: 0 },
  { id: "pebble-2", tx: 400, ty: -300, baseScale: 1.01, rotate: 0, speed: 0.9, phase: 2.1 },
  { id: "pebble-3", tx: 0, ty: 0, baseScale: 1.02, rotate: 0, speed: 0.55, phase: 4.3 },
];

export function AnimatedLogo({ className, variant = "default", ...rest }: AnimatedLogoProps): React.JSX.Element {
  const fillClass = PEBBLE_FILL[variant];
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.006;

      PEBBLES.forEach(p => {
        const group = svg.querySelector(`#${p.id}`) as SVGGElement | null;
        const glowGroup = svg.querySelector(`#${p.id}-glow`) as SVGGElement | null;

        if (!group) return;

        const t = time * p.speed + p.phase;

        const floatX = Math.sin(t * 0.5) * 25 + Math.cos(t * 0.8) * 12;
        const floatY = Math.cos(t * 0.35) * 30 + Math.sin(t * 0.65) * 15;

        const rotate = Math.sin(t * 0.3) * 2 + Math.cos(t * 0.5) * 1;

        const breathe = 1 + Math.sin(t * 0.25) * 0.025;
        const scale = p.baseScale * breathe;

        const tx = p.tx + floatX;
        const ty = p.ty + floatY;

        group.setAttribute("transform", `translate(${tx}, ${ty}) scale(${scale}) rotate(${rotate} 2000 2000)`);

        if (glowGroup) {
          const glowOpacity = 0.08 + Math.sin(t * 0.2) * 0.04;
          glowGroup.setAttribute("opacity", `${glowOpacity}`);
          glowGroup.setAttribute(
            "transform",
            `translate(${tx}, ${ty}) scale(${scale * 1.05}) rotate(${rotate} 2000 2000)`,
          );
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div
      className={cn("relative inline-flex items-center justify-center [container-type:inline-size]", className)}
      {...rest}
    >
      <div className="relative flex size-full items-center justify-center rotate-290 -skew-y-15" aria-hidden="true">
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
              opacity="0.08"
              transform={`translate(${pebble.tx}, ${pebble.ty}) scale(${pebble.baseScale}) rotate(${pebble.rotate})`}
              className="will-change-transform"
            >
              <path d={PEBBLE_PATH} className={fillClass} filter="url(#pebble-blur)" />
            </g>
          ))}

          {PEBBLES.map(pebble => (
            <g
              key={pebble.id}
              id={pebble.id}
              transform={`translate(${pebble.tx}, ${pebble.ty}) scale(${pebble.baseScale}) rotate(${pebble.rotate})`}
              className="will-change-transform"
            >
              <path d={PEBBLE_PATH} className={fillClass} fillRule="evenodd" />
            </g>
          ))}
        </svg>
      </div>
      <span
        className="absolute inset-0 flex items-center justify-center pointer-events-none font-ds-script-2xl text-ds-on-surface/5"
        style={{ fontSize: "20cqw" }}
        aria-hidden
      >
        Try
      </span>
    </div>
  );
}
