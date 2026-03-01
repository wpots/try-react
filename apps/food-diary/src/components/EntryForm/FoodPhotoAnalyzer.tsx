"use client";

import { Button, Icon, Image } from "@repo/ui";
import imageCompression from "browser-image-compression";
import NextImage from "next/image";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { FileTrigger } from "react-aria-components";

import { analyzeFoodImage } from "@/app/actions/analyze-food-image";
import { useAuth } from "@/contexts/AuthContext";
import { readAsBase64 } from "@/utils/readAsBase64";

import { PhotoAnalyzerStatus } from "./partials/PhotoAnalyzerStatus";

import type { AnalysisStatus, FoodPhotoAnalyzerProps } from "./index";

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

  // Refs
  const previewObjectUrlRef = useRef<string | null>(null);

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
        console.error("[FoodPhotoAnalyzer] analysis error:", result.error, result.message);
        setStatus("error");
        return;
      }

      setRemaining(result.remaining ?? null);
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

  const isDisabled = status === "analyzing" || status === "quota-reached";

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
    </div>
  );
}
