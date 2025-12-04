import { useContext } from "react";
import { PurchasesContext } from "../contexts/purchaseContext"; 

export const usePurchases = () => {
  const context = useContext(PurchasesContext);
  if (!context) {
    throw new Error("usePurchases debe usarse dentro de un PurchasesProvider");
  }
  return context;
};
