'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
    Search, SlidersHorizontal, LayoutGrid, List,
    Plus, Star, MoreVertical, ChevronDown
} from 'lucide-react'

/* ── Mock data ────────────────────────────────────────────────── */
const MOCK_PRODUCTOS = [
    { id:  1, nombre: 'Zapatilla Nike Air Max',      codigo: 'ZAP-001', precio: 295.00, stock: 120, stock_minimo: 10, unidad: 'Par',    imagen: null, variantes: 0 },
    { id:  2, nombre: 'Polo Algodón Blanco',          codigo: 'POL-002', precio:  53.00, stock: 250, stock_minimo: 20, unidad: 'Unidad', imagen: null, variantes: 0 },
    { id:  3, nombre: 'Jean Skinny Azul',             codigo: 'JEA-003', precio:  83.60, stock:   8, stock_minimo: 15, unidad: 'Unidad', imagen: null, variantes: 0 },
    { id:  4, nombre: 'Buzo Deportivo Adidas',        codigo: 'BUZ-004', precio:  50.00, stock: 500, stock_minimo: 30, unidad: 'Unidad', imagen: null, variantes: 0 },
    { id:  5, nombre: 'Camisa Oxford Slim Fit',       codigo: 'CAM-005', precio: 140.00, stock:  25, stock_minimo: 10, unidad: 'Unidad', imagen: null, variantes: 3 },
    { id:  6, nombre: 'Bermuda Cargo Hombre',         codigo: 'BER-006', precio: 100.00, stock:  60, stock_minimo:  8, unidad: 'Unidad', imagen: null, variantes: 0 },
    { id:  7, nombre: 'Blusa Floral Mujer',           codigo: 'BLU-007', precio: 110.00, stock:  12, stock_minimo: 15, unidad: 'Unidad', imagen: null, variantes: 0 },
    { id:  8, nombre: 'Zapatilla Running Reebok',     codigo: 'ZAP-008', precio:  12.00, stock: 200, stock_minimo: 20, unidad: 'Par',    imagen: null, variantes: 0 },
    { id:  9, nombre: 'Vestido Casual Manga Corta',   codigo: 'VES-009', precio:  33.00, stock:  45, stock_minimo: 10, unidad: 'Unidad', imagen: null, variantes: 2 },
    { id: 10, nombre: 'Chaqueta Cuero Sintético',     codigo: 'CHA-010', precio:  85.00, stock:  18, stock_minimo: 10, unidad: 'Unidad', imagen: null, variantes: 0 },
    { id: 11, nombre: 'Short Deportivo Nike',         codigo: 'SHO-011', precio: 147.00, stock:  22, stock_minimo:  8, unidad: 'Unidad', imagen: null, variantes: 0 },
    { id: 12, nombre: 'Cartera Cuero Mujer',          codigo: 'CAR-012', precio: 750.00, stock:  30, stock_minimo:  5, unidad: 'Unidad', imagen: null, variantes: 5 },
    { id: 13, nombre: 'Mochila Escolar 40L',          codigo: 'MOC-013', precio: 450.00, stock:   5, stock_minimo: 10, unidad: 'Unidad', imagen: null, variantes: 0 },
    { id: 14, nombre: 'Cinturón Cuero Negro',         codigo: 'CIN-014', precio:   5.10, stock: 300, stock_minimo: 20, unidad: 'Unidad', imagen: null, variantes: 0 },
    { id: 15, nombre: 'Gorra Trucker Bordada',        codigo: 'GOR-015', precio:   1.98, stock:   0, stock_minimo: 10, unidad: 'Unidad', imagen: null, variantes: 0 },
    { id: 16, nombre: 'Pañuelo Seda Estampado',       codigo: 'PAN-016', precio: 210.00, stock:  40, stock_minimo:  8, unidad: 'Unidad', imagen: null, variantes: 0 },
    { id: 17, nombre: 'Medias Algodón Pack x3',       codigo: 'MED-017', precio: 110.50, stock:  80, stock_minimo: 20, unidad: 'Pqt',   imagen: null, variantes: 0 },
    { id: 18, nombre: 'Sandalias Playa Mujer',        codigo: 'SAN-018', precio:  25.00, stock:  70, stock_minimo: 10, unidad: 'Par',    imagen: null, variantes: 0 },
    { id: 19, nombre: 'Pantalón Chino Slim',          codigo: 'PAN-019', precio: 195.00, stock:  35, stock_minimo:  8, unidad: 'Unidad', imagen: null, variantes: 0 },
    { id: 20, nombre: 'Suéter Lana Merino',           codigo: 'SWE-020', precio: 235.00, stock:  14, stock_minimo: 12, unidad: 'Unidad', imagen: null, variantes: 0 },
    { id: 21, nombre: 'Polo Manga Larga Rayas',       codigo: 'POL-021', precio:  48.00, stock: 180, stock_minimo: 25, unidad: 'Unidad', imagen: null, variantes: 0 },
    { id: 22, nombre: 'Falda Midi Plisada',           codigo: 'FAL-022', precio:  89.00, stock:  28, stock_minimo: 10, unidad: 'Unidad', imagen: null, variantes: 0 },
    { id: 23, nombre: 'Top Deportivo Mujer',          codigo: 'TOP-023', precio:  44.00, stock:  65, stock_minimo: 15, unidad: 'Unidad', imagen: null, variantes: 4 },
    { id: 24, nombre: 'Chaleco Puffer Hombre',        codigo: 'CHA-024', precio: 175.00, stock:  10, stock_minimo: 12, unidad: 'Unidad', imagen: null, variantes: 0 },
    { id: 25, nombre: 'Leggings Deportivos',          codigo: 'LEG-025', precio:  62.00, stock: 130, stock_minimo: 20, unidad: 'Unidad', imagen: null, variantes: 2 },
    { id: 26, nombre: 'Camiseta Oversize',            codigo: 'CAM-026', precio:  38.00, stock:   9, stock_minimo: 15, unidad: 'Unidad', imagen: null, variantes: 0 },
    { id: 27, nombre: 'Maletín Laptop 15"',           codigo: 'MAL-027', precio: 320.00, stock:  22, stock_minimo:  5, unidad: 'Unidad', imagen: null, variantes: 0 },
    { id: 28, nombre: 'Bufanda Invierno Lana',        codigo: 'BUF-028', precio:  55.00, stock:  48, stock_minimo: 10, unidad: 'Unidad', imagen: null, variantes: 0 },
    { id: 29, nombre: 'Guantes Cuero Forrado',        codigo: 'GUA-029', precio:  78.00, stock:   7, stock_minimo: 10, unidad: 'Par',    imagen: null, variantes: 0 },
    { id: 30, nombre: 'Zapatilla Casual Canvas',      codigo: 'ZAP-030', precio:  95.00, stock: 165, stock_minimo: 30, unidad: 'Par',    imagen: null, variantes: 3 },
    { id: 31, nombre: 'Polo Polo Ralph Piqué',        codigo: 'POL-031', precio: 210.00, stock:  55, stock_minimo: 10, unidad: 'Unidad', imagen: null, variantes: 0 },
    { id: 32, nombre: 'Joggers Algodón Premium',      codigo: 'JOG-032', precio:  88.00, stock:   0, stock_minimo: 15, unidad: 'Unidad', imagen: null, variantes: 0 },
    { id: 33, nombre: 'Jumpsuit Casual Mujer',        codigo: 'JUM-033', precio: 145.00, stock:  33, stock_minimo:  8, unidad: 'Unidad', imagen: null, variantes: 0 },
    { id: 34, nombre: 'Sombrero Fedora Paño',         codigo: 'SOM-034', precio:  67.00, stock:  20, stock_minimo:  5, unidad: 'Unidad', imagen: null, variantes: 0 },
    { id: 35, nombre: 'Vestido Noche Satín',          codigo: 'VES-035', precio: 285.00, stock:  16, stock_minimo:  8, unidad: 'Unidad', imagen: null, variantes: 0 },
    { id: 36, nombre: 'Blazer Hombre Classic',        codigo: 'BLA-036', precio: 399.00, stock:  42, stock_minimo: 10, unidad: 'Unidad', imagen: null, variantes: 2 },
    { id: 37, nombre: 'Calza Ciclista Mujer',         codigo: 'CAL-037', precio:  52.00, stock:  95, stock_minimo: 20, unidad: 'Unidad', imagen: null, variantes: 0 },
    { id: 38, nombre: 'Camisa Hawa Print',            codigo: 'CAM-038', precio:  72.00, stock:  11, stock_minimo: 12, unidad: 'Unidad', imagen: null, variantes: 0 },
    { id: 39, nombre: 'Pantalón Drill Trabajo',       codigo: 'PAN-039', precio: 110.00, stock: 220, stock_minimo: 40, unidad: 'Unidad', imagen: null, variantes: 0 },
    { id: 40, nombre: 'Chompa Tejida Alpaca',         codigo: 'CHO-040', precio: 185.00, stock:  29, stock_minimo:  8, unidad: 'Unidad', imagen: null, variantes: 0 },
    { id: 41, nombre: 'Calzoncillo Boxer Pack x3',    codigo: 'CAL-041', precio:  45.00, stock: 310, stock_minimo: 50, unidad: 'Pqt',   imagen: null, variantes: 0 },
    { id: 42, nombre: 'Sostén Push-Up Mujer',         codigo: 'SOS-042', precio:  58.00, stock:  17, stock_minimo: 20, unidad: 'Unidad', imagen: null, variantes: 0 },
    { id: 43, nombre: 'Traje Baño Completo',          codigo: 'TRA-043', precio:  98.00, stock:  44, stock_minimo: 10, unidad: 'Unidad', imagen: null, variantes: 3 },
    { id: 44, nombre: 'Polo Henley Botones',          codigo: 'POL-044', precio:  65.00, stock: 130, stock_minimo: 25, unidad: 'Unidad', imagen: null, variantes: 0 },
    { id: 45, nombre: 'Corbata Seda Estampada',       codigo: 'COR-045', precio:  90.00, stock:   6, stock_minimo: 10, unidad: 'Unidad', imagen: null, variantes: 0 },
    { id: 46, nombre: 'Zapatilla Fútbol Sala',        codigo: 'ZAP-046', precio: 155.00, stock:  75, stock_minimo: 15, unidad: 'Par',    imagen: null, variantes: 0 },
    { id: 47, nombre: 'Body Bebé Pack x5',            codigo: 'BOD-047', precio:  36.00, stock:   0, stock_minimo: 20, unidad: 'Pqt',   imagen: null, variantes: 0 },
]

