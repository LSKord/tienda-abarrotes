import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { DataTable, type DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import type { ProductModel } from "../models/productModel";
import { Tag } from "primereact/tag";
import {
  areProductsUnderMinimun,
  productsUnderMinimun,
} from "../utils/productsUnderMinimun";
import { Dropdown } from "primereact/dropdown";
import { useProduct } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import AddEditProductModal from "../components/addEditProductModal";
import { confirmDialog } from "primereact/confirmdialog";
import { deleteProduct } from "../services/apiService";
import { useToast } from "../hooks/useToast";

const Inventory = () => {
  const { products, refresh, loadingProducts } = useProduct();
  const { categories, loadingCategories } = useCategories();
  const [productFilterList, setProductFilterList] = useState<ProductModel[]>([]);
  const productsMinimun = productsUnderMinimun(products);
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: "contains" },
    nombreProducto: { value: null, matchMode: "contains" },
    descripcionProducto: { value: null, matchMode: "contains" },
    categoriaProducto: { value: null, matchMode: "equals" },
    precioProducto: { value: null, matchMode: "contains" },
    cantidadProducto: { value: null, matchMode: "contains" },
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const loading = loadingProducts || loadingCategories;
  const [productToEdit, setProductToEdit] = useState<ProductModel>();
  const { showToast } = useToast();

  const getFilterValue = (field: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const f = (filters as any)[field];
    if (!f) return null;
    if ("value" in f) return f.value;
    return f?.constraints?.length ? f.constraints[0].value : null;
  };

  const handleDelete = (product: ProductModel) => {
    confirmDialog({
      message: `¿Estás seguro de deshabilitar "${product.nombreProducto}"?`,
      header: "Confirmar eliminación",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sí, Deshabilitar",
      rejectLabel: "Cancelar",
      acceptClassName: "p-button-danger",
      defaultFocus: "reject",
      accept: async () => {
        try {
          await deleteProduct(product.id);
          showToast("Producto deshabilitado", "success");
          refresh();
        } catch (error) {
          console.error(error);
          showToast("Error al deshabilitar el producto", "error");
        }
      },
    });
  };

  useEffect(() => {
    const getData = () => {
      setProductFilterList(products);
    };
    getData();
  }, [products]);

  const statusProduct = (producto: ProductModel) => {
    return (
      <Tag
        value={
          producto.productoEnVenta
            ? producto.cantidadProducto <= producto.minimoProducto
              ? "Cantidad baja"
              : "Mucho producto"
            : "Deshabilitado"
        }
        severity={
          producto.productoEnVenta
            ? producto.cantidadProducto <= producto.minimoProducto
              ? "danger"
              : "success"
            : "info"
        }
      />
    );
  };

  const actionProduct = (producto: ProductModel) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          rounded
          text
          onClick={() => {
            setProductToEdit(producto);
            setModalVisible(true);
          }}
        />
        <Button
          icon="pi pi-trash"
          rounded
          text
          severity="danger"
          onClick={() => handleDelete(producto)}
        />
      </div>
    );
  };

  const TableHeader = () => {
    return (
      <div className="flex mb-4 justify-content-end gap-2">
        <span className="flex-1">
          <InputText
            placeholder="Buscar..."
            className="w-full"
            value={globalFilter}
            onChange={(e) => {
              const value = e.target.value;
              setGlobalFilter(value);
              setFilters((prev) => ({
                ...prev,
                global: { ...prev.global, value },
              }));
            }}
          />
        </span>

        <Button
          icon="pi pi-plus"
          label="Agregar producto"
          className="bg-black-alpha-90 text-white border-500"
          onClick={() => {
            setModalVisible(true);
            setProductToEdit(undefined);
          }}
        />
      </div>
    );
  };

  return (
    <>
      <AddEditProductModal
        visible={modalVisible}
        onHide={() => setModalVisible(false)}
        productToEdit={productToEdit}
      />
      <div>
        <div className="grid m-4 justify-content-around">
          <div className="col-12 md:col-3">
            <Card className="shadow-none border-solid border-1 border-gray-300 ">
              <div className="flex flex-row gap-1 justify-content-between align-items-center">
                <div className="flex flex-column">
                  <h4 className="m-0">Total de productos</h4>
                  <h2 className="mt-2 text-black-alpha-90">
                    {products.length}
                  </h2>
                </div>
                <div>
                  <i className="pi pi-box text-6xl" />
                </div>
              </div>
            </Card>
          </div>
          <div className="col-12 md:col-3">
            <Card className="shadow-none border-solid border-1 border-gray-300 ">
              <div className="flex flex-row gap-1 justify-content-between align-items-center">
                <div className="flex flex-column">
                  <h4 className="m-0">Productos debajo de cantidad minima</h4>
                  <h2 className="mt-2 text-red-400">
                    {productsMinimun.length}
                  </h2>
                </div>
                <div>
                  <i className="pi pi-exclamation-triangle text-6xl text-red-400" />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {areProductsUnderMinimun(products) ? (
          <div className="p-3 mb-4 mx-8 border-round bg-yellow-100 text-gray-600 ">
            <i className="pi pi-exclamation-circle mr-2"></i>
            Tienes {productsMinimun.length} productos bajo la cantidad minima:
            {productsMinimun.map((p) => {
              return ` ${p.nombreProducto}`;
            })}
          </div>
        ) : null}

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
                value={productFilterList}
                tableStyle={{ minWidth: "50rem" }}
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                header={TableHeader}
                filters={filters}
                onFilter={(e) => {
                  setFilters(e.filters);
                }}
                globalFilterFields={[
                  "nombreProducto",
                  "descripcionProducto",
                  "categoriaProducto",
                ]}
                emptyMessage="Productos no encontrados"
                filterLocale="es-MX"
              >
                <Column
                  field="nombreProducto"
                  header="Producto"
                  filter
                  showFilterMatchModes={false}
                  sortable
                  filterPlaceholder="Buscar por nombre"
                />
                <Column
                  field="descripcionProducto"
                  header="Descripción"
                  filter
                  showFilterMatchModes={false}
                  sortable
                  filterPlaceholder="Buscar por descripcion"
                />
                <Column
                  field="categoriaProducto"
                  header="Categoría"
                  body={(row: ProductModel) =>
                    categories.find((c) => c.id === row.categoriaProducto)
                      ?.nombreCategoria || "Sin categoría"
                  }
                  filter
                  showFilterMatchModes={false}
                  filterElement={
                    <Dropdown
                      value={getFilterValue("categoriaProducto")}
                      options={categories.map((c) => ({
                        label: c.nombreCategoria,
                        value: c.id,
                      }))}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          categoriaProducto: {
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
                  field="precioProducto"
                  header="Precio"
                  body={(row: ProductModel) => `$${row.precioProducto.toFixed(2)}`}
                  filter
                  showFilterMatchModes={false}
                  sortable
                  filterPlaceholder="Buscar por precio"
                />
                <Column
                  field="cantidadProducto"
                  header="Cantidad"
                  filter
                  showFilterMatchModes={false}
                  sortable
                  filterPlaceholder="Buscar por cantidad"
                />
                <Column header="Estado" body={statusProduct} />
                <Column header="Acciones" body={actionProduct} />
              </DataTable>
            </>
          </Card>
        )}
      </div>
    </>
  );
};

export default Inventory;
