import type { ProductModel } from "../models/productModel"

export const areProductsUnderMinimun = (products:ProductModel[]) =>{
    return products.some(p=>p.cantidadProducto <= p.minimoProducto);
}

export const productsUnderMinimun = (products:ProductModel[]):ProductModel[] =>{
    return products.filter(p=>p.cantidadProducto<=p.minimoProducto);
}