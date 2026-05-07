import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import type { PurchaseModel } from "../../models/purchaseModel";
import type { ProviderModel } from "../../models/providerModel";
import dateFormater from "../dateFormater";

export const generatePurchasesExcel = async (
  purchases: PurchaseModel[],
  providers: ProviderModel[]
) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Compras");

  sheet.columns = [
    { header: "Compra", key: "id", width: 15 },
    { header: "Fecha", key: "date", width: 20 },
    { header: "Proveedor", key: "provider", width: 40 },
    { header: "Dirección de proveedor", key: "address", width: 40 },
    { header: "Correo de proveedor", key: "mail", width: 40 },
    { header: "Telefono de proveedor", key: "phone", width: 20 },
    { header: "Total", key: "total", width: 15 },
  ];

  purchases.forEach((purchase) => {
    const provider = providers.find((p) => p.id === purchase.idProveedorCompra);
    sheet.addRow({
      id: purchase.id,
      date: dateFormater(purchase.fechaCompra.toString()),
      provider:provider?.nombreProveedor,
      address:provider?.direccionProveedor,
      mail:provider?.correoProveedor,
      phone:provider?.telefonoProveedor,
      total: `$${purchase.detallesCompra.reduce(
        (acc, d) => acc + d.cantidadDetalle * d.precioUnitarioDetalle,
        0
      ).toFixed(2)}`,
    });
  });

  styleHeader(sheet);
  download(workbook, "Reporte_Compras.xlsx");
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
