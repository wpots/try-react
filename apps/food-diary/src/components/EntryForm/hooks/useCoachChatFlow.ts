"use client";

import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { formatDatetimeHuman } from "../utils/formatDatetimeHuman";
import { getDefaultEntryType } from "../utils/getDefaultEntryType";
import { getInitialEntry } from "../utils/getInitialEntry";
import {
  areEntryBehaviors,
  behaviorOptions,
  companyOptions,
  isEntryCompany,
  isEntryLocation,
  isEntryType,
  locationOptions,
} from "../utils/options";
import { STEPS } from "../utils/steps";

import type { WizardEntry, EntryFormMode } from "../index";
import type { CoachChatMessage, UseCoachChatMessagingResult } from "./useCoachChatMessaging";
import type { UseCoachChatPersistenceResult } from "./useCoachChatPersistence";
import type { WizardStep } from "../utils/steps";
import type { useTranslations } from "next-intl";
import type { Dispatch, SetStateAction } from "react";

type EntryTranslations = ReturnType<typeof useTranslations>;

interface UseCoachChatFlowArgs {
  initialMode: EntryFormMode;
  onComplete?: () => void;
  locale: string;
  t: EntryTranslations;
  messaging: UseCoachChatMessagingResult;
  persistence: UseCoachChatPersistenceResult;
}

interface Snapshot {
  messages: CoachChatMessage[];
  entry: WizardEntry;
}

function getFilteredSteps(entry: WizardEntry): WizardStep[] {
  return STEPS.filter(step =>
    step.condition
      ? step.condition({
          entryType: entry.entryType,
          behavior: entry.behavior,
          emotions: entry.emotions,
        })
      : true,
  );
}

export interface UseCoachChatFlowResult {
  mode: EntryFormMode;
  setMode: Dispatch<SetStateAction<EntryFormMode>>;
  currentStepIndex: number;
  entry: WizardEntry;
  completed: boolean;
  inputText: string;
  inputChips: string[];
  inputEmotions: string[];
  inputBookmarked: boolean | null;
  inputOtherText: string;
  filteredSteps: WizardStep[];
  setEntry: Dispatch<SetStateAction<WizardEntry>>;
  setInputText: Dispatch<SetStateAction<string>>;
  setInputChips: Dispatch<SetStateAction<string[]>>;
  setInputEmotions: Dispatch<SetStateAction<string[]>>;
  setInputBookmarked: Dispatch<SetStateAction<boolean | null>>;
  setInputOtherText: Dispatch<SetStateAction<string>>;
  handleStepBack: () => void;
  handleSkip: () => void;
  handleSubmitEntryType: () => void;
  handleSubmitDatetime: () => void;
  handleSubmitBookmark: (override?: boolean | null) => void;
  handleSubmitLocation: (override?: string) => void;
  handleSubmitCompany: (override?: string) => void;
  handleSubmitFood: () => void;
  handleSubmitEmotions: () => void;
  handleSubmitDescription: () => void;
  handleSubmitBehavior: () => void;
  handleSubmitConfirm: () => void;
  handleTraditionalComplete: (entry: WizardEntry) => void;
}

