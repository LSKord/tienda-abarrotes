import { createContext } from "react";

export interface AuthContextType {
  token: string | null;
  login: (token: string, refreshToken: string,user:number,username:string) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
