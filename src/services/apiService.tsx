import axios from "axios";
import type { LoginRequest, LoginResponse } from "../models/loginModel";
import type { ProductModel } from "../models/productModel";
import type { SaleModel } from "../models/saleModel";
import type { UserModel } from "../models/userModel";
import type { CategorieModel } from "../models/categorieModel";
import type { ProviderModel } from "../models/providerModel";
import type { CreatePurchaseModel, PurchaseModel } from "../models/purchaseModel";
import type { TransactionModel } from "../models/transactionModel";

const baseUrl = "/api";

export const loginUser = async (
  loginRequest: LoginRequest
): Promise<LoginResponse> => {
  const url = `${baseUrl}/Auth/login`;
  const response = await axios.post<LoginResponse>(url, loginRequest);
  const data = response.data;
  return data;
};

export const refreshToken = async (token: string): Promise<LoginResponse> => {
  const url = `${baseUrl}/Auth/refresh`;
  const response = await axios.post<LoginResponse>(url, { token: token });
  const data = response.data;
  return data;
};

export const logoutUser = async (token: string) => {
  const url = `${baseUrl}/Auth/logout`;
  await axios.post(url, { token: token });
};

export const getUsers = async (token: string): Promise<UserModel[]> => {
  const url = `${baseUrl}/Usuarios`;
  const response = await axios.get<UserModel[]>(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = response.data;
  return data;
};

export const getCategories = async (token: string): Promise<CategorieModel[]> => {
  const url = `${baseUrl}/Categorias`;
  const response = await axios.get<CategorieModel[]>(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = response.data;
  return data;
};

export const getProducts = async (token:string): Promise<ProductModel[]> => {
  const url = `${baseUrl}/Productos`;
  const response = await axios.get<ProductModel[]>(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = response.data;
  return data;
};

export const postProduct = async (product: unknown) => {
  const url = `${baseUrl}/Productos`;
  await axios.post(url, product, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const putProduct = async (product: unknown, id: number) => {
  const url = `${baseUrl}/Productos/${id}`;
  await axios.put(url, product, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const deleteProduct = async (id: number) => {
  const url = `${baseUrl}/Productos/${id}`;
  await axios.delete(url, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getProviders = async (token: string): Promise<ProviderModel[]> => {
  const url = `${baseUrl}/Proveedores`;
  const response = await axios.get<ProviderModel[]>(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = response.data;
  return data;
};

export const postProvider = async (provider: unknown) => {
  const url = `${baseUrl}/Proveedores`;
  await axios.post(url, provider, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const putProvider = async (provider: unknown, id: number) => {
  const url = `${baseUrl}/Proveedores/${id}`;
  await axios.put(url, provider, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const deleteProvider = async (id: number) => {
  const url = `${baseUrl}/Proveedores/${id}`;
  await axios.delete(url, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getPurchases = async (token: string): Promise<PurchaseModel[]> => {
  const url = `${baseUrl}/Compras`;
  const response = await axios.get<PurchaseModel[]>(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = response.data;
  return data;
};

export const postPurchase = async(purchase: CreatePurchaseModel) => {
  const url = `${baseUrl}/Compras/Recompra`;
  await axios.post(url, purchase, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const postSale = async (sale: SaleModel) => {
  const url = `${baseUrl}/Ventas`;
  await axios.post(url, sale, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getTransactions = async (token: string): Promise<TransactionModel[]> => {
  const url = `${baseUrl}/Ventas`;
  const response = await axios.get<TransactionModel[]>(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = response.data;
  return data;
};

export const checkoutPayment = async (price: number) => {
  const url = `${baseUrl}/Payments/Create-checkout`;
  const response = await axios.post(
    url,
    { totalVenta: Math.round(price * 100) },
    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
  );
  const { clientSecret } = response.data;
  return clientSecret;
};
