"use client";

import { useEffect, useRef } from "react";

import type { CoachChatProps } from "./index";
import { TraditionalForm } from "./TraditionalForm";
import { CoachChatActiveInput } from "./partials/CoachChatActiveInput";
import { CoachChatHeader } from "./partials/CoachChatHeader";
import { CoachChatMessages } from "./partials/CoachChatMessages";
import { useCoachChatController } from "./useCoachChatController";

export function CoachChat({ onComplete }: CoachChatProps): React.JSX.Element {
  const controller = useCoachChatController({ onComplete });
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollRef.current) {
      return;
    }

    const element = scrollRef.current;
    element.scrollTop = element.scrollHeight;
  }, [controller.messages, controller.isTyping]);

  if (controller.mode === "form") {
    return (
      <TraditionalForm
        initialEntry={controller.entry}
        onSwitchToChat={() => controller.setMode("chat")}
        onComplete={controller.handleTraditionalComplete}
      />
    );
  }

  return (
    <div className="flex h-full flex-col">
      <CoachChatHeader
        canGoBack={controller.currentStepIndex > 0}
        currentStepIndex={controller.currentStepIndex}
        isTyping={controller.isTyping}
        totalSteps={controller.filteredSteps.length}
        onBack={controller.handleStepBack}
        onSwitchMode={() => controller.setMode("form")}
      />

      <CoachChatMessages
        scrollRef={scrollRef}
        messages={controller.messages}
        isTyping={controller.isTyping}
      />

      <div className="mx-auto w-full max-w-2xl">
        <CoachChatActiveInput controller={controller} />
      </div>
    </div>
  );
}
