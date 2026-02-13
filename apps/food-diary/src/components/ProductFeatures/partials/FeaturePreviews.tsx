"use client";

import { useEffect, useState, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  Tiny coach avatar for previews                                     */
/* ------------------------------------------------------------------ */

function MiniAvatar() {
  return (
    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ds-surface-subtle text-ds-primary">
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5 text-foreground"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mini typing dots                                                   */
/* ------------------------------------------------------------------ */

function MiniTyping() {
  return (
    <div className="flex items-end gap-1.5">
      <MiniAvatar />
      <div className="flex gap-0.5 rounded-2xl rounded-bl-sm bg-muted px-3 py-2.5">
        <span className="typing-dot inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
        <span className="typing-dot inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
        <span className="typing-dot inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mini coach bubble                                                  */
/* ------------------------------------------------------------------ */

function MiniBubble({ text, visible }: { text: string; visible: boolean }) {
  return (
    <div
      className="flex items-end gap-1.5 transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
      }}
    >
      <MiniAvatar />
      <div className="max-w-[75%] rounded-2xl rounded-bl-sm bg-muted px-3 py-2">
        <p className="text-[11px] leading-snug text-foreground">{text}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mini user bubble                                                   */
/* ------------------------------------------------------------------ */

function MiniUserBubble({ text, visible }: { text: string; visible: boolean }) {
  return (
    <div
      className="flex justify-end transition-all duration-400"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
      }}
    >
      <div className="max-w-[70%] rounded-2xl rounded-br-sm bg-primary/15 px-3 py-2">
        <p className="text-[11px] leading-snug text-foreground">{text}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Cycle hook for looping animations                                  */
/* ------------------------------------------------------------------ */

function useCyclePhase(phases: number, intervalMs: number) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setPhase(p => (p + 1) % phases);
    }, intervalMs);
    return () => clearInterval(id);
  }, [phases, intervalMs]);
  return phase;
}

/* ================================================================== */
/*  1. FOOD ENTRY PREVIEW                                              */
/* ================================================================== */

export function FoodEntryPreview() {
  const phase = useCyclePhase(5, 1200);

  return (
    <div className="flex flex-col gap-2.5">
      <MiniBubble text="Wat heb je gegeten of gedronken?" visible={phase >= 0} />
      {phase >= 1 && phase < 3 && (
        <div className="mt-1 flex gap-1.5">
          <div className="flex-1 rounded-xl border border-border bg-card px-3 py-2">
            <p className="text-[11px] text-foreground">
              {phase >= 2 ? "Boterham met kaas" : "Boterham m"}
              <span className="inline-block h-3 w-[1px] animate-pulse bg-foreground/60" />
            </p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 text-primary-foreground"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
      )}
      {phase >= 3 && <MiniUserBubble text="Boterham met kaas" visible />}
      {phase >= 4 && <MiniTyping />}
    </div>
  );
}

/* ================================================================== */
/*  2. TRIGGER-FREE PREVIEW                                            */
/* ================================================================== */

export function TriggerFreePreview() {
  const phase = useCyclePhase(4, 1400);

  return (
    <div className="flex flex-col gap-2.5">
      <MiniBubble text="Hoe was je moment?" visible={phase >= 0} />
      {phase >= 1 && (
        <div className="mt-1 flex flex-col gap-2 transition-all duration-500" style={{ opacity: phase >= 1 ? 1 : 0 }}>
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-sage/50">
              <svg
                viewBox="0 0 24 24"
                className="h-3 w-3 text-teal"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="text-[10px] font-medium text-sage">Geen calorieen</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-sage/50">
              <svg
                viewBox="0 0 24 24"
                className="h-3 w-3 text-teal"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="text-[10px] font-medium text-sage">Geen scores</span>
          </div>
          {phase >= 2 && (
            <div
              className="flex items-center gap-2 transition-all duration-400"
              style={{ opacity: phase >= 2 ? 1 : 0 }}
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-sage/50">
                <svg
                  viewBox="0 0 24 24"
                  className="h-3 w-3 text-teal"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="text-[10px] font-medium text-sage">Geen oordeel</span>
            </div>
          )}
        </div>
      )}
      {phase >= 3 && <MiniUserBubble text="Gewoon rustig ontbijt" visible />}
    </div>
  );
}

/* ================================================================== */
/*  3. EMOTIONS PREVIEW                                                */
/* ================================================================== */

