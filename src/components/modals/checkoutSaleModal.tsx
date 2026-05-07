import { Dialog } from "primereact/dialog";
import type { ProductModel } from "../../models/productModel";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { type UserModel } from "../../models/userModel";
import { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { checkoutPayment, postSale } from "../../services/apiService";
import type { SaleModel } from "../../models/saleModel";
import { useProduct } from "../../hooks/useProducts";
import { useToast } from "../../hooks/useToast";
import { useTransactions } from "../../hooks/useTransaction";

interface CheckoutModalProps {
  visible: boolean;
  onHide: () => void;
  cart: ProductModel[];
  users: UserModel[];
}

const CheckoutModal = ({
  visible,
  onHide,
  cart,
  users,
}: CheckoutModalProps) => {
  const [selectedClient, setSelectedClient] = useState<UserModel | null>(null);
  const [selectedMethod, setSelectedMethod] = useState(1);
  const [sending, setSending] = useState(false);
  const { refresh } = useProduct();
  const { refreshTransactions } = useTransactions();
  const { showToast } = useToast();
  const stripe = useStripe();
  const elements = useElements();
  const price = parseFloat(
    cart
      .reduce(
        (total, product) =>
          total + product.precioProducto * (product.cantidadProducto ?? 0),
        0
      )
      .toFixed(2)
  );

  const stripeSale = async () => {
    if (!stripe || !elements) return;

    const clientSecret = await checkoutPayment(price);
    const cardElement = elements.getElement(CardElement);

    if (!cardElement) throw new Error("CardElement no encontrado");

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: selectedClient?.nombreUsuario || "Invitado",
          },
        },
      }
    );

    if (error) {
      console.error(error);
    } else if (paymentIntent.status == "succeeded") {
      console.log("Pago realizado correctamente");
    }
  };

  const handleSale = async () => {
    setSending(true);
    try {
      if (selectedMethod === 2) {
        await stripeSale();
      }

      const sale: SaleModel = {
        idMetodoPagoVenta: selectedMethod,
        idVendedorVenta: parseInt(localStorage.getItem("user") ?? "1"),
        idCompradorVenta: selectedClient?.id ?? null,
        detalleVenta: cart.map((p) => ({
          idProductoVenta: p.id,
          cantidadProductoVenta: p.cantidadProducto,
          precioProductoVenta: p.precioProducto,
        })),
      };
      console.log(sale.detalleVenta);
      await postSale(sale);
      await refresh();
      await refreshTransactions();
      showToast("Venta realizada con exito", "success");
      onHide();
    } catch (e) {
      showToast("Error al procesar pago", "error");
      console.error("Error al procesar pago:", e);
    } finally {
      setSending(false);
    }
  };

  const footer = () => {
    return (
      <div className="flex justify-content-between">
        <Button
          label="Cancelar"
          onClick={onHide}
          className="p-button-text text-black-alpha-90"
          disabled={sending}
        />
        <Button
          label="Completar venta"
          icon="pi pi-check"
          className="bg-black-alpha-90"
          onClick={handleSale}
          loading={sending}
        />
      </div>
    );
  };

  return (
    <div>
      <Dialog
        headerClassName="text-primary-700"
        header="Confirmar venta"
        visible={visible}
        onHide={onHide}
        draggable={false}
        footer={footer}
        closable={!sending}
      >
        <div className="flex flex-column px-3">
          <span className="mt-0">
            Ingresa los detalles del cliente y método de pago
          </span>
          <h4 className="mb-1">Cliente</h4>
          <Dropdown
            className="w-full mt-0"
            value={selectedClient}
            options={[
              { label: "Ningun cliente", value: null },
              ...users
                .filter((u) => u.rolUsuario === 3)
                .map((u) => ({ label: u.nombreUsuario, value: u })),
            ]}
            onChange={(e) => setSelectedClient(e.value)}
            placeholder="Selecciona un cliente"
          />
          <h4 className="mb-1 mt-3">Método de pago</h4>
          <Dropdown
            className="w-full mt-0"
            value={selectedMethod}
            options={[
              { label: "Efectivo", value: 1 },
              { label: "Tarjeta", value: 2 },
            ]}
            onChange={(e) => setSelectedMethod(e.value)}
          />
          {selectedMethod == 2 && (
            <div className="mt-4 mb-2">
              <CardElement options={{ hidePostalCode: true }} />
            </div>
          )}
          <div className="border-top-1 w-full border-black-alpha-90 mt-3" />
          <h3 className="my-2">Resumen de orden</h3>
          <div className="w-full max-h-22rem overflow-y-auto">
            <div className="flex flex-column flex-wrap gap-2">
              {cart.map((p) => (
                <div className="flex justify-content-between" key={p.id}>
                  <span>
                    {p.nombreProducto} x {p.cantidadProducto}
                  </span>
                  <span>${p.precioProducto.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-top-1 w-full border-black-alpha-90 mt-3" />
          <div className="flex justify-content-between">
            <h4>Total</h4>
            <h4>${price.toFixed(2)}</h4>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default CheckoutModal;
