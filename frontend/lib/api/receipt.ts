function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") ?? "";
}

export async function sendReceipt(file: File, email: string, token?: string) {
  const authToken = token ?? getToken();
  const form = new FormData();
  form.append("file", file);
  form.append("email", email);

  const res = await fetch(`${process.env.NEXT_PUBLIC_RECEIPT_API_URL}/api/Receipt/send-receipt`, {
    method: "POST",
    headers: { Authorization: `Bearer ${authToken}` },
    body: form,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || "Failed to send receipt");
  return json;
}

