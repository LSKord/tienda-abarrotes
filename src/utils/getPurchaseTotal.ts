import type { PurchaseModel } from "../models/purchaseModel";

export const getTotal = (purchase:PurchaseModel):number => {
    const total = purchase.detallesCompra?.reduce((prev,d)=>prev + d.precioUnitarioDetalle * d.cantidadDetalle,0);

    return total;
}