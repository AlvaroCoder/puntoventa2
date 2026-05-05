import { fetchWithAuth } from '@/lib/fetchwithAuth'

const BASE_PRODUCTO  = '/api/producto'
const BASE_CATEGORIA = '/api/categoria'
const BASE_INVENTARIO = '/api/inventario'

/** Obtiene todos los productos de una empresa */
export async function getProductosByEmpresa(empresaId) {
    return fetchWithAuth(`${BASE_PRODUCTO}/empresa/${empresaId}`)
}

/** Obtiene un producto por su ID */
export async function getProductoById(id) {
    return fetchWithAuth(`${BASE_PRODUCTO}/${id}`)
}

/** Obtiene productos con bajo stock de una empresa */
export async function getProductosBajoStock(empresaId) {
    return fetchWithAuth(`${BASE_PRODUCTO}/bajo-stock/${empresaId}`)
}

/** Crea un nuevo producto */
export async function createProducto(data = {}) {
    return fetchWithAuth(BASE_PRODUCTO, { method: 'POST', body: data })
}

/** Actualiza un producto */
export async function updateProducto(id, data = {}) {
    return fetchWithAuth(`${BASE_PRODUCTO}/${id}`, { method: 'PUT', body: data })
}

/** Elimina un producto (soft delete) */
export async function deleteProducto(id) {
    return fetchWithAuth(`${BASE_PRODUCTO}/${id}`, { method: 'DELETE' })
}

/** Obtiene todas las categorías */
export async function getCategorias() {
    return fetchWithAuth(BASE_CATEGORIA)
}

/** Obtiene el inventario de una tienda */
export async function getInventarioByTienda(tiendaId) {
    return fetchWithAuth(`${BASE_INVENTARIO}/tienda/${tiendaId}`)
}
