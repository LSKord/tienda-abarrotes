import { useContext } from "react";
import { ProductContext } from "../contexts/productContext";

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct debe usarse dentro de un ProductProvider");
  }
  return context;
};
