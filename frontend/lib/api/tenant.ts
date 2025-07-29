import { UpdateTenantDto } from "@/types/dtos";

/* POST: /api/v1/tenants */
export async function createNewTenant(token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_TENANT_API_URL}/api/v1/tenants`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}

/* PUT: /api/v1/tenants/{id} */
export async function updateTenant(updateTenantDto: UpdateTenantDto, id: string, token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_TENANT_API_URL}/api/v1/tenants/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updateTenantDto)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}

