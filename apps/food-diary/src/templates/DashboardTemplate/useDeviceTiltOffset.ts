"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface DeviceOrientationPermissionEvent {
  requestPermission: () => Promise<string>;
}

interface UseDeviceTiltOffsetOptions {
  isEnabled?: boolean;
  maxBeta?: number;
  maxGamma?: number;
}

export type DeviceTiltPermissionState =
  | "unsupported"
  | "prompt"
  | "granted"
  | "denied";

export interface UseDeviceTiltOffsetResult {
  tiltOffset: number;
  hasTiltSignal: boolean;
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
  maxBeta = 24,
  maxGamma = 24,
}: UseDeviceTiltOffsetOptions = {}): UseDeviceTiltOffsetResult {
  const [rawTiltOffset, setRawTiltOffset] = useState(0);
  const [hasTiltSignal, setHasTiltSignal] = useState(false);
  const [requestedPermissionState, setRequestedPermissionState] = useState<
    "prompt" | "granted" | "denied"
  >("prompt");
  const baselineRef = useRef<{ beta: number; gamma: number } | null>(
    null,
  );
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
      setHasTiltSignal(false);
      setRequestedPermissionState("denied");
    } catch {
      setRawTiltOffset(0);
      setHasTiltSignal(false);
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

    baselineRef.current = null;

    const handleOrientation = (event: DeviceOrientationEvent): void => {
      if (event.gamma == null && event.beta == null) {
        return;
      }

      setHasTiltSignal(true);

      const gamma = event.gamma ?? 0;
      const beta = event.beta ?? 0;
      if (baselineRef.current == null) {
        baselineRef.current = {
          beta,
          gamma,
        };
        return;
      }

      const normalizedGamma = clamp(
        (gamma - baselineRef.current.gamma) / maxGamma,
        -1,
        1,
      );
      const normalizedBeta = clamp(
        (beta - baselineRef.current.beta) / maxBeta,
        -1,
        1,
      );
      const combinedTilt = clamp(
        normalizedGamma + normalizedBeta * 0.75,
        -1,
        1,
      );

      setRawTiltOffset((currentOffset) => {
        return Math.abs(currentOffset - combinedTilt) < 0.01
          ? currentOffset
          : combinedTilt;
      });
    };

    window.addEventListener("deviceorientation", handleOrientation, {
      passive: true,
    });

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [isEnabled, maxBeta, maxGamma, permissionState]);

  const tiltOffset =
    isEnabled && permissionState === "granted" ? rawTiltOffset : 0;

  return {
    tiltOffset,
    hasTiltSignal,
    permissionState,
    canRequestPermission,
    requestPermission,
  };
}
