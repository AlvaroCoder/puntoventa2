'use client'
import { getSession } from "@/lib/authentication";

export async function CREATE_CLIENT(data={}) {
    const URL_CREATE_CLIENT = process.env.NEXT_PUBLIC_URL_GET_CLIENTS;
    const session=await getSession();
    
    return await fetch(URL_CREATE_CLIENT,{
        method : 'POST',
        headers : {
            'Content-Type':'application/json',
            'Authorization':`Bearer ${session?.access_token}`
        },
        body : JSON.stringify(data),
        mode : 'cors'
    })
}

export async function REGISTER_USER(data) {
    const URL_REGISTER = process.env.NEXT_PUBLIC_URL_REGISTER;
    return await fetch(URL_REGISTER, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        mode: 'cors'
    })
};

export async function CREATE_COMPANY(data = {}, token='') {

    const URL_CREATE = process.env.NEXT_PUBLIC_URL_CREATE_COMPANY;
    return await fetch(URL_CREATE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
        mode: 'cors'
    })
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3030';

export async function RECUPERAR_PASSWORD(email) {
    return await fetch(`${BASE_URL}/api/usuarios/recuperar-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        mode: 'cors'
    });
}

export async function VERIFICAR_CODIGO_RESET(email, codigo) {
    return await fetch(`${BASE_URL}/api/usuarios/verificar-codigo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, codigo }),
        mode: 'cors'
    });
}

export async function RESET_PASSWORD(reset_token, nueva_password) {
    return await fetch(`${BASE_URL}/api/usuarios/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reset_token, nueva_password }),
        mode: 'cors'
    });
}

// ─── Trabajadores ────────────────────────────────────────────────────────────

async function authHeaders() {
    const session = await getSession();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`
    };
}

export async function GET_TRABAJADORES_BY_EMPRESA(empresaId, params = {}) {
    const query = new URLSearchParams(params).toString();
    return await fetch(`${BASE_URL}/api/trabajador/empresa/${empresaId}${query ? `?${query}` : ''}`, {
        method: 'GET',
        headers: await authHeaders(),
        mode: 'cors'
    });
}

export async function GET_CUOTA_TRABAJADORES(empresaId) {
    return await fetch(`${BASE_URL}/api/trabajador/empresa/${empresaId}/cuota`, {
        method: 'GET',
        headers: await authHeaders(),
        mode: 'cors'
    });
}

export async function CREATE_TRABAJADOR(data = {}) {
    return await fetch(`${BASE_URL}/api/trabajador`, {
        method: 'POST',
        headers: await authHeaders(),
        body: JSON.stringify(data),
        mode: 'cors'
    });
}

export async function UPDATE_TRABAJADOR(id, data = {}) {
    return await fetch(`${BASE_URL}/api/trabajador/${id}`, {
        method: 'PUT',
        headers: await authHeaders(),
        body: JSON.stringify(data),
        mode: 'cors'
    });
}

export async function TOGGLE_ESTADO_TRABAJADOR(id, activo) {
    return await fetch(`${BASE_URL}/api/trabajador/${id}/estado`, {
        method: 'PATCH',
        headers: await authHeaders(),
        body: JSON.stringify({ activo }),
        mode: 'cors'
    });
}

export async function GET_TIENDAS_BY_EMPRESA(empresaId) {
    return await fetch(`${BASE_URL}/api/tienda/empresa/${empresaId}`, {
        method: 'GET',
        headers: await authHeaders(),
        mode: 'cors'
    });
}

export async function GET_ROLES() {
    return await fetch(`${BASE_URL}/api/rol`, {
        method: 'GET',
        headers: await authHeaders(),
        mode: 'cors'
    });
}