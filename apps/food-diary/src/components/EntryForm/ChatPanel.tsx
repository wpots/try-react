"use client";

import { Button, TextField, Typography } from "@repo/ui";
import { Loader2Icon, SendHorizonalIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import type { ChatPanelProps } from "./index";

export function ChatPanel({
  messages,
  chatScrollRef,
  isSending,
  chatInput,
  chatError,
  onInputChange,
  onSend,
  onPrefill,
}: Readonly<ChatPanelProps>): React.JSX.Element {
  const t = useTranslations("entry.form");

  return (
    <div className="flex flex-col gap-ds-s">
      <output>
        <Typography variant="body" size="sm" className="text-ds-success">
          {t("analysisComplete")}
        </Typography>
      </output>

      {messages.length > 0 ? (
        <div
          ref={chatScrollRef}
          className="flex max-h-48 flex-col gap-ds-s overflow-y-auto rounded-ds-md border border-ds-border-subtle bg-ds-surface p-ds-s"
        >
          {messages.map(msg => (
            <div key={msg.id} className={`flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <Typography
                variant="body"
                size="sm"
                className={`max-w-[85%] rounded-ds-md px-ds-m py-ds-s ${
                  msg.role === "user" ? "bg-ds-interactive text-ds-on-interactive" : "bg-ds-surface-muted text-ds-text"
                }`}
              >
                {msg.text}
              </Typography>
              {msg.role === "model" && msg.updatedData ? (
                <Button
                  type="button"
                  variant="link"
                  size="link"
                  onClick={() => {
                    onPrefill({
                      foodName: msg.updatedData?.foodName ?? "",
                      mealType: msg.updatedData?.mealType ?? "",
                      description: msg.updatedData?.description ?? "",
                    });
                  }}
                >
                  {t("chatApplySuggestions")}
                </Button>
              ) : null}
            </div>
          ))}

          {isSending ? (
            <div className="flex items-start">
              <Loader2Icon className="size-4 animate-spin text-ds-text-muted" aria-hidden="true" />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Chat input */}
      <div className="flex items-end gap-ds-s">
        <TextField
          label={t("chatPlaceholder")}
          labelClassName="sr-only"
          containerClassName="min-w-0 flex-1"
          value={chatInput}
          onChange={onInputChange}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder={t("chatPlaceholder")}
          disabled={isSending}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isSending || !chatInput.trim()}
          onClick={onSend}
          aria-label={t("chatSend")}
        >
          {isSending ? (
            <Loader2Icon className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <SendHorizonalIcon className="size-4" aria-hidden="true" />
          )}
        </Button>
      </div>

      {chatError ? (
        <Typography variant="body" size="xs" className="text-ds-danger" role="alert">
          {t("chatError")}
        </Typography>
      ) : null}
    </div>
  );
}
