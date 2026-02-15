import type React from "react";

import { CoachAvatar } from "./CoachAvatar";
import { cn } from "@repo/ui";

export interface ChatBubbleProps {
  role: "coach" | "user";
  children: React.ReactNode;
}

const bubbleClasses = "max-w-[80%] rounded-ds-lg px-ds-l py-ds-m";

export function ChatBubble({ role, children }: ChatBubbleProps): React.JSX.Element {
  if (role === "coach") {
    return (
      <div className="animate-message-in flex items-end gap-ds-s">
        <CoachAvatar />
        <div className={cn(bubbleClasses, "rounded-bl-sm bg-ds-surface-muted text-ds-on-surface")}>
          <p className="leading-relaxed">{children}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-message-in flex justify-end">
      <div className={cn(bubbleClasses, "rounded-br-sm bg-ds-primary/20 text-ds-on-surface")}>
        <p className="leading-relaxed">{children}</p>
      </div>
    </div>
  );
}