const PAGE_SIZE = 24

const SORT_OPTIONS = [
    { key: 'nombre_az',   label: 'Nombre (A - Z)' },
    { key: 'nombre_za',   label: 'Nombre (Z - A)' },
    { key: 'precio_asc',  label: 'Precio (menor a mayor)' },
    { key: 'precio_desc', label: 'Precio (mayor a menor)' },
    { key: 'stock_asc',   label: 'Stock (menor a mayor)' },
]

/* ── Estado de stock ──────────────────────────────────────────── */
function stockStatus(p) {
    if (p.stock === 0)                           return { dot: '#C0392B', label: 'Sin stock',  badge: 'rgba(192,57,43,0.08)'  }
    if (p.stock <= p.stock_minimo)               return { dot: '#E8A020', label: 'Stock bajo', badge: 'rgba(232,160,32,0.10)' }
    return                                              { dot: '#1EB3B2', label: 'En stock',   badge: 'rgba(30,179,178,0.10)' }
}

/* ── Iniciales del producto ───────────────────────────────────── */
function Initials({ nombre }) {
    const letters = nombre.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('')
    const colors  = ['#3960A9', '#1EB3B2', '#E8A020', '#1F2F57', '#C0392B']
    const bg      = colors[nombre.charCodeAt(0) % colors.length]
    return (
        <div
            className="w-full h-full flex items-center justify-center text-white font-bold text-base rounded-lg"
            style={{ backgroundColor: bg }}
        >
            {letters}
        </div>
    )
}

