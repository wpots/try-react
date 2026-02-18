import { ChatBubble } from "./ChatBubble";
import { TypingIndicator } from "./TypingIndicator";

interface Message {
  id: number;
  role: "coach" | "user";
  text: string;
}

interface CoachChatMessagesProps {
  isTyping: boolean;
  messages: Message[];
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

export function CoachChatMessages({ isTyping, messages, scrollRef }: CoachChatMessagesProps): React.JSX.Element {
  return (
    <div
      ref={scrollRef}
      className="chat-scroll min-h-0 flex-1 overflow-y-auto px-ds-l py-ds-xl"
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-ds-m">
        {messages.map(message => (
          <ChatBubble key={message.id} role={message.role}>
            {message.text}
          </ChatBubble>
        ))}
        {isTyping ? <TypingIndicator /> : null}
      </div>
    </div>
  );
}
