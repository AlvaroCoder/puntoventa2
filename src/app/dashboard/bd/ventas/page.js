'use client'
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { Search } from 'lucide-react'
import { useAuth } from '@/Context/AuthContext'
import { getTiendasByEmpresa } from '@/Connections/tiendas'
import { getClientesByEmpresa } from '@/Connections/clientes'
import { getInventarioByTienda } from '@/Connections/productos'
import {
    getVentasByTienda,
    createVenta,
    getDetallesByVenta,
} from '@/Connections/ventas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import TablaVentas from '@/components/Tables/TablaVentas'
import AddIcon from '@mui/icons-material/Add'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import StorefrontIcon from '@mui/icons-material/Storefront'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

// ─── Helpers ─────────────────────────────────────────────────

const fmt = v =>
    new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(v ?? 0)

const fmtDate = d =>
    d
        ? new Date(d).toLocaleString('es-PE', {
              day: '2-digit', month: 'short', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
          })
        : '—'

const extractList = res =>
    res?.data?.data?.data ?? res?.data?.data ?? res?.data ?? []

// ─── Dialog: Detalle de Venta ─────────────────────────────────

function DialogDetalleVenta({ open, onClose, venta }) {
    const [detalles, setDetalles] = useState([])
    const [loading, setLoading]   = useState(false)

    useEffect(() => {
        if (!open || !venta?.id) return
        setLoading(true)
        getDetallesByVenta(venta.id)
            .then(res => setDetalles(extractList(res)))
            .catch(() => toast.error('Error al cargar el detalle'))
            .finally(() => setLoading(false))
    }, [open, venta?.id])

    const total = venta?.total ?? venta?.montoTotal ?? venta?.totalVenta ?? 0
    const cliente = venta?.cliente?.nombre ?? venta?.clienteNombre ?? venta?.nombreCliente ?? '—'
    const tipoPago = (venta?.tipoPago ?? venta?.tipo_pago ?? '').toUpperCase()

    return (
        <Dialog open={open} onOpenChange={v => !v && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Detalle de Venta #{venta?.id}</DialogTitle>
                </DialogHeader>

                {/* Resumen */}
                <div className="bg-gray-50 rounded-xl px-4 py-3 grid grid-cols-3 gap-3 text-sm">
                    <div>
                        <p className="text-xs text-gray-400 font-semibold mb-0.5">Cliente</p>
                        <p className="font-semibold text-[#1F4363] truncate">{cliente}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-semibold mb-0.5">Tipo Pago</p>
                        <p className="font-semibold text-[#1F4363]">
                            {tipoPago === 'CREDITO' || tipoPago === 'CRÉDITO' ? 'Crédito' : 'Contado'}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-semibold mb-0.5">Total</p>
                        <p className="font-bold text-[#FF821E]">{fmt(total)}</p>
                    </div>
                </div>

                {/* Líneas de detalle */}
                <div className="max-h-72 overflow-y-auto">
                    {loading ? (
                        <div className="space-y-2 py-2">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : detalles.length === 0 ? (
                        <p className="text-center text-gray-300 text-sm py-6">Sin líneas de detalle</p>
                    ) : (
                        <table className="w-full text-sm mt-1">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    {['Producto', 'Cant.', 'P. Unit.', 'Subtotal'].map(h => (
                                        <th key={h} className="px-2 py-2 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {detalles.map((d, i) => (
                                    <tr key={d.id ?? i}>
                                        <td className="px-2 py-2.5 font-medium text-[#1F4363] truncate max-w-[160px]">
                                            {d.producto?.nombre ?? d.nombreProducto ?? d.productoNombre ?? `Producto #${d.productoId}`}
                                        </td>
                                        <td className="px-2 py-2.5 text-gray-600">
                                            {d.cantidad}
                                        </td>
                                        <td className="px-2 py-2.5 text-gray-600">
                                            {fmt(d.precioUnitario ?? d.precio_unitario)}
                                        </td>
                                        <td className="px-2 py-2.5 font-semibold text-[#1F4363]">
                                            {fmt(d.subtotal ?? (d.cantidad * (d.precioUnitario ?? d.precio_unitario)))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cerrar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// ─── Dialog: Nueva Venta ──────────────────────────────────────

const ITEM_EMPTY = { productoId: '', cantidad: 1, precioUnitario: '' }
const TIPO_PAGO_OPTIONS = [
    { key: 'CONTADO',  label: 'Contado'  },
    { key: 'CREDITO',  label: 'Crédito'  },
]

function DialogNuevaVenta({ open, onClose, tiendaId, empresaId, onSuccess }) {
    const [clientes,   setClientes]   = useState([])
    const [inventario, setInventario] = useState([])
    const [loadingData, setLoadingData] = useState(false)

    const [clienteId, setClienteId] = useState('')
    const [tipoPago,  setTipoPago]  = useState('CONTADO')
    const [items, setItems] = useState([{ ...ITEM_EMPTY }])
    const [saving, setSaving] = useState(false)

    // Cargar clientes e inventario al abrir
    useEffect(() => {
        if (!open || !empresaId || !tiendaId) return
        setLoadingData(true)
        Promise.all([
            getClientesByEmpresa(empresaId),
            getInventarioByTienda(tiendaId),
        ])
            .then(([resClientes, resInventario]) => {
                setClientes(extractList(resClientes))
                setInventario(extractList(resInventario))
            })
            .catch(() => toast.error('Error al cargar datos'))
            .finally(() => setLoadingData(false))
    }, [open, empresaId, tiendaId])

    // Reset al cerrar
    useEffect(() => {
        if (!open) {
            setClienteId('')
            setTipoPago('CONTADO')
            setItems([{ ...ITEM_EMPTY }])
        }
    }, [open])

    const addItem = () => setItems(p => [...p, { ...ITEM_EMPTY }])

    const updateItem = (idx, field, value) =>
        setItems(p => p.map((it, i) => i === idx ? { ...it, [field]: value } : it))

    const removeItem = idx =>
        setItems(p => p.filter((_, i) => i !== idx))

    // Al seleccionar producto, auto-completar precio desde inventario
    const handleProductoChange = (idx, productoId) => {
        const inv = inventario.find(i => String(i.productoId ?? i.id) === String(productoId))
        const precio = inv?.producto?.precio ?? inv?.precio ?? inv?.precioUnitario ?? ''
        updateItem(idx, 'productoId', productoId)
        if (precio) updateItem(idx, 'precioUnitario', precio)
    }

    const total = useMemo(() =>
        items.reduce((sum, it) => {
            const qty   = parseFloat(it.cantidad)    || 0
            const price = parseFloat(it.precioUnitario) || 0
            return sum + qty * price
        }, 0)
    , [items])

    const handleGuardar = async () => {
        const validItems = items.filter(it => it.productoId && it.cantidad > 0 && it.precioUnitario > 0)
        if (!validItems.length) return toast.error('Agrega al menos un producto válido')

        setSaving(true)
        try {
            const body = {
                tiendaId,
                ...(clienteId ? { clienteId } : {}),
                tipoPago,
                detalles: validItems.map(it => ({
                    productoId:     parseInt(it.productoId),
                    cantidad:       parseFloat(it.cantidad),
                    precioUnitario: parseFloat(it.precioUnitario),
                })),
            }
            const res = await createVenta(body)
            if (res.ok) {
                toast.success('Venta registrada correctamente')
                onSuccess()
                onClose()
            } else {
                toast.error(res.message || 'Error al registrar la venta')
            }
        } finally {
            setSaving(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={v => !v && onClose()}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Nueva Venta</DialogTitle>
                </DialogHeader>

                {loadingData ? (
                    <div className="space-y-3 py-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4 py-1">
                        {/* Cliente */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1 block">
                                Cliente <span className="font-normal text-gray-400">(opcional)</span>
                            </label>
                            <select
                                value={clienteId}
                                onChange={e => setClienteId(e.target.value)}
                                className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm text-[#1F4363] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF821E]/30 focus:border-[#FF821E]"
                            >
                                <option value="">— Sin cliente —</option>
                                {clientes.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.nombre} {c.documento ? `(${c.documento})` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Tipo de pago */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Tipo de pago</label>
                            <div className="flex gap-2">
                                {TIPO_PAGO_OPTIONS.map(({ key, label }) => (
                                    <button
                                        key={key}
                                        onClick={() => setTipoPago(key)}
                                        className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all border-2 ${
                                            tipoPago === key
                                                ? key === 'CONTADO'
                                                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                                                    : 'bg-amber-50 border-amber-400 text-amber-700'
                                                : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-gray-300'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Productos */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Productos *</label>
                            <div className="space-y-2">
                                {items.map((item, idx) => (
                                    <div key={idx} className="flex gap-2 items-start">
                                        {/* Selector de producto */}
                                        <select
                                            value={item.productoId}
                                            onChange={e => handleProductoChange(idx, e.target.value)}
                                            className="flex-1 h-9 px-2 rounded-lg border border-gray-200 text-sm text-[#1F4363] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF821E]/30 focus:border-[#FF821E]"
                                        >
                                            <option value="">— Producto —</option>
                                            {inventario.map(inv => {
                                                const prod = inv.producto ?? inv
                                                const id   = inv.productoId ?? prod.id
                                                return (
                                                    <option key={id} value={id}>
                                                        {prod.nombre ?? `#${id}`}
                                                    </option>
                                                )
                                            })}
                                        </select>

                                        {/* Cantidad */}
                                        <Input
                                            type="number"
                                            min="1"
                                            step="1"
                                            value={item.cantidad}
                                            onChange={e => updateItem(idx, 'cantidad', e.target.value)}
                                            placeholder="Cant."
                                            className="w-20 h-9 text-sm focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                                        />

                                        {/* Precio unitario */}
                                        <Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={item.precioUnitario}
                                            onChange={e => updateItem(idx, 'precioUnitario', e.target.value)}
                                            placeholder="Precio"
                                            className="w-28 h-9 text-sm focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                                        />

                                        {/* Subtotal */}
                                        <div className="w-24 h-9 flex items-center justify-end text-sm font-semibold text-[#1F4363] shrink-0">
                                            {fmt((parseFloat(item.cantidad) || 0) * (parseFloat(item.precioUnitario) || 0))}
                                        </div>

                                        {/* Eliminar fila */}
                                        <button
                                            onClick={() => removeItem(idx)}
                                            disabled={items.length === 1}
                                            className="w-9 h-9 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 disabled:opacity-20 shrink-0 transition-all"
                                        >
                                            <DeleteOutlineIcon style={{ fontSize: 18 }} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={addItem}
                                className="mt-2 text-xs text-[#FF821E] font-semibold hover:underline flex items-center gap-1"
                            >
                                <AddIcon style={{ fontSize: 15 }} /> Agregar producto
                            </button>
                        </div>

                        {/* Total */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <span className="text-sm font-semibold text-gray-500">Total</span>
                            <span className="text-xl font-bold text-[#1F4363]">{fmt(total)}</span>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={saving}>Cancelar</Button>
                    <Button
                        onClick={handleGuardar}
                        disabled={saving || loadingData}
                        className="bg-[#FF821E] hover:bg-[#FF821E]/90 text-white font-bold"
                    >
                        {saving ? 'Registrando...' : 'Registrar Venta'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// ─── Stat Card ────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, color = '#1F4363' }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}15` }}>
                {icon}
            </div>
            <div>
                <p className="text-xs text-gray-400 font-semibold">{label}</p>
                <p className="font-bold text-[#1F4363] text-xl mt-0.5">{value}</p>
                {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
            </div>
        </div>
    )
}

// ─── Page ─────────────────────────────────────────────────────

export default function PageVentas() {
    const { user } = useAuth()

    const [tiendas,  setTiendas]  = useState([])
    const [tiendaId, setTiendaId] = useState('')
    const [ventas,   setVentas]   = useState([])
    const [query,    setQuery]    = useState('')

    const [loadingTiendas, setLoadingTiendas] = useState(true)
    const [loadingVentas,  setLoadingVentas]  = useState(false)

    const [ventaDetalle, setVentaDetalle] = useState(null)
    const [dlgDetalle,   setDlgDetalle]   = useState(false)
    const [dlgNueva,     setDlgNueva]     = useState(false)

    // Cargar tiendas
    useEffect(() => {
        if (!user?.empresa_id) return
        async function load() {
            try {
                const res = await getTiendasByEmpresa(user.empresa_id)
                const list = extractList(res)
                setTiendas(list)
                if (list.length === 1) setTiendaId(String(list[0].id))
            } catch {
                toast.error('Error al cargar las tiendas')
            } finally {
                setLoadingTiendas(false)
            }
        }
        load()
    }, [user])

    // Cargar ventas cuando cambia tienda
    const loadVentas = useCallback(async () => {
        if (!tiendaId) return
        setLoadingVentas(true)
        setVentas([])
        try {
            const res = await getVentasByTienda(tiendaId)
            setVentas(extractList(res))
        } catch {
            toast.error('Error al cargar las ventas')
        } finally {
            setLoadingVentas(false)
        }
    }, [tiendaId])

    useEffect(() => { loadVentas() }, [loadVentas])

    // Filtrado local por cliente
    const filtered = useMemo(() => {
        if (!query.trim()) return ventas
        const q = query.toLowerCase()
        return ventas.filter(v => {
            const nombre = (v.cliente?.nombre ?? v.clienteNombre ?? v.nombreCliente ?? '').toLowerCase()
            return nombre.includes(q) || String(v.id).includes(q)
        })
    }, [ventas, query])

    // Stats computadas
    const stats = useMemo(() => {
        const count = ventas.length
        const total = ventas.reduce((s, v) => s + (v.total ?? v.montoTotal ?? v.totalVenta ?? 0), 0)
        const credito = ventas.filter(v => {
            const t = (v.tipoPago ?? v.tipo_pago ?? '').toUpperCase()
            return t === 'CREDITO' || t === 'CRÉDITO'
        }).length
        return { count, total, credito, contado: count - credito }
    }, [ventas])

    const handleVerDetalle = venta => {
        setVentaDetalle(venta)
        setDlgDetalle(true)
    }

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="font-bold text-[#1F4363] text-2xl">Ventas</h1>
                    <p className="text-sm text-gray-400">Historial y registro de ventas por tienda</p>
                </div>
                {tiendaId && (
                    <Button
                        onClick={() => setDlgNueva(true)}
                        className="flex items-center gap-2 bg-[#FF821E] hover:bg-[#FF821E]/90 text-white font-bold shadow-sm"
                    >
                        <AddIcon style={{ fontSize: 18 }} />
                        Nueva Venta
                    </Button>
                )}
            </div>

            {/* Selector de tienda */}
            <div className="mb-6">
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Tienda</label>
                {loadingTiendas ? (
                    <div className="h-10 w-64 bg-gray-100 rounded-xl animate-pulse" />
                ) : (
                    <select
                        value={tiendaId}
                        onChange={e => setTiendaId(e.target.value)}
                        className="h-10 px-3 pr-8 rounded-xl border border-gray-200 text-sm text-[#1F4363] font-medium bg-white shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF821E]/30 focus:border-[#FF821E] min-w-[220px] transition-all"
                    >
                        <option value="">— Selecciona una tienda —</option>
                        {tiendas.map(t => (
                            <option key={t.id} value={t.id}>{t.nombre}</option>
                        ))}
                    </select>
                )}
            </div>

            {!tiendaId ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                        <StorefrontIcon style={{ fontSize: 32, color: '#D1D5DB' }} />
                    </div>
                    <p className="text-gray-400 text-sm font-medium">Selecciona una tienda para ver sus ventas</p>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                >
                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <StatCard
                            icon={<ReceiptLongIcon style={{ fontSize: 24, color: '#1F4363' }} />}
                            label="Total de Ventas"
                            value={loadingVentas ? '—' : stats.count}
                            sub={loadingVentas ? '' : `${stats.contado} contado · ${stats.credito} crédito`}
                            color="#1F4363"
                        />
                        <StatCard
                            icon={<AccountBalanceWalletIcon style={{ fontSize: 24, color: '#FF821E' }} />}
                            label="Monto Total"
                            value={loadingVentas ? '—' : fmt(stats.total)}
                            color="#FF821E"
                        />
                        <StatCard
                            icon={<TrendingUpIcon style={{ fontSize: 24, color: '#198E7B' }} />}
                            label="Promedio por Venta"
                            value={loadingVentas ? '—' : fmt(stats.count ? stats.total / stats.count : 0)}
                            color="#198E7B"
                        />
                    </div>

                    {/* Buscador */}
                    <div className="relative max-w-sm">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder="Buscar por cliente o #..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            className="pl-9 focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                        />
                    </div>

                    {/* Tabla */}
                    <TablaVentas
                        data={filtered}
                        loading={loadingVentas}
                        onVerDetalle={handleVerDetalle}
                    />
                </motion.div>
            )}

            {/* Dialogs */}
            <DialogDetalleVenta
                open={dlgDetalle}
                onClose={() => { setDlgDetalle(false); setVentaDetalle(null) }}
                venta={ventaDetalle}
            />
            <DialogNuevaVenta
                open={dlgNueva}
                onClose={() => setDlgNueva(false)}
                tiendaId={tiendaId}
                empresaId={user?.empresa_id}
                onSuccess={loadVentas}
            />
        </div>
    )
}