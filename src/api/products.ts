import { apiClient } from "./client";
import type { Product, ProductPage, ProductRequest } from "../types";

export async function getProducts(page: number, size = 10): Promise<ProductPage> {
  const res = await apiClient.get<ProductPage>("/products", {
    params: { page, size },
  });
  return res.data;
}

export async function getProductById(id: number): Promise<Product> {
  const res = await apiClient.get<Product>(`/products/${id}`);
  return res.data;
}

export async function createProduct(data: ProductRequest): Promise<Product> {
  const res = await apiClient.post<Product>("/products", data);
  return res.data;
}

export async function updateProduct(id: number, data: ProductRequest): Promise<Product> {
  const res = await apiClient.put<Product>(`/products/${id}`, data);
  return res.data;
}

export async function deleteProduct(id: number): Promise<void> {
  await apiClient.delete(`/products/${id}`);
}
