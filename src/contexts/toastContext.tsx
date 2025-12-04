import { createContext } from "react";
import type { ToastSeverity } from "../components/toast";

export type ToastContextType = {
  showToast: (label: string, severity?: ToastSeverity, life?: number) => void;
};

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);
