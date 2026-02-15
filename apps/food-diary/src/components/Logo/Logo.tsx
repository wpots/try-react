"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, useSpring, useTransform } from "framer-motion";
import { Image, cn } from "@repo/ui";
import NextImage from "next/image";

import type { LogoProps } from "./index.ts";

const IMAGE_SIZE_CLASSNAMES: Record<NonNullable<LogoProps["size"]>, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

const TEXT_SIZE_CLASSNAMES: Record<NonNullable<LogoProps["size"]>, string> = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
};

const MAX_LETTERS = 5;
const SPRING = { stiffness: 380, damping: 32 };
const LETTER_ENTER_X = -8;
/** Min width when expanded (full wordmark). */
const MIN_WIDTH_EXPANDED = "22rem";
/** Min width when collapsed (pebble + TRY) so it never squishes. */
const MIN_WIDTH_COLLAPSED = "9rem";

/** When R/Y switch to r/y */
const LOWERCASE_P = 0.08;
/** Rest parts disappear in reverse of T,R,Y: ou → eal → he */
const OU_END = 0.22;
const EAL_END = 0.3;
const HE_END = 0.38;
const FIRST_LETTERS_END = 0.5;

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

/** Segment opacity: T (first letter word 0) */
function segT(p: number): number {
  if (p < HE_END) return 1;
  if (p < FIRST_LETTERS_END) return 1 - (p - HE_END) / (FIRST_LETTERS_END - HE_END);
  return 0;
}
/** he disappears last (reverse of T appearing) */
function segHe(p: number): number {
  if (p < 0.28) return 1;
  if (p < HE_END) return 1 - (p - 0.28) / (HE_END - 0.28);
  return 0;
}
/** eal disappears second (reverse of R) */
function segEal(p: number): number {
  if (p < 0.2) return 1;
  if (p < EAL_END) return 1 - (p - 0.2) / (EAL_END - 0.2);
  return 0;
}
/** ou disappears first (reverse of Y appearing) */
function segOu(p: number): number {
  if (p < 0.12) return 1;
  if (p < OU_END) return 1 - (p - 0.12) / (OU_END - 0.12);
  return 0;
}
function firstLetterVisible(p: number): number {
  return p < FIRST_LETTERS_END ? 1 : 0;
}
function uppercaseR(p: number): number {
  return (p < LOWERCASE_P ? 1 : 0) * firstLetterVisible(p);
}
function lowercaseR(p: number): number {
  return (p >= LOWERCASE_P ? 1 : 0) * firstLetterVisible(p);
}
function uppercaseY(p: number): number {
  return (p < LOWERCASE_P ? 1 : 0) * firstLetterVisible(p);
}
function lowercaseY(p: number): number {
  return (p >= LOWERCASE_P ? 1 : 0) * firstLetterVisible(p);
}
function spaceVisible(p: number): number {
  return firstLetterVisible(p);
}

/** Leftward slide (px) for remaining letters morphing into TRY. T stays, R and Y move left. */
const MORPH_START = 0.32;
const MORPH_X_R_PX = 40;
const MORPH_X_Y_PX = 88;

function firstLetterX_T(p: number): number {
  void p;
  return 0;
}
function firstLetterX_R(p: number): number {
  if (p < MORPH_START) return 0;
  if (p > FIRST_LETTERS_END) return -MORPH_X_R_PX;
  const t = (p - MORPH_START) / (FIRST_LETTERS_END - MORPH_START);
  return -MORPH_X_R_PX * t;
}
function firstLetterX_Y(p: number): number {
  if (p < MORPH_START) return 0;
  if (p > FIRST_LETTERS_END) return -MORPH_X_Y_PX;
  const t = (p - MORPH_START) / (FIRST_LETTERS_END - MORPH_START);
  return -MORPH_X_Y_PX * t;
}

/** TRY letters appear only after wordmark exit is done (FIRST_LETTERS_END). */
const TRY_LETTER_START = 0.5;
const TRY_LETTER_STAGGER = 0.08;
const TRY_LETTER_DURATION = 0.15;

function letterOpacity(i: number, p: number): number {
  const start = TRY_LETTER_START + i * TRY_LETTER_STAGGER;
  const end = start + TRY_LETTER_DURATION;
  if (p < start) return 0;
  if (p > end) return 1;
  return (p - start) / (end - start);
}

