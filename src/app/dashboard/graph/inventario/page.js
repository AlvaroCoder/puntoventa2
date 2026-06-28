'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { useAuth } from '@/Context/AuthContext'
import { getProductosByEmpresa, getCategorias, deleteProducto } from '@/Connections/productos'
import { getTiendasByEmpresa } from '@/Connections/tiendas'
import { getMyEmpresa } from '@/Connections/empresa'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DrawerProducto from '@/components/Inventario/DrawerProducto'
import ModalImportarExcelInventario from '@/components/Inventario/ModalImportarExcelInventario'
import ModalCatalogoSemilla from '@/components/Inventario/ModalCatalogoSemilla'

import InventoryIcon from '@mui/icons-material/Inventory'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import AddIcon from '@mui/icons-material/Add'
import TableRowsIcon from '@mui/icons-material/TableRows'
import BarChartIcon from '@mui/icons-material/BarChart'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CategoryIcon from '@mui/icons-material/Category'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import StoreIcon from '@mui/icons-material/Store'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import SyncAltIcon from '@mui/icons-material/SyncAlt'
import { ChevronDown } from 'lucide-react'

const STOCK_FILTERS = [
    { key: 'todos',  label: 'Todos' },
    { key: 'normal', label: 'Stock normal' },
    { key: 'bajo',   label: 'Stock bajo' },
    { key: 'sin',    label: 'Sin stock' },
]

const PAGE_SIZE_OPTIONS = [10, 25, 50]

function StockBadge({ stock, minimo }) {
    if (stock === 0 || stock == null)
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">Sin stock</span>
    if (stock <= minimo)
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">{stock}</span>
    return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">{stock}</span>
}

