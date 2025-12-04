export interface TransactionModel {
    id:number,
    fechaVenta:string,
    idMetodoPagoVenta:number,
    idVendedorVenta:number,
    idCompradorVenta:number,
    detallesVenta:TransactionDetailsModel[]
}

interface TransactionDetailsModel {
    id:number,
    idProductoVenta:number,
    cantidadVenta:number,
    precioProductoVenta:number,
}