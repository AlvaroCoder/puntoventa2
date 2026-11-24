import { NextResponse } from 'next/server'
import { getSession } from '@/lib/authentication'
import {
    getEstadoInventario,
    getValorInventario,
    getTopProductos,
    getVentasDiarias,
    getDeadStock,
    getMovimientosSemanales,
} from '@/Connections/analytics'

const HANDLERS = {
    'estado-inventario':     (tiendaId, _p) => getEstadoInventario(tiendaId),
    'valor-inventario':      (tiendaId, _p) => getValorInventario(tiendaId),
    'top-productos':         (tiendaId, p)  => getTopProductos(tiendaId, p.get('dias') ?? 30),
    'ventas-diarias':        (tiendaId, p)  => getVentasDiarias(tiendaId, p.get('dias') ?? 30),
    'dead-stock':            (tiendaId, p)  => getDeadStock(tiendaId, p.get('dias') ?? 60),
    'movimientos-semanales': (tiendaId, p)  => getMovimientosSemanales(tiendaId, p.get('semanas') ?? 8),
}

export async function GET(request, { params }) {
    const { slug } = await params

    if (!HANDLERS[slug]) {
        return NextResponse.json({ error: true, message: 'Ruta analytics no válida' }, { status: 404 })
    }

    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: true, message: 'No autorizado' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const tiendaId = searchParams.get('tiendaId') ?? null

        const result = await HANDLERS[slug](tiendaId, searchParams)
        return NextResponse.json(result)
    } catch (err) {
        return NextResponse.json({ error: true, message: err.message }, { status: 500 })
    }
}
