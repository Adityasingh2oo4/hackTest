const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function getToken() {
    return localStorage.getItem("jwt");
}

function authHeaders() {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

async function handleResponse(res) {
    const text = await res.text();
    let data;
    try {
        data = JSON.parse(text);
    } catch {
        data = text;
    }
    if (!res.ok) {
        const msg =
            (data && (data.message || data.error)) ||
            `HTTP ${res.status}`;
        throw new Error(msg);
    }
    return data;
}

export async function loginUser({ email, password }) {
    const res = await fetch(`${BASE_URL}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
}

export async function registerUser({ email, password, fullName }) {
    const res = await fetch(`${BASE_URL}/api/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName }),
    });
    return handleResponse(res);
}

export async function getProducts() {
    const res = await fetch(`${BASE_URL}/api/products`, {
        headers: authHeaders(),
    });
    return handleResponse(res);
}

export async function createProduct(product) {
    const res = await fetch(`${BASE_URL}/api/products`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(product),
    });
    return handleResponse(res);
}

export async function updateProduct(id, product) {
    const res = await fetch(`${BASE_URL}/api/products/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(product),
    });
    return handleResponse(res);
}

export async function deleteProduct(id) {
    const res = await fetch(`${BASE_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
    }
}

export async function placeOrder(items) {
    const res = await fetch(`${BASE_URL}/api/orders`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ items }),
    });
    return handleResponse(res);
}

export async function getMyOrders() {
    const res = await fetch(`${BASE_URL}/api/orders/my`, {
        headers: authHeaders(),
    });
    return handleResponse(res);
}

export async function cancelOrder(orderId) {
    const res = await fetch(`${BASE_URL}/api/orders/${orderId}/cancel`, {
        method: "PUT",
        headers: authHeaders(),
    });
    return handleResponse(res);
}

export async function getAllOrders() {
    const res = await fetch(`${BASE_URL}/api/orders`, {
        headers: authHeaders(),
    });
    return handleResponse(res);
}

export async function updateOrderStatus(orderId, status) {
    const res = await fetch(`${BASE_URL}/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ status }),
    });
    return handleResponse(res);
}

export async function processPayment({ orderId, paymentMethod, cardLast4 }) {
    const res = await fetch(`${BASE_URL}/api/payments`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ orderId, paymentMethod, cardLast4 }),
    });
    return handleResponse(res);
}

export async function getPaymentByOrder(orderId) {
    const res = await fetch(`${BASE_URL}/api/payments/order/${orderId}`, {
        headers: authHeaders(),
    });
    return handleResponse(res);
}

export async function getCategories() {
    const res = await fetch(`${BASE_URL}/api/categories`, {
        headers: authHeaders(),
    });
    return handleResponse(res);
}

export async function createCategory(category) {
    const res = await fetch(`${BASE_URL}/api/categories`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(category),
    });
    return handleResponse(res);
}

export async function updateCategory(id, category) {
    const res = await fetch(`${BASE_URL}/api/categories/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(category),
    });
    return handleResponse(res);
}

export async function deleteCategory(id) {
    const res = await fetch(`${BASE_URL}/api/categories/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
    }
}

export async function getBrands() {
    const res = await fetch(`${BASE_URL}/api/brands`, {
        headers: authHeaders(),
    });
    return handleResponse(res);
}

export async function createBrand(brand) {
    const res = await fetch(`${BASE_URL}/api/brands`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(brand),
    });
    return handleResponse(res);
}

export async function updateBrand(id, brand) {
    const res = await fetch(`${BASE_URL}/api/brands/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(brand),
    });
    return handleResponse(res);
}

export async function deleteBrand(id) {
    const res = await fetch(`${BASE_URL}/api/brands/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
    }
}

export async function getPackaging() {
    const res = await fetch(`${BASE_URL}/api/packaging`, {
        headers: authHeaders(),
    });
    return handleResponse(res);
}

export async function createPackaging(pkg) {
    const res = await fetch(`${BASE_URL}/api/packaging`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(pkg),
    });
    return handleResponse(res);
}

export async function updatePackaging(id, pkg) {
    const res = await fetch(`${BASE_URL}/api/packaging/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(pkg),
    });
    return handleResponse(res);
}

export async function deletePackaging(id) {
    const res = await fetch(`${BASE_URL}/api/packaging/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
    }
}
