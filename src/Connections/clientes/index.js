import { fetchWithAuth } from '@/lib/fetchwithAuth'

const BASE = '/api/cliente'

/** Obtiene todos los clientes de una empresa */
export async function getClientesByEmpresa(empresaId) {
    return fetchWithAuth(`${BASE}/empresa/${empresaId}`)
}

/** Obtiene un cliente por su ID */
export async function getClienteById(id) {
    return fetchWithAuth(`${BASE}/${id}`)
}

/** Crea un nuevo cliente */
export async function createCliente(data = {}) {
    return fetchWithAuth(BASE, { method: 'POST', body: data })
}

/** Actualiza un cliente existente */
export async function updateCliente(id, data = {}) {
    return fetchWithAuth(`${BASE}/${id}`, { method: 'PUT', body: data })
}

/** Elimina un cliente (soft delete) */
export async function deleteCliente(id) {
    return fetchWithAuth(`${BASE}/${id}`, { method: 'DELETE' })
}
