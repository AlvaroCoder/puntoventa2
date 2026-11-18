import { fetchWithAuth } from '@/lib/fetchwithAuth'

const BASE = '/api/rol'

export async function getAllRoles() {
    return fetchWithAuth(BASE)
}

export async function getRolById(id) {
    return fetchWithAuth(`${BASE}/${id}`)
}

export async function createRol(data = {}) {
    return fetchWithAuth(BASE, { method: 'POST', body: data })
}

export async function updateRol(id, data = {}) {
    return fetchWithAuth(`${BASE}/${id}`, { method: 'PUT', body: data })
}

export async function deleteRol(id) {
    return fetchWithAuth(`${BASE}/${id}`, { method: 'DELETE' })
}
