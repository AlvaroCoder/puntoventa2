'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
    Search, Warehouse, Truck, Package, AlertTriangle,
    MoreVertical, LayoutGrid, List, ChevronDown
} from 'lucide-react'

/* ── Datos mock ───────────────────────────────────────────────── */
const MOCK_ALMACENES = [
    { id: 1,  nombre: 'Almacén Principal',           codigo: 'ALM-001', transito: 12, totales: 1284, stock_bajo: 18, nivel: 78  },

]

/* ── Color de la barra según nivel ───────────────────────────── */
function barColor(nivel) {
    if (nivel >= 75) return '#1EB3B2'   // teal — bueno
    if (nivel >= 50) return '#E8A020'   // naranja — atención
    return '#C0392B'                    // rojo — crítico
}

/* ── Chip de métrica ──────────────────────────────────────────── */
function Chip({ icon: Icon, value, label, alert = false }) {
    const bg    = alert ? 'rgba(192,57,43,0.07)' : 'rgba(57,96,169,0.07)'
    const color = alert ? '#C0392B' : '#3960A9'
    return (
        <div
            className="flex flex-col items-start gap-0.5 rounded-lg px-3 py-2 min-w-[80px]"
            style={{ backgroundColor: bg }}
        >
            <div className="flex items-center gap-1.5">
                <Icon size={14} style={{ color }} />
                <span className="text-sm font-bold" style={{ color }}>{value}</span>
            </div>
            <span className="text-[11px] leading-tight" style={{ color: 'rgba(31,47,87,0.55)' }}>
                {label}
            </span>
        </div>
    )
}

/* ── Tarjeta de almacén ───────────────────────────────────────── */
function AlmacenCard({ almacen }) {
    const { id, nombre, codigo, transito, totales, stock_bajo, nivel } = almacen
    const bColor = barColor(nivel)

    return (
        <div
            className="bg-white rounded-xl p-5 flex flex-col gap-4"
            style={{ border: '0.5px solid rgba(31,47,87,0.12)' }}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: 'rgba(57,96,169,0.08)' }}
                    >
                        <Warehouse size={20} color="#3960A9" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold leading-tight" style={{ color: '#1F2F57' }}>
                            {nombre}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(31,47,87,0.45)' }}>
                            {codigo}
                        </p>
                    </div>
                </div>
                <button
                    aria-label="Opciones del almacén"
                    className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors shrink-0"
                >
                    <MoreVertical size={16} color="rgba(31,47,87,0.45)" />
                </button>
            </div>

            {/* Métricas */}
            <div className="flex gap-2 flex-wrap">
                <Chip icon={Truck}         value={transito}   label="Productos en tránsito" />
                <Chip icon={Package}       value={totales}    label="Productos totales"      />
                <Chip icon={AlertTriangle} value={stock_bajo} label="Stock bajo" alert={stock_bajo > 0} />
            </div>

            {/* Nivel de stock */}
            <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                    <span className="text-xs" style={{ color: 'rgba(31,47,87,0.55)' }}>
                        Nivel de stock
                    </span>
                    <span
                        className="text-xs font-semibold"
                        style={{ color: bColor }}
                        aria-hidden
                    >
                        {nivel}%
                    </span>
                    <span className="sr-only">{nivel}% de nivel de stock</span>
                </div>
                <div
                    className="w-full h-1.5 rounded-full"
                    style={{ backgroundColor: 'rgba(31,47,87,0.08)' }}
                >
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${nivel}%`, backgroundColor: bColor }}
                    />
                </div>
            </div>

            {/* Footer */}
            <Link
                href={`/dashboard/almacen/${id}`}
                className="text-xs font-medium hover:underline flex items-center gap-1"
                style={{ color: '#3960A9' }}
            >
                Ver detalles →
            </Link>
        </div>
    )
}

/* ── Página principal ─────────────────────────────────────────── */
export default function PageInventarioResumen() {
    const [query, setQuery]   = useState('')
    const [view, setView]     = useState('kanban') // 'kanban' | 'lista'

    const filtered = useMemo(() =>
        MOCK_ALMACENES.filter(a =>
            a.nombre.toLowerCase().includes(query.toLowerCase()) ||
            a.codigo.toLowerCase().includes(query.toLowerCase())
        ),
    [query])

    return (
        <div className="p-6 flex flex-col gap-6 bg-[#E1E7F0] min-h-full">

            {/* Encabezado + controles */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold" style={{ color: '#1F2F57' }}>
                        Resumen de inventario
                    </h2>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(31,47,87,0.55)' }}>
                        Visualiza el estado de tus almacenes y sus principales indicadores.
                    </p>
                </div>

                {/* Controles */}
                <div className="flex items-center gap-2 flex-wrap">
                    {/* Buscador */}
                    <div
                        className="flex items-center gap-2 px-3 rounded-lg h-9 min-w-[200px]"
                        style={{ background: '#fff', border: '0.5px solid rgba(31,47,87,0.18)' }}
                    >
                        <Search size={14} color="rgba(31,47,87,0.4)" />
                        <input
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Buscar almacén..."
                            className="bg-transparent outline-none text-xs flex-1 placeholder:text-[rgba(31,47,87,0.35)]"
                            style={{ color: '#1F2F57' }}
                        />
                    </div>

                    {/* Toggle Kanban / Lista */}
                    <div
                        className="flex items-center rounded-lg overflow-hidden h-9"
                        style={{ border: '0.5px solid rgba(31,47,87,0.18)', background: '#fff' }}
                    >
                        {[
                            { key: 'kanban', Icon: LayoutGrid, label: 'Kanban' },
                            { key: 'lista',  Icon: List,       label: 'Lista'  },
                        ].map(({ key, Icon, label }) => (
                            <button
                                key={key}
                                onClick={() => setView(key)}
                                aria-label={label}
                                className="flex items-center gap-1.5 px-3 h-full text-xs font-medium transition-colors"
                                style={{
                                    background: view === key ? '#3960A9' : 'transparent',
                                    color:      view === key ? '#fff'    : 'rgba(31,47,87,0.6)',
                                }}
                            >
                                <Icon size={14} />
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Agrupar por */}
                    <button
                        className="flex items-center gap-2 px-3 h-9 rounded-lg text-xs font-medium transition-colors"
                        style={{
                            border: '0.5px solid rgba(31,47,87,0.18)',
                            background: '#fff',
                            color: '#1F2F57',
                        }}
                    >
                        <Warehouse size={14} color="#3960A9" />
                        <span>
                            Agrupar por{' '}
                            <strong style={{ color: '#1F2F57' }}>Almacenes</strong>
                        </span>
                        <ChevronDown size={13} color="rgba(31,47,87,0.5)" />
                    </button>
                </div>
            </div>

            {/* Grid de tarjetas */}
            {filtered.length === 0 ? (
                <div
                    className="flex flex-col items-center justify-center py-16 rounded-xl bg-white"
                    style={{ border: '0.5px solid rgba(31,47,87,0.12)' }}
                >
                    <Warehouse size={32} color="rgba(31,47,87,0.2)" />
                    <p className="text-sm mt-3" style={{ color: 'rgba(31,47,87,0.5)' }}>
                        No se encontraron almacenes para{' '}
                        <strong className="font-medium">&quot;{query}&quot;</strong>
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filtered.map(a => (
                        <AlmacenCard key={a.id} almacen={a} />
                    ))}
                </div>
            )}

        </div>
    )
}
