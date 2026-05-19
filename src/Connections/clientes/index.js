import { fetchWithAuth } from '@/lib/fetchwithAuth'

const BASE = '/api/cliente'

export async function getClientesByEmpresa(empresaId) {
    return fetchWithAuth(`${BASE}/empresa/${empresaId}`)
}

export async function getClienteSunat(documentoCliente) {
    return fetchWithAuth(`${BASE}/documento/${documentoCliente}`)
}

export async function getClienteById(id) {
    return fetchWithAuth(`${BASE}/${id}`)
}

export async function createCliente(data = {}) {
    return fetchWithAuth(BASE, { method: 'POST', body: data })
}

export async function updateCliente(id, data = {}) {
    return fetchWithAuth(`${BASE}/${id}`, { method: 'PUT', body: data })
}

export async function deleteCliente(id) {
    return fetchWithAuth(`${BASE}/${id}`, { method: 'DELETE' })
}