function SkeletonRow({ cols }) {
    return (
        <tr className="border-b border-gray-50">
            {[...Array(cols)].map((_, i) => (
                <td key={i} className="px-4 py-3">
                    <div className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${55 + (i * 11) % 40}%` }} />
                </td>
            ))}
        </tr>
    )
}

function SortIcon({ active, dir }) {
    if (!active) return null
    return dir === 'asc'
        ? <ArrowUpwardIcon style={{ fontSize: 13 }} className="ml-1 text-[#FF821E]" />
        : <ArrowDownwardIcon style={{ fontSize: 13 }} className="ml-1 text-[#FF821E]" />
}

export default function PageInventarioGraph() {
    const { user } = useAuth()
    const router = useRouter()

    // ── Data ──
    const [productos, setProductos]     = useState([])
    const [tiendas, setTiendas]         = useState([])
    const [categorias, setCategorias]   = useState([])
    const [empresa, setEmpresa]         = useState(null)
    const [loading, setLoading]         = useState(true)

    // ── UI ──
    const [vista, setVista]             = useState('operativa')
    const [tiendaFiltro, setTiendaFiltro] = useState('todas')
    const [catFiltro, setCatFiltro]     = useState('todas')
    const [query, setQuery]             = useState('')
    const [stockFiltro, setStockFiltro] = useState('todos')
    const [sortCol, setSortCol]         = useState('nombre')
    const [sortDir, setSortDir]         = useState('asc')
    const [page, setPage]               = useState(1)
    const [pageSize, setPageSize]       = useState(10)

    // ── Modals ──
    const [showDrawer, setShowDrawer]   = useState(false)
    const [productoEdit, setProductoEdit] = useState(null)
    const [showImport, setShowImport]   = useState(false)
    const [showSemilla, setShowSemilla] = useState(false)

    // ── Fetch ──
    useEffect(() => {
        if (!user?.empresa_id) return
        async function loadAll() {
            setLoading(true)
            try {
                const [prodRes, tiendasRes, catsRes, empresaRes] = await Promise.all([
                    getProductosByEmpresa(user.empresa_id),
                    getTiendasByEmpresa(user.empresa_id),
                    getCategorias(),
                    getMyEmpresa(),
                ])
                setProductos(prodRes?.data?.data   ?? prodRes?.data   ?? [])
                setTiendas(tiendasRes?.data?.data   ?? tiendasRes?.data ?? [])
                setCategorias(catsRes?.data?.data   ?? catsRes?.data   ?? [])
                setEmpresa(empresaRes?.data ?? null)
            } catch {
                toast.error('Error al cargar el inventario')
            } finally {
                setLoading(false)
            }
        }
        loadAll()
    }, [user])

    // ── KPIs ──
    const kpis = useMemo(() => {
        const total    = productos.length
        const bajStock = productos.filter(p => {
            const inv = p.inventario ?? []
            return inv.some(i => i.stock_disponible > 0 && i.stock_disponible <= (i.stock_minimo ?? 0))
        }).length
        const sinStock = productos.filter(p => {
            const inv = p.inventario ?? []
            return inv.length === 0 || inv.every(i => !i.stock_disponible || i.stock_disponible === 0)
        }).length
        return { total, bajStock, sinStock, entradas: 0 }
    }, [productos])

    // ── Filter + Sort ──
    const filtered = useMemo(() => {
        let list = [...productos]

        if (tiendaFiltro !== 'todas')
            list = list.filter(p => (p.inventario ?? []).some(i => String(i.tienda_id) === String(tiendaFiltro)))
        if (catFiltro !== 'todas')
            list = list.filter(p => String(p.categoria_id) === String(catFiltro))
        if (query.trim()) {
            const q = query.toLowerCase()
            list = list.filter(p =>
                (p.nombre ?? '').toLowerCase().includes(q) ||
                (p.codigo ?? '').toLowerCase().includes(q) ||
                (p.codigo_barras ?? '').toLowerCase().includes(q)
            )
        }
        if (stockFiltro !== 'todos') {
            list = list.filter(p => {
                const inv = p.inventario ?? []
                if (stockFiltro === 'sin')    return inv.every(i => !i.stock_disponible || i.stock_disponible === 0)
                if (stockFiltro === 'bajo')   return inv.some(i => i.stock_disponible > 0 && i.stock_disponible <= (i.stock_minimo ?? 0))
                if (stockFiltro === 'normal') return inv.every(i => (i.stock_disponible ?? 0) > (i.stock_minimo ?? 0))
                return true
            })
        }
        list.sort((a, b) => {
            let va = a[sortCol] ?? '', vb = b[sortCol] ?? ''
            if (typeof va === 'string') va = va.toLowerCase()
            if (typeof vb === 'string') vb = vb.toLowerCase()
            return sortDir === 'asc' ? (va < vb ? -1 : va > vb ? 1 : 0) : (va > vb ? -1 : va < vb ? 1 : 0)
        })
        return list
    }, [productos, tiendaFiltro, catFiltro, query, stockFiltro, sortCol, sortDir])

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
    const paginated  = filtered.slice((page - 1) * pageSize, page * pageSize)
    const colCount   = 4 + Math.min(tiendas.length, 2) + 3

    const handleSort = col => {
        if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        else { setSortCol(col); setSortDir('asc') }
        setPage(1)
    }

    const handleDelete = async id => {
        if (!confirm('¿Desactivar este producto?')) return
        const res = await deleteProducto(id)
        if (res.ok) {
            setProductos(prev => prev.filter(p => p.id !== id))
            toast.success('Producto desactivado')
        } else {
            toast.error(res.message || 'Error al desactivar')
        }
    }

    const handleEdit = producto => { setProductoEdit(producto); setShowDrawer(true) }

    const handleAddSuccess = nuevo => {
        setProductos(prev => [nuevo, ...prev])
        setShowDrawer(false)
        setProductoEdit(null)
    }

    const handleUpdateSuccess = actualizado => {
        setProductos(prev => prev.map(p => p.id === actualizado.id ? actualizado : p))
        setShowDrawer(false)
        setProductoEdit(null)
    }

    return (
        <div className="w-full">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div>
                    <h1 className="font-bold text-[#1F4363] text-2xl">Inventario</h1>
                    <p className="text-sm text-gray-400">Gestión de productos y stock por tienda</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1">
                        <button
                            onClick={() => setVista('operativa')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${vista === 'operativa' ? 'bg-white text-[#1F4363] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <TableRowsIcon style={{ fontSize: 16 }} />
                            Operativa
                        </button>
                        <button
                            onClick={() => setVista('gerencial')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${vista === 'gerencial' ? 'bg-white text-[#1F4363] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <BarChartIcon style={{ fontSize: 16 }} />
                            Gerencial
                        </button>
                    </div>
                    <Button
                        onClick={() => { setProductoEdit(null); setShowDrawer(true) }}
                        className="flex items-center gap-2 bg-[#FF821E] hover:bg-[#FF821E]/90 text-white font-bold shadow-sm"
                    >
                        <AddIcon style={{ fontSize: 18 }} />
                        Nuevo Producto
                    </Button>
                </div>
            </div>

            <AnimatePresence mode="wait">

                {/* ── Vista Gerencial ── */}
                {vista === 'gerencial' && (
                    <motion.div
                        key="gerencial"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center justify-center py-28 text-center"
                    >
                        <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                            <BarChartIcon style={{ fontSize: 44, color: '#D1D5DB' }} />
                        </div>
                        <h2 className="text-[#1F4363] font-bold text-lg">Vista Gerencial</h2>
                        <p className="text-gray-400 text-sm mt-1 max-w-xs leading-relaxed">
                            Los gráficos de inventario, rotación de stock y KPIs gerenciales estarán disponibles próximamente.
                        </p>
                    </motion.div>
                )}

                {/* ── Vista Operativa ── */}
                {vista === 'operativa' && (
                    <motion.div
                        key="operativa"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-4"
                    >
                        {/* Banner sin tiendas */}
                        {!loading && tiendas.length === 0 && (
                            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                                <WarningAmberIcon style={{ fontSize: 20, color: '#D97706' }} />
                                <p className="text-sm text-amber-800 flex-1">
                                    No tienes tiendas registradas. El stock no podrá asignarse.
                                </p>
                                <Link href="/dashboard/bd/tiendas">
                                    <span className="text-xs font-semibold text-amber-700 hover:underline whitespace-nowrap">Crear tienda →</span>
                                </Link>
                            </div>
                        )}

                        {/* ── KPIs ── */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            {[
                                { label: 'Total productos',     value: kpis.total,    Icon: InventoryIcon,     color: '#1F4363', bg: '#1F436315' },
                                { label: 'Stock bajo',          value: kpis.bajStock,  Icon: WarningAmberIcon,  color: '#D97706', bg: '#FEF3C715' },
                                { label: 'Sin stock',           value: kpis.sinStock,  Icon: ReportProblemIcon, color: '#DC2626', bg: '#FEE2E215' },
                                { label: 'Entradas pendientes', value: kpis.entradas,  Icon: LocalShippingIcon, color: '#198E7B', bg: '#198E7B15', href: '/dashboard/bd/logistica' },
                            ].map(({ label, value, Icon, color, bg, href }) => (
                                <motion.div
                                    key={label}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={href ? { y: -2 } : {}}
                                    className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-4 ${href ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
                                    onClick={href ? () => router.push(href) : undefined}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
                                            <Icon style={{ fontSize: 20, color }} />
                                        </div>
                                        {href && <span className="text-xs font-semibold" style={{ color }}>Ver →</span>}
                                    </div>
                                    <p className="text-2xl font-extrabold mt-2" style={{ color }}>{loading ? '—' : value}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* ── Filtros ── */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3 flex-wrap items-start sm:items-center">
                            <div className="relative shrink-0">
                                <StoreIcon style={{ fontSize: 15, color: '#8D99AE' }} className="absolute left-2.5 top-2.5 pointer-events-none" />
                                <select
                                    value={tiendaFiltro}
                                    onChange={e => { setTiendaFiltro(e.target.value); setPage(1) }}
                                    className="pl-8 pr-7 py-2 rounded-lg border border-gray-200 bg-white text-sm text-[#1F4363] appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF821E]/30 focus:border-[#FF821E] min-w-[155px]"
                                >
                                    <option value="todas">Todas las tiendas</option>
                                    {tiendas.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                                </select>
                                <ChevronDown size={13} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
                            </div>

                            <div className="relative shrink-0">
                                <CategoryIcon style={{ fontSize: 15, color: '#8D99AE' }} className="absolute left-2.5 top-2.5 pointer-events-none" />
                                <select
                                    value={catFiltro}
                                    onChange={e => { setCatFiltro(e.target.value); setPage(1) }}
                                    className="pl-8 pr-7 py-2 rounded-lg border border-gray-200 bg-white text-sm text-[#1F4363] appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF821E]/30 focus:border-[#FF821E] min-w-[155px]"
                                >
                                    <option value="todas">Todas las categorías</option>
                                    {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                </select>
                                <ChevronDown size={13} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
                            </div>

                            <div className="relative flex-1 min-w-[180px]">
                                <SearchIcon style={{ fontSize: 16, color: '#8D99AE' }} className="absolute left-2.5 top-2.5 pointer-events-none" />
                                <Input
                                    placeholder="Buscar por nombre, código..."
                                    value={query}
                                    onChange={e => { setQuery(e.target.value); setPage(1) }}
                                    className="pl-8 focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                                />
                            </div>

                            <div className="flex items-center gap-1 flex-wrap">
                                {STOCK_FILTERS.map(f => (
                                    <button
                                        key={f.key}
                                        onClick={() => { setStockFiltro(f.key); setPage(1) }}
                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${stockFiltro === f.key ? 'bg-[#FF821E] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ── Acciones de carga ── */}
                        <div className="flex gap-2 flex-wrap">
                            <Button
                                variant="outline"
                                onClick={() => setShowImport(true)}
                                className="flex items-center gap-2 border-[#1F4363] text-[#1F4363] hover:bg-[#1F4363] hover:text-white transition-colors text-xs"
                            >
                                <FileDownloadIcon style={{ fontSize: 17 }} />
                                Importar Excel
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setShowSemilla(true)}
                                className="flex items-center gap-2 border-[#198E7B] text-[#198E7B] hover:bg-[#198E7B] hover:text-white transition-colors text-xs"
                            >
                                <AutoAwesomeIcon style={{ fontSize: 17 }} />
                                Catálogo Semilla
                            </Button>
                            <Link href="/dashboard/bd/logistica">
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2 border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors text-xs"
                                >
                                    <SyncAltIcon style={{ fontSize: 17 }} />
                                    Desde Entrada de Mercancía
                                </Button>
                            </Link>
                        </div>

                        {/* ── Tabla ── */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 bg-gray-50/60">
                                            <th className="px-4 py-3 w-12" />
                                            {[
                                                { key: 'codigo',      label: 'Código' },
                                                { key: 'nombre',      label: 'Nombre' },
                                                { key: 'categoria_id', label: 'Categoría' },
                                            ].map(col => (
                                                <th
                                                    key={col.key}
                                                    onClick={() => handleSort(col.key)}
                                                    className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-[#1F4363] transition-colors"
                                                >
                                                    <span className="flex items-center">
                                                        {col.label}
                                                        <SortIcon active={sortCol === col.key} dir={sortDir} />
                                                    </span>
                                                </th>
                                            ))}
                                            {tiendas.slice(0, 2).map(t => (
                                                <th key={t.id} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider max-w-[120px] truncate">
                                                    {t.nombre}
                                                </th>
                                            ))}
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                Mín.
                                            </th>
                                            <th
                                                onClick={() => handleSort('precio_venta')}
                                                className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-[#1F4363] transition-colors"
                                            >
                                                <span className="flex items-center">
                                                    Precio
                                                    <SortIcon active={sortCol === 'precio_venta'} dir={sortDir} />
                                                </span>
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {loading ? (
                                            [...Array(6)].map((_, i) => <SkeletonRow key={i} cols={colCount} />)
                                        ) : paginated.length === 0 ? (
                                            <tr>
                                                <td colSpan={colCount} className="py-20 text-center">
                                                    <InventoryIcon style={{ fontSize: 44, color: '#E5E7EB' }} />
                                                    <p className="text-gray-400 text-sm mt-2 font-medium">No se encontraron productos</p>
                                                    <p className="text-gray-300 text-xs mt-1">Ajusta los filtros o crea un nuevo producto</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            paginated.map(producto => {
                                                const inv = producto.inventario ?? []
                                                const catNombre = categorias.find(c => c.id === producto.categoria_id)?.nombre ?? '—'
                                                return (
                                                    <tr key={producto.id} className="hover:bg-gray-50/60 transition-colors group">
                                                        <td className="px-4 py-3">
                                                            {producto.imagen_url ? (
                                                                <img
                                                                    src={producto.imagen_url}
                                                                    alt={producto.nombre}
                                                                    className="w-10 h-10 rounded-xl object-cover border border-gray-100"
                                                                />
                                                            ) : (
                                                                <div className="w-10 h-10 rounded-xl bg-[#1F4363]/10 flex items-center justify-center text-[#1F4363] font-bold text-sm shrink-0">
                                                                    {(producto.nombre ?? 'P')[0].toUpperCase()}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-xs text-gray-500 font-mono">{producto.codigo ?? '—'}</td>
                                                        <td className="px-4 py-3">
                                                            <p className="font-semibold text-[#1F4363] truncate max-w-[200px]">{producto.nombre}</p>
                                                            {producto.codigo_barras && (
                                                                <p className="text-xs text-gray-400">{producto.codigo_barras}</p>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-xs text-gray-500">{catNombre}</td>
                                                        {tiendas.slice(0, 2).map(t => {
                                                            const stockT = inv.find(i => String(i.tienda_id) === String(t.id))
                                                            return (
                                                                <td key={t.id} className="px-4 py-3">
                                                                    <StockBadge
                                                                        stock={stockT?.stock_disponible}
                                                                        minimo={stockT?.stock_minimo ?? 0}
                                                                    />
                                                                </td>
                                                            )
                                                        })}
                                                        <td className="px-4 py-3 text-xs text-gray-500">{inv[0]?.stock_minimo ?? '—'}</td>
                                                        <td className="px-4 py-3 text-sm font-semibold text-[#1F4363]">
                                                            S/ {parseFloat(producto.precio_venta ?? 0).toFixed(2)}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center justify-end gap-1">
                                                                <button
                                                                    onClick={() => handleEdit(producto)}
                                                                    title="Editar"
                                                                    className="w-8 h-8 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 hover:bg-[#1F4363]/10 text-[#1F4363] transition-all"
                                                                >
                                                                    <EditIcon style={{ fontSize: 17 }} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(producto.id)}
                                                                    title="Desactivar"
                                                                    className="w-8 h-8 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-red-400 transition-all"
                                                                >
                                                                    <DeleteIcon style={{ fontSize: 17 }} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* ── Paginación ── */}
                            {!loading && filtered.length > 0 && (
                                <div className="px-4 py-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        Mostrar
                                        <select
                                            value={pageSize}
                                            onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}
                                            className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#FF821E]/30"
                                        >
                                            {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
                                        </select>
                                        por página · <span className="font-medium text-[#1F4363]">{filtered.length}</span> resultados
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                        >
                                            ‹ Anterior
                                        </button>
                                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                            const p = i + 1
                                            return (
                                                <button
                                                    key={p}
                                                    onClick={() => setPage(p)}
                                                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${p === page ? 'bg-[#FF821E] text-white shadow-sm' : 'hover:bg-gray-100 text-gray-600'}`}
                                                >
                                                    {p}
                                                </button>
                                            )
                                        })}
                                        <button
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                            className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Siguiente ›
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Drawer / Modals ── */}
            <DrawerProducto
                open={showDrawer}
                onClose={() => { setShowDrawer(false); setProductoEdit(null) }}
                productoData={productoEdit}
                tiendas={tiendas}
                categorias={categorias}
                empresaId={user?.empresa_id}
                onAddSuccess={handleAddSuccess}
                onUpdateSuccess={handleUpdateSuccess}
            />

            <ModalImportarExcelInventario
                open={showImport}
                onClose={() => setShowImport(false)}
            />

            <ModalCatalogoSemilla
                open={showSemilla}
                onClose={() => setShowSemilla(false)}
                empresa={empresa}
                onImportSuccess={newProds => {
                    setProductos(prev => [...newProds, ...prev])
                    setShowSemilla(false)
                    toast.success(`${newProds.length} productos importados del catálogo`)
                }}
            />
        </div>
    )
}