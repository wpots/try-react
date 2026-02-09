import type { User } from "firebase/auth";
import type { ReactNode } from "react";

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isGuest: boolean;
}

export interface AuthProviderProps {
  children: ReactNode;
}

export { AuthProvider, useAuth } from "./AuthContext";
