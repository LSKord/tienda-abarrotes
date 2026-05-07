import { Button } from "primereact/button";
import { logoutUser } from "../services/apiService";
import { useAuth } from "../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { TabMenu } from "primereact/tabmenu";
import { useEffect, useState } from "react";

const tabItems = [
  { label: "Punto de venta", icon: "pi pi-shopping-cart", to: "/sales" },
  {
    label: "Punto de compra",
    icon: "pi pi-cart-arrow-down",
    to: "/purchases",
  },
  { label: "Inventario", icon: "pi pi-box", to: "/inventory" },
  { label: "Transacciones", icon: "pi pi-receipt", to: "/transactions" },
];

const HeaderAbarrotes = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeIndex, setActiveIndex] = useState<number>(tabItems.findIndex((item) => item.to === location.pathname));

  useEffect(() => {
    const index = tabItems.findIndex((item) => item.to === location.pathname);
    setActiveIndex(index === -1 ? 0: index );
    console.log("hola")
  }, [location.pathname]);

  return (
    <div>
      <div className="flex justify-content-between align-items-center mx-8 my-4">
        <div
          className="flex gap-1 align-items-center cursor-pointer"
          onClick={() => {
            navigate(tabItems[2].to);
          }}
        >
          <img
            alt="inventory image"
            src="https://img.freepik.com/vector-premium/ilustracion-plana-mini-tienda_847361-516.jpg"
            className="border-round-md object-cover w-3rem h-3rem m-auto"
          />
          <div className="flex flex-column justify-content-center gap-1">
            <h2 className="m-0 text-primary-700">Tienda</h2>
            <p className="m-0">Maneja tu tienda</p>
          </div>
        </div>
        <Button
          icon="pi pi-sign-out"
          label="Cerrar sesión"
          className="bg-white text-black-alpha-90 border-500"
          onClick={() => {
            logoutUser(localStorage.getItem("refreshToken") ?? "");
            logout();
            navigate("/");
          }}
        />
      </div>
      <hr></hr>
      <div className="my-3 mx-8 flex justify-content-center gap-3">
        <TabMenu
          model={tabItems.map((item) => ({
            ...item,
            command: () => navigate(item.to),
          }))}
          activeIndex={activeIndex}
          onTabChange={(e)=>{
            setActiveIndex(e.index);
            navigate(tabItems[e.index].to);
          }}
        />
      </div>
    </div>
  );
};

export default HeaderAbarrotes;
