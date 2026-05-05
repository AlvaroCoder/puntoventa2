import { fetchWithAuth } from '@/lib/fetchwithAuth'

const BASE = '/api/creditos'

/** Obtiene todos los créditos de una empresa */
export async function getCreditosByEmpresa(empresaId) {
    return fetchWithAuth(`${BASE}/empresa/${empresaId}`)
}

/** Obtiene los créditos de un cliente específico */
export async function getCreditosByCliente(clienteId) {
    return fetchWithAuth(`${BASE}/cliente/${clienteId}`)
}

/** Obtiene los créditos vencidos de una empresa */
export async function getCreditosVencidos(empresaId) {
    return fetchWithAuth(`${BASE}/vencidos/${empresaId}`)
}

/** Obtiene el saldo pendiente de un crédito */
export async function getSaldoCredito(creditoId) {
    return fetchWithAuth(`${BASE}/${creditoId}/saldo`)
}

/** Crea un nuevo crédito */
export async function createCredito(data = {}) {
    return fetchWithAuth(BASE, { method: 'POST', body: data })
}

/** Registra un pago a un crédito */
export async function pagarCredito(creditoId, data = {}) {
    return fetchWithAuth(`${BASE}/${creditoId}/pagar`, { method: 'POST', body: data })
}
