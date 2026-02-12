import { CoachAvatar } from "./CoachAvatar";

export function TypingIndicator(): React.JSX.Element {
  return (
    <div className="flex items-end gap-ds-s">
      <CoachAvatar />
      <div className="rounded-ds-2xl rounded-bl-md bg-ds-surface-muted px-ds-m py-ds-s">
        <div className="flex gap-ds-xs">
          <span className="typing-dot h-2 w-2 rounded-ds-full bg-ds-on-surface-secondary" />
          <span className="typing-dot h-2 w-2 rounded-ds-full bg-ds-on-surface-secondary" />
          <span className="typing-dot h-2 w-2 rounded-ds-full bg-ds-on-surface-secondary" />
        </div>
      </div>
    </div>
  );
}

