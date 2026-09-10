import { fetchWithAuth } from '@/lib/fetchwithAuth'

const BASE = 'http://localhost:8085/api/ordenes-compra'

export async function createOrdenCompra(data = {}) {
    return fetchWithAuth(BASE, { method: 'POST', body: data })
}

export async function enviarOrdenCompra(id) {
    return fetchWithAuth(`${BASE}/${id}/enviar`, { method: 'POST' })
}

export async function getOrdenesByEmpresa(empresaId) {
    return fetchWithAuth(`${BASE}?empresaId=${empresaId}`)
}

export async function getOrdenById(id) {
    return fetchWithAuth(`${BASE}/${id}`)
}

export async function updateOrdenCompra(id, data = {}) {
    return fetchWithAuth(`${BASE}/${id}`, { method: 'PUT', body: data })
}
