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

export async function getTrabajadorByIdUser(userId) {
    return fetchWithAuth(`${BASE}/usuario/${userId}`)
}

export async function createTrabajador(data = {}, token) {
    return fetch(`http://localhost:3030${BASE}`, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
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
