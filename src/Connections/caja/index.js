import { fetchWithAuth } from '@/lib/fetchwithAuth'
import { CAJA_ENDPOINTS } from '../EndpointsRouter';

const ENDPOINTS = CAJA_ENDPOINTS;

export async function getCajaByTienda(tiendaId) {
    return fetchWithAuth(ENDPOINTS.getAllCajasByTienda(tiendaId), {}, 'spring')
}

export async function createCaja(data = {}) {
    return fetchWithAuth(ENDPOINTS.createCaja(), { method: 'POST', body: data }, {}, 'spring')
}

export async function updateCaja(cajaId, data = {}) {
    return fetchWithAuth(ENDPOINTS.updateCaja(cajaId), { method: 'PUT', body: data }, {}, 'spring')
}

export async function getCajaById(cajaId) {
    return fetchWithAuth(ENDPOINTS.getCajaByTienda(tiendaId, cajaId), {}, 'spring')
}

export async function getSesionActual(cajaId) {
    return fetchWithAuth(ENDPOINTS.getSesionActual(cajaId), {}, 'spring')
}

export async function getSesionesActivas(tiendaId) { 
    return fetchWithAuth(ENDPOINTS.getSesionesActivas(tiendaId), {}, 'spring');
}

export async function getSesionesByCaja(cajaId) {
    return fetchWithAuth(ENDPOINTS.getSesionesByCaja(cajaId), {}, 'spring')
}

export async function abrirCaja(cajaId, data = {}) {
    return fetchWithAuth(ENDPOINTS.abrirCaja(cajaId), { method: 'POST', body: data }, 'spring')
}

export async function cerrarCaja(cajaId, data = {}) {
    return fetchWithAuth(ENDPOINTS.cerrarCaja(cajaId), { method: 'POST', body: data }, 'spring')
}

export async function getMovimientosByCaja(cajaId) {
    return fetchWithAuth(ENDPOINTS.getMovementsByCaja(cajaId), {}, 'spring')
}

export async function createMovimiento(cajaId, data = {}) {
    return fetchWithAuth(ENDPOINTS.registerMovements(cajaId), { method: 'POST', body: data }, 'spring')
}
