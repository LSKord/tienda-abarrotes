import { Card } from "primereact/card";
import type { ProductModel } from "../models/productModel";
import { Button } from "primereact/button";

interface ProductCartProps {
  product: ProductModel;
  onAdd: () => void;
  onRemove: () => void;
  onClear: () => void;
  disabled: boolean;
}

const ProductCartCard = ({
  product,
  onAdd,
  onClear,
  onRemove,
  disabled,
}: ProductCartProps) => {
  return (
    <Card className="shadow-none border-solid border-1 border-gray-300 p-0 w-10">
      <div className="flex justify-content-between gap-2 py-0 align-items-center">
        <div>
          <h4 className="m-0">{product.nombreProducto}</h4>
          <p className="m-0 text-sm text-500">
            ${product.precioProducto.toFixed(2)}
          </p>
        </div>

        <div className="flex align-items-center gap-2">
          <Button
            icon="pi pi-minus"
            className="p-button-rounded p-button-text p-button-sm text-black-alpha-90"
            onClick={onRemove}
          />

          <span className="w-2rem text-center">{product.cantidadProducto}</span>

          <Button
            icon="pi pi-plus"
            className="p-button-rounded p-button-text p-button-sm text-black-alpha-90"
            onClick={onAdd}
            disabled={disabled}
          />

          <Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-text p-button-sm p-button-danger"
            onClick={onClear}
          />
        </div>
      </div>
    </Card>
  );
};

export default ProductCartCard;
