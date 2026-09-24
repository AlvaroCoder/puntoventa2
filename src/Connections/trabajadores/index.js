import { fetchWithAuth } from '@/lib/fetchwithAuth'

const BASE = '/api/trabajador'

export async function getTrabajadoresByEmpresa(empresaId, params = {}) {
    return fetchWithAuth(`${BASE}/empresa/${empresaId}`, { params })
}

export async function getCuotaTrabajadores(empresaId) {
    return fetchWithAuth(`${BASE}/empresa/${empresaId}/cuota`)
}

export async function getTrabajadorById(id) {
    return fetchWithAuth(`${BASE}/${id}`)
}

export async function createTrabajador(data = {}) {
    return fetchWithAuth(BASE, { method: 'POST', body: data })
}

export async function updateTrabajador(id, data = {}) {
    return fetchWithAuth(`${BASE}/${id}`, { method: 'PUT', body: data })
}

export async function toggleEstadoTrabajador(id, activo) {
    return fetchWithAuth(`${BASE}/${id}/estado`, { method: 'PATCH', body: { activo } })
}

export async function deleteTrabajador(id) {
    return fetchWithAuth(`${BASE}/${id}`, { method: 'DELETE' })
}
