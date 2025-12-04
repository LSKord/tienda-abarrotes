import { Card } from "primereact/card";
import type { ProductModel } from "../models/productModel";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import type { CategorieModel } from "../models/categorieModel";

interface ProductCardProps {
  product: ProductModel;
  handleButton: () => void;
  disabled: boolean;
  categories:CategorieModel[]
}

const ProductCard = ({ product, handleButton, disabled,categories }: ProductCardProps) => {
  

  return (
    <Card className="w-5 m-0 py-0 shadow-none border-solid border-1 border-gray-300">
      <div className="m-0 flex justify-content-between">
        <h4 className="mt-1 text-overflow-ellipsis">{product.nombreProducto}</h4>
        <Tag
          value={`${product.cantidadProducto} restantes`}
          className={
            product.cantidadProducto <= product.minimoProducto
              ? "py-0 bg-red-400 h-2rem"
              : "py-0 bg-black-alpha-90 h-2rem"
          }
        />
      </div>
      <p className="mt-0">{categories.find((c)=>c.id===product.categoriaProducto)?.nombreCategoria || "Sin categoria"}</p>
      <div className="m-0 flex justify-content-between">
        <h4>${product.precioProducto.toFixed(2)}</h4>
        <Button
          label="Agregar"
          icon="pi pi-plus"
          className="bg-black-alpha-90 m-0"
          onClick={handleButton}
          disabled={disabled}
        />
      </div>
    </Card>
  );
};

export default ProductCard;
