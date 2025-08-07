import { CreateTenantDto, UpdateTenantDto } from "@/types/dtos";
import { Tenant, tenantPaginated } from "@/types/types";

/* GET: /api/v1/tenants/{id} */
export async function getTenantById(tenantId: string, token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_TENANT_API_URL}/api/v1/tenants/${tenantId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}

/* GET: /api/v1/tenants/{id}/subscription-status */
export async function getSubscriptionStatus(id: string, token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_TENANT_API_URL}/api/v1/tenants/${id}/subscription-status`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}

/* GET: /api/v1/tenants/active */
export async function getActiveTenants(token: string) : Promise<Tenant[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_TENANT_API_URL}/api/v1/tenants/active`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}

/* GET: /api/v1/tenants/{tenantId}/with-branches */
export async function getTenantWithBranches(tenantId: string, token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_TENANT_API_URL}/api/v1/tenants/${tenantId}/with-branches`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}

export async function getAllTenantWithPagination( token: string) : Promise<tenantPaginated> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_TENANT_API_URL}/api/v1/tenants`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    console.log("from api call tenants" , json);
    
    return json;
}


/* POST: /api/v1/tenants */
export async function createNewTenant(token: string, createTenantDto: CreateTenantDto) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_TENANT_API_URL}/api/v1/tenants`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(createTenantDto)
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

/* POST:  */



/* DELETE /api/v1/tenants/{id} */
export async function deleteTenant(id: string, token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_TENANT_API_URL}/api/v1/tenants/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}



/* USER-TENANT-MAPPING */

/* GET: /api/users/mappings */ // superadmin only
export async function getAllUserTenantMappings(token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_TENANT_API_URL}/api/users/mappings`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    console.log(json);
    return json;
    
}

/* GET: /api/users/{userId}/tenant */
export async function getUserTenant(userId: number, token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_TENANT_API_URL}/api/users/${userId}/tenant`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}

/* POST: /api/users/{userId}/tenant/{tenantId} */
export async function assignUserToTenant(userId: number, tenantId: string, token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_TENANT_API_URL}/api/users/${userId}/tenant/${tenantId}`, {
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

/* PUT: /api/users/{userId}/tenant/{tenantId} */ //  Maybe it does assign to other tenant ? idk 
export async function updateUserTenant(userId: string, tenantId: string, token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_TENANT_API_URL}/api/users/${userId}/tenant/${tenantId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}