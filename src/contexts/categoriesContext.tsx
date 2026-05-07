import { createContext } from "react";
import type { CategoryModel } from "../models/categoryModel"; 

interface CategoriaContextType {
  categories: CategoryModel[];
  loadingCategories: boolean;
  refreshCategories: () => Promise<void>;
}

export const CategoriesContext = createContext<CategoriaContextType | undefined>(undefined);