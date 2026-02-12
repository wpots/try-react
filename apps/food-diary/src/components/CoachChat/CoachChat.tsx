"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { Button, Card, ChipSelector, EmotionPicker, TextArea } from "@repo/ui";

import { useAuth } from "@/contexts/AuthContext";
import { signInAnonymously } from "@/lib/auth";
import { saveDiaryEntry } from "@/lib/diaryEntries";

import { ChatBubble } from "./ChatBubble";
import { ProgressDots } from "./ProgressDots";
import { TypingIndicator } from "./TypingIndicator";
import type { WizardEntry } from "./types";
import { getDefaultEntryType } from "./utils/getDefaultEntryType";
import { STEPS } from "./utils/steps";
import { TraditionalForm } from "./TraditionalForm";

interface Message {
  id: number;
  role: "coach" | "user";
  text: string;
}

interface Snapshot {
  messages: Message[];
  entry: WizardEntry;
}

export interface CoachChatProps {
  onComplete?: () => void;
}

export function CoachChat({ onComplete }: CoachChatProps): React.JSX.Element {
  const t = useTranslations("createEntry");
  const { user } = useAuth();

  const [mode, setMode] = useState<"chat" | "form">("chat");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [entry, setEntry] = useState<WizardEntry>(() => {
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const time = now.toTimeString().slice(0, 5);

    return {
      entryType: null,
      skippedMeal: null,
      date,
      time,
      location: null,
      company: null,
      foodEaten: "",
      emotions: [],
      description: "",
      behavior: [],
    };
  });
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

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const msgIdRef = useRef(0);

  const filteredSteps = STEPS.filter((step) =>
    step.condition ? step.condition({ entryType: entry.entryType }) : true,
  );

  useEffect(() => {
    if (scrollRef.current) {
      const element = scrollRef.current;
      element.scrollTop = element.scrollHeight;
    }
  }, [messages, isTyping]);

  const showCoachMessage = useCallback(
    (stepIndex: number) => {
      if (stepIndex >= filteredSteps.length) {
        setIsTyping(true);
        window.setTimeout(() => {
          setIsTyping(false);
          const id = ++msgIdRef.current;
          setMessages((previous) => [
            ...previous,
            {
              id,
              role: "coach",
              text: t("coach.complete"),
            },
          ]);
          setCompleted(true);
        }, 800);
        return;
      }

      const step = filteredSteps[stepIndex];

      setIsTyping(true);
      window.setTimeout(() => {
        setIsTyping(false);
        const id = ++msgIdRef.current;
        setMessages((previous) => [
          ...previous,
          {
            id,
            role: "coach",
            text: t.raw(step.messageKey.replace("createEntry.", "")) as string,
          },
        ]);
      }, 700 + Math.random() * 400);
    },
    [filteredSteps, t],
  );

  useEffect(() => {
    showCoachMessage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addUserMessage(text: string): void {
    const id = ++msgIdRef.current;
    setMessages((previous) => [...previous, { id, role: "user", text }]);
  }

  function advanceStep(updatedEntry: WizardEntry): void {
    setHistory((previous) => [...previous, { messages: [...messages], entry }]);
    setEntry(updatedEntry);

    const nextIndex = currentStepIndex + 1;
    setCurrentStepIndex(nextIndex);

    setInputText("");
    setInputChips([]);
    setInputEmotions([]);
    setInputSkippedMeal(null);

    if (nextIndex >= filteredSteps.length) {
      void handlePersist(updatedEntry);
      return;
    }

    showCoachMessage(nextIndex);
  }

  function handleStepBack(): void {
    if (currentStepIndex === 0 || history.length === 0 || isTyping) {
      return;
    }

    const previousSnapshot = history[history.length - 1];

    setMessages(previousSnapshot.messages);
    setEntry(previousSnapshot.entry);
    setHistory((previous) => previous.slice(0, -1));
    setCurrentStepIndex((previous) => previous - 1);
    setCompleted(false);

    setInputText("");
    setInputChips([]);
    setInputEmotions([]);
    setInputSkippedMeal(null);

    showCoachMessage(currentStepIndex - 1);
  }

  function handleSkip(): void {
    addUserMessage(t("form.skip"));
    advanceStep(entry);
  }

  async function handlePersist(finalEntry: WizardEntry): Promise<void> {
    try {
      setIsSaving(true);
      setSaveError(null);

      const activeUser = user ?? (await signInAnonymously());

      const date = finalEntry.date;
      const time = finalEntry.time;
      const entryType =
        finalEntry.entryType ?? getDefaultEntryType(date, time ?? "00:00");

      await saveDiaryEntry({
        userId: activeUser.uid,
        entryType,
        skippedMeal: finalEntry.skippedMeal ?? false,
        foodEaten: finalEntry.foodEaten,
        description: finalEntry.description,
        emotions: finalEntry.emotions,
        location: (finalEntry.location ?? "home") as never,
        company: (finalEntry.company ?? "alone") as never,
        behavior: finalEntry.behavior as never,
        date,
        time,
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
  }

  function handleSubmitEntryType(): void {
    if (!inputChips[0]) {
      return;
    }

    const type = inputChips[0];
    addUserMessage(t(`entryTypes.${type}`));

    const updated: WizardEntry = {
      ...entry,
      entryType: type,
    };
    advanceStep(updated);
  }

  function handleSubmitDatetime(): void {
    addUserMessage(`${entry.date} ${entry.time}`);
    advanceStep(entry);
  }

  function handleSubmitSkippedMeal(): void {
    if (inputSkippedMeal == null) {
      return;
    }

    addUserMessage(inputSkippedMeal ? t("form.yes") : t("form.no"));
    advanceStep({ ...entry, skippedMeal: inputSkippedMeal });
  }

  function handleSubmitLocation(): void {
    if (!inputChips[0]) {
      return;
    }

    const value = inputChips[0];
    addUserMessage(t(`locations.${value}`));
    advanceStep({ ...entry, location: value });
  }

  function handleSubmitCompany(): void {
    if (!inputChips[0]) {
      return;
    }

    const value = inputChips[0];
    addUserMessage(t(`company.${value}`));
    advanceStep({ ...entry, company: value });
  }

  function handleSubmitFood(): void {
    if (!inputText.trim()) {
      return;
    }

    addUserMessage(inputText.trim());
    advanceStep({ ...entry, foodEaten: inputText.trim() });
  }

  function handleSubmitEmotions(): void {
    if (inputEmotions.length === 0) {
      return;
    }

    const label = inputEmotions
      .map((key) => t(`emotions.${key}`))
      .join(", ");
    addUserMessage(label);
    advanceStep({ ...entry, emotions: inputEmotions });
  }

  function handleSubmitDescription(): void {
    const text = inputText.trim();
    addUserMessage(text || t("form.skip"));
    advanceStep({ ...entry, description: text });
  }

  function handleSubmitBehavior(): void {
    const text =
      inputChips.length > 0
        ? inputChips.map((key) => t(`behaviors.${key}`)).join(", ")
        : t("hints.behaviorNone");
    addUserMessage(text);
    advanceStep({ ...entry, behavior: inputChips });
  }

  function handleSubmitConfirm(): void {
    void handlePersist(entry);
  }

  function renderActiveInput(): React.JSX.Element | null {
    if (completed || isTyping || mode !== "chat") {
      return null;
    }

    const step = filteredSteps[currentStepIndex];
    if (!step) {
      return null;
    }

    const isOptional = Boolean(step.optional);

    if (step.key === "entryType") {
      const now = new Date();
      const defaultTime = now.toTimeString().slice(0, 5);
      const suggestedType = getDefaultEntryType(entry.date, entry.time || defaultTime);

      const selected =
        inputChips.length > 0
          ? inputChips
          : entry.entryType
            ? [entry.entryType]
            : [suggestedType];

      return (
        <div className="animate-message-in border-t border-ds-border-subtle bg-ds-surface px-ds-l pb-ds-l pt-ds-m">
          <ChipSelector
            options={[
              { value: "breakfast", label: t("entryTypes.breakfast") },
              { value: "lunch", label: t("entryTypes.lunch") },
              { value: "dinner", label: t("entryTypes.dinner") },
              { value: "snack", label: t("entryTypes.snack") },
              { value: "moment", label: t("entryTypes.moment") },
            ]}
            selectedValues={selected}
            onSelectedValuesChange={setInputChips}
            selectionMode="single"
          />
          <div className="mt-ds-m flex justify-end">
            <Button
              variant="solid"
              size="sm"
              onPress={handleSubmitEntryType}
            >
              {t("form.confirm")}
            </Button>
          </div>
        </div>
      );
    }

    if (step.key === "datetime") {
      return (
        <div className="animate-message-in border-t border-ds-border-subtle bg-ds-surface px-ds-l pb-ds-l pt-ds-m">
          <div className="flex flex-col gap-ds-s">
            <div className="flex gap-ds-s">
              <input
                type="date"
                value={entry.date}
                onChange={(event) =>
                  setEntry({ ...entry, date: event.target.value })
                }
                className="flex-1 rounded-md border border-ds-border bg-ds-surface-elevated px-ds-m py-ds-s text-ds-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring/20"
              />
              <input
                type="time"
                value={entry.time}
                onChange={(event) =>
                  setEntry({ ...entry, time: event.target.value })
                }
                className="w-32 rounded-md border border-ds-border bg-ds-surface-elevated px-ds-m py-ds-s text-ds-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring/20"
              />
            </div>
            <div className="flex justify-end">
              <Button
                variant="solid"
                size="sm"
                onPress={handleSubmitDatetime}
              >
                {t("form.confirm")}
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (step.key === "skippedMeal") {
      return (
        <div className="animate-message-in border-t border-ds-border-subtle bg-ds-surface px-ds-l pb-ds-l pt-ds-m">
          {isOptional ? (
            <button
              type="button"
              onClick={handleSkip}
              className="mb-ds-s flex items-center gap-ds-xs text-sm text-ds-on-surface-secondary hover:text-ds-interactive"
            >
              {t("form.skip")}
            </button>
          ) : null}
          <div className="flex items-center gap-ds-s">
            <Button
              variant={inputSkippedMeal === false ? "solid" : "outline"}
              size="sm"
              onPress={() => setInputSkippedMeal(false)}
            >
              {t("form.no")}
            </Button>
            <Button
              variant={inputSkippedMeal === true ? "solid" : "outline"}
              size="sm"
              onPress={() => setInputSkippedMeal(true)}
            >
              {t("form.yes")}
            </Button>
            <div className="flex-1" />
            <Button
              variant="solid"
              size="sm"
              onPress={handleSubmitSkippedMeal}
              isDisabled={inputSkippedMeal == null}
            >
              {t("form.confirm")}
            </Button>
          </div>
        </div>
      );
    }

    if (step.key === "location") {
      return (
        <div className="animate-message-in border-t border-ds-border-subtle bg-ds-surface px-ds-l pb-ds-l pt-ds-m">
          <ChipSelector
            options={[
              { value: "home", label: t("locations.home") },
              { value: "work", label: t("locations.work") },
              { value: "restaurant", label: t("locations.restaurant") },
              { value: "friend's house", label: t("locations.friends") },
              { value: "on the road", label: t("locations.onTheRoad") },
              { value: "family event", label: t("locations.familyEvent") },
            ]}
            selectedValues={inputChips}
            onSelectedValuesChange={setInputChips}
            selectionMode="single"
          />
          <div className="mt-ds-m flex justify-end">
            <Button
              variant="solid"
              size="sm"
              onPress={handleSubmitLocation}
              isDisabled={inputChips.length === 0}
            >
              {t("form.confirm")}
            </Button>
          </div>
        </div>
      );
    }

    if (step.key === "company") {
      return (
        <div className="animate-message-in border-t border-ds-border-subtle bg-ds-surface px-ds-l pb-ds-l pt-ds-m">
          <ChipSelector
            options={[
              { value: "alone", label: t("company.alone") },
              { value: "partner", label: t("company.partner") },
              { value: "family", label: t("company.family") },
              { value: "friends", label: t("company.friends") },
              { value: "colleagues", label: t("company.colleagues") },
              { value: "kids", label: t("company.kids") },
            ]}
            selectedValues={inputChips}
            onSelectedValuesChange={setInputChips}
            selectionMode="single"
          />
          <div className="mt-ds-m flex justify-end">
            <Button
              variant="solid"
              size="sm"
              onPress={handleSubmitCompany}
              isDisabled={inputChips.length === 0}
            >
              {t("form.confirm")}
            </Button>
          </div>
        </div>
      );
    }

    if (step.key === "foodEaten") {
      return (
        <div className="animate-message-in border-t border-ds-border-subtle bg-ds-surface px-ds-l pb-ds-l pt-ds-m">
          <TextArea
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
            placeholder={t("placeholders.foodEaten")}
          />
          <p className="mt-ds-xs text-xs text-ds-on-surface-secondary">
            {t("placeholders.foodEatenAi")}
          </p>
          <div className="mt-ds-m flex justify-end">
            <Button
              variant="solid"
              size="sm"
              onPress={handleSubmitFood}
              isDisabled={!inputText.trim()}
            >
              {t("form.confirm")}
            </Button>
          </div>
        </div>
      );
    }

    if (step.key === "emotions") {
      return (
        <div className="animate-message-in border-t border-ds-border-subtle bg-ds-surface px-ds-l pb-ds-l pt-ds-m">
          <EmotionPicker
            selectedKeys={inputEmotions}
            onSelectedKeysChange={setInputEmotions}
          />
          <div className="mt-ds-m flex justify-end">
            <Button
              variant="solid"
              size="sm"
              onPress={handleSubmitEmotions}
              isDisabled={inputEmotions.length === 0}
            >
              {t("form.confirm")}
            </Button>
          </div>
        </div>
      );
    }

    if (step.key === "description") {
      return (
        <div className="animate-message-in border-t border-ds-border-subtle bg-ds-surface px-ds-l pb-ds-l pt-ds-m">
          {isOptional ? (
            <button
              type="button"
              onClick={handleSkip}
              className="mb-ds-s flex items-center gap-ds-xs text-sm text-ds-on-surface-secondary hover:text-ds-interactive"
            >
              {t("form.skip")}
            </button>
          ) : null}
          <TextArea
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
            placeholder={t("placeholders.description")}
          />
          <div className="mt-ds-m flex justify-end">
            <Button
              variant="solid"
              size="sm"
              onPress={handleSubmitDescription}
            >
              {inputText.trim() ? t("form.confirm") : t("form.skip")}
            </Button>
          </div>
        </div>
      );
    }

    if (step.key === "behavior") {
      return (
        <div className="animate-message-in border-t border-ds-border-subtle bg-ds-surface px-ds-l pb-ds-l pt-ds-m">
          {isOptional ? (
            <button
              type="button"
              onClick={handleSkip}
              className="mb-ds-s flex items-center gap-ds-xs text-sm text-ds-on-surface-secondary hover:text-ds-interactive"
            >
              {t("form.skip")}
            </button>
          ) : null}
          <ChipSelector
            options={[
              {
                value: "restricted",
                label: t("behaviors.restricted"),
              },
              {
                value: "binged",
                label: t("behaviors.binged"),
              },
              {
                value: "overate",
                label: t("behaviors.overate"),
              },
              {
                value: "threw up",
                label: t("behaviors.threwUp"),
              },
            ]}
            selectedValues={inputChips}
            onSelectedValuesChange={setInputChips}
            selectionMode="multiple"
            variant="gentle"
          />
          <div className="mt-ds-m flex justify-end">
            <Button
              variant="solid"
              size="sm"
              onPress={handleSubmitBehavior}
            >
              {t("form.confirm")}
            </Button>
          </div>
        </div>
      );
    }

    if (step.key === "confirm") {
      return (
        <div className="animate-message-in border-t border-ds-border-subtle bg-ds-surface px-ds-l pb-ds-l pt-ds-m">
          <Card className="space-y-ds-s">
            <p className="text-sm text-ds-on-surface-secondary">
              {t("coach.confirm")}
            </p>
            <ul className="space-y-ds-xs text-sm">
              <li>
                <strong>{t("fields.type")}:</strong>{" "}
                {entry.entryType ? t(`entryTypes.${entry.entryType}`) : "—"}
              </li>
              <li>
                <strong>{t("fields.datetime")}:</strong>{" "}
                {entry.date} {entry.time}
              </li>
              <li>
                <strong>{t("coach.location")}:</strong>{" "}
                {entry.location ? t(`locations.${entry.location}`) : "—"}
              </li>
              <li>
                <strong>{t("coach.company")}:</strong>{" "}
                {entry.company ? t(`company.${entry.company}`) : "—"}
              </li>
              <li>
                <strong>{t("coach.foodEaten")}:</strong>{" "}
                {entry.foodEaten || "—"}
              </li>
            </ul>
            {saveError ? (
              <p className="text-sm text-ds-danger">{saveError}</p>
            ) : null}
            <div className="mt-ds-m flex justify-end gap-ds-s">
              <Button
                variant="outline"
                size="sm"
                onPress={handleStepBack}
              >
                {t("form.edit")}
              </Button>
              <Button
                variant="solid"
                size="sm"
                onPress={handleSubmitConfirm}
                isDisabled={isSaving}
              >
                {isSaving ? t("saving") : t("form.submit")}
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return null;
  }

  if (mode === "form") {
    return (
      <TraditionalForm
        initialEntry={entry}
        onSwitchToChat={() => setMode("chat")}
        onComplete={(updated) => {
          setEntry(updated);
          void handlePersist(updated);
        }}
      />
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-ds-border-subtle bg-ds-surface/80 px-ds-l py-ds-m">
        <div className="flex items-center gap-ds-m">
          <button
            type="button"
            onClick={handleStepBack}
            disabled={currentStepIndex === 0 || isTyping}
            className="flex h-8 w-8 items-center justify-center rounded-md text-ds-on-surface-secondary hover:bg-ds-surface-muted hover:text-ds-on-surface disabled:pointer-events-none disabled:opacity-40"
            aria-label={t("form.back")}
          >
            ←
          </button>
          <ProgressDots
            total={filteredSteps.length}
            currentIndex={currentStepIndex}
          />
        </div>
        <button
          type="button"
          onClick={() => setMode("form")}
          className="text-sm font-medium text-ds-on-surface-secondary hover:text-ds-interactive"
        >
          {t("form.switchToForm")}
        </button>
      </div>

      <div
        ref={scrollRef}
        className="chat-scroll flex-1 overflow-y-auto px-ds-l py-ds-xl"
      >
        <div className="mx-auto flex max-w-2xl flex-col gap-ds-m">
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              role={message.role}
            >
              {message.text}
            </ChatBubble>
          ))}
          {isTyping ? <TypingIndicator /> : null}
        </div>
      </div>

      <div className="mx-auto w-full max-w-2xl">{renderActiveInput()}</div>
    </div>
  );
}

