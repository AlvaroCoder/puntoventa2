import { fetchWithAuth } from '@/lib/fetchwithAuth'

const BASE = '/api/codigos-union'

export async function createCodigoUnion(data = {}) {
    return fetchWithAuth(BASE, { method: 'POST', body: data })
}

export async function getCodigosUnion(estado = 'vigente') {
    return fetchWithAuth(`${BASE}?estado=${estado}`)
}

export async function desactivarCodigoUnion(id) {
    return fetchWithAuth(`${BASE}/${id}`, { method: 'DELETE' })
}

export async function verCodigoUnion(codigo) {
    return fetchWithAuth(`${BASE}/ver/${codigo}`)
}
