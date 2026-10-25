import { fetchServer } from '@/lib/fetchServer'
import { fetchWithAuth } from '@/lib/fetchwithAuth'

const BASE = '/api/logistica'

export async function createOrdenCompra(data = {}) {
    return fetchWithAuth(BASE, { method: 'POST', body: data })
}

export async function enviarOrdenCompra(id) {
    return fetchWithAuth(`${BASE}/${id}/enviar`, { method: 'POST' })
}

export async function getOrdenesByEmpresa(empresaId) {
    return fetchServer(`${BASE}/ordenes-compra/empresa/${empresaId}`);
}

export async function getOrdenById(id) {
    return fetchWithAuth(`${BASE}/${id}`)
}

export async function updateOrdenCompra(id, data = {}) {
    return fetchWithAuth(`${BASE}/${id}`, { method: 'PUT', body: data })
}
