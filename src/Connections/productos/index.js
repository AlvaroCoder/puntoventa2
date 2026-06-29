import { fetchWithAuth } from '@/lib/fetchwithAuth'

const BASE_PRODUCTO  = '/api/producto'
const BASE_CATEGORIA = '/api/categoria'
const BASE_INVENTARIO = '/api/inventario'

export async function getProductosByEmpresa(empresaId) {
    return fetchWithAuth(`${BASE_PRODUCTO}/empresa/${empresaId}`)
}

export async function getProductoById(id) {
    return fetchWithAuth(`${BASE_PRODUCTO}/${id}`)
}

export async function getProductosBajoStock(empresaId) {
    return fetchWithAuth(`${BASE_PRODUCTO}/bajo-stock/${empresaId}`)
}

export async function createProducto(data = {}) {
    return fetchWithAuth(BASE_PRODUCTO, { method: 'POST', body: data })
}

export async function updateProducto(id, data = {}) {
    return fetchWithAuth(`${BASE_PRODUCTO}/${id}`, { method: 'PUT', body: data })
}

export async function deleteProducto(id) {
    return fetchWithAuth(`${BASE_PRODUCTO}/${id}`, { method: 'DELETE' })
}

export async function getCategorias() {
    return fetchWithAuth(BASE_CATEGORIA)
}

export async function getInventarioByTienda(tiendaId) {
    return fetchWithAuth(`${BASE_INVENTARIO}/tienda/${tiendaId}`)
}
