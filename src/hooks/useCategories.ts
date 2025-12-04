import { useContext } from "react";
import { CategoriesContext } from "../contexts/categoriesContext";

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error("useCategories debe usarse dentro de un CategoriesProvider");
  }
  return context;
};
