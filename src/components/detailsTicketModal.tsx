import { Dialog } from "primereact/dialog";
import type { TransactionModel } from "../models/transactionModel";
import type { UserModel } from "../models/userModel";
import type { ProductModel } from "../models/productModel";
import { Divider } from "primereact/divider";

interface DetailsTicketsProps {
  visible: boolean;
  transaction: TransactionModel | undefined;
  onHide: () => void;
  users: UserModel[];
  products: ProductModel[];
}

const DetailsTicketModal = ({
  visible,
  transaction,
  onHide,
  users,
  products,
}: DetailsTicketsProps) => {
  if (!transaction) return null;

  const fecha = new Date(transaction.fechaVenta);

  const vendedor = users.find((u) => u.id === transaction.idVendedorVenta);
  const comprador = users.find((u) => u.id === transaction.idCompradorVenta);

  return (
    <Dialog
      header="Detalles de venta"
      visible={visible}
      onHide={onHide}
      style={{ width: "35rem" }}
      draggable={false}
      modal
    >
      <div className="flex flex-column">
        <h5 className="text-lg text-gray-600">Venta #{transaction.id}</h5>

        <div className="grid">
          <div className="col-6">
            <strong>Fecha</strong>
            <p>{fecha.toLocaleDateString("es-MX")}</p>
          </div>
          <div className="col-6">
            <strong>Hora</strong>
            <p>
              {fecha.toLocaleTimeString("es-MX", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        <div className="grid">
          <div className="col-6">
            <strong>Vendedor</strong>
            <p>{vendedor?.nombreUsuario ?? "Compra móvil"}</p>
          </div>
          <div className="col-6">
            <strong>Cliente</strong>
            <p>{comprador?.nombreUsuario ?? "Invitado"}</p>
          </div>
        </div>

        <div className="grid">
          <div className="col-6">
            <strong>Correo</strong>
            <p>{comprador?.correoUsuario ?? "N/A"}</p>
          </div>
          <div className="col-6">
            <strong>Método de pago</strong>
            <p>
              {transaction.idMetodoPagoVenta === 1 ? "Efectivo" : "Tarjeta"}
            </p>
          </div>
        </div>

        <Divider/>

        <h5 className="mt-0 text-lg">Productos vendidos</h5>
        <div className="flex flex-column gap-2">
          {transaction.detallesVenta.map((item) => {
            const name = products.find(
              (product) => product.id === item.id
            )?.nombreProducto;
            return (
              <div
                key={item.id}
                className="flex justify-content-between align-items-center p-2 border-round bg-gray-100"
              >
                <div>
                  <strong>{name}</strong>
                  <p className="text-xs">
                    {item.cantidadVenta} × $
                    {item.precioProductoVenta.toFixed(2)}
                  </p>
                </div>
                <strong>
                  ${(item.cantidadVenta * item.precioProductoVenta).toFixed(2)}
                </strong>
              </div>
            );
          })}
        </div>

        <Divider/>

        <div className="flex justify-content-between">
          <strong>Total</strong>
          <strong className="text-xl">
            $
            {transaction.detallesVenta
              .reduce(
                (total, t) => total + t.cantidadVenta * t.precioProductoVenta,
                0
              )
              .toFixed(2)}
          </strong>
        </div>
      </div>
    </Dialog>
  );
};

export default DetailsTicketModal;
