import { useEffect } from "react";
import type { RefObject } from "react";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";
import type { AnimatedLogoMotionMode } from "./index";

interface PebbleConfig {
  id: string;
  tx: number;
  ty: number;
  baseScale: number;
  rotate: number;
  speed: number;
  phase: number;
}

interface UseAnimatedLogoMotionProps {
  motionMode: AnimatedLogoMotionMode;
  pebbles: PebbleConfig[];
  svgRef: RefObject<SVGSVGElement | null>;
}

const DEFAULT_GLOW_OPACITY = 0.08;

function buildTransform(
  tx: number,
  ty: number,
  scale: number,
  rotate: number,
): string {
  return [
    `translate(${tx}, ${ty})`,
    `scale(${scale})`,
    `rotate(${rotate} 2000 2000)`,
  ].join(" ");
}

function resetPebbles(svg: SVGSVGElement, pebbles: PebbleConfig[]): void {
  for (const pebble of pebbles) {
    const group = svg.querySelector<SVGGElement>(`#${pebble.id}`);
    const glowGroup = svg.querySelector<SVGGElement>(
      `#${pebble.id}-glow`,
    );
    const baseTransform = buildTransform(
      pebble.tx,
      pebble.ty,
      pebble.baseScale,
      pebble.rotate,
    );

    if (group) {
      group.setAttribute("transform", baseTransform);
    }

    if (glowGroup) {
      glowGroup.setAttribute("opacity", `${DEFAULT_GLOW_OPACITY}`);
      glowGroup.setAttribute("transform", baseTransform);
    }
  }
}

export function useAnimatedLogoMotion({
  motionMode,
  pebbles,
  svgRef,
}: UseAnimatedLogoMotionProps): void {
  const isMotionEnabled = useMotionEnabled(motionMode);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) {
      return;
    }

    let animationId: number | null = null;
    let time = 0;

    const animate = () => {
      time += 0.006;

      for (const pebble of pebbles) {
        const group = svg.querySelector<SVGGElement>(`#${pebble.id}`);
        const glowGroup = svg.querySelector<SVGGElement>(
          `#${pebble.id}-glow`,
        );
        if (!group) {
          continue;
        }

        const t = time * pebble.speed + pebble.phase;
        const floatX = Math.sin(t * 0.5) * 25 + Math.cos(t * 0.8) * 12;
        const floatY = Math.cos(t * 0.35) * 30 + Math.sin(t * 0.65) * 15;
        const rotate = Math.sin(t * 0.3) * 2 + Math.cos(t * 0.5) * 1;
        const breathe = 1 + Math.sin(t * 0.25) * 0.025;
        const scale = pebble.baseScale * breathe;
        const tx = pebble.tx + floatX;
        const ty = pebble.ty + floatY;

        group.setAttribute("transform", buildTransform(tx, ty, scale, rotate));

        if (glowGroup) {
          const glowOpacity = DEFAULT_GLOW_OPACITY + Math.sin(t * 0.2) * 0.04;
          glowGroup.setAttribute("opacity", `${glowOpacity}`);
          glowGroup.setAttribute(
            "transform",
            buildTransform(tx, ty, scale * 1.05, rotate),
          );
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    const stopAnimation = () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    };

    const startAnimation = () => {
      if (animationId === null) {
        animationId = requestAnimationFrame(animate);
      }
    };

    if (isMotionEnabled) {
      startAnimation();
    } else {
      stopAnimation();
      resetPebbles(svg, pebbles);
    }

    return () => {
      stopAnimation();
    };
  }, [isMotionEnabled, pebbles, svgRef]);
}
