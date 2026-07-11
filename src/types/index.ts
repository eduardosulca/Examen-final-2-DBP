export type Availability = "DISPONIBLE" | "AGOTADO" | "PROXIMAMENTE";

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
  availability: Availability;
}

export type ProductRequest = Omit<Product, "id">;

export interface PageableInfo {
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  offset: number;
  unpaged: boolean;
}

export interface ProductPage {
  totalElements: number;
  totalPages: number;
  pageable: PageableInfo;
  size: number;
  content: Product[];
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

/** Forma esperada de un error de la API (best-effort, ver src/api/errors.ts) */
export interface ApiErrorBody {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  path?: string;
  errors?: { field: string; message: string }[];
}
