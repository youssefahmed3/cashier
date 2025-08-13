export type ShiftDto = {
  id?: number;
  startTime: string;
  endTime?: string | null;
  startingCash: number;
  endingCash?: number | null;
  expectedCash?: number | null;
  cashDifference?: number | null;
  isActive: boolean;
  userId: number;
  branchId: number;
};

export type StartShiftDto = {
  userId: number;
  branchId: number;
  startingCash: number;
};

export type EndShiftDto = {
  shiftId: number;
  endingCash: number;
};

function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") ?? "";
}

const jsonHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

const base = () => `${process.env.NEXT_PUBLIC_SHIFT_API_URL}/api/v1/shifts`;

export async function getActiveShift(branchId: number, userId: number, token?: string): Promise<ShiftDto | null> {
  const authToken = token ?? getToken();
  const res = await fetch(`${base()}/active/${branchId}/${userId}`, {
    method: "GET",
    headers: jsonHeaders(authToken),
  });
  if (res.status === 404) return null;
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || json?.message || "Failed to load active shift");
  return json as ShiftDto;
}

export async function startShift(payload: StartShiftDto, token?: string): Promise<ShiftDto> {
  const authToken = token ?? getToken();
  const res = await fetch(`${base()}/start`, {
    method: "POST",
    headers: jsonHeaders(authToken),
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || json?.message || "Failed to start shift");
  return json as ShiftDto;
}

export async function endShift(payload: EndShiftDto, token?: string): Promise<ShiftDto> {
  const authToken = token ?? getToken();
  const res = await fetch(`${base()}/end`, {
    method: "POST",
    headers: jsonHeaders(authToken),
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || json?.message || "Failed to end shift");
  return json as ShiftDto;
}

