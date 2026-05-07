import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import type { TransactionModel } from "../../models/transactionModel";
import type { UserModel } from "../../models/userModel";
import dateFormater from "../dateFormater";

export const generateSalesExcel = async (
  sales: TransactionModel[],
  users: UserModel[]
) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Ventas");

  sheet.columns = [
    { header: "Venta", key: "id", width: 15 },
    { header: "Fecha", key: "date", width: 20 },
    { header: "Cliente", key: "client", width: 40 },
    { header: "Vendedor", key: "vendor", width: 40 },
    { header: "Método de pago", key: "payment", width: 20 },
    { header: "Total", key: "total", width: 15 },
  ];

  sales.forEach((sale) => {
    sheet.addRow({
      id: sale.id,
      date: dateFormater(sale.fechaVenta),
      client:
        users.find((u) => u.id === sale.idCompradorVenta)?.nombreUsuario ??
        "Invitado",
      vendor:
        users.find((u) => u.id === sale.idVendedorVenta)?.nombreUsuario ??
        "Venta móvil",
      payment: sale.idMetodoPagoVenta === 1 ?"Efectivo":"Tarjeta",
      total: `$${sale.detallesVenta.reduce(
        (acc, d) => acc + d.cantidadVenta * d.precioProductoVenta,
        0
      ).toFixed(2)}`,
    });
  });

  styleHeader(sheet);
  download(workbook, "Reporte_Ventas.xlsx");
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
