import { Toast, type ToastMessage } from "primereact/toast";
import { forwardRef, type JSX, useImperativeHandle, useRef } from "react";

export type ToastSeverity = ToastMessage["severity"];

export interface AppToastRef {
  show: (label: string, severity?: ToastSeverity, life?: number) => void;
}

interface AppToastProps {
  position?:
    | "center"
    | "bottom-right"
    | "bottom-left"
    | "top-right"
    | "top-left"
    | "top-center"
    | "bottom-center";
}

const AppToast = forwardRef<AppToastRef, AppToastProps>(
  ({ position = "top-right" }, ref):JSX.Element => {
    const toastRef = useRef<Toast>(null);

    useImperativeHandle(ref, () => ({
      show: (label, severity = "info", life = 3000) => {
        toastRef.current?.show({
          severity: severity,
          summary: label,
          detail: label,
          life: life,
        });
      },
    }));

    return <Toast ref={toastRef} position={position} />;
  }
);

AppToast.displayName = "AppToast";

export default AppToast;
