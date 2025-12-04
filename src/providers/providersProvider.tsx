import { useEffect, useState } from "react";
import { getProviders } from "../services/apiService"; 
import { useAuth } from "../hooks/useAuth";
import { ProvidersContext } from "../contexts/providersContext";
import type { ProviderModel } from "../models/providerModel";

export const ProvidersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {token,loading} = useAuth();
  const [providers, setProviders] = useState<ProviderModel[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(true);

  const fetchData = async () => {
    if (!token) return;
    if (loading) return;
    setLoadingProviders(true);
    try {
      const data = await getProviders(token);
      setProviders(data);
    } catch (error) {
      console.error("Error al obtener proveedores", error);
    } finally {
      setLoadingProviders(false);
    }
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <ProvidersContext.Provider value={{ providers , loadingProviders, refreshProviders:fetchData}}>
      {children}
    </ProvidersContext.Provider>
  );
};