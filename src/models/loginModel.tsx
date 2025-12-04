export interface LoginRequest {
    Usuario :string,
    Password:string,
}

export interface LoginResponse {
    accessToken : string,
    refreshToken : string,
    role:string,
    user:number,
    username:string,
}