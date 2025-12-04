import { createContext } from "react";
import type { ProductModel } from "../models/productModel";

interface ProductContextType {
  products: ProductModel[];
  loadingProducts: boolean;
  refresh: () => Promise<void>;
}

export const ProductContext = createContext<ProductContextType | undefined>(undefined);