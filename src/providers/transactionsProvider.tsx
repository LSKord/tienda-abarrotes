import { useEffect, useState } from "react";
import { getTransactions } from "../services/apiService"; 
import { useAuth } from "../hooks/useAuth";
import { TransactionsContext } from "../contexts/transactionsContext"; 
import type { TransactionModel } from "../models/transactionModel"; 

export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {token,loading} = useAuth();
  const [transactions, setTransactions] = useState<TransactionModel[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  const fetchData = async () => {
    if (!token) return;
    if (loading) return;
    setLoadingTransactions(true);
    try {
      const data = await getTransactions(token);
      setTransactions(data);
    } catch (error) {
      console.error("Error al obtener ventas", error);
    } finally {
      setLoadingTransactions(false);
    }
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <TransactionsContext.Provider value={{ transactions , loadingTransactions, refreshTransactions:fetchData}}>
      {children}
    </TransactionsContext.Provider>
  );
};