export function EmotionsPreview() {
  const phase = useCyclePhase(5, 1100);

  const faceEmotions = [
    { label: "Blij", mouth: "M8 14s1.5 2 4 2 4-2 4-2" },
    { label: "Rustig", mouth: "M8 14.5s1.5 1.5 4 1.5 4-1.5 4-1.5" },
    { label: "Moe", mouth: "M8 15.5s1 .5 4 .5 4-.5 4-.5" },
    { label: "Trots", mouth: "M8 13s1.5 2.5 4 2.5 4-2.5 4-2.5" },
  ];

  const selected = phase >= 2 ? [0, 2] : phase >= 1 ? [0] : [];

  return (
    <div className="flex flex-col gap-2.5">
      <MiniBubble text="Hoe voelde je je?" visible={phase >= 0} />
      {phase >= 1 && (
        <div className="mt-1 grid grid-cols-4 gap-1.5">
          {faceEmotions.map((em, i) => {
            const isActive = selected.includes(i);
            return (
              <div
                key={em.label}
                className={`flex flex-col items-center gap-1 rounded-xl px-1.5 py-2 transition-all duration-300 ${
                  isActive ? "bg-primary/15 ring-1 ring-primary/40" : "bg-muted"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className={`h-6 w-6 ${isActive ? "text-teal" : "text-muted-foreground"}`}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
                  <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
                  <path d={em.mouth} />
                </svg>
                <span className={`text-[8px] ${isActive ? "font-medium text-teal" : "text-muted-foreground"}`}>
                  {em.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
      {phase >= 3 && <MiniUserBubble text="Blij, Moe" visible />}
      {phase >= 4 && <MiniTyping />}
    </div>
  );
}

/* ================================================================== */
/*  4. BEHAVIORS PREVIEW                                               */
/* ================================================================== */

export function BehaviorsPreview() {
  const phase = useCyclePhase(5, 1300);

  const chips = ["Maaltijd overgeslagen", "Eetbui", "Te weinig gegeten"];

  const [selectedIdx, setSelectedIdx] = useState<number[]>([]);

  const resetAndAnimate = useCallback(() => {
    if (phase === 0) setSelectedIdx([]);
    if (phase === 2) setSelectedIdx([0]);
  }, [phase]);

  useEffect(() => {
    resetAndAnimate();
  }, [resetAndAnimate]);

  return (
    <div className="flex flex-col gap-2.5">
      <MiniBubble text="Was er iets bijzonders?" visible={phase >= 0} />
      {phase >= 1 && (
        <div className="mt-1 flex flex-col gap-2">
          <div className="flex flex-wrap gap-1.5">
            {chips.map((c, i) => (
              <span
                key={c}
                className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition-all duration-300 ${
                  selectedIdx.includes(i)
                    ? "bg-secondary/40 text-foreground ring-1 ring-secondary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {c}
              </span>
            ))}
          </div>
          {phase >= 3 && (
            <span className="text-[9px] italic text-muted-foreground transition-opacity duration-500">
              Geen oordeel, puur voor jou.
            </span>
          )}
        </div>
      )}
      {phase >= 4 && <MiniUserBubble text="Maaltijd overgeslagen" visible />}
    </div>
  );
}

/* ================================================================== */
/*  5. EXPORT PREVIEW                                                  */
/* ================================================================== */

export function ExportPreview() {
  const phase = useCyclePhase(4, 1500);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 py-4">
      <div
        className="relative transition-all duration-700"
        style={{
          transform: phase >= 1 ? "scale(1)" : "scale(0.8)",
          opacity: phase >= 0 ? 1 : 0,
        }}
      >
        <div className="h-28 w-20 rounded-xl border border-border bg-card shadow-sm">
          <div className="border-b border-border/50 px-2.5 py-2">
            <div className="h-1.5 w-10 rounded-full bg-primary/40" />
            <div className="mt-1.5 h-1 w-12 rounded-full bg-muted-foreground/20" />
          </div>
          <div className="space-y-2 p-2.5">
            <div className="h-1 w-full rounded-full bg-muted-foreground/15" />
            <div className="h-1 w-12 rounded-full bg-muted-foreground/15" />
            <div className="h-1 w-full rounded-full bg-muted-foreground/15" />
            <div className="h-1 w-10 rounded-full bg-muted-foreground/15" />
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              <div className="h-4 rounded bg-sage/20" />
              <div className="h-4 rounded bg-sky-light/30" />
            </div>
          </div>
        </div>
        <div className="absolute -right-2 -top-2 rounded-lg bg-primary px-2 py-0.5 text-[8px] font-bold text-primary-foreground shadow-sm">
          PDF
        </div>
      </div>
      {phase >= 2 && (
        <div className="flex items-center gap-2 transition-all duration-500" style={{ opacity: phase >= 2 ? 1 : 0 }}>
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5 text-primary"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span className="text-[10px] font-medium text-primary">Delen met therapeut</span>
        </div>
      )}
      {phase >= 3 && (
        <div
          className="flex items-center gap-1.5 rounded-full bg-sage/20 px-3 py-1 transition-all duration-400"
          style={{ opacity: phase >= 3 ? 1 : 0 }}
        >
          <svg viewBox="0 0 24 24" className="h-3 w-3 text-teal" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="text-[8px] font-medium text-teal">Verstuurd</span>
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  6. BOOKMARK PREVIEW                                                */
/* ================================================================== */

export function BookmarkPreview() {
  const phase = useCyclePhase(5, 1200);

  return (
    <div className="flex flex-col gap-2.5">
      <MiniBubble text="Wil je dit moment bewaren?" visible={phase >= 0} />
      {phase >= 1 && (
        <div className="mt-1 flex items-center gap-2">
          <span className="rounded-full bg-muted px-3 py-1 text-[10px] font-medium text-muted-foreground">Nee</span>
          <span
            className={`rounded-full px-3 py-1 text-[10px] font-medium transition-all duration-300 ${
              phase >= 2 ? "bg-primary/15 text-teal ring-1 ring-primary/40" : "bg-muted text-muted-foreground"
            }`}
          >
            Ja, bewaren
          </span>
        </div>
      )}
      {phase >= 3 && <MiniUserBubble text="Ja, bewaren" visible />}
      {phase >= 4 && (
        <div className="flex items-end gap-1.5">
          <MiniAvatar />
          <div className="rounded-2xl rounded-bl-sm bg-muted px-3 py-2">
            <div className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary" fill="currentColor" stroke="none">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              <span className="text-[10px] text-foreground">Bewaard!</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
