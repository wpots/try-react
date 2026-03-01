"use client";

import { Button, Icon, Image } from "@repo/ui";
import imageCompression from "browser-image-compression";
import NextImage from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { FileTrigger } from "react-aria-components";

import type { ChatMessage } from "@/app/actions/analyze-food-image";
import { analyzeFoodImage, chatAboutPhoto } from "@/app/actions/analyze-food-image";
import { useAuth } from "@/contexts/AuthContext";
import { readAsBase64 } from "@/utils/readAsBase64";

import { ChatPanel } from "./ChatPanel";
import { PhotoAnalyzerStatus } from "./partials/PhotoAnalyzerStatus";

import type { AnalysisStatus, ChatEntry, FoodPhotoAnalyzerProps } from "./index";

const COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 400,
  useWebWorker: true,
};

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

  const revokePreviewUrl = (): void => {
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
      previewObjectUrlRef.current = null;
    }
  };

  const handleFileSelect = async (files: FileList | null): Promise<void> => {
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
  };

  const handleChatSend = async (): Promise<void> => {
    const message = chatInput.trim();
    if (!message || !user || !base64Ref.current || !initialModelResponseRef.current) return;

    setChatInput("");
    setChatError(false);
    const userEntry: ChatEntry = { id: crypto.randomUUID(), role: "user", text: message };
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
          id: crypto.randomUUID(),
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
  };

  const isDisabled = status === "analyzing" || status === "quota-reached";
  const showChat = status === "success" && initialModelResponseRef.current !== null;

  return (
    <div className="flex flex-col gap-1">
      <FileTrigger acceptedFileTypes={["image/*"]} onSelect={files => void handleFileSelect(files)}>
        <Button type="button" variant="outline" size="sm" disabled={isDisabled} className="self-start">
          {status === "analyzing" ? (
            <>
              <Icon name="LoaderCircle" className="animate-spin" aria-hidden="true" />
              <span>{t("analyzing")}</span>
            </>
          ) : (
            <>
              <Icon name="Camera" aria-hidden="true" />
              <span>{t("analyzePhoto")}</span>
            </>
          )}
        </Button>
      </FileTrigger>

      <PhotoAnalyzerStatus status={status} remaining={remaining} />

      {/* Image preview during analysis */}
      {previewUrl && status === "analyzing" ? (
        <div className="relative mt-ds-s w-20 h-20 rounded-ds-md overflow-hidden border border-ds-border-subtle">
          <Image
            component={NextImage}
            fill
            unoptimized
            src={previewUrl}
            alt=""
            aria-hidden="true"
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-ds-surface/60">
            <Icon name="LoaderCircle" className="size-5 animate-spin text-ds-interactive" aria-hidden="true" />
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
    </div>
  );
}
