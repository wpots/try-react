"use client";

import { useCallback, useEffect, useState } from "react";

interface DeviceOrientationPermissionEvent {
  requestPermission: () => Promise<string>;
}

interface UseDeviceTiltOffsetOptions {
  isEnabled?: boolean;
  maxGamma?: number;
}

export type DeviceTiltPermissionState =
  | "unsupported"
  | "prompt"
  | "granted"
  | "denied";

export interface UseDeviceTiltOffsetResult {
  tiltOffset: number;
  permissionState: DeviceTiltPermissionState;
  canRequestPermission: boolean;
  requestPermission: () => Promise<void>;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function resolveOrientationApi(): unknown {
  if (typeof window === "undefined") {
    return null;
  }

  return window.DeviceOrientationEvent;
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
}: UseDeviceTiltOffsetOptions = {}): UseDeviceTiltOffsetResult {
  const [rawTiltOffset, setRawTiltOffset] = useState(0);
  const [requestedPermissionState, setRequestedPermissionState] = useState<
    "prompt" | "granted" | "denied"
  >("prompt");
  const orientationApi = resolveOrientationApi();
  const isOrientationSupported = orientationApi != null;
  const canRequestPermission = supportsPermissionRequest(orientationApi);
  const permissionState: DeviceTiltPermissionState = !isOrientationSupported
    ? "unsupported"
    : canRequestPermission
      ? requestedPermissionState
      : "granted";

  const requestPermission = useCallback(async (): Promise<void> => {
    const orientationApi = resolveOrientationApi();
    if (orientationApi == null) {
      return;
    }

    if (!supportsPermissionRequest(orientationApi)) {
      return;
    }

    try {
      const permissionResult = await orientationApi.requestPermission();

      if (permissionResult === "granted") {
        setRequestedPermissionState("granted");
        return;
      }

      setRawTiltOffset(0);
      setRequestedPermissionState("denied");
    } catch {
      setRawTiltOffset(0);
      setRequestedPermissionState("denied");
    }
  }, []);

  useEffect(() => {
    if (
      !isEnabled ||
      permissionState !== "granted" ||
      typeof window === "undefined"
    ) {
      return undefined;
    }

    const handleOrientation = (event: DeviceOrientationEvent): void => {
      if (event.gamma == null) {
        return;
      }

      const normalizedGamma = clamp(event.gamma / maxGamma, -1, 1);
      setRawTiltOffset((currentOffset) => {
        return Math.abs(currentOffset - normalizedGamma) < 0.01
          ? currentOffset
          : normalizedGamma;
      });
    };

    window.addEventListener("deviceorientation", handleOrientation, {
      passive: true,
    });

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [isEnabled, maxGamma, permissionState]);

  const tiltOffset =
    isEnabled && permissionState === "granted" ? rawTiltOffset : 0;

  return {
    tiltOffset,
    permissionState,
    canRequestPermission,
    requestPermission,
  };
}
