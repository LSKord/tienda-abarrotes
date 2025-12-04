import type { ReactNode } from "react";
import { ToastContext } from "../contexts/toastContext";
import { useAppToast } from "../hooks/useAppToast";

type Props = { children: ReactNode };

export const ToastProvider = ({ children }: Props) => {
  const { toastElement, showToast } = useAppToast();

  return (
    <ToastContext.Provider value={{ showToast }}>
      {toastElement}
      {children}
    </ToastContext.Provider>
  );
};