/* ── Tarjeta de producto ──────────────────────────────────────── */
function ProductoCard({ producto, favorito, onToggleFav }) {
    const st = stockStatus(producto)

    return (
        <div
            className="bg-white rounded-xl overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition-shadow"
            style={{ border: '0.5px solid rgba(31,47,87,0.12)' }}
        >
            {/* Contenido superior */}
            <div className="flex items-start gap-3 p-3 pb-2">
                {/* Favorito */}
                <button
                    onClick={() => onToggleFav(producto.id)}
                    aria-label={favorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                    className="mt-0.5 shrink-0"
                >
                    <Star
                        size={15}
                        strokeWidth={1.5}
                        fill={favorito ? '#E8A020' : 'none'}
                        color={favorito ? '#E8A020' : 'rgba(31,47,87,0.3)'}
                    />
                </button>

                {/* Imagen / Iniciales */}
                <div className="w-[72px] h-[72px] shrink-0 rounded-lg overflow-hidden"
                    style={{ border: '0.5px solid rgba(31,47,87,0.08)' }}>
                    <Initials nombre={producto.nombre} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-tight line-clamp-2" style={{ color: '#1F2F57' }}>
                        {producto.nombre}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(31,47,87,0.45)' }}>
                        [{producto.codigo}]
                    </p>
                    {producto.variantes > 0 && (
                        <p className="text-xs mt-0.5" style={{ color: '#3960A9' }}>
                            [{producto.variantes} Variantes]
                        </p>
                    )}
                    <p className="text-sm font-semibold mt-1" style={{ color: '#1F2F57' }}>
                        S/ {producto.precio.toFixed(2).replace('.', ',')}
                    </p>
                </div>

                {/* Menú */}
                <button
                    aria-label="Más opciones"
                    className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors shrink-0"
                >
                    <MoreVertical size={14} color="rgba(31,47,87,0.45)" />
                </button>
            </div>

            {/* Footer de estado */}
            <div
                className="flex items-center justify-between px-3 py-2 mt-auto"
                style={{ borderTop: '0.5px solid rgba(31,47,87,0.08)', backgroundColor: st.badge }}
            >
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: st.dot }} />
                    <span className="text-xs font-medium" style={{ color: st.dot }}>
                        {st.label}
                    </span>
                </div>
                <span className="text-xs" style={{ color: 'rgba(31,47,87,0.5)' }}>
                    {producto.stock} {producto.unidad}s
                </span>
            </div>
        </div>
    )
}

