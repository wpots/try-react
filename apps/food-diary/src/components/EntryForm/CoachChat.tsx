"use client";

import type { CoachChatProps } from "./index";
import { EntryForm } from "./EntryForm";

export function CoachChat({ cms, onComplete }: CoachChatProps): React.JSX.Element {
  return <EntryForm cms={cms} onComplete={onComplete} />;
}
