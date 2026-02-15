"use client";

import { useEffect, useRef } from "react";

import { CoachChatActiveInput } from "./partials/CoachChatActiveInput";
import { CoachChatMessages } from "./partials/CoachChatMessages";
import type { UseCoachChatControllerResult } from "./useCoachChatController";

interface CoachChatProps {
  cms: Record<string, unknown>;
  controller: UseCoachChatControllerResult;
}

export function CoachChat({
  cms,
  controller,
}: CoachChatProps): React.JSX.Element {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollRef.current) {
      return;
    }

    const element = scrollRef.current;
    element.scrollTop = element.scrollHeight;
  }, [controller.messages, controller.isTyping]);

  return (
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
  );
}
