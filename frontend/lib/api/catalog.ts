import { CreateCategoryDto, CreateProductDto } from "@/types/dtos";


/* Categories Endpoints */

/* GET:  /categories */
export async function getCategories() {
    const res = await fetch(`${process.env.NEXT_CATALOG_URL}/categories`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}

/* GET: /categories/{id} */
export async function getCategoryById(id: number) {
    const res = await fetch(`${process.env.NEXT_CATALOG_URL}/categories/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}

/* GET: /categories/{id}/products */
export async function getProductsByCategory(id: number) {
    const res = await fetch(`${process.env.NEXT_CATALOG_URL}/categories/${id}/products`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}

/* POST: /categories */
export async function createCategory(createCategoryDto: CreateCategoryDto) {
    const res = await fetch(`${process.env.NEXT_CATALOG_URL}/categories`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(createCategoryDto)
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}

/* PUT: /categories/{id} */
export async function updateCategory(id: number, updateCategoryDto: CreateCategoryDto) {
    const res = await fetch(`${process.env.NEXT_CATALOG_URL}/categories/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updateCategoryDto)
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}

/* DELETE: /categories/{id} */
export async function deleteCategory(id: number) {
    const res = await fetch(`${process.env.NEXT_CATALOG_URL}/categories/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}


/* Products Endpoints */

/* GET: /products */
export async function getProducts() {
    const res = await fetch(`${process.env.NEXT_CATALOG_URL}/products`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}

/* GET: /products/{id} */
export async function getProductById(id: number) {
    const res = await fetch(`${process.env.NEXT_CATALOG_URL}/products/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}

/* GET: /products/{id}/category */
export async function getCategoryByProductId(id: number) {
    const res = await fetch(`${process.env.NEXT_CATALOG_URL}/products/${id}/category`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}

/* POST: /products */
export async function createProduct(createProductDto: CreateProductDto) {
    const res = await fetch(`${process.env.NEXT_CATALOG_URL}/products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(createProductDto)
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}

/* PUT: /products/{id} */
export async function updateProduct(id: number, updateProductDto: CreateProductDto) {
    const res = await fetch(`${process.env.NEXT_CATALOG_URL}/products/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updateProductDto)
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}

/* PUT: /products/{id}/activate */
export async function activateProduct(id: number) {
    const res = await fetch(`${process.env.NEXT_CATALOG_URL}/products/${id}/activate`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}



/* PUT: /products/{id}/disable */
export async function disableProduct(id: number) {
    const res = await fetch(`${process.env.NEXT_CATALOG_URL}/products/${id}/disable`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}


/* PUT: /products/{productId}/category/{categoryId} */
export async function assignCategoryToProduct(productId: number, categoryId: number) {
    const res = await fetch(`${process.env.NEXT_CATALOG_URL}/products/${productId}/category/${categoryId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}


/* DELETE: /products/{id} */
export async function deleteProduct(id: number) {
    const res = await fetch(`${process.env.NEXT_CATALOG_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json;
}