"use client";

import { emotions as emotionDefinitions } from "@repo/ui";
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
import type { WizardStep, WizardStepKey } from "./utils/steps";

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

const COACH_REPLY_KEYS: Record<WizardStepKey, string> = {
  entryType: "coachReplies.entryType",
  datetime: "coachReplies.datetime",
  location: "coachReplies.location",
  company: "coachReplies.company",
  behavior: "coachReplies.behavior",
  foodEaten: "coachReplies.foodEaten",
  emotions: "coachReplies.emotions",
  description: "coachReplies.description",
  bookmark: "coachReplies.bookmark",
  confirm: "coachReplies.confirm",
};

const MIN_TYPING_DELAY_MS = 550;
const TYPING_DELAY_VARIANCE_MS = 350;
const negativeEmotionKeys = new Set(
  emotionDefinitions
    .filter((emotion) => emotion.category === "negative")
    .map((emotion) => emotion.key),
);

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((item) => typeof item === "string")
  );
}

function isStringArrayMap(value: unknown): value is Record<string, string[]> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).every((entry) => isStringArray(entry));
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
  const coachSequenceIdRef = useRef(0);
  const timeoutIdsRef = useRef<number[]>([]);
  const initialDatetimeRef = useRef<{ date: string; time: string }>({
    date: entry.date,
    time: entry.time,
  });
  const replyRotationRef = useRef<Record<string, number>>({});

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

  const clearPendingCoachTimeouts = useCallback(() => {
    timeoutIdsRef.current.forEach((timeoutId) => {
      window.clearTimeout(timeoutId);
    });
    timeoutIdsRef.current = [];
  }, []);

  const startCoachSequence = useCallback(
    (coachTexts: string[]) => {
      const queue = coachTexts
        .map((text) => text.trim())
        .filter((text) => text.length > 0);

      coachSequenceIdRef.current += 1;
      const sequenceId = coachSequenceIdRef.current;
      clearPendingCoachTimeouts();

      if (queue.length === 0) {
        setIsTyping(false);
        return;
      }

      setIsTyping(true);

      const scheduleNext = (index: number): void => {
        const timeoutId = window.setTimeout(() => {
          timeoutIdsRef.current = timeoutIdsRef.current.filter(
            (id) => id !== timeoutId,
          );

          if (coachSequenceIdRef.current !== sequenceId) {
            return;
          }

          const text = queue[index];
          if (!text) {
            return;
          }

          addMessage("coach", text);

          const isLast = index === queue.length - 1;
          if (isLast) {
            setIsTyping(false);
            return;
          }

          scheduleNext(index + 1);
        }, MIN_TYPING_DELAY_MS + Math.random() * TYPING_DELAY_VARIANCE_MS);

        timeoutIdsRef.current.push(timeoutId);
      };

      scheduleNext(0);
    },
    [addMessage, clearPendingCoachTimeouts],
  );

  const getReplyArray = useCallback(
    (key: string): string[] => {
      try {
        const rawValue = t.raw(key);
        if (!isStringArray(rawValue)) {
          return [];
        }

        return rawValue
          .map((message) => message.trim())
          .filter((message) => message.length > 0);
      } catch {
        return [];
      }
    },
    [t],
  );

  const getReplyArrayMap = useCallback(
    (key: string): Record<string, string[]> => {
      try {
        const rawValue = t.raw(key);
        if (!isStringArrayMap(rawValue)) {
          return {};
        }

        const replyMap: Record<string, string[]> = {};
        Object.entries(rawValue).forEach(([replyKey, messages]) => {
          const sanitizedMessages = messages
            .map((message) => message.trim())
            .filter((message) => message.length > 0);

          if (sanitizedMessages.length > 0) {
            replyMap[replyKey] = sanitizedMessages;
          }
        });

        return replyMap;
      } catch {
        return {};
      }
    },
    [t],
  );

  const getRotatingReply = useCallback(
    (
      messages: string[],
      rotationKey: string,
      fallbackMessage: string,
    ): string => {
      if (messages.length === 0) {
        return fallbackMessage;
      }

      const index = replyRotationRef.current[rotationKey] ?? 0;
      const normalizedIndex = index % messages.length;
      const selectedMessage = messages[normalizedIndex];
      replyRotationRef.current[rotationKey] = normalizedIndex + 1;

      if (!selectedMessage) {
        return fallbackMessage;
      }

      return selectedMessage;
    },
    [],
  );

  const getSingleValueReplyMessage = useCallback(
    ({
      byTypeKey,
      defaultKey,
      fallback,
      rotationPrefix,
      value,
    }: {
      byTypeKey: string;
      defaultKey: string;
      fallback: string;
      rotationPrefix: string;
      value: string | null;
    }): string => {
      if (!value) {
        return fallback;
      }

      const repliesByType = getReplyArrayMap(byTypeKey);
      const scopedReplies = repliesByType[value];
      if (scopedReplies && scopedReplies.length > 0) {
        return getRotatingReply(
          scopedReplies,
          `${rotationPrefix}.${value}`,
          fallback,
        );
      }

      const defaultReplies = getReplyArray(defaultKey);
      if (defaultReplies.length > 0) {
        return getRotatingReply(
          defaultReplies,
          `${rotationPrefix}.default`,
          fallback,
        );
      }

      return fallback;
    },
    [getReplyArray, getReplyArrayMap, getRotatingReply],
  );

  const getLocationReplyMessage = useCallback(
    (targetEntry: WizardEntry): string =>
      getSingleValueReplyMessage({
        byTypeKey: "coachReplies.locationByType",
        defaultKey: "coachReplies.locationDefaults",
        fallback: "",
        rotationPrefix: "location",
        value: targetEntry.location,
      }),
    [getSingleValueReplyMessage],
  );

  const getEntryTypeReplyMessage = useCallback(
    (targetEntry: WizardEntry): string => {
      const selectedType = targetEntry.entryType;
      if (!selectedType) {
        return "";
      }

      const repliesByType = getReplyArrayMap("coachReplies.entryTypeByType");
      const scopedReplies = repliesByType[selectedType] ?? [];
      return getRotatingReply(scopedReplies, `entryType.${selectedType}`, "");
    },
    [getReplyArrayMap, getRotatingReply],
  );

  const getCompanyReplyMessage = useCallback(
    (targetEntry: WizardEntry): string =>
      getSingleValueReplyMessage({
        byTypeKey: "coachReplies.companyByType",
        defaultKey: "coachReplies.companyDefaults",
        fallback: "",
        rotationPrefix: "company",
        value: targetEntry.company,
      }),
    [getSingleValueReplyMessage],
  );

  const getBehaviorReplyMessage = useCallback(
    (targetEntry: WizardEntry): string => {
      const behaviorReplyMap = getReplyArrayMap("coachReplies.behaviorByType");
      const scopedReplies = targetEntry.behavior.reduce<string[]>(
        (allReplies, behavior) => {
          const mappedReplies = behaviorReplyMap[behavior];
          if (!mappedReplies || mappedReplies.length === 0) {
            return allReplies;
          }

          return [...allReplies, ...mappedReplies];
        },
        [],
      );

      if (scopedReplies.length > 0) {
        const rotationKey =
          targetEntry.behavior.join("|") || "behavior.scoped";
        return getRotatingReply(
          scopedReplies,
          `behavior.${rotationKey}`,
          t("coachReplies.behavior"),
        );
      }

      const defaultReplies = getReplyArray("coachReplies.behaviorDefaults");
      return getRotatingReply(
        defaultReplies,
        "behavior.default",
        t("coachReplies.behavior"),
      );
    },
    [getReplyArray, getReplyArrayMap, getRotatingReply, t],
  );

  const getEmotionReplyMessage = useCallback(
    (targetEntry: WizardEntry): string => {
      const hasNegativeEmotion = targetEntry.emotions.some((emotion) =>
        negativeEmotionKeys.has(emotion),
      );
      if (hasNegativeEmotion) {
        const supportiveReplies = getReplyArray(
          "coachReplies.emotionsSupportive",
        );
        return getRotatingReply(
          supportiveReplies,
          "emotions.supportive",
          t("coachReplies.emotions"),
        );
      }

      if (targetEntry.emotions.length > 0) {
        const motivationalReplies = getReplyArray(
          "coachReplies.emotionsMotivational",
        );
        return getRotatingReply(
          motivationalReplies,
          "emotions.motivational",
          t("coachReplies.emotions"),
        );
      }

      return t("coachReplies.emotions");
    },
    [getReplyArray, getRotatingReply, t],
  );

  const getThoughtsReplyMessage = useCallback((): string => {
    const thoughtsReplies = getReplyArray("coachReplies.thoughtsReflective");
    return getRotatingReply(
      thoughtsReplies,
      "thoughts.reflective",
      t("coachReplies.description"),
    );
  }, [getReplyArray, getRotatingReply, t]);

  const getCoachReplyMessage = useCallback(
    (
      step: WizardStep | undefined,
      wasSkipped: boolean,
      targetEntry: WizardEntry,
    ): string => {
      if (wasSkipped) {
        return t("coachReplies.skip");
      }

      if (!step) {
        return t("coachReplies.default");
      }

      const replyKey = step.replyKey ?? step.key;
      if (replyKey === "entryType") {
        return getEntryTypeReplyMessage(targetEntry);
      }
      if (replyKey === "location") {
        return getLocationReplyMessage(targetEntry);
      }
      if (replyKey === "company") {
        return getCompanyReplyMessage(targetEntry);
      }
      if (replyKey === "behavior") {
        return getBehaviorReplyMessage(targetEntry);
      }
      if (replyKey === "emotions") {
        return getEmotionReplyMessage(targetEntry);
      }
      if (replyKey === "description") {
        return getThoughtsReplyMessage();
      }

      return t(COACH_REPLY_KEYS[replyKey]);
    },
    [
      getCompanyReplyMessage,
      getBehaviorReplyMessage,
      getEntryTypeReplyMessage,
      getEmotionReplyMessage,
      getLocationReplyMessage,
      getThoughtsReplyMessage,
      t,
    ],
  );

  const getCoachStepMessage = useCallback(
    (step: WizardStep, targetEntry: WizardEntry): string => {
      if (step.key !== "datetime") {
        return t(step.messageKey);
      }

      return t(step.messageKey, {
        moment: formatDatetimeHuman(
          targetEntry.date,
          targetEntry.time || "00:00",
          locale,
        ),
      });
    },
    [locale, t],
  );

  const isDatetimeUnchanged = useCallback(
    (targetEntry: WizardEntry): boolean =>
      targetEntry.date === initialDatetimeRef.current.date &&
      targetEntry.time === initialDatetimeRef.current.time,
    [],
  );

  useEffect(() => {
    if (isInitializedRef.current) {
      return;
    }

    isInitializedRef.current = true;
    const firstStep = filteredSteps[0];
    if (!firstStep) {
      setIsTyping(false);
      return;
    }

    startCoachSequence([getCoachStepMessage(firstStep, entry)]);
  }, [entry, filteredSteps, getCoachStepMessage, startCoachSequence]);

  useEffect(() => {
    return () => {
      isInitializedRef.current = false;
      coachSequenceIdRef.current += 1;
      clearPendingCoachTimeouts();
    };
  }, [clearPendingCoachTimeouts]);

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
    (
      updatedEntry: WizardEntry,
      options?: {
        wasSkipped?: boolean;
        skipAcknowledgement?: boolean;
      },
    ) => {
      const answeredStep = filteredSteps[currentStepIndex];
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

      const nextStep = nextSteps[nextIndex];
      if (!nextStep) {
        return;
      }

      if (options?.skipAcknowledgement) {
        startCoachSequence([getCoachStepMessage(nextStep, updatedEntry)]);
        return;
      }

      const acknowledgement = getCoachReplyMessage(
        answeredStep,
        options?.wasSkipped ?? false,
        updatedEntry,
      );
      startCoachSequence([
        acknowledgement,
        getCoachStepMessage(nextStep, updatedEntry),
      ]);
    },
    [
      filteredSteps,
      currentStepIndex,
      entry,
      getCoachStepMessage,
      getCoachReplyMessage,
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
    setHistory((previous) => previous.slice(0, -1));
    setCurrentStepIndex(previousIndex);
    setCompleted(false);
    resetInputState();

    if (!previousStep) {
      setIsTyping(false);
      return;
    }

    startCoachSequence([
      t("coachReplies.stepBack"),
      getCoachStepMessage(previousStep, previousSnapshot.entry),
    ]);
  }, [
    currentStepIndex,
    getCoachStepMessage,
    history,
    isTyping,
    resetInputState,
    startCoachSequence,
    t,
  ]);

  const handleSkip = useCallback(() => {
    addMessage("user", t("form.skip"));
    advanceStep(entry, { wasSkipped: true });
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
    const unchangedDatetime = isDatetimeUnchanged(entry);
    const message = unchangedDatetime
      ? t("form.ok")
      : formatDatetimeHuman(entry.date, entry.time || "00:00", locale);

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
