export interface SaleModel {
    idMetodoPagoVenta:number,
    idVendedorVenta:number,
    idCompradorVenta:number|null,
    detalleVenta:DetailSaleModel[],
} 

interface DetailSaleModel {
    idProductoVenta:number,
    cantidadProductoVenta:number,
    precioProductoVenta:number,
}