export type PaymentRequestDto = {
  orderId: number;
  amount: number;
  paymentMethod: string; // Cash | Paymob
  branchId: number;
  shiftId: number;
  cashierId: number;
  customerId?: number;
  reference?: string | null;
};

export type PaymentDto = {
  id: number;
  amount: number;
  method: string;
  status: string;
  transactionId?: string | null;
  reference?: string | null;
  createdAt: string;
  completedAt?: string | null;
  orderId: number;
  branchId: number;
  shiftId: number;
};

export type RefundItemDto = {
  orderItemId: number;
  quantity: number;
  productId: number;
};

export type RefundRequestDto = {
  orderId: number;
  branchId: number;
  shiftId: number;
  reason?: string;
  items: RefundItemDto[];
};

function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") ?? "";
}

const jsonHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export async function processPayment(request: PaymentRequestDto, token?: string): Promise<PaymentDto> {
  const authToken = token ?? getToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_ORDER_API_URL}/api/Payment/process`, {
    method: "POST",
    headers: jsonHeaders(authToken),
    body: JSON.stringify(request),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || json?.message || "Failed to process payment");
  return json as PaymentDto;
}

export async function getPaymentsByBranch(
  branchId: number,
  fromDate?: string,
  toDate?: string,
  token?: string
): Promise<PaymentDto[]> {
  const authToken = token ?? getToken();
  const search = new URLSearchParams();
  if (fromDate) search.set("fromDate", fromDate);
  if (toDate) search.set("toDate", toDate);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_ORDER_API_URL}/api/Payment/branch/${branchId}?${search.toString()}`,
    {
      method: "GET",
      headers: jsonHeaders(authToken),
    }
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || json?.message || "Failed to load payments");
  return json as PaymentDto[];
}

export async function refundPayment(request: RefundRequestDto, token?: string) {
  const authToken = token ?? getToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_ORDER_API_URL}/api/Payment/refund`, {
    method: "POST",
    headers: jsonHeaders(authToken),
    body: JSON.stringify(request),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || json?.message || "Failed to refund payment");
  return json;
}

