import { CartItem } from "@/app/(authenticated)/cashier/page";

export type OrderItemDto = {
  id?: number;
  productId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  orderId?: number;
};

export type OrderDto = {
  orderId: number;
  branchId: number;
  userId?: number | null;
  total: number;
  customerId?: number | null;
  shiftId: number;
  status?: string;
  items: OrderItemDto[];
};

function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") ?? "";
}

const jsonHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export async function createOrder(payload: OrderDto, token?: string): Promise<OrderDto> {
  const authToken = token ?? getToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_ORDER_API_URL}/api/orders`, {
    method: "POST",
    headers: jsonHeaders(authToken),
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || json?.message || "Failed to create order");
  return json as OrderDto;
}

export async function getOrderById(orderId: number, token?: string): Promise<OrderDto> {
  const authToken = token ?? getToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_ORDER_API_URL}/api/orders/${orderId}`, {
    method: "GET",
    headers: jsonHeaders(authToken),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || json?.message || "Failed to load order");
  return json as OrderDto;
}

export function mapCartToOrderItems(cart: CartItem[]): OrderItemDto[] {
  return cart.map((item) => ({
    productId: Number.parseInt(item.id, 10),
    name: item.name,
    quantity: item.quantity,
    unitPrice: item.price,
  }));
}

