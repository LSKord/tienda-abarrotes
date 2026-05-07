import { Dialog } from "primereact/dialog";
import type { PurchaseModel } from "../../models/purchaseModel";
import { useProduct } from "../../hooks/useProducts";
import { useProviders } from "../../hooks/useProviders";
import { Divider } from "primereact/divider";
import { Tag } from "primereact/tag";

interface PurchaseModalProps {
  visible: boolean;
  onHide: () => void;
  purchase: PurchaseModel|undefined;
}

const PurchaseModal = ({ visible, onHide, purchase }: PurchaseModalProps) => {
  const { products } = useProduct();
  const { providers } = useProviders();

  if (!purchase) return;

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      closable
      draggable={false}
      style={{ width: "30rem" }}
      headerClassName="text-primary-700"
      header={`Compra #${purchase.id}`}
    >
      <div className="flex justify-content-between align-items-center">
        <Tag value={"Completado"} severity={"success"} />
        <div className="text-right">
          <span className="block text-sm text-color-secondary">Total</span>
          <span className="text-2xl font-bold">
            $
            {purchase.detallesCompra
              .reduce(
                (prev, acc) =>
                  prev + acc.precioUnitarioDetalle * acc.cantidadDetalle,
                0
              )
              .toFixed(2)}
          </span>
        </div>
      </div>

      <Divider />

      <div className="mb-3">
        <p className="m-0 text-sm">
          <strong>Proveedor:</strong>{" "}
          {
            providers.find((p) => p.id === purchase.idProveedorCompra)
              ?.nombreProveedor
          }
        </p>
        <p className="m-0 text-sm text-color-secondary">
          Fecha:{" "}
          {new Date(purchase.fechaCompra).toLocaleString("es-MX", {
            dateStyle: "short",
            timeStyle: "medium",
          })}
        </p>
      </div>

      <Divider />

      <div className="mb-3">
        <p className="font-semibold mb-2">Items:</p>
        {purchase.detallesCompra.map((item, i) => (
          <div
            key={i}
            className="flex justify-content-between align-items-center p-2 border-round surface-100 mb-2"
          >
            <div>
              <p className="m-0 font-medium">{products.find((p)=>p.id===item.idProductoDetalle)?.nombreProducto}</p>
              <small className="text-color-secondary">ID: {item.id}</small>
            </div>
            <div className="text-right">
              <p className="m-0 text-sm">
                {item.cantidadDetalle} unidades x ${item.precioUnitarioDetalle.toFixed(2)}
              </p>
              <strong>${(item.cantidadDetalle * item.precioUnitarioDetalle).toFixed(2)}</strong>
            </div>
          </div>
        ))}
      </div>

      <Divider />
    </Dialog>
  );
};

export default PurchaseModal;
