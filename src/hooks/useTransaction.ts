import { useContext } from "react";
import { TransactionsContext } from "../contexts/transactionsContext";

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error("useTransactions debe usarse dentro de un TransactionsProvider");
  }
  return context;
};
