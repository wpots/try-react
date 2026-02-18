"use client";

import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { signInAnonymously } from "@/lib/auth";
import { saveDiaryEntry } from "@/lib/diaryEntries";

import { formatDatetimeHuman } from "./utils/formatDatetimeHuman";
import { getDefaultEntryType } from "./utils/getDefaultEntryType";
import { getInitialEntry } from "./utils/getInitialEntry";
import {
  areEntryBehaviors,
  behaviorOptions,
  companyOptions,
  isEntryCompany,
  isEntryLocation,
  isEntryType,
  locationOptions,
} from "./utils/options";
import { STEPS } from "./utils/steps";

import type { CoachChatProps, EntryFormMode, WizardEntry } from "./index";
import type { WizardStep } from "./utils/steps";

export interface CoachChatMessage {
  id: number;
  role: "coach" | "user";
  text: string;
}

interface Snapshot {
  messages: CoachChatMessage[];
  entry: WizardEntry;
}

export interface UseCoachChatControllerResult {
  mode: EntryFormMode;
  setMode: (mode: EntryFormMode) => void;
  currentStepIndex: number;
  messages: CoachChatMessage[];
  isTyping: boolean;
  entry: WizardEntry;
  completed: boolean;
  isSaving: boolean;
  saveError: string | null;
  inputText: string;
  inputChips: string[];
  inputEmotions: string[];
  inputBookmarked: boolean | null;
  inputOtherText: string;
  filteredSteps: WizardStep[];
  setEntry: (entry: WizardEntry) => void;
  setInputText: (value: string) => void;
  setInputChips: (value: string[]) => void;
  setInputEmotions: (value: string[]) => void;
  setInputBookmarked: (value: boolean | null) => void;
  setInputOtherText: (value: string) => void;
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

function getFilteredSteps(entry: WizardEntry): WizardStep[] {
  return STEPS.filter((step) =>
    step.condition
      ? step.condition({
          entryType: entry.entryType,
          behavior: entry.behavior,
          emotions: entry.emotions,
        })
      : true,
  );
}

export function useCoachChatController({
  entryId,
  initialMode = "chat",
  onComplete,
}: CoachChatProps): UseCoachChatControllerResult {
  const { user } = useAuth();

  const [mode, setMode] = useState<EntryFormMode>(initialMode);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [messages, setMessages] = useState<CoachChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [entry, setEntry] = useState<WizardEntry>(getInitialEntry);
  const [history, setHistory] = useState<Snapshot[]>([]);
  const [completed, setCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [inputChips, setInputChips] = useState<string[]>([]);
  const [inputEmotions, setInputEmotions] = useState<string[]>([]);
  const [inputBookmarked, setInputBookmarked] = useState<boolean | null>(null);
  const [inputOtherText, setInputOtherText] = useState("");

  const isInitializedRef = useRef(false);
  const messageIdRef = useRef(0);
  const messagesRef = useRef<CoachChatMessage[]>([]);

  const locale = useLocale();
  const t = useTranslations("entry");

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const filteredSteps = getFilteredSteps(entry);

  const resetInputState = useCallback(() => {
    setInputText("");
    setInputChips([]);
    setInputEmotions([]);
    setInputBookmarked(null);
    setInputOtherText("");
  }, []);

  const addMessage = useCallback(
    (role: CoachChatMessage["role"], text: string) => {
      setMessages((previous) => {
        const next = [...previous, { id: messageIdRef.current + 1, role, text }];
        messageIdRef.current += 1;
        messagesRef.current = next;
        return next;
      });
    },
    [],
  );

  const showCoachMessage = useCallback(
    (stepIndex: number, steps: WizardStep[]) => {
      if (stepIndex >= steps.length) {
        setIsTyping(true);
        window.setTimeout(() => {
          setIsTyping(false);
          addMessage("coach", t("coach.complete"));
          setCompleted(true);
        }, 800);
        return;
      }

      const step = steps[stepIndex];
      if (!step) {
        return;
      }

      setIsTyping(true);
      window.setTimeout(() => {
        setIsTyping(false);
        addMessage("coach", t(step.messageKey));
      }, 700 + Math.random() * 400);
    },
    [addMessage, t],
  );

  useEffect(() => {
    if (isInitializedRef.current) {
      return;
    }

    isInitializedRef.current = true;
    showCoachMessage(0, filteredSteps);
  }, [filteredSteps, showCoachMessage]);

  useEffect(() => {
    const currentStep = filteredSteps[currentStepIndex];
    if (!currentStep) {
      return;
    }
    if (currentStep.key === "bookmark") {
      setInputBookmarked(entry.isBookmarked);
      setInputOtherText("");
    } else if (currentStep.key === "location" && entry.location === "anders") {
      setInputOtherText(entry.locationOther ?? "");
    } else if (currentStep.key === "company" && entry.company === "anders") {
      setInputOtherText(entry.companyOther ?? "");
    } else if (
      currentStep.key === "behavior" &&
      entry.behavior?.includes("anders")
    ) {
      setInputOtherText(entry.behaviorOther ?? "");
    } else {
      setInputOtherText("");
    }
  }, [currentStepIndex, filteredSteps, entry]);

  const handlePersist = useCallback(
    async (finalEntry: WizardEntry) => {
      try {
        setIsSaving(true);
        setSaveError(null);

        const activeUser = user ?? (await signInAnonymously());
        const entryType =
          finalEntry.entryType ??
          getDefaultEntryType(finalEntry.date, finalEntry.time || "00:00");

        await saveDiaryEntry({
          entryId,
          userId: activeUser.uid,
          entryType,
          foodEaten: finalEntry.foodEaten,
          description: finalEntry.description,
          emotions: finalEntry.emotions,
          location: finalEntry.location ?? "home",
          company: finalEntry.company ?? "alone",
          behavior: finalEntry.behavior,
          date: finalEntry.date,
          time: finalEntry.time,
          locationOther: finalEntry.locationOther,
          companyOther: finalEntry.companyOther,
          behaviorOther: finalEntry.behaviorOther,
          isBookmarked: finalEntry.isBookmarked,
          imageUrl: finalEntry.imageUrl,
          imagePublicId: finalEntry.imagePublicId,
        });

        setCompleted(true);
        if (onComplete) {
          onComplete();
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : t("errors.saveFailed");
        setSaveError(message);
      } finally {
        setIsSaving(false);
      }
    },
    [entryId, onComplete, t, user],
  );

  const advanceStep = useCallback(
    (updatedEntry: WizardEntry) => {
      setHistory((previous) => [
        ...previous,
        { messages: [...messagesRef.current], entry },
      ]);
      setEntry(updatedEntry);

      const nextIndex = currentStepIndex + 1;
      const nextSteps = getFilteredSteps(updatedEntry);
      setCurrentStepIndex(nextIndex);
      resetInputState();

      if (nextIndex >= nextSteps.length) {
        void handlePersist(updatedEntry);
        return;
      }

      showCoachMessage(nextIndex, nextSteps);
    },
    [
      currentStepIndex,
      entry,
      handlePersist,
      resetInputState,
      showCoachMessage,
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
    setMessages(previousSnapshot.messages);
    setEntry(previousSnapshot.entry);
    setHistory((previous) => previous.slice(0, -1));
    setCurrentStepIndex(previousIndex);
    setCompleted(false);
    resetInputState();
    showCoachMessage(
      previousIndex,
      getFilteredSteps(previousSnapshot.entry),
    );
  }, [currentStepIndex, history, isTyping, resetInputState, showCoachMessage]);

  const handleSkip = useCallback(() => {
    addMessage("user", t("form.skip"));
    advanceStep(entry);
  }, [addMessage, advanceStep, entry, t]);

  const handleSubmitEntryType = useCallback(() => {
    const fallbackTime = new Date().toTimeString().slice(0, 5);
    const suggestedType = getDefaultEntryType(
      entry.date,
      entry.time || fallbackTime,
    );
    const selected = inputChips[0] ?? entry.entryType ?? suggestedType;
    if (!selected || !isEntryType(selected)) {
      return;
    }

    addMessage("user", t(`entryTypes.${selected}`));
    advanceStep({ ...entry, entryType: selected });
  }, [addMessage, advanceStep, entry, inputChips, t]);

  const handleSubmitDatetime = useCallback(() => {
    addMessage("user", formatDatetimeHuman(entry.date, entry.time ?? "00:00", locale));
    advanceStep(entry);
  }, [addMessage, advanceStep, entry, locale]);

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
          : t(locationOptions.find((o) => o.value === selected)?.labelKey ?? "locations.anders");
      addMessage("user", label);
      advanceStep({
        ...entry,
        location: selected,
        locationOther: selected === "anders" ? inputOtherText.trim() : undefined,
      });
      setInputOtherText("");
    },
    [addMessage, advanceStep, entry, inputChips, inputOtherText, t],
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
          : t(companyOptions.find((o) => o.value === selected)?.labelKey ?? "company.anders");
      addMessage("user", label);
      advanceStep({
        ...entry,
        company: selected,
        companyOther: selected === "anders" ? inputOtherText.trim() : undefined,
      });
      setInputOtherText("");
    },
    [addMessage, advanceStep, entry, inputChips, inputOtherText, t],
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

    const label = inputEmotions.map((key) => t(`emotions.${key}`)).join(", ");
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
            .map((key) =>
              key === "anders"
                ? inputOtherText.trim()
                : t(behaviorOptions.find((o) => o.value === key)?.labelKey ?? "behaviors.anders"),
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
  }, [addMessage, advanceStep, entry, inputChips, inputOtherText, t]);

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

  return {
    mode,
    setMode,
    currentStepIndex,
    messages,
    isTyping,
    entry,
    completed,
    isSaving,
    saveError,
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
