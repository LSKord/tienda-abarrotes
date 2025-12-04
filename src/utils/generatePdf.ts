import { jsPDF } from "jspdf";
import type { TransactionModel } from "../models/transactionModel";
import type { ProductModel } from "../models/productModel";
import dateFormater from "./dateFormater";

interface TicketProps {
  transaction: TransactionModel | undefined;
  products: ProductModel[];
}

const lineHeight = 6;
const maxWidth = 50;

const getTicketHeight = (
  transaction: TransactionModel,
  products: ProductModel[]
): number => {
  let contentHeight = 0;

  transaction.detallesVenta.forEach((item) => {
    const product = products.find((p) => p.id === item.idProductoVenta);
    const name = `${item.cantidadVenta} ${product?.nombreProducto || ""}`;

    const wrappedLines = new jsPDF().splitTextToSize(name, maxWidth);
    contentHeight += wrappedLines.length * lineHeight;
  });

  return contentHeight;
};

const generateTicket = ({ transaction, products }: TicketProps) => {
  if (!transaction) return;

  const baseHeight = 60;
  const ticketHeight = getTicketHeight(transaction,products);

  const pdf = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: [80, baseHeight + ticketHeight],
  });

  let y = 10;

  pdf.setFontSize(12);
  pdf.text("Tienda de abarrotes", 3, y);
  y += 6;
  pdf.text("Ticket de venta", 3, y);
  y += 6;
  pdf.text(`Venta #${transaction.id}`, 3, y);
  y += 6;
  pdf.text(`Fecha: ${dateFormater(transaction.fechaVenta)}`, 3, y);
  y += 10;

  pdf.setFontSize(10);

  transaction.detallesVenta.forEach((item) => {
    const product = products.find((p) => p.id === item.idProductoVenta);
    const totalItem = (item.cantidadVenta * item.precioProductoVenta).toFixed(
      2
    );

    const name = `${item.cantidadVenta} ${product?.nombreProducto || ""}`;
    const wrappedLines = pdf.splitTextToSize(name, maxWidth);

    wrappedLines.forEach((line: string) => {
      pdf.text(line, 3, y);
      y += lineHeight;
    });

    pdf.text(`$${totalItem}`, 54, y - lineHeight);
  });

  const total = transaction.detallesVenta.reduce(
    (sum, p) => sum + p.cantidadVenta * p.precioProductoVenta,
    0
  );

  y += 5;
  pdf.setFontSize(12);
  pdf.text(`TOTAL: $${total.toFixed(2)}`, 3, y);

  pdf.save(`Ticket-${transaction.id}`);
};

export default generateTicket;
