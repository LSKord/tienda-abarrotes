import { useEffect, useState } from "react";
import { getPurchases } from "../services/apiService"; 
import { useAuth } from "../hooks/useAuth";
import { PurchasesContext } from "../contexts/purchaseContext"; 
import type { PurchaseModel } from "../models/purchaseModel";

export const PurchasesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {token,loading} = useAuth();
  const [purchases, setPurchases] = useState<PurchaseModel[]>([]);
  const [loadingPurchases, setLoadingPurchases] = useState(true);

  const fetchData = async () => {
    if (!token) return;
    if (loading) return;
    setLoadingPurchases(true);
    try {
      const data = await getPurchases(token);
      setPurchases(data);
    } catch (error) {
      console.error("Error al obtener compras", error);
    } finally {
      setLoadingPurchases(false);
    }
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <PurchasesContext.Provider value={{ purchases , loadingPurchases, refreshPurchases:fetchData}}>
      {children}
    </PurchasesContext.Provider>
  );
};