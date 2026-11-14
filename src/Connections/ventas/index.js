import { fetchWithAuth } from '@/lib/fetchwithAuth'
import { fetchServer } from '@/lib/fetchServer'
const BASE_VENTAS  = '/api/ventas'
const BASE_DETALLES = '/api/venta-detalles'

export async function getVentas() {
    return fetchServer(`${BASE_VENTAS}`, { method: "GET" }, type_api = "express");
}

export async function getVentasByEmpresa(empresaId, params = {}) {
    return fetchWithAuth(`${BASE_VENTAS}/empresa/${empresaId}`, { params })
}

export async function getVentasByTienda(tiendaId, params = {}) {
    return fetchWithAuth(`${BASE_VENTAS}/tienda/${tiendaId}`, { params })
}

export async function getVentasByCliente(clienteId) {
    return fetchWithAuth(`${BASE_VENTAS}/cliente/${clienteId}`)
}

export async function getVentaById(id) {
    return fetchWithAuth(`${BASE_VENTAS}/${id}`)
}

export async function createVenta(data = {}) {
    return fetchServer("/api/ventas", {
      method: "POST",
      body: data,
    }, 'spring');
}

export async function getDetallesByVenta(ventaId) {
    return fetchWithAuth(`${BASE_DETALLES}/venta/${ventaId}`)
}
