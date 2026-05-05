import { fetchWithAuth } from '@/lib/fetchwithAuth'

const BASE = '/api/trabajador'

/** Obtiene todos los trabajadores de una empresa (con filtros opcionales) */
export async function getTrabajadoresByEmpresa(empresaId, params = {}) {
    return fetchWithAuth(`${BASE}/empresa/${empresaId}`, { params })
}

/** Obtiene la cuota de trabajadores de una empresa */
export async function getCuotaTrabajadores(empresaId) {
    return fetchWithAuth(`${BASE}/empresa/${empresaId}/cuota`)
}

/** Obtiene un trabajador por su ID */
export async function getTrabajadorById(id) {
    return fetchWithAuth(`${BASE}/${id}`)
}

/** Crea un nuevo trabajador */
export async function createTrabajador(data = {}) {
    return fetchWithAuth(BASE, { method: 'POST', body: data })
}

/** Actualiza un trabajador */
export async function updateTrabajador(id, data = {}) {
    return fetchWithAuth(`${BASE}/${id}`, { method: 'PUT', body: data })
}

/** Activa o desactiva un trabajador */
export async function toggleEstadoTrabajador(id, activo) {
    return fetchWithAuth(`${BASE}/${id}/estado`, { method: 'PATCH', body: { activo } })
}

/** Elimina un trabajador (soft delete) */
export async function deleteTrabajador(id) {
    return fetchWithAuth(`${BASE}/${id}`, { method: 'DELETE' })
}
