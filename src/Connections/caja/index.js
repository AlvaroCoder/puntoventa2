import { fetchWithAuth } from '@/lib/fetchwithAuth'

const BASE_CAJA = '/api/caja';

export async function getCajaByTienda(tiendaId) {
    return fetchWithAuth(`${BASE_CAJA}?tienda_id=${tiendaId}&activa=true`)
}

export async function createCaja(data = {}) {
    return fetchWithAuth(BASE_CAJA, { method: 'POST', body: data })
}

export async function updateCaja(cajaId, data = {}) {
    return fetchWithAuth(`${BASE_CAJA}/${cajaId}`, { method: 'PUT', body: data })
}

export async function getCajaById(cajaId) {
    return fetchWithAuth(`${BASE_CAJA}/${cajaId}`)
}

export async function getSesionActual(cajaId) {
    return fetchWithAuth(`${BASE_CAJA}/${cajaId}/sesion`)
}

export async function getSesionesByCaja(cajaId) {
    return fetchWithAuth(`${BASE_CAJA}/${cajaId}/sesiones`)
}

export async function abrirCaja(cajaId, data = {}) {
    return fetchWithAuth(`${BASE_CAJA}/${cajaId}/abrir`, { method: 'POST', body: data })
}

export async function cerrarCaja(cajaId, data = {}) {
    return fetchWithAuth(`${BASE_CAJA}/${cajaId}/cerrar`, { method: 'POST', body: data })
}

export async function getMovimientosByCaja(cajaId) {
    return fetchWithAuth(`${BASE_CAJA}/${cajaId}/movimientos`)
}

export async function createMovimiento(cajaId, data = {}) {
    return fetchWithAuth(`${BASE_CAJA}/${cajaId}/movimientos`, { method: 'POST', body: data })
}
