import { useContext } from "react";
import { ProvidersContext } from "../contexts/providersContext";

export const useProviders = () => {
  const context = useContext(ProvidersContext);
  if (!context) {
    throw new Error("useProviders debe usarse dentro de un ProvidersProvider");
  }
  return context;
};
