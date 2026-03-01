"use client";

import imageCompression from "browser-image-compression";
import { CameraIcon, Loader2Icon, SparklesIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { FileTrigger } from "react-aria-components";

import { analyzeFoodImage } from "@/app/actions/analyze-food-image";
import { useAuth } from "@/contexts/AuthContext";

const COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 400,
  useWebWorker: true,
};

export interface FoodAnalysisPrefill {
  foodName: string;
  mealType: string;
  description: string;
}

export interface FoodPhotoAnalyzerProps {
  onPrefill: (data: FoodAnalysisPrefill) => void;
}

type AnalysisStatus = "idle" | "analyzing" | "success" | "quota-reached" | "error";

export function FoodPhotoAnalyzer({ onPrefill }: FoodPhotoAnalyzerProps): React.JSX.Element {
  const t = useTranslations("entry.form");
  const { user } = useAuth();

  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const previewObjectUrlRef = useRef<string | null>(null);

  function revokePreviewUrl(): void {
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
      previewObjectUrlRef.current = null;
    }
  }

  async function handleFileSelect(files: FileList | null): Promise<void> {
    if (!files || files.length === 0 || !user) return;

    const file = files[0]!;
    if (!file.type.startsWith("image/")) return;

    // Create object URL for preview
    revokePreviewUrl();
    const objectUrl = URL.createObjectURL(file);
    previewObjectUrlRef.current = objectUrl;
    setPreviewUrl(objectUrl);
    setStatus("analyzing");

    try {
      // Compress image client-side
      const compressed = await imageCompression(file, COMPRESSION_OPTIONS);

      // Convert to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Strip data URL prefix to get raw base64
          const base64Data = result.split(",")[1];
          if (base64Data) resolve(base64Data);
          else reject(new Error("Failed to read file as base64"));
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(compressed);
      });

      // Get ID token and call server action
      const idToken = await user.getIdToken();
      const result = await analyzeFoodImage(idToken, base64);

      if (!result.success) {
        if (result.error === "DAILY_LIMIT_REACHED") {
          setRemaining(0);
          setStatus("quota-reached");
          revokePreviewUrl();
          setPreviewUrl(null);
        } else {
          setStatus("error");
        }
        return;
      }

      setRemaining(result.remaining ?? null);
      setStatus("success");

      if (result.data) {
        onPrefill(result.data);
        // Clear preview after a short delay so user sees the result
        setTimeout(() => {
          revokePreviewUrl();
          setPreviewUrl(null);
          setStatus("idle");
        }, 1500);
      }
    } catch {
      setStatus("error");
    }
  }

  const isDisabled = status === "analyzing" || status === "quota-reached";

  return (
    <div className="flex flex-col gap-ds-s rounded-ds-lg border border-ds-border-subtle bg-ds-surface-muted p-ds-m">
      <div className="flex items-center gap-ds-s">
        <SparklesIcon className="size-4 text-ds-interactive shrink-0" aria-hidden="true" />
        <span className="font-ds-label-base text-ds-text text-sm">{t("analyzePhoto")}</span>
      </div>

      <div className="flex flex-wrap items-center gap-ds-m">
        <FileTrigger
          acceptedFileTypes={["image/*"]}
          onSelect={handleFileSelect}
        >
          <button
            type="button"
            disabled={isDisabled}
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
        </FileTrigger>

        {remaining !== null && status !== "quota-reached" && (
          <span className="text-xs text-ds-text-muted">
            {t("quotaRemaining", { count: remaining })}
          </span>
        )}
      </div>

      {/* Image preview during analysis */}
      {previewUrl && status === "analyzing" ? (
        <div className="relative w-24 h-24 rounded-ds-md overflow-hidden border border-ds-border-subtle">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt=""
            className="w-full h-full object-cover"
            aria-hidden="true"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-ds-surface/60">
            <Loader2Icon className="size-6 animate-spin text-ds-interactive" aria-hidden="true" />
          </div>
        </div>
      ) : null}

      {/* Status messages */}
      {status === "success" ? (
        <p className="text-sm text-ds-success" role="status">
          {t("analysisComplete")}
        </p>
      ) : null}

      {status === "error" ? (
        <p className="text-sm text-ds-danger" role="alert">
          {t("analysisError")}
        </p>
      ) : null}

      {status === "quota-reached" ? (
        <p className="text-sm text-ds-text-muted" role="status">
          {t("quotaLimitReached")}
        </p>
      ) : null}
    </div>
  );
}
