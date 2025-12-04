import { createContext } from "react";
import type { PurchaseModel } from "../models/purchaseModel"; 

interface PurchaseContextType {
  purchases: PurchaseModel[];
  loadingPurchases: boolean;
  refreshPurchases: () => Promise<void>;
}

export const PurchasesContext = createContext<PurchaseContextType | undefined>(undefined);