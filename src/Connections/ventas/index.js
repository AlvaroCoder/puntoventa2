import { fetchWithAuth } from '@/lib/fetchwithAuth'

const BASE_VENTAS  = '/api/ventas'
const BASE_DETALLES = '/api/venta-detalles'

export async function getVentasByEmpresa(empresaId, params = {}) {
    return fetchWithAuth(`${BASE_VENTAS}/empresa/${empresaId}`, { params })
}

/** Obtiene las ventas de una tienda específica */
export async function getVentasByTienda(tiendaId, params = {}) {
    return fetchWithAuth(`${BASE_VENTAS}/tienda/${tiendaId}`, { params })
}

/** Obtiene el historial de ventas de un cliente */
export async function getVentasByCliente(clienteId) {
    return fetchWithAuth(`${BASE_VENTAS}/cliente/${clienteId}`)
}

/** Obtiene una venta por su ID */
export async function getVentaById(id) {
    return fetchWithAuth(`${BASE_VENTAS}/${id}`)
}

export async function createVenta(data = {}) {
    return fetchWithAuth("http://localhost:8085/api/ventas", {
      method: "POST",
      body: data,
    });
}

/** Obtiene el detalle de líneas de una venta */
export async function getDetallesByVenta(ventaId) {
    return fetchWithAuth(`${BASE_DETALLES}/venta/${ventaId}`)
}
