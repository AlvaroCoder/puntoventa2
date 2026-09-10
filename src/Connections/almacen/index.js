import { fetchWithAuth } from "@/lib/fetchwithAuth";

const BASE = 'http://localhost:8085/api';

export async function createAlmacen(data={}) {
    return fetchWithAuth(`${BASE}/almacen/almacenes`, {method : 'POST', body : data})
}

export async function getAlmacenesByTienda(tiendaId) {
    return fetchWithAuth(`${BASE}/almacen/almacenes?tiendaId=${tiendaId}`)
}