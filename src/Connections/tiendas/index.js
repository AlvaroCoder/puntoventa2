import { fetchWithAuth } from '@/lib/fetchwithAuth'

const BASE = '/api/tienda'

/** Obtiene todas las tiendas de una empresa */
export async function getTiendasByEmpresa(empresaId) {
    return fetchWithAuth(`${BASE}/empresa/${empresaId}`)
}

/** Obtiene una tienda por su ID */
export async function getTiendaById(id) {
    return fetchWithAuth(`${BASE}/${id}`)
}

/** Crea una nueva tienda */
export async function createTienda(data = {}) {
    return fetchWithAuth(BASE, { method: 'POST', body: data })
}

/** Actualiza una tienda */
export async function updateTienda(id, data = {}) {
    return fetchWithAuth(`${BASE}/${id}`, { method: 'PUT', body: data })
}

/** Elimina una tienda (soft delete) */
export async function deleteTienda(id) {
    return fetchWithAuth(`${BASE}/${id}`, { method: 'DELETE' })
}
