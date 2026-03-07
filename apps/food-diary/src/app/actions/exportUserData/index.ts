export interface ExportUserDataResult {
  success: boolean;
  jsonData?: string;
  filename?: string;
  error?: string;
}

export { exportUserData } from "./exportUserData";
