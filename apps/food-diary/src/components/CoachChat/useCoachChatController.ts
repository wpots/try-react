"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { useAuth } from "@/contexts/AuthContext";
import { signInAnonymously } from "@/lib/auth";
import { saveDiaryEntry } from "@/lib/diaryEntries";

import type { CoachChatProps, WizardEntry } from "./index";
import { getDefaultEntryType } from "./utils/getDefaultEntryType";
import { getInitialEntry } from "./utils/getInitialEntry";
import {
  areEntryBehaviors,
  isEntryCompany,
  isEntryLocation,
  isEntryType,
} from "./utils/options";
import type { WizardStep } from "./utils/steps";
import { STEPS } from "./utils/steps";

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
  mode: "chat" | "form";
  setMode: (mode: "chat" | "form") => void;
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
  inputSkippedMeal: boolean | null;
  filteredSteps: WizardStep[];
  setEntry: (entry: WizardEntry) => void;
  setInputText: (value: string) => void;
  setInputChips: (value: string[]) => void;
  setInputEmotions: (value: string[]) => void;
  setInputSkippedMeal: (value: boolean | null) => void;
  handleStepBack: () => void;
  handleSkip: () => void;
  handleSubmitEntryType: () => void;
  handleSubmitDatetime: () => void;
  handleSubmitSkippedMeal: () => void;
  handleSubmitLocation: () => void;
  handleSubmitCompany: () => void;
  handleSubmitFood: () => void;
  handleSubmitEmotions: () => void;
  handleSubmitDescription: () => void;
  handleSubmitBehavior: () => void;
  handleSubmitConfirm: () => void;
  handleTraditionalComplete: (entry: WizardEntry) => void;
}

function getCoachText(rawText: unknown): string {
  return typeof rawText === "string" ? rawText : "";
}

export function useCoachChatController({
  onComplete,
}: CoachChatProps): UseCoachChatControllerResult {
  const t = useTranslations("createEntry");
  const { user } = useAuth();

  const [mode, setMode] = useState<"chat" | "form">("chat");
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
  const [inputSkippedMeal, setInputSkippedMeal] = useState<boolean | null>(
    null,
  );

  const isInitializedRef = useRef(false);
  const messageIdRef = useRef(0);
  const messagesRef = useRef<CoachChatMessage[]>([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const filteredSteps = STEPS.filter((step) =>
    step.condition ? step.condition({ entryType: entry.entryType }) : true,
  );

  const resetInputState = useCallback(() => {
    setInputText("");
    setInputChips([]);
    setInputEmotions([]);
    setInputSkippedMeal(null);
  }, []);

  const addMessage = useCallback((role: CoachChatMessage["role"], text: string) => {
    setMessages((previous) => {
      const next = [...previous, { id: messageIdRef.current + 1, role, text }];
      messageIdRef.current += 1;
      messagesRef.current = next;
      return next;
    });
  }, []);

  const showCoachMessage = useCallback(
    (stepIndex: number) => {
      if (stepIndex >= filteredSteps.length) {
        setIsTyping(true);
        window.setTimeout(() => {
          setIsTyping(false);
          addMessage("coach", t("coach.complete"));
          setCompleted(true);
        }, 800);
        return;
      }

      const step = filteredSteps[stepIndex];
      if (!step) {
        return;
      }

      setIsTyping(true);
      window.setTimeout(() => {
        const translated = getCoachText(t.raw(step.messageKey));
        setIsTyping(false);
        addMessage("coach", translated || t("coach.complete"));
      }, 700 + Math.random() * 400);
    },
    [addMessage, filteredSteps, t],
  );

  useEffect(() => {
    if (isInitializedRef.current) {
      return;
    }

    isInitializedRef.current = true;
    showCoachMessage(0);
  }, [showCoachMessage]);

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
          userId: activeUser.uid,
          entryType,
          skippedMeal: finalEntry.skippedMeal ?? false,
          foodEaten: finalEntry.foodEaten,
          description: finalEntry.description,
          emotions: finalEntry.emotions,
          location: finalEntry.location ?? "home",
          company: finalEntry.company ?? "alone",
          behavior: finalEntry.behavior,
          date: finalEntry.date,
          time: finalEntry.time,
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
    [onComplete, t, user],
  );

  const advanceStep = useCallback(
    (updatedEntry: WizardEntry) => {
      setHistory((previous) => [
        ...previous,
        { messages: [...messagesRef.current], entry },
      ]);
      setEntry(updatedEntry);

      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      resetInputState();

      if (nextIndex >= filteredSteps.length) {
        void handlePersist(updatedEntry);
        return;
      }

      showCoachMessage(nextIndex);
    },
    [
      currentStepIndex,
      entry,
      filteredSteps.length,
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
    showCoachMessage(previousIndex);
  }, [currentStepIndex, history, isTyping, resetInputState, showCoachMessage]);

  const handleSkip = useCallback(() => {
    addMessage("user", t("form.skip"));
    advanceStep(entry);
  }, [addMessage, advanceStep, entry, t]);

  const handleSubmitEntryType = useCallback(() => {
    const selected = inputChips[0];
    if (!selected || !isEntryType(selected)) {
      return;
    }

    addMessage("user", t(`entryTypes.${selected}`));
    advanceStep({ ...entry, entryType: selected });
  }, [addMessage, advanceStep, entry, inputChips, t]);

  const handleSubmitDatetime = useCallback(() => {
    addMessage("user", `${entry.date} ${entry.time}`);
    advanceStep(entry);
  }, [addMessage, advanceStep, entry]);

  const handleSubmitSkippedMeal = useCallback(() => {
    if (inputSkippedMeal == null) {
      return;
    }

    addMessage("user", inputSkippedMeal ? t("form.yes") : t("form.no"));
    advanceStep({ ...entry, skippedMeal: inputSkippedMeal });
  }, [addMessage, advanceStep, entry, inputSkippedMeal, t]);

  const handleSubmitLocation = useCallback(() => {
    const selected = inputChips[0];
    if (!selected || !isEntryLocation(selected)) {
      return;
    }

    addMessage("user", t(`locations.${selected}`));
    advanceStep({ ...entry, location: selected });
  }, [addMessage, advanceStep, entry, inputChips, t]);

  const handleSubmitCompany = useCallback(() => {
    const selected = inputChips[0];
    if (!selected || !isEntryCompany(selected)) {
      return;
    }

    addMessage("user", t(`company.${selected}`));
    advanceStep({ ...entry, company: selected });
  }, [addMessage, advanceStep, entry, inputChips, t]);

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

    const label =
      inputChips.length > 0
        ? inputChips.map((key) => t(`behaviors.${key}`)).join(", ")
        : t("hints.behaviorNone");

    addMessage("user", label);
    advanceStep({ ...entry, behavior: inputChips });
  }, [addMessage, advanceStep, entry, inputChips, t]);

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
    inputSkippedMeal,
    filteredSteps,
    setEntry,
    setInputText,
    setInputChips,
    setInputEmotions,
    setInputSkippedMeal,
    handleStepBack,
    handleSkip,
    handleSubmitEntryType,
    handleSubmitDatetime,
    handleSubmitSkippedMeal,
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
