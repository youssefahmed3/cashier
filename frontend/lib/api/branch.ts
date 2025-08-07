import { CreateBranchDto } from "@/types/dtos";

/* GET: /api/v1/branches */ //pagination
export async function getAllBranchesPaginated(token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_TENANT_API_URL}/api/v1/branches`, {
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

/* GET: /api/v1/tenants/{tenantId}/branches */
export async function getAllTenantBranches(tenantId: string, token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_TENANT_API_URL}/api/v1/tenants/${tenantId}/branches`, {
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

/* GET: /api/v1/tenants/{tenantId}/branches/count */
export async function getAllTenantBranchesCount(tenantId: string, token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_TENANT_API_URL}/api/v1/tenants/${tenantId}/branches/count`, {
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

/* GET: /api/v1/branches/{id} */ // for superadmin
export async function getBranchById(id: string, token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_TENANT_API_URL}/api/v1/branches/${id}`, {
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

/* GET: /api/v1/tenants/{tenantId}/branches/{branchId} */ // admin of the branch
export async function getTenantBranchById(tenantId: string, branchId: string, token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_TENANT_API_URL}/api/v1/tenants/${tenantId}/branches/${branchId}`, {
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

/* POST: /api/v1/tenants/{tenantId}/branches */
export async function createNewBranch(tenantId: string, token: string, createBranchDto: CreateBranchDto) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_TENANT_API_URL}/api/v1/tenants/${tenantId}/branches`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(createBranchDto)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}


/* PUT: /api/v1/tenants/{tenantId}/branches/{branchId} */ // tenant specific (admin)
export async function updateBranch(updateBranchDto: CreateBranchDto, tenantId: string, branchId: string, token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_TENANT_API_URL}/api/v1/tenants/${tenantId}/branches/${branchId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updateBranchDto)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}

/* PUT: /api/v1/branches/{id} */ // superadmin
export async function updateBranchById(id: string, token: string, updateBranchDto: CreateBranchDto) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_TENANT_API_URL}/api/v1/branches/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updateBranchDto)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}


/* DELETE: /api/v1/branches/{id} */
export async function deleteBranchById(id: string, token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_TENANT_API_URL}/api/v1/branches/${id}`, {
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

/* DELETE: /api/v1/tenants/{tenantId}/branches/{branchId}  */
export async function deleteBranch(tenantId: string, branchId: string, token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_TENANT_API_URL}/api/v1/tenants/${tenantId}/branches/${branchId}`, {
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