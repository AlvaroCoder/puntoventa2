'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { useAuth } from '@/Context/AuthContext'
import { getTiendasByEmpresa } from '@/Connections/tiendas'
import {
    getCajaByTienda, createCaja, updateCaja,
    getSesionActual, getSesionesByCaja,
    abrirCaja, cerrarCaja,
    getMovimientosByCaja, createMovimiento,
} from '@/Connections/caja'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import AddIcon from '@mui/icons-material/Add'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import LockIcon from '@mui/icons-material/Lock'
import EditIcon from '@mui/icons-material/Edit'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import HistoryIcon from '@mui/icons-material/History'
import StorefrontIcon from '@mui/icons-material/Storefront'

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

const extractOne = res => {
    const d = res?.data?.data ?? res?.data
    if (!d) return null
    if (Array.isArray(d)) return d[0] ?? null
    return d
}

// ─── Dialog: Crear / Editar Caja ─────────────────────────────

function DialogCaja({ open, onClose, caja, tiendaId, onSuccess }) {
    const isEdit = !!caja
    const [form, setForm] = useState({ nombre: '', descripcion: '' })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (open) setForm({ nombre: caja?.nombre ?? '', descripcion: caja?.descripcion ?? '' })
    }, [open, caja])

    const handleSave = async () => {
        if (!form.nombre.trim()) return toast.error('El nombre es requerido')
        setSaving(true)
        try {
            const body = isEdit ? form : { ...form, tienda_id: tiendaId }
            const res = isEdit ? await updateCaja(caja.id, body) : await createCaja(body)
            if (res.ok) {
                toast.success(isEdit ? 'Caja actualizada' : 'Caja creada')
                onSuccess()
                onClose()
            } else {
                toast.error(res.message || 'Error al guardar la caja')
            }
        } finally {
            setSaving(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={v => !v && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Editar Caja' : 'Nueva Caja'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 py-2">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1 block">Nombre *</label>
                        <Input
                            value={form.nombre}
                            onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                            placeholder="Ej: Caja Principal"
                            className="focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1 block">Descripción</label>
                        <Input
                            value={form.descripcion}
                            onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))}
                            placeholder="Opcional"
                            className="focus-visible:ring-[#FF821E]/30 focus-visible:border-[#FF821E]"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={saving}>Cancelar</Button>
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-[#FF821E] hover:bg-[#FF821E]/90 text-white font-bold"
                    >
                        {saving ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear Caja'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// ─── Dialog: Abrir Caja ───────────────────────────────────────

function DialogAbrirCaja({ open, onClose, cajaId, onSuccess }) {
    const [form, setForm] = useState({ monto_apertura: '', observacion: '' })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (open) setForm({ monto_apertura: '', observacion: '' })
    }, [open])

    const handleAbrir = async () => {
        if (!form.monto_apertura) return toast.error('El monto de apertura es requerido')
        setSaving(true)
        try {
            const res = await abrirCaja(cajaId, {
                ...form,
                monto_apertura: parseFloat(form.monto_apertura),
            })
            if (res.ok) {
                toast.success('Caja abierta correctamente')
                onSuccess()
                onClose()
            } else {
                toast.error(res.message || 'Error al abrir la caja')
            }
        } finally {
            setSaving(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={v => !v && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Abrir Caja</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 py-2">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1 block">
                            Monto de apertura (S/) *
                        </label>
                        <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.monto_apertura}
                            onChange={e => setForm(p => ({ ...p, monto_apertura: e.target.value }))}
                            placeholder="0.00"
                            className="focus-visible:ring-green-500/30 focus-visible:border-green-500"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1 block">Observación</label>
                        <Input
                            value={form.observacion}
                            onChange={e => setForm(p => ({ ...p, observacion: e.target.value }))}
                            placeholder="Opcional"
                            className="focus-visible:ring-green-500/30 focus-visible:border-green-500"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={saving}>Cancelar</Button>
                    <Button
                        onClick={handleAbrir}
                        disabled={saving}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold"
                    >
                        {saving ? 'Abriendo...' : 'Abrir Caja'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// ─── Dialog: Cerrar Caja ──────────────────────────────────────

function DialogCerrarCaja({ open, onClose, cajaId, sesion, onSuccess }) {
    const [form, setForm] = useState({ monto_cierre: '', observacion: '' })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (open) setForm({ monto_cierre: '', observacion: '' })
    }, [open])

    const handleCerrar = async () => {
        if (!form.monto_cierre) return toast.error('El monto de cierre es requerido')
        setSaving(true)
        try {
            const res = await cerrarCaja(cajaId, {
                ...form,
                monto_cierre: parseFloat(form.monto_cierre),
            })
            if (res.ok) {
                toast.success('Caja cerrada correctamente')
                onSuccess()
                onClose()
            } else {
                toast.error(res.message || 'Error al cerrar la caja')
            }
        } finally {
            setSaving(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={v => !v && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Cerrar Caja</DialogTitle>
                </DialogHeader>
                {sesion && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-sm">
                        <p className="text-amber-700 font-semibold">
                            Sesión abierta desde: {fmtDate(sesion.fecha_apertura)}
                        </p>
                        <p className="text-amber-600 mt-0.5">
                            Monto apertura: {fmt(sesion.monto_apertura)}
                        </p>
                    </div>
                )}
                <div className="space-y-3 py-2">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1 block">
                            Monto de cierre (S/) *
                        </label>
                        <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.monto_cierre}
                            onChange={e => setForm(p => ({ ...p, monto_cierre: e.target.value }))}
                            placeholder="0.00"
                            className="focus-visible:ring-red-400/30 focus-visible:border-red-400"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1 block">Observación</label>
                        <Input
                            value={form.observacion}
                            onChange={e => setForm(p => ({ ...p, observacion: e.target.value }))}
                            placeholder="Opcional"
                            className="focus-visible:ring-red-400/30 focus-visible:border-red-400"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={saving}>Cancelar</Button>
                    <Button
                        onClick={handleCerrar}
                        disabled={saving}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold"
                    >
                        {saving ? 'Cerrando...' : 'Cerrar Caja'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// ─── Dialog: Nuevo Movimiento ─────────────────────────────────

function DialogMovimiento({ open, onClose, cajaId, onSuccess }) {
    const [form, setForm] = useState({ tipo: 'entrada', monto: '', descripcion: '' })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (open) setForm({ tipo: 'entrada', monto: '', descripcion: '' })
    }, [open])

    const handleRegistrar = async () => {
        if (!form.monto || parseFloat(form.monto) <= 0)
            return toast.error('Ingresa un monto válido')
        if (!form.descripcion.trim())
            return toast.error('La descripción es requerida')
        setSaving(true)
        try {
            const res = await createMovimiento(cajaId, {
                ...form,
                monto: parseFloat(form.monto),
            })
            if (res.ok) {
                toast.success('Movimiento registrado')
                onSuccess()
                onClose()
            } else {
                toast.error(res.message || 'Error al registrar el movimiento')
            }
        } finally {
            setSaving(false)
        }
    }

    const isEntrada = form.tipo === 'entrada'

    return (
        <Dialog open={open} onOpenChange={v => !v && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Nuevo Movimiento</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 py-2">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Tipo</label>
                        <div className="flex gap-2">
                            {[
                                { key: 'entrada', label: '↑ Entrada' },
                                { key: 'salida',  label: '↓ Salida'  },
                            ].map(({ key, label }) => (
                                <button
                                    key={key}
                                    onClick={() => setForm(p => ({ ...p, tipo: key }))}
                                    className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all border-2 ${
                                        form.tipo === key
                                            ? key === 'entrada'
                                                ? 'bg-green-50 border-green-500 text-green-700'
                                                : 'bg-red-50 border-red-400 text-red-600'
                                            : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-gray-300'
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1 block">Monto (S/) *</label>
                        <Input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={form.monto}
                            onChange={e => setForm(p => ({ ...p, monto: e.target.value }))}
                            placeholder="0.00"
                            className={`${isEntrada
                                ? 'focus-visible:ring-green-500/30 focus-visible:border-green-500'
                                : 'focus-visible:ring-red-400/30 focus-visible:border-red-400'
                            }`}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1 block">Descripción *</label>
                        <Input
                            value={form.descripcion}
                            onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))}
                            placeholder="Ej: Pago proveedor"
                            className={`${isEntrada
                                ? 'focus-visible:ring-green-500/30 focus-visible:border-green-500'
                                : 'focus-visible:ring-red-400/30 focus-visible:border-red-400'
                            }`}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={saving}>Cancelar</Button>
                    <Button
                        onClick={handleRegistrar}
                        disabled={saving}
                        className={`text-white font-bold ${isEntrada
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-red-500 hover:bg-red-600'
                        }`}
                    >
                        {saving ? 'Registrando...' : 'Registrar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// ─── Tabla: Movimientos ───────────────────────────────────────

function SkeletonRow({ cols = 4 }) {
    const widths = [30, 20, 50, 25, 20]
    return (
        <tr className="border-b border-gray-50">
            {Array.from({ length: cols }).map((_, i) => (
                <td key={i} className="px-4 py-3.5">
                    <div
                        className="h-4 bg-gray-100 rounded animate-pulse"
                        style={{ width: `${widths[i % widths.length]}%` }}
                    />
                </td>
            ))}
        </tr>
    )
}

function TablaMovimientos({ data, loading }) {
    const headers = ['Tipo', 'Monto', 'Descripción', 'Fecha']

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/60">
                            {headers.map(h => (
                                <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {[...Array(4)].map((_, i) => <SkeletonRow key={i} cols={4} />)}
                    </tbody>
                </table>
            </div>
        )
    }

    if (!data.length) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                    <SwapVertIcon style={{ fontSize: 28, color: '#D1D5DB' }} />
                </div>
                <p className="text-gray-400 text-sm font-medium">Sin movimientos registrados</p>
                <p className="text-gray-300 text-xs mt-1">Agrega un movimiento con el botón de arriba</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/60">
                            {headers.map(h => (
                                <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {data.map((m, i) => (
                            <tr key={m.id ?? i} className="hover:bg-gray-50/60 transition-colors">
                                <td className="px-4 py-3.5">
                                    {m.tipo === 'entrada' ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                            ↑ Entrada
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                                            ↓ Salida
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3.5 font-semibold text-[#1F4363]">
                                    {fmt(m.monto)}
                                </td>
                                <td className="px-4 py-3.5 text-gray-600 max-w-[260px] truncate">
                                    {m.descripcion ?? <span className="text-gray-300">—</span>}
                                </td>
                                <td className="px-4 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                                    {fmtDate(m.created_at ?? m.fecha)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

// ─── Tabla: Sesiones ──────────────────────────────────────────

function TablaSesiones({ data, loading }) {
    const headers = ['Estado', 'Apertura', 'Cierre', 'Monto Apertura', 'Monto Cierre']

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/60">
                            {headers.map(h => (
                                <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {[...Array(3)].map((_, i) => <SkeletonRow key={i} cols={5} />)}
                    </tbody>
                </table>
            </div>
        )
    }

    if (!data.length) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                    <HistoryIcon style={{ fontSize: 28, color: '#D1D5DB' }} />
                </div>
                <p className="text-gray-400 text-sm font-medium">Sin sesiones registradas</p>
                <p className="text-gray-300 text-xs mt-1">Las sesiones aparecerán al abrir y cerrar la caja</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/60">
                            {headers.map(h => (
                                <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {data.map((s, i) => (
                            <tr key={s.id ?? i} className="hover:bg-gray-50/60 transition-colors">
                                <td className="px-4 py-3.5">
                                    {s.fecha_cierre ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                                            Cerrada
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                            Abierta
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3.5 text-gray-600 text-xs whitespace-nowrap">
                                    {fmtDate(s.fecha_apertura)}
                                </td>
                                <td className="px-4 py-3.5 text-gray-600 text-xs whitespace-nowrap">
                                    {fmtDate(s.fecha_cierre)}
                                </td>
                                <td className="px-4 py-3.5 font-semibold text-[#1F4363]">
                                    {fmt(s.monto_apertura)}
                                </td>
                                <td className="px-4 py-3.5 text-gray-600">
                                    {s.monto_cierre != null
                                        ? fmt(s.monto_cierre)
                                        : <span className="text-gray-300">—</span>
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

// ─── Page ─────────────────────────────────────────────────────

export default function PageCaja() {
    const { user } = useAuth()

    const [tiendas,     setTiendas]     = useState([])
    const [tiendaId,    setTiendaId]    = useState('')
    const [caja,        setCaja]        = useState(null)
    const [sesion,      setSesion]      = useState(null)
    const [sesiones,    setSesiones]    = useState([])
    const [movimientos, setMovimientos] = useState([])

    const [loadingTiendas,  setLoadingTiendas]  = useState(true)
    const [loadingCaja,     setLoadingCaja]     = useState(false)
    const [loadingMovs,     setLoadingMovs]     = useState(false)
    const [loadingSesiones, setLoadingSesiones] = useState(false)

    const [tab, setTab] = useState('movimientos')

    const [dlgCaja,      setDlgCaja]      = useState(false)
    const [dlgAbrir,     setDlgAbrir]     = useState(false)
    const [dlgCerrar,    setDlgCerrar]    = useState(false)
    const [dlgMovimiento, setDlgMovimiento] = useState(false)

    // Cargar tiendas de la empresa
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

    // Cargar caja y sesión actual cuando cambia la tienda
    const loadCaja = useCallback(async () => {
        if (!tiendaId) return
        setLoadingCaja(true)
        setCaja(null)
        setSesion(null)
        setMovimientos([])
        setSesiones([])
        try {
            const res = await getCajaByTienda(tiendaId)
            const cajaObj = extractOne(res)
            setCaja(cajaObj)

            if (cajaObj?.id) {
                const resSesion = await getSesionActual(cajaObj.id)
                setSesion(extractOne(resSesion))
            }
        } catch {
            toast.error('Error al cargar la caja')
        } finally {
            setLoadingCaja(false)
        }
    }, [tiendaId])

    useEffect(() => { loadCaja() }, [loadCaja])

    // Cargar movimientos o sesiones según el tab activo
    useEffect(() => {
        if (!caja?.id) return
        if (tab === 'movimientos') {
            setLoadingMovs(true)
            getMovimientosByCaja(caja.id)
                .then(res => setMovimientos(extractList(res)))
                .catch(() => toast.error('Error al cargar movimientos'))
                .finally(() => setLoadingMovs(false))
        } else {
            setLoadingSesiones(true)
            getSesionesByCaja(caja.id)
                .then(res => setSesiones(extractList(res)))
                .catch(() => toast.error('Error al cargar sesiones'))
                .finally(() => setLoadingSesiones(false))
        }
    }, [caja?.id, tab])

    const reloadMovimientos = useCallback(() => {
        if (!caja?.id) return
        setLoadingMovs(true)
        getMovimientosByCaja(caja.id)
            .then(res => setMovimientos(extractList(res)))
            .catch(() => {})
            .finally(() => setLoadingMovs(false))
    }, [caja?.id])

    const cajaAbierta = !!sesion && !sesion.fecha_cierre

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="font-bold text-[#1F4363] text-2xl">Movimientos de Caja</h1>
                    <p className="text-sm text-gray-400">Gestiona los movimientos de caja de tus tiendas</p>
                </div>
                {caja && (
                    <Button
                        onClick={() => setDlgCaja(true)}
                        variant="outline"
                        className="flex items-center gap-2 border-[#1F4363]/20 text-[#1F4363] font-semibold hover:bg-[#1F4363]/5"
                    >
                        <EditIcon style={{ fontSize: 16 }} />
                        Editar Caja
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

            {/* Contenido según estado */}
            {!tiendaId ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                        <StorefrontIcon style={{ fontSize: 32, color: '#D1D5DB' }} />
                    </div>
                    <p className="text-gray-400 text-sm font-medium">Selecciona una tienda para ver su caja</p>
                </div>

            ) : loadingCaja ? (
                <div className="space-y-4">
                    <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
                    <div className="h-10 w-56 bg-gray-100 rounded-xl animate-pulse" />
                    <div className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
                </div>

            ) : !caja ? (
                /* Sin caja → invitar a crear */
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm flex flex-col items-center justify-center py-20 text-center"
                >
                    <div className="w-16 h-16 rounded-2xl bg-[#FF821E]/10 flex items-center justify-center mb-4">
                        <PointOfSaleIcon style={{ fontSize: 32, color: '#FF821E' }} />
                    </div>
                    <p className="text-[#1F4363] font-semibold text-base">No hay caja registrada</p>
                    <p className="text-gray-400 text-sm mt-1 mb-5">Crea la caja para comenzar a operar</p>
                    <Button
                        onClick={() => setDlgCaja(true)}
                        className="flex items-center gap-2 bg-[#FF821E] hover:bg-[#FF821E]/90 text-white font-bold shadow-sm"
                    >
                        <AddIcon style={{ fontSize: 18 }} />
                        Crear Caja
                    </Button>
                </motion.div>

            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                >
                    {/* Tarjeta de estado de la caja */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            {/* Info */}
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                                    cajaAbierta ? 'bg-green-100' : 'bg-gray-100'
                                }`}>
                                    {cajaAbierta
                                        ? <LockOpenIcon style={{ fontSize: 24, color: '#16a34a' }} />
                                        : <LockIcon    style={{ fontSize: 24, color: '#9CA3AF' }} />
                                    }
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="font-bold text-[#1F4363] text-lg">{caja.nombre}</h2>
                                        {cajaAbierta ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                                Abierta
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                                                Cerrada
                                            </span>
                                        )}
                                    </div>
                                    {caja.descripcion && (
                                        <p className="text-sm text-gray-400 mt-0.5">{caja.descripcion}</p>
                                    )}
                                    {cajaAbierta && sesion?.fecha_apertura && (
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            Abierta desde: {fmtDate(sesion.fecha_apertura)}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Acciones */}
                            <div className="flex flex-wrap items-center gap-2">
                                {cajaAbierta ? (
                                    <>
                                        {sesion && (
                                            <div className="text-right pr-3 border-r border-gray-200">
                                                <p className="text-xs text-gray-400">Apertura</p>
                                                <p className="font-bold text-[#1F4363] text-base">
                                                    {fmt(sesion.monto_apertura)}
                                                </p>
                                            </div>
                                        )}
                                        <Button
                                            onClick={() => setDlgMovimiento(true)}
                                            className="flex items-center gap-2 bg-[#FF821E] hover:bg-[#FF821E]/90 text-white font-bold"
                                        >
                                            <AddIcon style={{ fontSize: 18 }} />
                                            Movimiento
                                        </Button>
                                        <Button
                                            onClick={() => setDlgCerrar(true)}
                                            variant="outline"
                                            className="flex items-center gap-2 border-red-200 text-red-500 hover:bg-red-50 font-semibold"
                                        >
                                            <LockIcon style={{ fontSize: 16 }} />
                                            Cerrar Caja
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        onClick={() => setDlgAbrir(true)}
                                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold"
                                    >
                                        <LockOpenIcon style={{ fontSize: 18 }} />
                                        Abrir Caja
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                        {[
                            { key: 'movimientos', label: 'Movimientos', icon: <SwapVertIcon style={{ fontSize: 16 }} /> },
                            { key: 'sesiones',    label: 'Sesiones',    icon: <HistoryIcon  style={{ fontSize: 16 }} /> },
                        ].map(t => (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                    tab === t.key
                                        ? 'bg-white text-[#1F4363] shadow-sm'
                                        : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                {t.icon}
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* Contenido del tab */}
                    {tab === 'movimientos' ? (
                        <TablaMovimientos data={movimientos} loading={loadingMovs} />
                    ) : (
                        <TablaSesiones data={sesiones} loading={loadingSesiones} />
                    )}
                </motion.div>
            )}

            {/* Dialogs */}
            <DialogCaja
                open={dlgCaja}
                onClose={() => setDlgCaja(false)}
                caja={caja}
                tiendaId={tiendaId}
                onSuccess={loadCaja}
            />
            <DialogAbrirCaja
                open={dlgAbrir}
                onClose={() => setDlgAbrir(false)}
                cajaId={caja?.id}
                onSuccess={loadCaja}
            />
            <DialogCerrarCaja
                open={dlgCerrar}
                onClose={() => setDlgCerrar(false)}
                cajaId={caja?.id}
                sesion={sesion}
                onSuccess={loadCaja}
            />
            <DialogMovimiento
                open={dlgMovimiento}
                onClose={() => setDlgMovimiento(false)}
                cajaId={caja?.id}
                onSuccess={reloadMovimientos}
            />
        </div>
    )
}