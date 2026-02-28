"use client";

import { emotions as emotionDefinitions } from "@repo/ui";
import { useCallback, useEffect, useRef, useState } from "react";

import { formatDatetimeHuman } from "../utils/formatDatetimeHuman";

import type { WizardEntry } from "../index";
import type { WizardStep, WizardStepKey } from "../utils/steps";
import type { useTranslations } from "next-intl";
import type { Dispatch, SetStateAction } from "react";

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === "string");
}

function isStringArrayMap(value: unknown): value is Record<string, string[]> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).every(entry => isStringArray(entry));
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
  emotionDefinitions.filter(emotion => emotion.category === "negative").map(emotion => emotion.key),
);

type EntryTranslations = ReturnType<typeof useTranslations>;

export interface CoachChatMessage {
  id: number;
  role: "coach" | "user";
  text: string;
}

interface UseCoachChatMessagingArgs {
  locale: string;
  t: EntryTranslations;
}

export interface UseCoachChatMessagingResult {
  messages: CoachChatMessage[];
  isTyping: boolean;
  addMessage: (role: CoachChatMessage["role"], text: string) => void;
  setMessages: Dispatch<SetStateAction<CoachChatMessage[]>>;
  startCoachSequence: (coachTexts: string[]) => void;
  resetSequence: () => void;
  captureMessagesSnapshot: () => CoachChatMessage[];
  getCoachReplyMessage: (step: WizardStep | undefined, wasSkipped: boolean, targetEntry: WizardEntry) => string;
  getCoachStepMessage: (step: WizardStep, targetEntry: WizardEntry) => string;
}

export function useCoachChatMessaging({ locale, t }: UseCoachChatMessagingArgs): UseCoachChatMessagingResult {
  const [messages, setMessages] = useState<CoachChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const messageIdRef = useRef(0);
  const messagesRef = useRef<CoachChatMessage[]>([]);
  const coachSequenceIdRef = useRef(0);
  const timeoutIdsRef = useRef<number[]>([]);
  const replyRotationRef = useRef<Record<string, number>>({});

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const addMessage = useCallback((role: CoachChatMessage["role"], text: string) => {
    setMessages(previous => {
      const next = [...previous, { id: messageIdRef.current + 1, role, text }];
      messageIdRef.current += 1;
      messagesRef.current = next;
      return next;
    });
  }, []);

  const clearPendingCoachTimeouts = useCallback(() => {
    timeoutIdsRef.current.forEach(timeoutId => {
      window.clearTimeout(timeoutId);
    });
    timeoutIdsRef.current = [];
  }, []);

  const startCoachSequence = useCallback(
    (coachTexts: string[]) => {
      const queue = coachTexts.map(text => text.trim()).filter(text => text.length > 0);

      coachSequenceIdRef.current += 1;
      const sequenceId = coachSequenceIdRef.current;
      clearPendingCoachTimeouts();

      if (queue.length === 0) {
        setIsTyping(false);
        return;
      }

      setIsTyping(true);

      const scheduleNext = (index: number): void => {
        const timeoutId = window.setTimeout(
          () => {
            timeoutIdsRef.current = timeoutIdsRef.current.filter(id => id !== timeoutId);

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
          },
          MIN_TYPING_DELAY_MS + Math.random() * TYPING_DELAY_VARIANCE_MS,
        );

        timeoutIdsRef.current.push(timeoutId);
      };

      scheduleNext(0);
    },
    [addMessage, clearPendingCoachTimeouts],
  );

  const resetSequence = useCallback(() => {
    coachSequenceIdRef.current += 1;
    clearPendingCoachTimeouts();
  }, [clearPendingCoachTimeouts]);

  const captureMessagesSnapshot = useCallback(() => [...messagesRef.current], []);

  const getReplyArray = useCallback(
    (key: string): string[] => {
      try {
        const rawValue = t.raw(key);
        if (!isStringArray(rawValue)) {
          return [];
        }

        return rawValue.map(message => message.trim()).filter(message => message.length > 0);
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
          const sanitizedMessages = messages.map(message => message.trim()).filter(message => message.length > 0);

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

  const getRotatingReply = useCallback((messages: string[], rotationKey: string, fallbackMessage: string): string => {
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
  }, []);

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
        return getRotatingReply(scopedReplies, `${rotationPrefix}.${value}`, fallback);
      }

      const defaultReplies = getReplyArray(defaultKey);
      if (defaultReplies.length > 0) {
        return getRotatingReply(defaultReplies, `${rotationPrefix}.default`, fallback);
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
      const scopedReplies = targetEntry.behavior.reduce<string[]>((allReplies, behavior) => {
        const mappedReplies = behaviorReplyMap[behavior];
        if (!mappedReplies || mappedReplies.length === 0) {
          return allReplies;
        }

        return [...allReplies, ...mappedReplies];
      }, []);

      if (scopedReplies.length > 0) {
        const rotationKey = targetEntry.behavior.join("|") || "behavior.scoped";
        return getRotatingReply(scopedReplies, `behavior.${rotationKey}`, t("coachReplies.behavior"));
      }

      const defaultReplies = getReplyArray("coachReplies.behaviorDefaults");
      return getRotatingReply(defaultReplies, "behavior.default", t("coachReplies.behavior"));
    },
    [getReplyArray, getReplyArrayMap, getRotatingReply, t],
  );

  const getEmotionReplyMessage = useCallback(
    (targetEntry: WizardEntry): string => {
      const hasNegativeEmotion = targetEntry.emotions.some(emotion => negativeEmotionKeys.has(emotion));
      if (hasNegativeEmotion) {
        const supportiveReplies = getReplyArray("coachReplies.emotionsSupportive");
        return getRotatingReply(supportiveReplies, "emotions.supportive", t("coachReplies.emotions"));
      }

      if (targetEntry.emotions.length > 0) {
        const motivationalReplies = getReplyArray("coachReplies.emotionsMotivational");
        return getRotatingReply(motivationalReplies, "emotions.motivational", t("coachReplies.emotions"));
      }

      return t("coachReplies.emotions");
    },
    [getReplyArray, getRotatingReply, t],
  );

  const getThoughtsReplyMessage = useCallback((): string => {
    const thoughtsReplies = getReplyArray("coachReplies.thoughtsReflective");
    return getRotatingReply(thoughtsReplies, "thoughts.reflective", t("coachReplies.description"));
  }, [getReplyArray, getRotatingReply, t]);

  const getCoachReplyMessage = useCallback(
    (step: WizardStep | undefined, wasSkipped: boolean, targetEntry: WizardEntry): string => {
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
        moment: formatDatetimeHuman(targetEntry.date, targetEntry.time || "00:00", locale),
      });
    },
    [locale, t],
  );

  return {
    messages,
    isTyping,
    addMessage,
    setMessages,
    startCoachSequence,
    resetSequence,
    captureMessagesSnapshot,
    getCoachReplyMessage,
    getCoachStepMessage,
  };
}
