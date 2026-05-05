import { fetchWithAuth } from '@/lib/fetchwithAuth'

const BASE_CAJA      = '/api/caja'
const BASE_MOVIMIENTO = '/api/movimiento'

/** Obtiene la caja de una tienda */
export async function getCajaByTienda(tiendaId) {
    return fetchWithAuth(`${BASE_CAJA}/tienda/${tiendaId}`)
}

/** Abre la caja de una tienda */
export async function abrirCaja(tiendaId, data = {}) {
    return fetchWithAuth(`${BASE_CAJA}/tienda/${tiendaId}/abrir`, { method: 'POST', body: data })
}

/** Cierra la caja de una tienda */
export async function cerrarCaja(tiendaId, data = {}) {
    return fetchWithAuth(`${BASE_CAJA}/tienda/${tiendaId}/cerrar`, { method: 'POST', body: data })
}

/** Obtiene los movimientos de una caja */
export async function getMovimientosByCaja(cajaId) {
    return fetchWithAuth(`${BASE_MOVIMIENTO}/caja/${cajaId}`)
}

/** Registra un movimiento de caja (ingreso/egreso) */
export async function createMovimiento(data = {}) {
    return fetchWithAuth(BASE_MOVIMIENTO, { method: 'POST', body: data })
}
