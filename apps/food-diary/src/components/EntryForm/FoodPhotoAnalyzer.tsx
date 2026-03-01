"use client";

import imageCompression from "browser-image-compression";
import { CameraIcon, Loader2Icon, SendHorizonalIcon, SparklesIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { analyzeFoodImage, chatAboutPhoto } from "@/app/actions/analyze-food-image";
import { useAuth } from "@/contexts/AuthContext";

import type { ChatMessage, AnalyzeFoodImageData } from "@/app/actions/analyze-food-image";

const COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 400,
  useWebWorker: true,
};

function readAsBase64(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = (reader.result as string).split(",")[1];
      if (base64Data) resolve(base64Data);
      else reject(new Error("Failed to read file as base64"));
    };
    reader.onerror = () => reject(new Error(String(reader.error)));
    reader.readAsDataURL(file);
  });
}

export interface FoodAnalysisPrefill {
  foodName: string;
  mealType: string;
  description: string;
}

export interface FoodPhotoAnalyzerProps {
  readonly onPrefill: (data: FoodAnalysisPrefill) => void;
}

type AnalysisStatus = "idle" | "analyzing" | "success" | "quota-reached" | "error";

interface ChatEntry {
  role: "user" | "model";
  text: string;
  updatedData?: Partial<AnalyzeFoodImageData>;
}

// ---------------------------------------------------------------------------
// ChatPanel — extracted to keep FoodPhotoAnalyzer's cognitive complexity down
// ---------------------------------------------------------------------------

interface ChatPanelProps {
  readonly messages: ChatEntry[];
  readonly chatScrollRef: React.RefObject<HTMLDivElement | null>;
  readonly isSending: boolean;
  readonly chatInput: string;
  readonly chatError: boolean;
  readonly onInputChange: (value: string) => void;
  readonly onSend: () => void;
  readonly onPrefill: (data: FoodAnalysisPrefill) => void;
}

