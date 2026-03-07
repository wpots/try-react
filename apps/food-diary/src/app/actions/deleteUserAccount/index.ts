export interface DeleteUserAccountResult {
  success: boolean;
  deletedCount: number;
  error?: string;
}

export { deleteUserAccount } from "./deleteUserAccount";