function letterX(i: number, p: number): number {
  const start = TRY_LETTER_START + i * TRY_LETTER_STAGGER;
  const end = start + TRY_LETTER_DURATION;
  if (p < start) return LETTER_ENTER_X;
  if (p > end) return 0;
  return LETTER_ENTER_X + (Math.abs(LETTER_ENTER_X) * (p - start)) / (end - start);
}

export function Logo({
  size = "md",
  showText = true,
  scrollProgress,
  className,
  id = "logo",
  href = "#home",
  component: ImageComponent,
  ...props
}: LogoProps): React.JSX.Element {
  const t = useTranslations("common.brand");
  const rawProgress = scrollProgress !== undefined ? easeOutCubic(scrollProgress) : undefined;
  const isAnimated = rawProgress !== undefined;

  const smoothProgress = useSpring(0, SPRING);
  useEffect(() => {
    if (rawProgress !== undefined) smoothProgress.set(rawProgress);
  }, [rawProgress, smoothProgress]);

  const words = t("tagline").split(/\s+/).filter(Boolean);
  const letters = [...t("wordmark")];

  const segTOpacity = useTransform(smoothProgress, (p: number) => segT(p));
  const segHeOpacity = useTransform(smoothProgress, (p: number) => segHe(p));
  const segSpaceOpacity = useTransform(smoothProgress, (p: number) => spaceVisible(p));
  const segRUpperOpacity = useTransform(smoothProgress, (p: number) => uppercaseR(p));
  const segRLowerOpacity = useTransform(smoothProgress, (p: number) => lowercaseR(p));
  const segEalOpacity = useTransform(smoothProgress, (p: number) => segEal(p));
  const segYUpperOpacity = useTransform(smoothProgress, (p: number) => uppercaseY(p));
  const segYLowerOpacity = useTransform(smoothProgress, (p: number) => lowercaseY(p));
  const segOuOpacity = useTransform(smoothProgress, (p: number) => segOu(p));
  const wordmarkFallbackOpacity = useTransform(smoothProgress, (p: number) => 1 - p);

  const segTX = useTransform(smoothProgress, (p: number) => firstLetterX_T(p));
  const segRX = useTransform(smoothProgress, (p: number) => firstLetterX_R(p));
  const segYX = useTransform(smoothProgress, (p: number) => firstLetterX_Y(p));

  const letterOpacity0 = useTransform(smoothProgress, (p: number) => letterOpacity(0, p));
  const letterOpacity1 = useTransform(smoothProgress, (p: number) => letterOpacity(1, p));
  const letterOpacity2 = useTransform(smoothProgress, (p: number) => letterOpacity(2, p));
  const letterOpacity3 = useTransform(smoothProgress, (p: number) => letterOpacity(3, p));
  const letterOpacity4 = useTransform(smoothProgress, (p: number) => letterOpacity(4, p));
  const letterX0 = useTransform(smoothProgress, (p: number) => letterX(0, p));
  const letterX1 = useTransform(smoothProgress, (p: number) => letterX(1, p));
  const letterX2 = useTransform(smoothProgress, (p: number) => letterX(2, p));
  const letterX3 = useTransform(smoothProgress, (p: number) => letterX(3, p));
  const letterX4 = useTransform(smoothProgress, (p: number) => letterX(4, p));

  const letterOpacityValues = [letterOpacity0, letterOpacity1, letterOpacity2, letterOpacity3, letterOpacity4];
  const letterXValues = [letterX0, letterX1, letterX2, letterX3, letterX4];

  if (isAnimated) {
    const visibleLetters = letters.slice(0, MAX_LETTERS);
    const expandedAriaHidden = (rawProgress ?? 0) > 0.5;
    const collapsedAriaHidden = (rawProgress ?? 0) < 0.5;

    const useSegmentWordmark = words.length >= 3;
    const segWords = useSegmentWordmark ? words.slice(0, 3) : [];
    const segments = useSegmentWordmark
      ? (() => {
          const out: { first: string; rest: string }[] = [];
          for (const w of segWords) {
            out.push({ first: w.slice(0, 1), rest: w.slice(1) });
          }
          return out;
        })()
      : [];

    return (
      <a
        data-component-type="Logo"
        id={id}
        href={href}
        className={cn(
          "relative inline-flex h-ds-xl items-center no-underline md:h-ds-3xl",
          "shrink-0 overflow-visible transition-[min-width] duration-300 ease-out",
          className,
        )}
        style={{
          minWidth: (rawProgress ?? 0) >= 1 ? MIN_WIDTH_COLLAPSED : MIN_WIDTH_EXPANDED,
        }}
        {...props}
      >
        <span
          className="absolute left-0 top-ds-lg inline-block whitespace-nowrap font-ds-script-xl text-ds-on-surface"
          aria-hidden={expandedAriaHidden}
        >
          {useSegmentWordmark && segments.length === 3 ? (
            <>
              <motion.span className="inline-block" style={{ opacity: segTOpacity, x: segTX }}>
                {segments[0].first}
              </motion.span>
              <motion.span className="inline-block" style={{ opacity: segHeOpacity }}>
                {segments[0].rest}
              </motion.span>
              <motion.span className="inline-block" style={{ opacity: segSpaceOpacity }}>
                {"\u00A0"}
              </motion.span>
              <motion.span className="inline-block align-top" style={{ x: segRX }}>
                <span className="relative inline-block align-top">
                  <span className="invisible" aria-hidden>
                    {segments[1].first}
                  </span>
                  <motion.span className="absolute left-0 top-0" style={{ opacity: segRUpperOpacity }}>
                    {segments[1].first}
                  </motion.span>
                  <motion.span className="absolute left-0 top-0" style={{ opacity: segRLowerOpacity }}>
                    {segments[1].first.toLowerCase()}
                  </motion.span>
                </span>
              </motion.span>
              <motion.span className="inline-block" style={{ opacity: segEalOpacity }}>
                {segments[1].rest}
              </motion.span>
              <motion.span className="inline-block" style={{ opacity: segSpaceOpacity }}>
                {"\u00A0"}
              </motion.span>
              <motion.span className="inline-block align-top" style={{ x: segYX }}>
                <span className="relative inline-block align-top">
                  <span className="invisible" aria-hidden>
                    {segments[2].first}
                  </span>
                  <motion.span className="absolute left-0 top-0" style={{ opacity: segYUpperOpacity }}>
                    {segments[2].first}
                  </motion.span>
                  <motion.span className="absolute left-0 top-0" style={{ opacity: segYLowerOpacity }}>
                    {segments[2].first.toLowerCase()}
                  </motion.span>
                </span>
              </motion.span>
              <motion.span className="inline-block" style={{ opacity: segOuOpacity }}>
                {segments[2].rest}
              </motion.span>
            </>
          ) : (
            <motion.span className="inline-block" style={{ opacity: wordmarkFallbackOpacity }}>
              {t("tagline")}
            </motion.span>
          )}
        </span>
        <span
          className="absolute left-0 top-1/2 flex -translate-y-1/2 items-center gap-ds-s"
          aria-hidden={collapsedAriaHidden}
        >
          <motion.span style={{ opacity: letterOpacityValues[0] }}>
            <Image
              src="/img/pebblesgreen.png"
              alt=""
              width={48}
              height={48}
              component={NextImage}
              className="h-8 w-8 shrink-0 md:size-ds-4xl"
              aria-hidden
            />
          </motion.span>
          <span className="font-ds-script-xl flex">
            {visibleLetters.map((letter, i) => (
              <motion.span
                key={`${i}-${letter}`}
                className="inline-block"
                style={{
                  opacity: letterOpacityValues[i],
                  x: letterXValues[i],
                }}
              >
                {letter}
              </motion.span>
            ))}
          </span>
        </span>
        <span className="sr-only">{t("tagline")}</span>
      </a>
    );
  }

  return (
    <a
      data-component-type="Logo"
      id={id}
      href={href}
      className={cn("inline-flex items-center gap-ds-s text-inherit no-underline", className)}
      {...props}
    >
      <Image
        src="/img/pebblesblue.png"
        alt={t("logoAlt")}
        width={48}
        height={48}
        component={ImageComponent}
        className={IMAGE_SIZE_CLASSNAMES[size]}
      />
      {showText ? <span className={cn("font-display", TEXT_SIZE_CLASSNAMES[size])}>{t("tagline")}</span> : null}
    </a>
  );
}
