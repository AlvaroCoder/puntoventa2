'use client'
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { Search } from 'lucide-react'
import { useAuth } from '@/Context/AuthContext'
import { getTiendasByEmpresa } from '@/Connections/tiendas'
import {
    getVentasByTienda,
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
import { DialogNuevaVenta } from '@/components/Dialogs/DialogNuevaVenta'

const fmt = v =>
    new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(v ?? 0)

const fmtDate = d =>
    d
        ? new Date(d).toLocaleString('es-PE', {
              day: '2-digit', month: 'short', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
          })
        : '—'



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