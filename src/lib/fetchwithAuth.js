'use client'
import { getSession } from '@/lib/authentication'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3030'
const BASE_URL_2 = process.env.NEXT_PUBLIC_BASE_URL_2 ?? 'http://localhost:8085'

export async function fetchWithAuth(endpoint, { method = 'GET', body = null, params = {} } = {}, type_api = 'express') {
    const session = await getSession()
    const token   = session?.access_token

    const base = endpoint.startsWith('http') ? endpoint : (type_api === 'express' ? `${BASE_URL}${endpoint}` : `${BASE_URL_2}${endpoint}`)
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
};

export async function fetchWithAuthFormData(endpoint, { method = 'POST', body = null, params = {} } = {}, type_api = 'express') {
    const session = await getSession()
    const token   = session?.access_token

    const base = endpoint.startsWith('http') ? endpoint : (type_api === 'express' ? `${BASE_URL}${endpoint}` : `${BASE_URL_2}${endpoint}`)
    const url  = Object.keys(params).length
        ? `${base}?${new URLSearchParams(params).toString()}`
        : base

    const fetchOptions = {
        method,
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        mode: 'cors',
        ...(body !== null ? { body } : {}),
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