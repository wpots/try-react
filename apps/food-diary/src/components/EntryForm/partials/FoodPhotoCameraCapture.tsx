"use client";

import { Button, Icon, Typography } from "@repo/ui";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import type { FoodPhotoCameraCaptureProps } from "../index";

const CAMERA_CONSTRAINTS: MediaStreamConstraints = {
  audio: false,
  video: {
    facingMode: {
      ideal: "environment",
    },
  },
};

type CameraErrorMessageKey = "cameraAccessDenied" | "cameraNotSupported" | "cameraUnavailable";

function stopMediaStream(stream: MediaStream | null): void {
  for (const track of stream?.getTracks() ?? []) {
    track.stop();
  }
}

function getCameraErrorMessageKey(error: unknown): CameraErrorMessageKey {
  if (typeof navigator === "undefined" || typeof navigator.mediaDevices?.getUserMedia !== "function") {
    return "cameraNotSupported";
  }

  if (error instanceof DOMException && (error.name === "NotAllowedError" || error.name === "SecurityError")) {
    return "cameraAccessDenied";
  }

  return "cameraUnavailable";
}

function createPhotoFile(video: HTMLVideoElement): Promise<File> {
  return new Promise<File>((resolve, reject) => {
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      reject(new Error("Camera frame is not ready."));
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    if (!context) {
      reject(new Error("Canvas context is unavailable."));
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      blob => {
        if (!blob) {
          reject(new Error("Failed to capture photo."));
          return;
        }

        resolve(
          new File([blob], "camera-capture.jpg", {
            lastModified: Date.now(),
            type: blob.type || "image/jpeg",
          }),
        );
      },
      "image/jpeg",
      0.92,
    );
  });
}

export function FoodPhotoCameraCapture({
  disabled,
  onCapture,
  onClose,
}: Readonly<FoodPhotoCameraCaptureProps>): React.JSX.Element {
  const t = useTranslations("entry.form");

  const [cameraError, setCameraError] = useState<CameraErrorMessageKey | null>(null);
  const [isStarting, setIsStarting] = useState(true);
  const [isCaptureReady, setIsCaptureReady] = useState(false);

  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function startCamera(): Promise<void> {
      if (typeof navigator === "undefined" || typeof navigator.mediaDevices?.getUserMedia !== "function") {
        if (isMounted) {
          setCameraError("cameraNotSupported");
          setIsStarting(false);
        }
        return;
      }

      setCameraError(null);
      setIsStarting(true);
      setIsCaptureReady(false);

      try {
        const stream = await navigator.mediaDevices.getUserMedia(CAMERA_CONSTRAINTS);

        if (!isMounted) {
          stopMediaStream(stream);
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        if (isMounted) {
          setCameraError(getCameraErrorMessageKey(error));
        }
      } finally {
        if (isMounted) {
          setIsStarting(false);
        }
      }
    }

    void startCamera();

    return () => {
      isMounted = false;
      stopMediaStream(streamRef.current);
      streamRef.current = null;
    };
  }, []);

  const handleCapture = async (): Promise<void> => {
    if (!videoRef.current || disabled || !isCaptureReady) {
      return;
    }

    try {
      const file = await createPhotoFile(videoRef.current);
      stopMediaStream(streamRef.current);
      streamRef.current = null;
      await onCapture(file);
    } catch {
      setCameraError("cameraUnavailable");
    }
  };

  const handleClose = (): void => {
    stopMediaStream(streamRef.current);
    streamRef.current = null;
    onClose();
  };

  return (
    <section
      aria-label={t("cameraPanelLabel")}
      className="mt-ds-s flex flex-col gap-ds-s rounded-ds-lg border border-ds-border-subtle bg-ds-surface p-ds-s"
    >
      <div className="flex flex-col gap-1">
        <Typography variant="body" size="sm" className="font-medium text-ds-text">
          {t("cameraPanelTitle")}
        </Typography>
        <Typography variant="body" size="xs" className="text-ds-text-muted">
          {t("cameraHint")}
        </Typography>
      </div>

      <div className="overflow-hidden rounded-ds-md border border-ds-border-subtle bg-ds-surface-muted">
        {cameraError ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-2 p-ds-m text-center">
            <Icon name="TriangleAlert" aria-hidden="true" className="size-5 text-ds-danger" />
            <Typography variant="body" size="xs" className="text-ds-danger" role="alert">
              {t(cameraError)}
            </Typography>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="h-64 w-full object-cover"
              aria-label={t("cameraPreview")}
              onLoadedData={() => setIsCaptureReady(true)}
            />
            {isStarting ? (
              <div className="flex items-center gap-2 border-t border-ds-border-subtle px-ds-s py-ds-xs">
                <Icon name="LoaderCircle" className="animate-spin" aria-hidden="true" />
                <Typography variant="body" size="xs" className="text-ds-text-muted">
                  {t("cameraStarting")}
                </Typography>
              </div>
            ) : null}
          </>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          disabled={disabled || isStarting || !isCaptureReady || cameraError !== null}
          onClick={() => void handleCapture()}
        >
          <Icon name="ScanLine" aria-hidden="true" />
          <span>{t("capturePhoto")}</span>
        </Button>
        <Button type="button" variant="outline" size="sm" disabled={disabled} onClick={handleClose}>
          <Icon name="X" aria-hidden="true" />
          <span>{t("closeCamera")}</span>
        </Button>
      </div>
    </section>
  );
}