/* ── Página ───────────────────────────────────────────────────── */
export default function ProductosPage() {
    const [query, setQuery]     = useState('')
    const [view, setView]       = useState('tarjetas')   // 'tarjetas' | 'lista'
    const [sort, setSort]       = useState('nombre_az')
    const [page, setPage]       = useState(1)
    const [favoritos, setFavoritos] = useState(new Set())
    const [showSort, setShowSort]   = useState(false)

    const toggleFav = id => setFavoritos(prev => {
        const next = new Set(prev)
        next.has(id) ? next.delete(id) : next.add(id)
        return next
    })

    const filtered = useMemo(() => {
        let list = MOCK_PRODUCTOS
        if (query.trim()) {
            const q = query.toLowerCase()
            list = list.filter(p =>
                p.nombre.toLowerCase().includes(q) ||
                p.codigo.toLowerCase().includes(q)
            )
        }
        return [...list].sort((a, b) => {
            switch (sort) {
                case 'nombre_za':   return b.nombre.localeCompare(a.nombre)
                case 'precio_asc':  return a.precio - b.precio
                case 'precio_desc': return b.precio - a.precio
                case 'stock_asc':   return a.stock  - b.stock
                default:            return a.nombre.localeCompare(b.nombre)
            }
        })
    }, [query, sort])

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    const start      = (page - 1) * PAGE_SIZE + 1
    const end        = Math.min(page * PAGE_SIZE, filtered.length)

    const sortLabel  = SORT_OPTIONS.find(o => o.key === sort)?.label ?? 'Nombre (A - Z)'

    return (
        <div className="p-6 flex flex-col gap-5 bg-[#E1E7F0] min-h-full">

            {/* ── Encabezado ─────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold" style={{ color: '#1F2F57' }}>Productos</h2>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(31,47,87,0.55)' }}>
                        Administra tu catálogo de productos. Visualiza, busca y gestiona la información de tu inventario.
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    {/* Buscador */}
                    <div
                        className="flex items-center gap-2 px-3 rounded-lg h-9 min-w-[210px]"
                        style={{ background: '#fff', border: '0.5px solid rgba(31,47,87,0.18)' }}
                    >
                        <Search size={14} color="rgba(31,47,87,0.4)" />
                        <input
                            value={query}
                            onChange={e => { setQuery(e.target.value); setPage(1) }}
                            placeholder="Buscar productos..."
                            className="bg-transparent outline-none text-xs flex-1 placeholder:text-[rgba(31,47,87,0.35)]"
                            style={{ color: '#1F2F57' }}
                        />
                    </div>

                    {/* Filtros */}
                    <button
                        className="flex items-center gap-1.5 px-3 h-9 rounded-lg text-xs font-medium"
                        style={{ background: '#fff', border: '0.5px solid rgba(31,47,87,0.18)', color: '#1F2F57' }}
                    >
                        <SlidersHorizontal size={14} color="#3960A9" />
                        Filtros
                        <ChevronDown size={13} color="rgba(31,47,87,0.5)" />
                    </button>

                    {/* Toggle Tarjetas / Lista */}
                    <div
                        className="flex items-center rounded-lg overflow-hidden h-9"
                        style={{ border: '0.5px solid rgba(31,47,87,0.18)', background: '#fff' }}
                    >
                        {[
                            { key: 'tarjetas', Icon: LayoutGrid, label: 'Tarjetas' },
                            { key: 'lista',    Icon: List,       label: 'Lista'    },
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

                    {/* Ingresar producto */}
                    <Link
                        href="/dashboard/inventario/productos/crear"
                        className="flex items-center gap-1.5 px-4 h-9 rounded-lg text-xs font-semibold text-white"
                        style={{ background: '#1F2F57' }}
                    >
                        <Plus size={15} />
                        Ingresar Inventario
                    </Link>
                </div>
            </div>

            {/* ── Contador + Ordenar ─────────────────────────────── */}
            <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: 'rgba(31,47,87,0.55)' }}>
                    {filtered.length === 0
                        ? '0 productos'
                        : `${start} - ${end} de ${filtered.length} producto${filtered.length !== 1 ? 's' : ''}`
                    }
                </span>

                {/* Ordenar por */}
                <div className="relative">
                    <button
                        onClick={() => setShowSort(v => !v)}
                        className="flex items-center gap-1.5 text-xs"
                        style={{ color: 'rgba(31,47,87,0.6)' }}
                    >
                        Ordenar por:&nbsp;
                        <strong style={{ color: '#1F2F57' }}>{sortLabel}</strong>
                        <ChevronDown size={13} color="rgba(31,47,87,0.5)" />
                    </button>
                    {showSort && (
                        <div
                            className="absolute right-0 top-7 z-20 flex flex-col rounded-xl overflow-hidden shadow-lg min-w-[200px]"
                            style={{ background: '#fff', border: '0.5px solid rgba(31,47,87,0.12)' }}
                        >
                            {SORT_OPTIONS.map(o => (
                                <button
                                    key={o.key}
                                    onClick={() => { setSort(o.key); setShowSort(false); setPage(1) }}
                                    className="px-4 py-2.5 text-xs text-left hover:bg-[rgba(31,47,87,0.04)] transition-colors"
                                    style={{
                                        color:      sort === o.key ? '#3960A9' : '#1F2F57',
                                        fontWeight: sort === o.key ? 600 : 400,
                                    }}
                                >
                                    {o.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Grid de productos ──────────────────────────────── */}
            {paginated.length === 0 ? (
                <div
                    className="flex flex-col items-center justify-center py-20 rounded-xl bg-white"
                    style={{ border: '0.5px solid rgba(31,47,87,0.12)' }}
                >
                    <p className="text-sm" style={{ color: 'rgba(31,47,87,0.5)' }}>
                        No se encontraron productos para{' '}
                        <strong className="text-[#1F2F57]">&quot;{query}&quot;</strong>
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {paginated.map(p => (
                        <ProductoCard
                            key={p.id}
                            producto={p}
                            favorito={favoritos.has(p.id)}
                            onToggleFav={toggleFav}
                        />
                    ))}
                </div>
            )}

            {/* ── Paginación ─────────────────────────────────────── */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 pt-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-white transition-colors disabled:opacity-40"
                        style={{ border: '0.5px solid rgba(31,47,87,0.18)', color: '#1F2F57' }}
                    >
                        ‹ Anterior
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(n => (
                        <button
                            key={n}
                            onClick={() => setPage(n)}
                            className="w-8 h-8 rounded-lg text-xs font-semibold transition-colors"
                            style={{
                                background: n === page ? '#3960A9' : 'transparent',
                                color:      n === page ? '#fff'    : '#1F2F57',
                                border:     n === page ? 'none'    : '0.5px solid rgba(31,47,87,0.18)',
                            }}
                        >
                            {n}
                        </button>
                    ))}
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-white transition-colors disabled:opacity-40"
                        style={{ border: '0.5px solid rgba(31,47,87,0.18)', color: '#1F2F57' }}
                    >
                        Siguiente ›
                    </button>
                </div>
            )}

        </div>
    )
}
