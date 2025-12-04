import { type JSX, useRef } from "react";
import AppToast, {type AppToastRef}  from "../components/toast";
import React from "react";

export const useAppToast = () => {
  const toastRef = useRef<AppToastRef>(null);

  const toastElement:JSX.Element = React.createElement(AppToast,{
    ref:toastRef,
  })
  const showToast = (
    label: string,
    severity: Parameters<AppToastRef["show"]>[1],
    life?: number
  ) => {
    toastRef.current?.show(label, severity, life);
  };

  return { toastElement, showToast };
};