function ChatPanel({
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
      <output className="text-sm text-ds-success">{t("analysisComplete")}</output>

      {messages.length > 0 ? (
        <div
          ref={chatScrollRef}
          className="flex max-h-48 flex-col gap-ds-s overflow-y-auto rounded-ds-md border border-ds-border-subtle bg-ds-surface p-ds-s"
        >
          {messages.map((msg, i) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              className={`flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              <p
                className={`max-w-[85%] rounded-ds-md px-ds-m py-ds-s text-sm ${
                  msg.role === "user" ? "bg-ds-interactive text-ds-on-interactive" : "bg-ds-surface-muted text-ds-text"
                }`}
              >
                {msg.text}
              </p>
              {msg.role === "model" && msg.updatedData ? (
                <button
                  type="button"
                  className="text-xs text-ds-interactive underline underline-offset-2 hover:text-ds-interactive-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                  onClick={() => {
                    onPrefill({
                      foodName: msg.updatedData?.foodName ?? "",
                      mealType: msg.updatedData?.mealType ?? "",
                      description: msg.updatedData?.description ?? "",
                    });
                  }}
                >
                  {t("chatApplySuggestions")}
                </button>
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
      <div className="flex gap-ds-s">
        <input
          type="text"
          value={chatInput}
          onChange={e => onInputChange(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder={t("chatPlaceholder")}
          disabled={isSending}
          className="min-w-0 flex-1 rounded-ds-md border border-ds-border-subtle bg-ds-surface px-ds-m py-ds-s text-sm text-ds-text placeholder:text-ds-text-muted disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        />
        <button
          type="button"
          disabled={isSending || !chatInput.trim()}
          onClick={onSend}
          aria-label={t("chatSend")}
          className="inline-flex items-center justify-center rounded-ds-md border border-ds-border-subtle bg-ds-surface px-ds-m py-ds-s text-ds-interactive transition-colors hover:bg-ds-surface-strong disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        >
          {isSending ? (
            <Loader2Icon className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <SendHorizonalIcon className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {chatError ? (
        <p className="text-xs text-ds-danger" role="alert">
          {t("chatError")}
        </p>
      ) : null}
    </div>
  );
}

export function FoodPhotoAnalyzer({ onPrefill }: Readonly<FoodPhotoAnalyzerProps>): React.JSX.Element {
  const t = useTranslations("entry.form");
  const { user } = useAuth();

  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatEntry[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [chatError, setChatError] = useState(false);

  // Refs for stateless session reconstruction
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewObjectUrlRef = useRef<string | null>(null);
  const base64Ref = useRef<string | null>(null);
  const initialModelResponseRef = useRef<string | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Keep chat scrolled to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  function revokePreviewUrl(): void {
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
      previewObjectUrlRef.current = null;
    }
  }

  async function handleFileSelect(files: FileList | null): Promise<void> {
    if (!files || files.length === 0 || !user) return;

    const file = files[0];
    if (!file?.type.startsWith("image/")) return;

    // Reset chat whenever a new photo is selected
    setChatMessages([]);
    setChatInput("");
    setChatError(false);
    base64Ref.current = null;
    initialModelResponseRef.current = null;

    // Create object URL for preview
    revokePreviewUrl();
    const objectUrl = URL.createObjectURL(file);
    previewObjectUrlRef.current = objectUrl;
    setPreviewUrl(objectUrl);
    setStatus("analyzing");

    try {
      // Compress image client-side, then convert to base64
      const compressed = await imageCompression(file, COMPRESSION_OPTIONS);
      const base64 = await readAsBase64(compressed);
      base64Ref.current = base64;

      // Get ID token and call server action
      const idToken = await user.getIdToken();
      const result = await analyzeFoodImage(idToken, base64);

      if (!result.success && result.error === "DAILY_LIMIT_REACHED") {
        setRemaining(0);
        setStatus("quota-reached");
        revokePreviewUrl();
        setPreviewUrl(null);
        return;
      }
      if (!result.success) {
        setStatus("error");
        return;
      }

      setRemaining(result.remaining ?? null);
      initialModelResponseRef.current = result.initialModelResponse ?? null;
      setStatus("success");

      if (result.data) {
        onPrefill(result.data);
        // Clear preview after the image has been analysed
        setTimeout(() => {
          revokePreviewUrl();
          setPreviewUrl(null);
        }, 1500);
      }
    } catch {
      setStatus("error");
    }
  }

  async function handleChatSend(): Promise<void> {
    const message = chatInput.trim();
    if (!message || !user || !base64Ref.current || !initialModelResponseRef.current) return;

    setChatInput("");
    setChatError(false);
    const userEntry: ChatEntry = { role: "user", text: message };
    setChatMessages(prev => [...prev, userEntry]);
    setIsSending(true);

    try {
      const idToken = await user.getIdToken();
      // Build history from previous chat entries (exclude updatedData ‑ server doesn't need it)
      const history: ChatMessage[] = chatMessages.map(m => ({ role: m.role, text: m.text }));

      const result = await chatAboutPhoto(
        idToken,
        base64Ref.current,
        initialModelResponseRef.current,
        history,
        message,
      );

      if (!result.success || !result.data) {
        setChatError(true);
        return;
      }

      setChatMessages(prev => [
        ...prev,
        {
          role: "model",
          text: result.data!.reply,
          updatedData: result.data!.updatedData,
        },
      ]);
    } catch {
      setChatError(true);
    } finally {
      setIsSending(false);
    }
  }

  const isDisabled = status === "analyzing" || status === "quota-reached";
  const showChat = status === "success" && initialModelResponseRef.current !== null;

  return (
    <div className="flex flex-col gap-ds-s rounded-ds-lg border border-ds-border-subtle bg-ds-surface-muted p-ds-m">
      <div className="flex items-center gap-ds-s">
        <SparklesIcon className="size-4 text-ds-interactive shrink-0" aria-hidden="true" />
        <span className="font-ds-label-base text-ds-text text-sm">{t("analyzePhoto")}</span>
      </div>

      <div className="flex flex-wrap items-center gap-ds-m">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          disabled={isDisabled}
          onChange={e => void handleFileSelect(e.target.files)}
        />
        <button
          type="button"
          disabled={isDisabled}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-ds-s rounded-ds-md border border-ds-border-subtle bg-ds-surface px-ds-l py-ds-s font-ds-label-base text-sm text-ds-text transition-colors hover:bg-ds-surface-strong disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        >
          {status === "analyzing" ? (
            <>
              <Loader2Icon className="size-4 animate-spin" aria-hidden="true" />
              <span>{t("analyzing")}</span>
            </>
          ) : (
            <>
              <CameraIcon className="size-4" aria-hidden="true" />
              <span>{t("analyzePhoto")}</span>
            </>
          )}
        </button>

        {remaining !== null && status !== "quota-reached" && (
          <span className="text-xs text-ds-text-muted">{t("quotaRemaining", { count: remaining })}</span>
        )}
      </div>

      {/* Image preview during analysis */}
      {previewUrl && status === "analyzing" ? (
        <div className="relative w-24 h-24 rounded-ds-md overflow-hidden border border-ds-border-subtle">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="" className="w-full h-full object-cover" aria-hidden="true" />
          <div className="absolute inset-0 flex items-center justify-center bg-ds-surface/60">
            <Loader2Icon className="size-6 animate-spin text-ds-interactive" aria-hidden="true" />
          </div>
        </div>
      ) : null}

      {/* Analysis success → chat panel */}
      {showChat ? (
        <ChatPanel
          messages={chatMessages}
          chatScrollRef={chatScrollRef}
          isSending={isSending}
          chatInput={chatInput}
          chatError={chatError}
          onInputChange={setChatInput}
          onSend={() => void handleChatSend()}
          onPrefill={onPrefill}
        />
      ) : null}

      {/* Non-success status messages */}
      {status === "error" ? (
        <p className="text-sm text-ds-danger" role="alert">
          {t("analysisError")}
        </p>
      ) : null}

      {status === "quota-reached" ? (
        <output className="text-sm text-ds-text-muted">{t("quotaLimitReached")}</output>
      ) : null}
    </div>
  );
}
