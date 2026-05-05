'use client'
import { getSession } from '@/lib/authentication'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3030'

/**
 * Wrapper de fetch que inyecta automáticamente el Bearer token de la sesión.
 *
 * @param {string} endpoint  - Path relativo ("/api/clientes") o URL absoluta
 * @param {object} options
 * @param {'GET'|'POST'|'PUT'|'PATCH'|'DELETE'} options.method  - Método HTTP (default: 'GET')
 * @param {object|null} options.body    - Cuerpo de la petición (se serializa a JSON)
 * @param {object} options.params       - Query params { key: value }
 *
 * @returns {{ ok: boolean, status: number, data: any, message: string, error: boolean }}
 */
export async function fetchWithAuth(endpoint, { method = 'GET', body = null, params = {} } = {}) {
    const session = await getSession()
    const token   = session?.access_token

    // Construir URL final
    const base = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`
    const url  = Object.keys(params).length
        ? `${base}?${new URLSearchParams(params).toString()}`
        : base

    const fetchOptions = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        mode: 'cors',
        ...(body !== null ? { body: JSON.stringify(body) } : {}),
    }

    const response = await fetch(url, fetchOptions)

    let json = null
    try {
        json = await response.json()
    } catch {
        json = null
    }

    return {
        ok:      response.ok,
        status:  response.status,
        data:    json?.data    ?? json,
        message: json?.message ?? '',
        error:   !response.ok,
    }
}
