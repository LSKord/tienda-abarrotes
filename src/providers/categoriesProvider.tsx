import { useEffect, useState } from "react";
import type { CategorieModel } from "../models/categorieModel"; 
import { getCategories } from "../services/apiService"; 
import { CategoriesContext } from "../contexts/categoriesContext"; 
import { useAuth } from "../hooks/useAuth";

export const CategoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {token,loading} = useAuth();
  const [categories, setCategories] = useState<CategorieModel[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const fetchData = async () => {
    if (!token) return;
    if (loading) return;
    setLoadingCategories(true);
    try {
      const data = await getCategories(token);
      setCategories(data);
    } catch (error) {
      console.error("Error al obtener categorias", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <CategoriesContext.Provider value={{ categories , loadingCategories, refreshCategories:fetchData}}>
      {children}
    </CategoriesContext.Provider>
  );
};