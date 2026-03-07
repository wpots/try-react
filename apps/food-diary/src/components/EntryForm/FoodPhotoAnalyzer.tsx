"use client";

import { Button, Icon, Image } from "@repo/ui";
import imageCompression from "browser-image-compression";
import NextImage from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { FileTrigger } from "react-aria-components";

import { analyzeFoodImage } from "@/app/actions/analyze-food-image";
import { useAuth } from "@/contexts/AuthContext";
import { trackAiAnalysisTriggered, trackImageUploaded } from "@/lib/analytics";
import { readAsBase64 } from "@/utils/readAsBase64";

import { FoodPhotoCameraCapture } from "./partials/FoodPhotoCameraCapture";
import { PhotoAnalyzerStatus } from "./partials/PhotoAnalyzerStatus";

import type { AnalysisStatus, FoodPhotoAnalyzerProps } from "./index";

const COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 400,
  useWebWorker: true,
};

export function FoodPhotoAnalyzer({ onPrefill }: Readonly<FoodPhotoAnalyzerProps>): React.JSX.Element {
  const t = useTranslations("entry.form");
  const locale = useLocale();
  const { user } = useAuth();

  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCameraSupported, setIsCameraSupported] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  // Refs
  const previewObjectUrlRef = useRef<string | null>(null);
  const clearPreviewTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsCameraSupported(
      typeof navigator !== "undefined" &&
        navigator.mediaDevices !== undefined &&
        typeof navigator.mediaDevices.getUserMedia === "function",
    );

    return () => {
      if (clearPreviewTimeoutRef.current) {
        clearTimeout(clearPreviewTimeoutRef.current);
      }

      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
        previewObjectUrlRef.current = null;
      }
    };
  }, []);

  const revokePreviewUrl = (): void => {
    if (clearPreviewTimeoutRef.current) {
      clearTimeout(clearPreviewTimeoutRef.current);
      clearPreviewTimeoutRef.current = null;
    }

    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
      previewObjectUrlRef.current = null;
    }

    setPreviewUrl(null);
  };

  const analyzeSelectedFile = async (file: File): Promise<void> => {
    if (!user || !file.type.startsWith("image/")) {
      return;
    }

    revokePreviewUrl();
    const objectUrl = URL.createObjectURL(file);
    previewObjectUrlRef.current = objectUrl;
    setPreviewUrl(objectUrl);
    setStatus("analyzing");

    try {
      trackImageUploaded({ mimeType: file.type });

      const compressed = await imageCompression(file, COMPRESSION_OPTIONS);
      const base64 = await readAsBase64(compressed);

      const idToken = await user.getIdToken();
      trackAiAnalysisTriggered({ locale });
      const result = await analyzeFoodImage(idToken, base64, locale);

      if (!result.success && result.error === "DAILY_LIMIT_REACHED") {
        setRemaining(0);
        setStatus("quota-reached");
        revokePreviewUrl();
        return;
      }
      if (!result.success) {
        console.error("[FoodPhotoAnalyzer] analysis error:", result.error, result.message);
        setStatus("error");
        revokePreviewUrl();
        return;
      }

      setRemaining(result.remaining ?? null);
      setStatus("success");

      if (result.data) {
        onPrefill(result.data);
        clearPreviewTimeoutRef.current = setTimeout(() => {
          revokePreviewUrl();
        }, 1500);
      }
    } catch {
      setStatus("error");
      revokePreviewUrl();
    }
  };

  const handleFileSelect = async (files: FileList | null): Promise<void> => {
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];

    if (!file) {
      return;
    }

    await analyzeSelectedFile(file);
  };

  const handleCameraOpen = (): void => {
    setIsCameraOpen(true);
  };

  const handleCameraClose = (): void => {
    setIsCameraOpen(false);
  };

  const handleCameraCapture = async (file: File): Promise<void> => {
    setIsCameraOpen(false);
    await analyzeSelectedFile(file);
  };

  const isDisabled = status === "analyzing" || status === "quota-reached";

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap gap-2">
        {isCameraSupported ? (
          <Button
            type="button"
            variant="strong"
            size="sm"
            disabled={isDisabled}
            className="self-start"
            onClick={handleCameraOpen}
          >
            <>
              <Icon name="Camera" aria-hidden="true" />
              <span>{t("useCamera")}</span>
            </>
          </Button>
        ) : null}

        <FileTrigger acceptedFileTypes={["image/*"]} onSelect={files => void handleFileSelect(files)}>
          <Button type="button" variant="outline" size="sm" disabled={isDisabled} className="self-start">
            <>
              {status === "analyzing" ? (
                <Icon name="LoaderCircle" className="animate-spin" aria-hidden="true" />
              ) : (
                <Icon name="ImagePlus" aria-hidden="true" />
              )}
              <span>{status === "analyzing" ? t("analyzing") : t("uploadPhoto")}</span>
            </>
          </Button>
        </FileTrigger>
      </div>

      {isCameraOpen ? (
        <FoodPhotoCameraCapture disabled={isDisabled} onCapture={handleCameraCapture} onClose={handleCameraClose} />
      ) : null}

      <PhotoAnalyzerStatus status={status} remaining={remaining} />

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
    </div>
  );
}
