"use client";

import { useEffect, useRef } from "react";

import type { EntryFormProps } from "./index";
import { TraditionalForm } from "./TraditionalForm";
import { CoachChatActiveInput } from "./partials/CoachChatActiveInput";
import { CoachChatMessages } from "./partials/CoachChatMessages";
import { EntryFormHeader } from "./partials/EntryFormHeader";
import { useCoachChatController } from "./useCoachChatController";

export function EntryForm({ onComplete, cms }: EntryFormProps): React.JSX.Element {
  const controller = useCoachChatController({ onComplete, cms });
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollRef.current) {
      return;
    }

    const element = scrollRef.current;
    element.scrollTop = element.scrollHeight;
  }, [controller.messages, controller.isTyping]);

  return (
    <div className="flex h-full flex-col">
      <EntryFormHeader
        cms={cms}
        currentStepIndex={controller.currentStepIndex}
        mode={controller.mode}
        totalSteps={controller.filteredSteps.length}
        onSwitchMode={() =>
          controller.setMode(controller.mode === "chat" ? "form" : "chat")
        }
      />

      {controller.mode === "form" ? (
        <TraditionalForm
          cms={cms}
          initialEntry={controller.entry}
          onComplete={controller.handleTraditionalComplete}
        />
      ) : (
        <>
          <CoachChatMessages
            scrollRef={scrollRef}
            messages={controller.messages}
            isTyping={controller.isTyping}
          />

          <div className="mx-auto w-full max-w-2xl">
            <CoachChatActiveInput controller={controller} cms={cms} />
          </div>
        </>
      )}
    </div>
  );
}
