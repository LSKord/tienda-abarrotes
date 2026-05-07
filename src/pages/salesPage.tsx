import { useEffect, useState } from "react";
import type { ProductModel } from "../models/productModel";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { ScrollPanel } from "primereact/scrollpanel";
import { useProduct } from "../hooks/useProducts";
import { ProgressSpinner } from "primereact/progressspinner";
import ProductCard from "../components/productSalesComponent";
import ProductCartCard from "../components/productCartComponent";
import { Button } from "primereact/button";
import CheckoutModal from "../components/modals/checkoutSaleModal";
import { useCategories } from "../hooks/useCategories";
import { useUsers } from "../hooks/useUsers";
import { useToast } from "../hooks/useToast";
import { useTransactions } from "../hooks/useTransaction";

const Sales = () => {
  const { products, loadingProducts } = useProduct();
  const { transactions } = useTransactions();
  const [productFilterList, setProductFilterList] = useState<ProductModel[]>(
    []
  );
  const [shoppingCart, setShoppingCart] = useState<ProductModel[]>([]);
  const [productFilter, setProductFilter] = useState("");
  const [visibleModal, setVisibleModal] = useState(false);
  const { categories } = useCategories();
  const { users } = useUsers();
  const { showToast } = useToast();

  useEffect(() => {
    setProductFilterList(products.filter((p) => p.productoEnVenta));
  }, [products]);

  const addToCart = (p: ProductModel) => {
    setShoppingCart((prevCart) => {
      const exist = prevCart.find((c) => c.id === p.id);

      if (exist) {
        return prevCart.map((c) =>
          c.id === p.id ? { ...c, cantidadProducto: c.cantidadProducto + 1 } : c
        );
      } else {
        return [...prevCart, { ...p, cantidadProducto: 1 }];
      }
    });
  };

  const incrementQuantity = (p: ProductModel) => {
    setShoppingCart((prevCart) =>
      prevCart.map((item) =>
        item.id === p.id
          ? { ...item, cantidadProducto: item.cantidadProducto + 1 }
          : item
      )
    );
  };

  const decrementQuantity = (p: ProductModel) => {
    setShoppingCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === p.id
            ? { ...item, cantidadProducto: item.cantidadProducto - 1 }
            : item
        )
        .filter((item) => item.cantidadProducto > 0)
    );
  };

  const clearFromCart = (p: ProductModel) => {
    setShoppingCart((prevCart) => prevCart.filter((item) => item.id !== p.id));
  };

  return (
    <div>
      <CheckoutModal
        visible={visibleModal}
        onHide={() => {
          setVisibleModal(false);
        }}
        cart={shoppingCart}
        users={users}
      />
      <div className="mx-8 mt-5 flex justify-content-center gap-5">
        {loadingProducts && products.length <= 0 ? (
          <Card className="flex justify-content-center">
            <ProgressSpinner />
          </Card>
        ) : (
          <Card className="ml-3 w-6 shadow-none border-solid border-1 border-gray-400">
            <h4 className="mb-2 mt-0">
              <span className="pi pi-box mr-2 text-primary-700" /> Productos ({products.length})
            </h4>
            <p className="mb-4 mt-0">Agrega productos al carritos</p>
            <InputText
              placeholder="Buscar productos..."
              className="w-full bg-gray-100 border-none"
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
            />
            <ScrollPanel style={{ height: "56vh" }} className="w-full mt-3">
              <div className="flex justify-content-evenly gap-3 flex-wrap">
                {productFilterList.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    categories={categories}
                    disabled={
                      (shoppingCart.find((c) => c.id === p.id)
                        ?.cantidadProducto ?? 0) >= p.cantidadProducto
                    }
                    handleButton={() => addToCart(p)}
                  />
                ))}
              </div>
            </ScrollPanel>
          </Card>
        )}
        <div className="flex flex-column gap-4 w-4">
          <Card className="shadow-none border-solid border-1 border-gray-400">
            <h4 className="mt-0">
              <span className="pi pi-shopping-cart m-auto" /> Carrito (
              {shoppingCart.length})
            </h4>
            <ScrollPanel className="w-full mt-3 mb-3 h-17rem">
              {shoppingCart.length <= 0 ? (
                <div className="flex justify-content-center">
                  <p>El carrito esta vacio</p>
                </div>
              ) : (
                <div className="flex justify-content-evenly gap-2 flex-wrap">
                  {shoppingCart.map((c) => (
                    <ProductCartCard
                      key={c.id}
                      product={c}
                      onAdd={() => incrementQuantity(c)}
                      onRemove={() => decrementQuantity(c)}
                      onClear={() => clearFromCart(c)}
                      disabled={
                        (productFilterList.find((p) => p.id === c.id)
                          ?.cantidadProducto ?? 0) <= c.cantidadProducto
                      }
                    />
                  ))}
                </div>
              )}
            </ScrollPanel>
            <hr />
            <div className="flex justify-content-between">
              <h4>Total:</h4>
              <h4>
                $
                {shoppingCart
                  .reduce(
                    (total, item) =>
                      total +
                      item.precioProducto * (item.cantidadProducto ?? 0),
                    0
                  )
                  .toFixed(2)}
              </h4>
            </div>
            <Button
              className="bg-black-alpha-90 w-full flex justify-content-center"
              onClick={() => {
                if (shoppingCart.length > 0) {
                  setVisibleModal(true);
                } else {
                  showToast("El carrito esta vacio", "info");
                }
              }}
            >
              <i className="pi pi-credit-card mr-2"></i>
              <span>Pagar</span>
            </Button>
          </Card>
          <Card className="shadow-none border-solid border-1 border-gray-400">
            <h4 className="mb-3 mt-0">
              <span className="pi pi-dollar mr-1" /> Ventas del día
            </h4>
            <div className="flex justify-content-between ">
              <p className="m-0">Ventas:</p>
              <p className="m-0">
                {
                  transactions.filter(
                    (t) =>
                      new Date(t.fechaVenta).setHours(0, 0, 0, 0) ===
                      new Date().setHours(0, 0, 0, 0)
                  ).length
                }
              </p>
            </div>
            <div className="flex justify-content-between">
              <p className="m-0 mt-1">Ganancias:</p>
              <p className="m-0 mt-1">
                $
                {transactions
                  .filter(
                    (t) =>
                      new Date(t.fechaVenta).setHours(0, 0, 0, 0) ===
                      new Date().setHours(0, 0, 0, 0)
                  )
                  .reduce(
                    (total, t) =>
                      total +
                      t.detallesVenta.reduce(
                        (total, t) =>
                          total + t.cantidadVenta * t.precioProductoVenta,
                        0
                      ),
                    0
                  )
                  .toFixed(2)}
              </p>
            </div>
            <div className="flex justify-content-between">
              <p className="m-0 mt-1">Productos vendidos:</p>
              <p className="m-0 mt-1">
                $
                {transactions
                  .filter(
                    (t) =>
                      new Date(t.fechaVenta).setHours(0, 0, 0, 0) ===
                      new Date().setHours(0, 0, 0, 0)
                  )
                  .reduce(
                    (total, t) =>
                      total +
                      t.detallesVenta.reduce(
                        (total, t) => total + t.cantidadVenta,
                        0
                      ),
                    0
                  )
                  .toFixed(2)}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Sales;
