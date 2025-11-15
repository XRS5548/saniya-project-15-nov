// src/api/products.js
// Simple wrapper functions for https://fakestoreapi.com/
// Using browser fetch because CRA runs in browser.

const BASE = 'https://fakestoreapi.com';

async function handleResponse(res:Response) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

/**
 * Get all products
 * GET /products
 */
export async function getAllProducts() {
  const res = await fetch(`${BASE}/products`);
  return handleResponse(res);
}

/**
 * Get single product by id
 * GET /products/:id
 * (Note: assignment asked to NOT fetch dynamically for details page,
 * but this helper is provided if needed elsewhere)
 */
export async function getProductById(id:string) {
  const res = await fetch(`${BASE}/products/${encodeURIComponent(id)}`);
  return handleResponse(res);
}

/**
 * Get all categories
 * GET /products/categories
 */
export async function getCategories() {
  const res = await fetch(`${BASE}/products/categories`);
  return handleResponse(res);
}

/**
 * Get products by category
 * GET /products/category/:category
 * NOTE: categories sometimes contain spaces, encode properly
 */
export async function getProductsByCategory(category:string) {
  const res = await fetch(`${BASE}/products/category/${encodeURIComponent(category)}`);
  return handleResponse(res);
}



export async function getProductDetails(id: string) {
  const res = await fetch(`${BASE}/products/${encodeURIComponent(id)}`);
  return handleResponse(res);
}