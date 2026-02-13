"use client";

import { useEffect, useRef } from "react";

const PEBBLE_PATH =
  "M 407.507812 2930.03125 C -966.570312 1529.390625 2265.960938 -2091.140625 3740.929688 2590.960938 C 4477.929688 4930.476562 1159.339844 3696.390625 407.507812 2930.03125 Z";

interface PebbleConfig {
  id: string;
  tx: number;
  ty: number;
  baseScale: number;
  fillClass: string;
  speed: number;
  phase: number;
}

const PEBBLES: PebbleConfig[] = [
  {
    id: "pebble-1",
    tx: 100,
    ty: -500,
    baseScale: 1,
    fillClass: "fill-ds-brand-support/40",
    speed: 0.7,
    phase: 0,
  },
  {
    id: "pebble-2",
    tx: 400,
    ty: -300,
    baseScale: 1.01,
    fillClass: "fill-ds-brand-support/40",
    speed: 0.9,
    phase: 2.1,
  },
  {
    id: "pebble-3",
    tx: 0,
    ty: 0,
    baseScale: 1.02,
    fillClass: "fill-ds-brand-support/40",
    speed: 0.55,
    phase: 4.3,
  },
];

export function AnimatedLogo(): React.JSX.Element {
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
    <div className="relative flex size-full items-center justify-center rotate-290 -skew-y-15" aria-hidden="true">
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-400 -800 5200 5600"
        width="320"
        height="320"
        className="overflow-visible"
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
            <path d={PEBBLE_PATH} className={pebble.fillClass} filter="url(#pebble-blur)" />
          </g>
        ))}

        {PEBBLES.map(pebble => (
          <g
            key={pebble.id}
            id={pebble.id}
            transform={`translate(${pebble.tx}, ${pebble.ty}) scale(${pebble.baseScale}) rotate(${pebble.rotate})`}
            className="will-change-transform"
          >
            <path d={PEBBLE_PATH} className={pebble.fillClass} fillRule="evenodd" />
          </g>
        ))}
      </svg>
    </div>
  );
}
