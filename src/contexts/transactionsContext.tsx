import { createContext } from "react";
import type { TransactionModel } from "../models/transactionModel"; 

interface TransactionContextType {
  transactions: TransactionModel[];
  loadingTransactions: boolean;
  refreshTransactions: () => Promise<void>;
}

export const TransactionsContext = createContext<TransactionContextType | undefined>(undefined);