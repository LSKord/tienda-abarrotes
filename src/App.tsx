import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./pages/loginPage";
import { AuthProvider } from "./providers/authProvider";
import Inventory from "./pages/inventoryPage";
import Sales from "./pages/salesPage";
import HeaderAbarrotes from "./components/headerComponent";
import { PrivateRoute } from "./components/privateRoute";
import { ProductProvider } from "./providers/productProvider";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { UsersProvider } from "./providers/usersProvider";
import { CategoriesProvider } from "./providers/categoriesProvider";
import { ToastProvider } from "./providers/toastProvider";
import { ConfirmDialog } from "primereact/confirmdialog";
import Purchases from "./pages/purchasesPage";
import { ProvidersProvider } from "./providers/providersProvider";
import { PurchasesProvider } from "./providers/purchasesProvider";
import Tickets from "./pages/ticketsPage";
import { TransactionsProvider } from "./providers/transactionsProvider";
import { PublicRoute } from "./components/publicRoute";
import ErrorPage from "./pages/errorPage";

function AppLayout() {
  const location = useLocation();

  return (
    <>
      <ConfirmDialog />
      {location.pathname !== "/" ? <HeaderAbarrotes /> : null}
      <Routes>
        <Route path="/" element={<PublicRoute children={<Login />} />} />
        <Route
          path="/inventory"
          element={<PrivateRoute children={<Inventory />} />}
        />
        <Route path="/sales" element={<PrivateRoute children={<Sales />} />} />
        <Route
          path="/purchases"
          element={<PrivateRoute children={<Purchases />} />}
        />
        <Route
          path="/transactions"
          element={<PrivateRoute children={<Tickets />} />}
        />

        <Route path="*" element={<ErrorPage/>} />
      </Routes>
    </>
  );
}

function App() {
  const stripePromise = loadStripe(import.meta.env.VITE_PUBLISHABLE_KEY);
  return (
    <ToastProvider>
      <AuthProvider>
        <UsersProvider>
          <CategoriesProvider>
            <ProductProvider>
              <ProvidersProvider>
                <PurchasesProvider>
                  <TransactionsProvider>
                    <BrowserRouter>
                      <Elements stripe={stripePromise}>
                        <AppLayout />
                      </Elements>
                    </BrowserRouter>
                  </TransactionsProvider>
                </PurchasesProvider>
              </ProvidersProvider>
            </ProductProvider>
          </CategoriesProvider>
        </UsersProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
