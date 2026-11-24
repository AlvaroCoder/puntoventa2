import { fetchServer } from '@/lib/fetchServer'
import { ANALYTICS_ENDPOINTS } from '@/Connections/EndpointsRouter'

export async function getEstadoInventario(tiendaId) {
    return fetchServer(ANALYTICS_ENDPOINTS.estadoInventario(tiendaId), {}, 'spring')
}

export async function getValorInventario(tiendaId) {
    return fetchServer(ANALYTICS_ENDPOINTS.valorInventario(tiendaId), {}, 'spring')
}

export async function getTopProductos(tiendaId, dias = 30) {
    return fetchServer(ANALYTICS_ENDPOINTS.topProductos(tiendaId, dias), {}, 'spring')
}

export async function getVentasDiarias(tiendaId, dias = 30) {
    return fetchServer(ANALYTICS_ENDPOINTS.ventasDiarias(tiendaId, dias), {}, 'spring')
}

export async function getDeadStock(tiendaId, dias = 60) {
    return fetchServer(ANALYTICS_ENDPOINTS.deadStock(tiendaId, dias), {}, 'spring')
}

export async function getMovimientosSemanales(tiendaId, semanas = 8) {
    return fetchServer(ANALYTICS_ENDPOINTS.movimientosSemanales(tiendaId, semanas), {}, 'spring')
}
