import { fetchServer } from '@/lib/fetchServer';
import { fetchWithAuth } from '@/lib/fetchwithAuth'

const BASE = '/api/tienda'

export async function getTiendasByEmpresa(empresaId) {
    return fetchServer(`${BASE}/empresa/${empresaId}`)
}

export async function getTiendasByUser() {
    return fetchWithAuth(BASE);
}

export async function getTiendaById(id) {
    return fetchWithAuth(` ${BASE}/${id}`)
}

export async function createTienda(data = {}) {
    return fetchWithAuth(BASE, { method: 'POST', body: data })
}

export async function updateTienda(id, data = {}) {
    return fetchWithAuth(`${BASE}/${id}`, { method: 'PUT', body: data })
}

export async function deleteTienda(id) {
    return fetchServer(`${BASE}/${id}`, { method: 'DELETE' })
}
