export interface PurchaseModel {
    id:number,
    idProveedorCompra:number,
    fechaCompra:Date,
    detallesCompra:PurchaseDetails[]
}

interface PurchaseDetails {
    id:number,
    idCompraOriginal:number,
    idProductoDetalle:number,
    cantidadDetalle:number,
    precioUnitarioDetalle:number,
}

export interface CreatePurchaseModel {
    idProveedorRecompra:number,
    detalles:CreatePurchaseDetailModel[],
}

export interface CreatePurchaseDetailModel {
    idProductoRecompra:number,
    cantidadProducto:number,
    precioProducto:number
}