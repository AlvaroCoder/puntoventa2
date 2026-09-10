import { fetchWithAuth } from '@/lib/fetchwithAuth'

const BASE = 'http://localhost:3030/api/proveedor'

export async function getProveedoresByEmpresa(empresaId) {
    return fetchWithAuth(`${BASE}/empresa/${empresaId}`)
}

export async function createProveedor(data = {}) {
    return fetchWithAuth(BASE, { method: 'POST', body: data })
}

export async function updateProveedor(id, data = {}) {
    return fetchWithAuth(`${BASE}/${id}`, { method: 'PUT', body: data })
}

export async function deleteProveedor(id) {
    return fetchWithAuth(`${BASE}/${id}`, { method: 'DELETE' })
}
