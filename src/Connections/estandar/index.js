import { fetchWithAuth } from '@/lib/fetchwithAuth';

const BASE_PRODUCTO = '/api/estandar';
const BASE_CATEGORIA = '';

export async function getProductosSemilla() {
    return fetchWithAuth(`${BASE_PRODUCTO}`);
}

export async function getProductosSemillaByRubro(idRubro) {
    return fetchWithAuth(`${BASE_PRODUCTO}/rubro/${idRubro}`)
}

