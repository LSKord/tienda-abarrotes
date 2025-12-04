import { createContext } from "react";
import type { ProviderModel } from "../models/providerModel";

interface ProveedorContextType {
  providers: ProviderModel[];
  loadingProviders: boolean;
  refreshProviders: () => Promise<void>;
}

export const ProvidersContext = createContext<ProveedorContextType | undefined>(undefined);