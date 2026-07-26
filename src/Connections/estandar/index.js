import { fetchWithAuth } from '@/lib/fetchwithAuth';
import { SEMILLA_ENDPOINTS } from '@/Connections/EndpointRouterExpress';

const ENDPOINTS = SEMILLA_ENDPOINTS;

export async function getProductosSemilla() {
    return fetchWithAuth(ENDPOINTS.getAllProductosEstandar());
}

export async function getProductosSemillaByRubro(idRubro) {
    return fetchWithAuth(ENDPOINTS.getProductosEstandarByRubro(idRubro));
}

export async function importarProductosEstandar(data) {
    return fetchWithAuth(ENDPOINTS.importarAEmpresa(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}
