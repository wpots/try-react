import type { SaveState } from "../index";

export function getInitialSaveState(): SaveState {
  return {
    success: false,
    error: null,
  };
}
