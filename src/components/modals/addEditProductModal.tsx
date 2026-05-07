import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import { useCategories } from "../../hooks/useCategories";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import type { Nullable } from "primereact/ts-helpers";
import { postProduct, putProduct } from "../../services/apiService";
import { useProduct } from "../../hooks/useProducts";
import { useToast } from "../../hooks/useToast";
import type { ProductModel } from "../../models/productModel";
import { Checkbox } from "primereact/checkbox";

interface AddEditProductModalProps {
  visible: boolean;
  onHide: () => void;
  productToEdit?: ProductModel;
}

const AddEditProductModal = ({
  visible,
  onHide,
  productToEdit,
}: AddEditProductModalProps) => {
  const [sending, setSending] = useState(false);
  const [product, setProduct] = useState({
    nombreProducto: "",
    descripcionProducto: "",
    categoriaProducto: 1,
    cantidadProducto: 0,
    precioProducto: 0,
    productoEnVenta: true,
    minimoProducto: 0,
  });
  const { categories } = useCategories();
  const { showToast } = useToast();
  const { refresh } = useProduct();
  const editable = productToEdit;

  useEffect(() => {
    if (productToEdit) {
      setProduct({
        nombreProducto: productToEdit.nombreProducto,
        descripcionProducto: productToEdit.descripcionProducto,
        categoriaProducto: productToEdit.categoriaProducto,
        cantidadProducto: productToEdit.cantidadProducto,
        precioProducto: productToEdit.precioProducto,
        productoEnVenta: productToEdit.productoEnVenta,
        minimoProducto: productToEdit.minimoProducto,
      });
    } else {
      setProduct({
        nombreProducto: "",
        descripcionProducto: "",
        categoriaProducto: 1,
        cantidadProducto: 0,
        precioProducto: 0,
        productoEnVenta: true,
        minimoProducto: 0,
      });
    }
  }, [productToEdit, visible]);

  const handleChange = (
    field: string,
    value: string | Nullable<number | null> | boolean
  ) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  const onAddEdit = async () => {
    setSending(true);
    try {
      if (editable) {
        await putProduct(product,productToEdit.id);
        showToast("Producto Editado", "success");
        await refresh();
        onHide();
      } else {
        await postProduct(product);
        showToast("Producto creado", "success");
        await refresh();
        onHide();
      }
    } catch (error) {
      showToast("Error al guardar producto", "error");
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  const footer = (
    <div className="flex justify-content-between gap-2 mt-3">
      <Button
        label="Cancelar"
        severity="secondary"
        onClick={onHide}
        disabled={sending}
        className="p-button-text text-black-alpha-90"
      />
      <Button
        label={editable ? "Guardar cambios" : "Agregar producto"}
        icon={editable ? "pi pi-save" : "pi pi-check"}
        onClick={() => onAddEdit()}
        loading={sending}
        className="bg-black-alpha-90"
      />
    </div>
  );

  return (
    <div>
      <Dialog
        visible={visible}
        onHide={onHide}
        draggable={false}
        closable={!sending}
        footer={footer}
        headerClassName="text-primary-700"
        header={editable ? "Editar producto" : "Agregar nuevo producto"}
        style={{ width: "30rem" }}
      >
        <div className="flex justify-content-between align-items-center mb-3">
          <p className="text-sm text-color-secondary m-0">
            {editable
              ? "Modifique los campos del producto"
              : "Ingrese los detalles del nuevo producto"}
          </p>

          {editable && <div className="flex align-items-center gap-2">
            <Checkbox
              inputId="enVenta"
              checked={product.productoEnVenta}
              onChange={(e) => handleChange("productoEnVenta", e.checked)}
            />
            <label htmlFor="enVenta" className="font-medium">
              En venta
            </label>
          </div>}
        </div>

        <div className="flex flex-column gap-3">
          <div>
            <label className="block mb-2 font-medium">Nombre</label>
            <InputText
              placeholder="Escriba el nombre del producto..."
              className="w-full"
              minLength={5}
              maxLength={150}
              value={product.nombreProducto}
              onChange={(e) => handleChange("nombreProducto", e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Descripción</label>
            <InputText
              placeholder="Descripción del producto..."
              className="w-full"
              value={product.descripcionProducto}
              onChange={(e) =>
                handleChange("descripcionProducto", e.target.value)
              }
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Categoria</label>
            <Dropdown
              className="w-full"
              value={product.categoriaProducto}
              options={[
                ...categories.map((u) => ({
                  label: u.nombreCategoria,
                  value: u.id,
                })),
              ]}
              onChange={(e) =>
                handleChange("categoriaProducto", e.target.value)
              }
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Precio</label>
            <InputNumber
              value={product.precioProducto}
              onValueChange={(e) => handleChange("precioProducto", e.value)}
              mode="currency"
              currency="MXN"
              locale="es-MX"
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Cantidad</label>
            <InputNumber
              value={product.cantidadProducto}
              onValueChange={(e) => handleChange("cantidadProducto", e.value)}
              showButtons
              min={0}
              className="w-full"
              decrementButtonClassName="bg-black-alpha-90 border-black-alpha-90"
              incrementButtonClassName="bg-black-alpha-90 border-black-alpha-90"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Minimo de producto</label>
            <InputNumber
              value={product.minimoProducto}
              onValueChange={(e) => handleChange("minimoProducto", e.value)}
              min={1}
              className="w-full"
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default AddEditProductModal;
