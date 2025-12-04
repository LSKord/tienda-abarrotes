import { useEffect, useState } from "react";
import type { ProductModel } from "../models/productModel";
import { getProducts } from "../services/apiService";
import { ProductContext } from "../contexts/productContext";
import { useAuth } from "../hooks/useAuth";

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {token,loading} = useAuth();
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const fetchData = async () => {
    if (!token) return;
    if (loading) return;
    setLoadingProducts(true);
    try {
      const data = await getProducts(token);
      setProducts(data);
    } catch (error) {
      console.error("Error al obtener productos", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <ProductContext.Provider value={{ products, loadingProducts, refresh: fetchData }}>
      {children}
    </ProductContext.Provider>
  );
};