import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import type { DataTableFilterMeta } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { useState, useEffect } from "react";
import { useProduct } from "../hooks/useProducts";
import { useTransactions } from "../hooks/useTransaction";
import { useUsers } from "../hooks/useUsers";
import type { TransactionModel } from "../models/transactionModel";
import dateFormater from "../utils/dateFormater";
import DetailsTicketModal from "../components/detailsTicketModal";
import generateTicket from "../utils/generatePdf";
import getDateFilter from "../utils/filterDates";

const Tickets = () => {
  const { transactions, loadingTransactions } = useTransactions();
  const { users } = useUsers();
  const { products } = useProduct();
  const [transactionsFilterList, setTransactionsFilterList] = useState<
    TransactionModel[]
  >([]);
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    id: { value: null, matchMode: "equals" },
    fechaVenta: { value: null, matchMode: "contains" },
    idMetodoPagoVenta: { value: null, matchMode: "equals" },
    idVendedorVenta: { value: null, matchMode: "contains" },
    idCompradorVenta: { value: null, matchMode: "contains" },
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [ticket, setTicket] = useState<TransactionModel>();
  const [viewType, setViewType] = useState("monthly");
  const loading = loadingTransactions;

  const getFilterValue = (field: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const f = (filters as any)[field];
    if (!f) return null;
    if ("value" in f) return f.value;
    return f?.constraints?.length ? f.constraints[0].value : null;
  };

  useEffect(() => {
    const getData = () => {
      setTransactionsFilterList(transactions);
    };
    getData();
  }, [transactions]);

  useEffect(() => {
    const filter = getDateFilter(viewType, transactions);
    setTransactionsFilterList(filter);
  }, [transactions, viewType]);

  const statusTicket = () => {
    return <Tag severity={"success"} value={"Completado"} />;
  };

  const actionTicket = (transaction: TransactionModel) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-eye"
          rounded
          text
          onClick={() => {
            setTicket(transaction);
            setModalVisible(true);
          }}
        />
        <Button
          icon="pi pi-download"
          rounded
          text
          onClick={() => {
            generateTicket({ transaction, products });
          }}
        />
      </div>
    );
  };

  const tableHeader = () => {
    return (
      <div className="flex justify-content-end p-2">
        <Dropdown
          value={viewType}
          options={[
            { label: "Anual", value: "yearly" },
            { label: "Mensual", value: "monthly" },
            { label: "Semanal", value: "weekly" },
          ]}
          onChange={(e) => setViewType(e.value)}
          style={{ width: "130px" }}
        />
      </div>
    );
  };

  return (
    <>
      <DetailsTicketModal
        visible={modalVisible}
        transaction={ticket}
        onHide={() => {
          setModalVisible(false);
          setTicket(undefined);
        }}
        users={users}
        products={products}
      />
      <div>
        <div className="grid m-4 justify-content-around">
          <div className="col-12 md:col-3">
            <Card className="shadow-none border-solid border-1 border-gray-300 ">
              <div className="flex flex-row gap-1 justify-content-between align-items-center">
                <div className="flex flex-column">
                  <h4 className="m-0">Ventas</h4>
                  <h2 className="mt-2 text-black-alpha-90">
                    {transactions.length}
                  </h2>
                </div>
                <div>
                  <i className="pi pi-arrow-up-right text-6xl" />
                </div>
              </div>
            </Card>
          </div>
          <div className="col-12 md:col-3">
            <Card className="shadow-none border-solid border-1 border-gray-300 ">
              <div className="flex flex-row gap-1 justify-content-between align-items-center">
                <div className="flex flex-column">
                  <h4 className="m-0">Ganancias</h4>
                  <h2 className="mt-2 text-green-400">
                    $
                    {transactions
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
                  </h2>
                </div>
                <div>
                  <i className="pi pi-dollar text-6xl" />
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
            <>
              <h4 className="mb-2">Productos ({products.length})</h4>
              <p className="mb-4">Maneja tu inventario</p>

              <DataTable
                value={transactionsFilterList}
                tableStyle={{ minWidth: "50rem" }}
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                filters={filters}
                header={tableHeader}
                onFilter={(e) => {
                  setFilters(e.filters);
                }}
                emptyMessage="Ventas no encontradas"
                filterLocale="es-MX"
              >
                <Column
                  field="id"
                  header="# de orden"
                  filter
                  showFilterMatchModes={false}
                  sortable
                  filterPlaceholder="Buscar por número"
                />
                <Column
                  field="fechaVenta"
                  header="Fecha"
                  showFilterMatchModes={false}
                  body={(row: TransactionModel) => dateFormater(row.fechaVenta)}
                  sortable
                  filterPlaceholder="Buscar por fecha"
                />
                <Column
                  field="idMetodoPagoVenta"
                  header="Método de pago"
                  body={(row: TransactionModel) =>
                    row.idMetodoPagoVenta === 1 ? "Efectivo" : "Tarjeta"
                  }
                  filter
                  showFilterMatchModes={false}
                  filterElement={
                    <Dropdown
                      value={getFilterValue("idMetodoPagoVenta")}
                      options={[
                        { label: "Efectivo", value: 1 },
                        { label: "Tarjeta", value: 2 },
                      ]}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          idMetodoPagoVenta: {
                            value: e.value,
                            matchMode: "equals",
                          },
                        }))
                      }
                      placeholder="Seleccionar"
                      showClear
                    />
                  }
                  sortable
                />
                <Column
                  field="idVendedorVenta"
                  header="Vendedor"
                  body={(row: TransactionModel) =>
                    users.find(
                      (u) =>
                        u.id === row.idVendedorVenta &&
                        (u.rolUsuario === 1 || u.rolUsuario === 2)
                    )?.nombreUsuario || "Venta móvil"
                  }
                  filter
                  showFilterMatchModes={false}
                  filterElement={
                    <Dropdown
                      value={getFilterValue("idVendedorVenta")}
                      options={users
                        .filter((u) => u.rolUsuario === 1 || u.rolUsuario === 2)
                        .map((u) => ({
                          label: u.nombreUsuario,
                          value: u.id,
                        }))}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          idVendedorVenta: {
                            value: e.value,
                            matchMode: "equals",
                          },
                        }))
                      }
                      placeholder="Seleccionar"
                      showClear
                    />
                  }
                  sortable
                />
                <Column
                  field="idCompradorVenta"
                  header="Cliente"
                  body={(row: TransactionModel) =>
                    users.find(
                      (u) => u.id === row.idCompradorVenta && u.rolUsuario === 3
                    )?.nombreUsuario || "Invitado"
                  }
                  filter
                  showFilterMatchModes={false}
                  filterElement={
                    <Dropdown
                      value={getFilterValue("idCompradorVenta")}
                      options={users
                        .filter((u) => u.rolUsuario === 3)
                        .map((u) => ({
                          label: u.nombreUsuario,
                          value: u.id,
                        }))}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          idCompradorVenta: {
                            value: e.value,
                            matchMode: "equals",
                          },
                        }))
                      }
                      placeholder="Seleccionar"
                      showClear
                    />
                  }
                  sortable
                />
                <Column header="Estado" body={statusTicket} />
                <Column header="Acciones" body={actionTicket} />
              </DataTable>
            </>
          </Card>
        )}
      </div>
    </>
  );
};

export default Tickets;
