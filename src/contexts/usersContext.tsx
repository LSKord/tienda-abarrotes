import { createContext } from "react";
import type { UserModel } from "../models/userModel";

interface UsersContextType {
  users: UserModel[];
  loadingUsers: boolean;
  refreshUsers: () => Promise<void>;
}

export const UsersContext = createContext<UsersContextType | undefined>(undefined);