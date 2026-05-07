import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import { Tag } from "primereact/tag";
import { useProviders } from "../hooks/useProviders";
import type { ProviderModel } from "../models/providerModel";
import AddEditProviderModal from "../components/modals/addEditProviderModal";
import { confirmDialog } from "primereact/confirmdialog";
import { deleteProvider } from "../services/apiService";
import { usePurchases } from "../hooks/usePurchases";
import type { PurchaseModel } from "../models/purchaseModel";
import { getTotal } from "../utils/getPurchaseTotal";
import PurchaseModal from "../components/modals/purchaseModal";
import CreatePurchaseModal from "../components/modals/createPurchaseModal";
import { useProduct } from "../hooks/useProducts";
import { useToast } from "../hooks/useToast";
import { generatePurchasesExcel } from "../utils/Excel/generatePurchasesReport";

const Purchases = () => {
  const { providers, loadingProviders, refreshProviders } = useProviders();
  const { purchases, loadingPurchases } = usePurchases();
  const { products } = useProduct();
  const [providerFilterList, setProviderFilterList] = useState<ProviderModel[]>(
    []
  );
  const [purchasesFilterList, setPurchasesFilterList] = useState<
    PurchaseModel[]
  >([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [providerToEdit, setProviderToEdit] = useState<ProviderModel>();
  const [purchaseModalVisible, setPurchaseModalVisible] = useState(false);
  const [createPurchaseModalVisible, setCreatePurchaseModalVisible] =
    useState(false);
  const [purchase, setPurchase] = useState<PurchaseModel>();
  const [showPurchases, setShowPurchases] = useState(false);
  const [loading] = useState(loadingProviders || loadingPurchases);
  const { showToast } = useToast();

  useEffect(() => {
    const getProviders = () => {
      setProviderFilterList(providers);
    };
    getProviders();
  }, [providers]);

  useEffect(() => {
    const getPurchases = () => {
      setPurchasesFilterList(purchases);
    };
    getPurchases();
  }, [purchases]);

  useEffect(() => {
    const filterProvides = () => {
      if (!globalFilter.trim()) {
        setProviderFilterList(providers);
      } else {
        const filtered = providers.filter((p) =>
          `${p.nombreProveedor} ${p.correoProveedor} ${p.direccionProveedor} ${p.telefonoProveedor}`
            .toLowerCase()
            .includes(globalFilter.toLowerCase())
        );
        setProviderFilterList(filtered);
      }
    };
    filterProvides();
  }, [globalFilter, providers]);

  const toggleTable = () => setShowPurchases(!showPurchases);

  const handleDelete = (provider: ProviderModel) => {
    confirmDialog({
      message: `¿Estás seguro de deshabilitar "${provider.nombreProveedor}"?`,
      header: "Confirmar eliminación",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sí, Deshabilitar",
      rejectLabel: "Cancelar",
      acceptClassName: "p-button-danger",
      defaultFocus: "reject",
      accept: async () => {
        try {
          await deleteProvider(provider.id);
          showToast("Proveedor deshabilitado", "success");
          refreshProviders();
        } catch (error) {
          console.error(error);
          showToast("Error al deshabilitar el proveedor", "error");
        }
      },
    });
  };

  const statusProvider = (provider: ProviderModel) => {
    return (
      <Tag
        value={provider.activoProveedor ? "Habilitado" : "Deshabilitado"}
        severity={provider.activoProveedor ? "info" : "warning"}
      />
    );
  };

  const actionProvider = (provider: ProviderModel) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          rounded
          text
          onClick={() => {
            setProviderToEdit(provider);
            setModalVisible(true);
          }}
        />
        <Button
          icon="pi pi-trash"
          rounded
          text
          severity="danger"
          onClick={() => handleDelete(provider)}
        />
      </div>
    );
  };

  const actionPurchase = (purchase: PurchaseModel) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-eye"
          rounded
          text
          onClick={() => {
            setPurchase(purchase);
            setPurchaseModalVisible(true);
          }}
        />
      </div>
    );
  };

  const TableHeader = () => {
    return (
      <div className="flex mb-4 justify-content-end gap-2">
        {showPurchases ? (
          <Button
            label="Generar reporte"
            icon="pi pi-file-excel"
            className="bg-black-alpha-90 text-white border-500"
            onClick={() => generatePurchasesExcel(purchases, providers)}
          />
        ) : (
          <span className="flex-1">
            <InputText
              placeholder="Buscar..."
              className="w-full"
              value={globalFilter}
              onChange={(e) => {
                const value = e.target.value;
                setGlobalFilter(value);
              }}
            />
          </span>
        )}
      </div>
    );
  };

  return (
    <>
      <AddEditProviderModal
        visible={modalVisible}
        onHide={() => setModalVisible(false)}
        providerToEdit={providerToEdit}
      />
      <PurchaseModal
        visible={purchaseModalVisible}
        onHide={() => setPurchaseModalVisible(false)}
        purchase={purchase}
      />
      <CreatePurchaseModal
        visible={createPurchaseModalVisible}
        onHide={() => setCreatePurchaseModalVisible(false)}
        providers={providers.filter((p) => p.activoProveedor === true)}
        products={products.filter((p) => p.productoEnVenta === true)}
      />
      <div>
        <div className="flex justify-content-between mx-8">
          <div className="flex flex-column">
            <h3 className="m-0 mb-1 text-primary-700">Administración de compras</h3>
            <p className="m-0 text-color-secondary">
              Administra tus proveedores y compra productos
            </p>
          </div>
          <div className="flex flex-row gap-1">
            <Button
              className="border-gray-400 bg-transparent text-black-alpha-90"
              icon="pi pi-building"
              label="Agregar proveedor"
              onClick={() => {
                setModalVisible(true);
                setProviderToEdit(undefined);
              }}
            />
            <Button
              className="border-black-alpha-90 bg-black-alpha-90 text-white"
              icon="pi pi-shopping-bag"
              label="Agregar orden de compra"
              onClick={() => {
                setCreatePurchaseModalVisible(true);
              }}
            />
            <Button
              icon={showPurchases ? "pi pi-users" : "pi pi-shopping-cart"}
              label={showPurchases ? "Ver proveedores" : "Ver compras"}
              className="border-black-alpha-90 bg-transparent text-black-alpha-90"
              onClick={toggleTable}
            />
          </div>
        </div>
        <div className="grid m-4 justify-content-around">
          <div className="col-12 md:col-3">
            <Card className="shadow-none border-solid border-1 border-gray-300 ">
              <div className="flex flex-row gap-1 justify-content-between align-items-center">
                <div className="flex flex-column">
                  <h4 className="m-0 text-orange-700">Total de proveedores</h4>
                  <h2 className="mt-2 text-orange-700">{providers.length}</h2>
                </div>
                <div>
                  <i className="pi pi-building text-6xl text-green-700" />
                </div>
              </div>
            </Card>
          </div>
          <div className="col-12 md:col-3">
            <Card className="shadow-none border-solid border-1 border-gray-300 ">
              <div className="flex flex-row gap-1 justify-content-between align-items-center">
                <div className="flex flex-column">
                  <h4 className="m-0 text-orange-600">Compras totales</h4>
                  <h2 className="mt-2 text-orange-600">{purchases.length}</h2>
                </div>
                <div>
                  <i className="pi pi-exclamation-triangle text-6xl text-red-400" />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-content-center align-items-center">
            <i className="pi pi-spinner pi-spin text-5xl"></i>
          </div>
        ) : (
          <Card className="mx-8 shadow-none border-solid border-1 border-gray-300">
            {showPurchases ? (
              <>
                <h4 className="mb-2 text-primary-700">Órdenes de compra ({purchases.length})</h4>
                <p className="mb-4">Consulta tus compras realizadas</p>
                <DataTable
                  value={purchasesFilterList}
                  tableStyle={{ minWidth: "50rem" }}
                  paginator
                  rows={5}
                  rowsPerPageOptions={[5, 10, 25, 50, 100]}
                  header={TableHeader}
                  emptyMessage="Órdenes de compra no encontradas"
                >
                  <Column field="id" header="ID" sortable />
                  <Column
                    body={(row) =>
                      `${
                        providers.find((p) => p.id == row.idProveedorCompra)
                          ?.nombreProveedor
                      }`
                    }
                    header="Proveedor"
                  />
                  <Column
                    body={(row) =>
                      new Date(row.fechaCompra).toLocaleDateString("es-MX", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                    }
                    header="Fecha"
                  />
                  <Column
                    header="Total"
                    body={(row) => `$${getTotal(row).toFixed(2)}`}
                  />
                  <Column header={"Acción"} body={actionPurchase} />
                </DataTable>
              </>
            ) : (
              <>
                <h4 className="mb-2 text-primary-700">Proveedores ({providers.length})</h4>
                <p className="mb-4">Maneja tus proveedores</p>

                <DataTable
                  value={providerFilterList}
                  tableStyle={{ minWidth: "50rem" }}
                  paginator
                  rows={5}
                  rowsPerPageOptions={[5, 10, 25, 50, 100]}
                  header={TableHeader}
                  emptyMessage="Proveedores no encontrados"
                >
                  <Column field="nombreProveedor" header="Proveedor" sortable />
                  <Column
                    field="correoProveedor"
                    header="Correo electrónico"
                    sortable
                  />
                  <Column
                    field="direccionProveedor"
                    header="Dirección"
                    sortable
                  />
                  <Column field="telefonoProveedor" header="Teléfono" />
                  <Column header="Estado" body={statusProvider} />
                  <Column header="Acciones" body={actionProvider} />
                </DataTable>
              </>
            )}
          </Card>
        )}
      </div>
    </>
  );
};

export default Purchases;
