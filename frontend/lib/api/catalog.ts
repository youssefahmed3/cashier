import { CreateCategoryDto, CreateProductDto } from "@/types/dtos";
import { Category, Product } from "@/types/types";


function headers(token: string): { [key: string]: string } {
    return {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`,
    };
}

/* Categories Endpoints */

/* GET:  /categories */
export async function getCategories(token: string): Promise<Category[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_CATALOG_URL}/categories`, {
        method: "GET",
        headers: headers(token)
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}

/* GET: /categories/{id} */
export async function getCategoryById(token: string, id: number): Promise<Category> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_CATALOG_URL}/categories/${id}`, {
        method: "GET",
        headers: headers(token)
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}

/* GET: /categories/{id}/products */
export async function getProductsByCategory(token: string, id: number): Promise<Product[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_CATALOG_URL}/categories/${id}/products`, {
        method: "GET",
        headers: headers(token)
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}

/* POST: /categories */
export async function createCategory(token: string, createCategoryDto: CreateCategoryDto) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_CATALOG_URL}/categories`, {
        method: "POST",
        headers: headers(token),
        body: JSON.stringify(createCategoryDto)
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}

/* PUT: /categories/{id} */
export async function updateCategory(token: string, id: number, updateCategoryDto: CreateCategoryDto) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_CATALOG_URL}/categories/${id}`, {
        method: "PUT",
        headers: headers(token),
        body: JSON.stringify(updateCategoryDto)
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}

/* DELETE: /categories/{id} */
export async function deleteCategory(token: string, id: number) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_CATALOG_URL}/categories/${id}`, {
        method: "DELETE",
        headers: headers(token)
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}


/* Products Endpoints */

/* GET: /products */
export async function getProducts(token: string): Promise<Product[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_CATALOG_URL}/products`, {
        method: "GET",
        headers: headers(token)
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}

/* GET: /products/{id} */
export async function getProductById(token: string, id: number): Promise<Product> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_CATALOG_URL}/products/${id}`, {
        method: "GET",
        headers: headers(token)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}

/* GET: /products/{id}/category */
export async function getCategoryByProductId(token: string, id: number): Promise<Category> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_CATALOG_URL}/products/${id}/category`, {
        method: "GET",
        headers: headers(token)
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}

/* POST: /products */
export async function createProduct(token: string, createProductDto: CreateProductDto) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_CATALOG_URL}/products`, {
        method: "POST",
        headers: headers(token),
        body: JSON.stringify(createProductDto)
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}

/* PUT: /products/{id} */
export async function updateProduct(token: string, id: number, updateProductDto: CreateProductDto) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_CATALOG_URL}/products/${id}`, {
        method: "PUT",
        headers: headers(token),
        body: JSON.stringify(updateProductDto)
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}

/* PUT: /products/{id}/activate */
export async function activateProduct(token: string, id: number) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_CATALOG_URL}/products/${id}/activate`, {
        method: "PUT",
        headers: headers(token)
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}



/* PUT: /products/{id}/disable */
export async function disableProduct(token: string, id: number) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_CATALOG_URL}/products/${id}/disable`, {
        method: "PUT",
        headers: headers(token)
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}


/* PUT: /products/{productId}/category/{categoryId} */
export async function assignCategoryToProduct(token: string, productId: number, categoryId: number) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_CATALOG_URL}/products/${productId}/category/${categoryId}`, {
        method: "PUT",
        headers: headers(token)
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}


/* DELETE: /products/{id} */
export async function deleteProduct(token: string, id: number) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_CATALOG_URL}/products/${id}`, {
        method: "DELETE",
        headers: headers(token)
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}