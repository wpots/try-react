export interface WipeGuestEntriesResult {
  success: boolean;
  deletedCount: number;
  error?: string;
}

export { wipeGuestEntries } from "./wipeGuestEntries";
