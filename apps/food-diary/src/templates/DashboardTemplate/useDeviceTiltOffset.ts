"use client";

import { useEffect, useState } from "react";

interface DeviceOrientationPermissionEvent {
  requestPermission: () => Promise<string>;
}

interface UseDeviceTiltOffsetOptions {
  isEnabled?: boolean;
  maxGamma?: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function supportsPermissionRequest(
  value: unknown,
): value is DeviceOrientationPermissionEvent {
  return (
    typeof value === "function" &&
    "requestPermission" in value &&
    typeof value.requestPermission === "function"
  );
}

export function useDeviceTiltOffset({
  isEnabled = true,
  maxGamma = 24,
}: UseDeviceTiltOffsetOptions = {}): number {
  const [tiltOffset, setTiltOffset] = useState(0);

  useEffect(() => {
    if (!isEnabled || typeof window === "undefined") {
      return undefined;
    }

    const orientationApi: unknown = window.DeviceOrientationEvent;
    if (orientationApi == null) {
      return undefined;
    }

    let hasRequestedPermission = false;
    let removeOrientationListener: (() => void) | undefined;

    const handleOrientation = (event: DeviceOrientationEvent): void => {
      if (event.gamma == null) {
        return;
      }

      const normalizedGamma = clamp(event.gamma / maxGamma, -1, 1);
      setTiltOffset((currentOffset) => {
        return Math.abs(currentOffset - normalizedGamma) < 0.01
          ? currentOffset
          : normalizedGamma;
      });
    };

    const attachOrientationListener = (): void => {
      if (removeOrientationListener != null) {
        return;
      }

      window.addEventListener("deviceorientation", handleOrientation, {
        passive: true,
      });
      removeOrientationListener = () => {
        window.removeEventListener("deviceorientation", handleOrientation);
      };
    };

    const removePermissionListeners = (): void => {
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("pointerdown", handleFirstInteraction);
    };

    const handleFirstInteraction = (): void => {
      if (hasRequestedPermission) {
        return;
      }

      hasRequestedPermission = true;
      removePermissionListeners();

      if (!supportsPermissionRequest(orientationApi)) {
        attachOrientationListener();
        return;
      }

      void orientationApi
        .requestPermission()
        .then((permissionState) => {
          if (permissionState === "granted") {
            attachOrientationListener();
          }
        })
        .catch(() => {
          setTiltOffset(0);
        });
    };

    if (supportsPermissionRequest(orientationApi)) {
      window.addEventListener("touchstart", handleFirstInteraction, {
        once: true,
        passive: true,
      });
      window.addEventListener("pointerdown", handleFirstInteraction, {
        once: true,
        passive: true,
      });
    } else {
      attachOrientationListener();
    }

    return () => {
      removePermissionListeners();
      removeOrientationListener?.();
    };
  }, [isEnabled, maxGamma]);

  return tiltOffset;
}
