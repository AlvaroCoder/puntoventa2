import { fetchWithAuth } from '@/lib/fetchwithAuth'
import { PRODUCTO_ENDPOINTS, INVENTARIO_ENDPOINTS, VARIANTES_ENDPOINTS } from '../EndpointsRouter'

const BASE_PRODUCTO  = '/api/producto'
const BASE_CATEGORIA = '/api/categoria'

const ENDPOINTS_PRODUCTO = PRODUCTO_ENDPOINTS;
const ENDPOINTS_INVENTARIO = INVENTARIO_ENDPOINTS;
const ENDPOINTS_VARIANTES = VARIANTES_ENDPOINTS;

export async function getProductosByEmpresa(empresaId) {
    return fetchWithAuth(ENDPOINTS_PRODUCTO.getAllProductosByIdEmpresa(empresaId))
}


export async function getProductoById(id) {
    return fetchWithAuth(`${BASE_PRODUCTO}/${id}`)
}

export async function getProductosBajoStock(empresaId) {
    return fetchWithAuth(`${BASE_PRODUCTO}/bajo-stock/${empresaId}`)
}

export async function createProducto(data = {}) {
    return fetchWithAuth(ENDPOINTS_PRODUCTO.createProducto(), {method:'POST', body : data})
}

export async function createVariante(data={}) {
    return fetchWithAuth(ENDPOINTS_VARIANTES.createVariante(), { method: 'POST', body : data})
}

export async function updateProducto(id, data = {}) {
    return fetchWithAuth(`${BASE_PRODUCTO}/${id}`, { method: 'PUT', body: data })
}

export async function deleteProducto(id) {
    return fetchWithAuth(`${BASE_PRODUCTO}/${id}`, { method: 'DELETE' })
}

export async function getCategorias() {
    return fetchWithAuth(BASE_CATEGORIA, {}, 'express')
}

export async function getInventarioByTienda(tiendaId) {
    return fetchWithAuth(ENDPOINTS_INVENTARIO.getStockByTienda(tiendaId))
}
