import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import type { ProductModel } from "../../models/productModel";
import type { CategoryModel } from "../../models/categoryModel";

export const generateInventoryExcel = async (
  inventory: ProductModel[],
  categories: CategoryModel[]
) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Inventario");

  sheet.columns = [
    { header: "Producto", key: "id", width: 15 },
    { header: "Nombre", key: "name", width: 40 },
    { header: "Descripción", key: "desc", width: 40 },
    { header: "Categoría", key: "category", width: 40 },
    { header: "Precio", key: "price", width: 15 },
    { header: "Cantidad", key: "quantity", width: 15 },
    { header: "Cantidad mínima", key: "minimum", width: 15 },
  ];

  inventory.forEach((product) => {
    sheet.addRow({
      id: product.id,
      name: product.nombreProducto,
      desc: product.descripcionProducto,
      category:
        categories.find((c) => c.id === product.categoriaProducto)
          ?.nombreCategoria ?? "N/A",
      price: `$${product.precioProducto.toFixed(2)}`,
      quantity: product.cantidadProducto,
      minimum: product.minimoProducto,
    });
  });

  styleHeader(sheet);
  download(workbook, "Reporte_Inventario.xlsx");
};

const styleHeader = (sheet: ExcelJS.Worksheet) => {
  const row = sheet.getRow(1);
  row.font = { bold: true, color: { argb: "FFFFFFFF" } };
  row.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF2563EB" },
  };
};

const download = async (workbook: ExcelJS.Workbook, filename: string) => {
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), filename);
};
