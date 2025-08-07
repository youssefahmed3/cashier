import { CreateInventoryDto, UpdateInventoryDto } from "@/types/dtos";

/* POST: /api/v1/inventory */
export async function createNewInventory(token: string, createInventoryDto: CreateInventoryDto) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_INVENTORY_API_URL}/api/v1/inventory`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(createInventoryDto)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}

/* with integration POST: /api/v1/inventory/inventory */
export async function createNewInventoryWithIntegration(token: string, createInventoryDto: CreateInventoryDto) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_INVENTORY_API_URL}/api/v1/inventory/inventory`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(createInventoryDto)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}


/* GET: /api/v1/inventory */
export async function getAllInventory(token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_INVENTORY_API_URL}/api/v1/inventory`, {
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

/* GET: /api/v1/inventory/{id} */
export async function getInventoryById(id: string, token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_INVENTORY_API_URL}/api/v1/inventory/${id}`, {
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



/* GET: /api/v1/inventory/low-stock */
export async function getLowStock(token: string, threshold: number) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_INVENTORY_API_URL}/api/v1/inventory/low-stock?threshold=${threshold}`, {
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

/* GET: /api/v1/inventory/catalog/product/{productId} */
export async function getInventoryProductsByProductId(token: string, productId: number) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_INVENTORY_API_URL}/api/v1/inventory/catalog/product/${productId}`, {
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

/* PATCH: /api/v1/inventory/{id}/quantity */
export async function updateInventoryQuantity(token: string, id: number, quantity: number) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_INVENTORY_API_URL}/api/v1/inventory/${id}/quantity?newQuantity=${quantity}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}


/* PUT: /api/v1/inventory/{id} */
export async function updateInventory(token: string, id: number, updateInventoryDto: UpdateInventoryDto) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_INVENTORY_API_URL}/api/v1/inventory/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updateInventoryDto)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}

/* DELETE: /api/v1/inventory/{id} */
export async function deleteInventoryById(id: string, token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_INVENTORY_API_URL}/api/v1/inventory/${id}`, {
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