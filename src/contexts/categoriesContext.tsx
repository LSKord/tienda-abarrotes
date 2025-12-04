import { createContext } from "react";
import type { CategorieModel } from "../models/categorieModel"; 

interface CategoriaContextType {
  categories: CategorieModel[];
  loadingCategories: boolean;
  refreshCategories: () => Promise<void>;
}

export const CategoriesContext = createContext<CategoriaContextType | undefined>(undefined);