export function useCoachChatFlow({
  initialMode,
  onComplete,
  locale,
  t,
  messaging,
  persistence,
}: UseCoachChatFlowArgs): UseCoachChatFlowResult {
  const [mode, setMode] = useState<EntryFormMode>(initialMode);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [entry, setEntry] = useState<WizardEntry>(getInitialEntry);
  const [history, setHistory] = useState<Snapshot[]>([]);
  const [completed, setCompleted] = useState(false);
  const [inputText, setInputText] = useState("");
  const [inputChips, setInputChips] = useState<string[]>([]);
  const [inputEmotions, setInputEmotions] = useState<string[]>([]);
  const [inputBookmarked, setInputBookmarked] = useState<boolean | null>(null);
  const [inputOtherText, setInputOtherText] = useState("");

  const initialDatetimeRef = useRef<{ date: string; time: string }>({
    date: entry.date,
    time: entry.time,
  });
  const isInitializedRef = useRef(false);

  const {
    addMessage,
    startCoachSequence,
    getCoachReplyMessage,
    getCoachStepMessage,
    captureMessagesSnapshot,
    setMessages,
    resetSequence,
    isTyping,
  } = messaging;
  const { persistEntry } = persistence;

  const filteredSteps = useMemo(() => getFilteredSteps(entry), [entry]);

  const resetInputState = useCallback(() => {
    setInputText("");
    setInputChips([]);
    setInputEmotions([]);
    setInputBookmarked(null);
    setInputOtherText("");
  }, []);

  const isDatetimeUnchanged = useCallback(
    (targetEntry: WizardEntry): boolean =>
      targetEntry.date === initialDatetimeRef.current.date && targetEntry.time === initialDatetimeRef.current.time,
    [],
  );

  const handlePersist = useCallback(
    async (finalEntry: WizardEntry) => {
      const result = await persistEntry(finalEntry);
      if (result.success) {
        setCompleted(true);
        onComplete?.();
      }
    },
    [onComplete, persistEntry],
  );

  const advanceStep = useCallback(
    (
      updatedEntry: WizardEntry,
      options?: {
        wasSkipped?: boolean;
        skipAcknowledgement?: boolean;
      },
    ) => {
      const answeredStep = filteredSteps[currentStepIndex];
      setHistory(previous => [...previous, { messages: captureMessagesSnapshot(), entry }]);
      setEntry(updatedEntry);

      const nextIndex = currentStepIndex + 1;
      const nextSteps = getFilteredSteps(updatedEntry);
      setCurrentStepIndex(nextIndex);
      resetInputState();

      if (nextIndex >= nextSteps.length) {
        void handlePersist(updatedEntry);
        return;
      }

      const nextStep = nextSteps[nextIndex];
      if (!nextStep) {
        return;
      }

      if (options?.skipAcknowledgement) {
        startCoachSequence([getCoachStepMessage(nextStep, updatedEntry)]);
        return;
      }

      const acknowledgement = getCoachReplyMessage(answeredStep, options?.wasSkipped ?? false, updatedEntry);
      startCoachSequence([acknowledgement, getCoachStepMessage(nextStep, updatedEntry)]);
    },
    [
      captureMessagesSnapshot,
      currentStepIndex,
      entry,
      filteredSteps,
      getCoachReplyMessage,
      getCoachStepMessage,
      handlePersist,
      resetInputState,
      startCoachSequence,
    ],
  );

  const handleStepBack = useCallback(() => {
    if (currentStepIndex === 0 || history.length === 0 || isTyping) {
      return;
    }

    const previousSnapshot = history[history.length - 1];
    if (!previousSnapshot) {
      return;
    }

    const previousIndex = currentStepIndex - 1;
    const previousSteps = getFilteredSteps(previousSnapshot.entry);
    const previousStep = previousSteps[previousIndex];

    setMessages(previousSnapshot.messages);
    setEntry(previousSnapshot.entry);
    setHistory(previous => previous.slice(0, -1));
    setCurrentStepIndex(previousIndex);
    setCompleted(false);
    resetInputState();

    if (!previousStep) {
      startCoachSequence([]);
      return;
    }

    startCoachSequence([t("coachReplies.stepBack"), getCoachStepMessage(previousStep, previousSnapshot.entry)]);
  }, [currentStepIndex, history, isTyping, resetInputState, setMessages, startCoachSequence, t, getCoachStepMessage]);

  const handleSkip = useCallback(() => {
    addMessage("user", t("form.skip"));
    advanceStep(entry, { wasSkipped: true });
  }, [addMessage, advanceStep, entry, t]);

  const handleSubmitEntryType = useCallback(() => {
    const fallbackTime = new Date().toTimeString().slice(0, 5);
    const suggestedType = getDefaultEntryType(entry.date, entry.time || fallbackTime);
    const selected = inputChips[0] ?? entry.entryType ?? suggestedType;
    if (!selected || !isEntryType(selected)) {
      return;
    }

    addMessage("user", t(`entryTypes.${selected}`));
    advanceStep({ ...entry, entryType: selected });
  }, [addMessage, advanceStep, entry, inputChips, t]);

  const handleSubmitDatetime = useCallback(() => {
    const unchangedDatetime = isDatetimeUnchanged(entry);
    const message = unchangedDatetime ? t("form.ok") : formatDatetimeHuman(entry.date, entry.time || "00:00", locale);

    addMessage("user", message);
    advanceStep(entry, { skipAcknowledgement: unchangedDatetime });
  }, [addMessage, advanceStep, entry, isDatetimeUnchanged, locale, t]);

  const handleSubmitBookmark = useCallback(
    (override?: boolean | null) => {
      const value = override !== undefined ? override : inputBookmarked;
      if (value == null) {
        return;
      }

      addMessage("user", value ? t("form.yes") : t("form.no"));
      advanceStep({ ...entry, isBookmarked: value });
    },
    [addMessage, advanceStep, entry, inputBookmarked, t],
  );

  const handleSubmitLocation = useCallback(
    (override?: string) => {
      const selected = override ?? inputChips[0];
      if (!selected || !isEntryLocation(selected)) {
        return;
      }
      if (selected === "anders" && !inputOtherText.trim()) {
        return;
      }

      const label =
        selected === "anders"
          ? inputOtherText.trim()
          : t(locationOptions.find(option => option.value === selected)?.labelKey ?? "locations.anders");
      addMessage("user", label);
      advanceStep({
        ...entry,
        location: selected,
        locationOther: selected === "anders" ? inputOtherText.trim() : undefined,
      });
      setInputOtherText("");
    },
    [addMessage, advanceStep, entry, inputChips, inputOtherText, setInputOtherText, t],
  );

  const handleSubmitCompany = useCallback(
    (override?: string) => {
      const selected = override ?? inputChips[0];
      if (!selected || !isEntryCompany(selected)) {
        return;
      }
      if (selected === "anders" && !inputOtherText.trim()) {
        return;
      }

      const label =
        selected === "anders"
          ? inputOtherText.trim()
          : t(companyOptions.find(option => option.value === selected)?.labelKey ?? "company.anders");
      addMessage("user", label);
      advanceStep({
        ...entry,
        company: selected,
        companyOther: selected === "anders" ? inputOtherText.trim() : undefined,
      });
      setInputOtherText("");
    },
    [addMessage, advanceStep, entry, inputChips, inputOtherText, setInputOtherText, t],
  );

  const handleSubmitFood = useCallback(() => {
    const foodEaten = inputText.trim();
    if (!foodEaten) {
      return;
    }

    addMessage("user", foodEaten);
    advanceStep({ ...entry, foodEaten });
  }, [addMessage, advanceStep, entry, inputText]);

  const handleSubmitEmotions = useCallback(() => {
    if (inputEmotions.length === 0) {
      return;
    }

    const label = inputEmotions.map(key => t(`emotions.${key}`)).join(", ");
    addMessage("user", label);
    advanceStep({ ...entry, emotions: inputEmotions });
  }, [addMessage, advanceStep, entry, inputEmotions, t]);

  const handleSubmitDescription = useCallback(() => {
    const description = inputText.trim();
    addMessage("user", description || t("form.skip"));
    advanceStep({ ...entry, description });
  }, [addMessage, advanceStep, entry, inputText, t]);

  const handleSubmitBehavior = useCallback(() => {
    if (!areEntryBehaviors(inputChips)) {
      return;
    }
    if (inputChips.includes("anders") && !inputOtherText.trim()) {
      return;
    }

    const label =
      inputChips.length > 0
        ? inputChips
            .map(key =>
              key === "anders"
                ? inputOtherText.trim()
                : t(behaviorOptions.find(option => option.value === key)?.labelKey ?? "behaviors.anders"),
            )
            .join(", ")
        : t("hints.behaviorNone");

    addMessage("user", label);
    advanceStep({
      ...entry,
      behavior: inputChips,
      behaviorOther: inputChips.includes("anders") ? inputOtherText.trim() : undefined,
    });
    setInputOtherText("");
  }, [addMessage, advanceStep, entry, inputChips, inputOtherText, setInputOtherText, t]);

  const handleSubmitConfirm = useCallback(() => {
    void handlePersist(entry);
  }, [entry, handlePersist]);

  const handleTraditionalComplete = useCallback(
    (updatedEntry: WizardEntry) => {
      setEntry(updatedEntry);
      void handlePersist(updatedEntry);
    },
    [handlePersist],
  );

  useEffect(() => {
    if (isInitializedRef.current) {
      return;
    }

    isInitializedRef.current = true;
    const firstStep = filteredSteps[0];
    if (!firstStep) {
      startCoachSequence([]);
      return;
    }

    startCoachSequence([getCoachStepMessage(firstStep, entry)]);
  }, [entry, filteredSteps, getCoachStepMessage, startCoachSequence]);

  useEffect(() => {
    return () => {
      isInitializedRef.current = false;
      resetSequence();
    };
  }, [resetSequence]);

  useEffect(() => {
    const currentStep = filteredSteps[currentStepIndex];
    if (!currentStep) {
      return;
    }

    startTransition(() => {
      if (currentStep.key === "bookmark") {
        setInputBookmarked(entry.isBookmarked);
        setInputOtherText("");
        return;
      }

      if (currentStep.key === "location" && entry.location === "anders") {
        setInputOtherText(entry.locationOther ?? "");
        return;
      }

      if (currentStep.key === "company" && entry.company === "anders") {
        setInputOtherText(entry.companyOther ?? "");
        return;
      }

      if (currentStep.key === "behavior" && entry.behavior?.includes("anders")) {
        setInputOtherText(entry.behaviorOther ?? "");
        return;
      }

      setInputOtherText("");
    });
  }, [currentStepIndex, entry, filteredSteps]);

  return {
    mode,
    setMode,
    currentStepIndex,
    entry,
    completed,
    inputText,
    inputChips,
    inputEmotions,
    inputBookmarked,
    inputOtherText,
    filteredSteps,
    setEntry,
    setInputText,
    setInputChips,
    setInputEmotions,
    setInputBookmarked,
    setInputOtherText,
    handleStepBack,
    handleSkip,
    handleSubmitEntryType,
    handleSubmitDatetime,
    handleSubmitBookmark,
    handleSubmitLocation,
    handleSubmitCompany,
    handleSubmitFood,
    handleSubmitEmotions,
    handleSubmitDescription,
    handleSubmitBehavior,
    handleSubmitConfirm,
    handleTraditionalComplete,
  };
}
