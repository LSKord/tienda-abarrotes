export interface UserModel {
    id:number,
    nombreUsuario:string,
    correoUsuario:string,
    direccionUsuario:string,
    telefonoUsuario:string,
    rolUsuario:number,
    activoUsuario:boolean
}

export const Rol:Record<number,string> = {
    1:"Admin",
    2:"Vendedor",
    3:"Cliente"
}