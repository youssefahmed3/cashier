// products API backed by Catalog service
export interface Product {
  id: number;
  name: string;
  price: number;
  barcode: string;
  category?: string;
  taxRate?: number;
  image?: string;
  stock?: number;
}

function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") ?? "";
}

const headers = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export const getProducts = async (): Promise<Product[]> => {
  const token = getToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_CATALOG_URL}/products`, {
    method: "GET",
    headers: headers(token),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || "Failed to load products");
  return json;
};

export const getProductByBarcode = async (barcode: string): Promise<Product | null> => {
  const token = getToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_CATALOG_URL}/products?barcode=${encodeURIComponent(barcode)}`, {
    method: "GET",
    headers: headers(token),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || "Failed to search by barcode");
  // assuming API returns list
  return Array.isArray(json) ? (json[0] ?? null) : json;
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  const token = getToken();
  const q = query.trim();
  if (!q) return [];
  const res = await fetch(`${process.env.NEXT_PUBLIC_CATALOG_URL}/products?search=${encodeURIComponent(q)}`, {
    method: "GET",
    headers: headers(token),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || "Failed to search products");
  return json;
};

export const getProductsByCategory = async (categoryId: number): Promise<Product[]> => {
  const token = getToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_CATALOG_URL}/categories/${categoryId}/products`, {
    method: "GET",
    headers: headers(token),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || "Failed to load category products");
  return json;
};

// React Query keys
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: string) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
  search: (query: string) => [...productKeys.all, "search", query] as const,
  category: (categoryId: number) => [...productKeys.all, "category", categoryId] as const,
};