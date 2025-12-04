import { Dialog } from "primereact/dialog";
import type { ProviderModel } from "../models/providerModel";
import type { ProductModel } from "../models/productModel";
import { useState } from "react";
import type { CreatePurchaseDetailModel } from "../models/purchaseModel";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { usePurchases } from "../hooks/usePurchases";
import { postPurchase } from "../services/apiService";
import { useToast } from "../hooks/useToast";

interface CreatePurchaseModalProps {
  visible: boolean;
  onHide: () => void;
  providers: ProviderModel[];
  products: ProductModel[];
}

const CreatePurchaseModal = ({
  visible,
  onHide,
  providers,
  products,
}: CreatePurchaseModalProps) => {
  const { refreshPurchases } = usePurchases();
  const { showToast } = useToast();
  const [provider, setProvider] = useState<ProviderModel>();
  const [selectedProduct, setSelectedProduct] = useState<ProductModel>();
  const [quantity, setQuantity] = useState<number>(1);
  const [unitCost, setUnitCost] = useState<number>(0);
  const [items, setItems] = useState<CreatePurchaseDetailModel[]>([]);
  const [sending,setSending] = useState(false);

  const addItem = () => {
    if (selectedProduct && quantity > 0 && unitCost > 0) {
      setItems([
        ...items,
        {
          idProductoRecompra: selectedProduct.id,
          cantidadProducto: quantity,
          precioProducto: unitCost,
        },
      ]);
      setSelectedProduct(undefined);
      setQuantity(1);
      setUnitCost(0);
    }
  };

  const handleSubmit = async () => {
    
    if (!provider || items.length === 0) return;

    setSending(true);

    try {
      await postPurchase({
        idProveedorRecompra: provider?.id,
        detalles: items,
      });
      await refreshPurchases();
      showToast("Compra creada", "success");
      onHide();
      setItems([]);
      setProvider(undefined);
    } catch (error) {
      showToast("Error al crear compra", "error");
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  const handleCancel = () => {
    onHide();
    setItems([]);
    setProvider(undefined);
  };

  const footer = (
    <div className="flex justify-content-end gap-2">
      <Button
        label="Cancelar"
        className="p-button-text"
        onClick={handleCancel}
        disabled={sending}
      />
      <Button
        label="Crear compra"
        icon="pi pi-check-circle"
        disabled={!provider || items.length === 0}
        onClick={handleSubmit}
        loading={sending}
        className="bg-black-alpha-90"
      />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      onHide={handleCancel}
      footer={footer}
      closable={!sending}
      header={"Crear compra"}
      style={{ width: "40rem" }}
      draggable={false}
    >
      <div className="flex flex-column gap-3">
        {/* Provider */}
        <div>
          <label className="font-medium block mb-1">Proveedor</label>
          <Dropdown
            value={provider}
            options={providers.map((p) => ({
              label: p.nombreProveedor,
              value: p,
            }))}
            onChange={(e) => setProvider(e.value)}
            placeholder="Selecciona un proveedor"
            className="w-full"
          />
        </div>

        <div>
          <label className="font-medium block mb-2">Agrega productos</label>
          <div className="grid align-items-center mb-2">
            <div className="col-5">
              <Dropdown
                value={selectedProduct}
                options={products.map((p) => ({
                  label: p.nombreProducto,
                  value: p,
                }))}
                onChange={(e) => setSelectedProduct(e.value)}
                placeholder="Selecciona productos"
                className="w-full"
              />
            </div>
            <div className="col-3">
              <InputNumber
                value={quantity}
                onValueChange={(e) => setQuantity(e.value || 1)}
                min={1}
                showButtons={false}
                inputClassName="text-center"
                inputStyle={{ width: "100%" }}
              />
            </div>
            <div className="col-3">
              <InputNumber
                value={unitCost}
                onValueChange={(e) => setUnitCost(e.value || 0)}
                mode="currency"
                currency="MXN"
                locale="es-MX"
                inputClassName="text-right"
                inputStyle={{ width: "100%" }}
              />
            </div>
          </div>

          <Button
            icon="pi pi-plus"
            label="Agregar producto"
            outlined
            className="w-full"
            onClick={addItem}
          />

          {/* Lista de productos agregados */}
          {items.length > 0 && (
            <ul className="mt-3 list-none p-0">
              {items.map((item, i) => (
                <li
                  key={i}
                  className="flex justify-content-between align-items-center border-bottom-1 surface-border py-2"
                >
                  <span>
                    {
                      products.find((p) => p.id === item.idProductoRecompra)
                        ?.nombreProducto
                    }
                  </span>
                  <span>
                    {item.cantidadProducto} × ${item.precioProducto.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default CreatePurchaseModal;
