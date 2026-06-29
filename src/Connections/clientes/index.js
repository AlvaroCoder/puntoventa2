import { fetchWithAuth } from '@/lib/fetchwithAuth'
import { getSession } from '@/lib/authentication'

const BASE = '/api/cliente'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3030'

export async function getClientesByEmpresa(empresaId) {
    return fetchWithAuth(`${BASE}/empresa/${empresaId}`)
}

export async function getClienteSunat(documentoCliente) {
    return fetchWithAuth(`${BASE}/documento/${documentoCliente}`)
}

export async function getClienteById(id) {
    return fetchWithAuth(`${BASE}/${id}`)
}

export async function uploadDataExcelClient(excelClient) {
    const session = await getSession()
    const token   = session?.access_token

    const formData = new FormData()
    formData.append('archivo', excelClient)

    const response = await fetch(`${BASE_URL}${BASE}/importar-excel`, {
        method: 'POST',
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        mode: 'cors',
        body: formData,
    })

    let json = null
    try { json = await response.json() } catch { json = null }

    return {
        ok:      response.ok,
        status:  response.status,
        data:    json?.data    ?? json,
        message: json?.message ?? '',
        error:   !response.ok,
    }
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
