import type React from "react";

import { CoachAvatar } from "./CoachAvatar";

export interface ChatBubbleProps {
  role: "coach" | "user";
  children: React.ReactNode;
}

export function ChatBubble({
  role,
  children,
}: ChatBubbleProps): React.JSX.Element {
  if (role === "coach") {
    return (
      <div className="animate-message-in flex items-end gap-ds-s">
        <CoachAvatar />
        <div className="max-w-[80%] rounded-ds-2xl rounded-bl-md bg-ds-surface-muted px-ds-m py-ds-s text-ds-on-surface">
          <p className="leading-relaxed">{children}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-message-in flex justify-end">
      <div className="max-w-[80%] rounded-ds-2xl rounded-br-md bg-ds-primary/15 px-ds-m py-ds-s text-ds-on-surface-strong">
        <p className="leading-relaxed">{children}</p>
      </div>
    </div>
  );
}

