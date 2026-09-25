'use client'
import React, { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import {
    Plus, Search, Store, MapPin, Phone,
    User, Calendar, Pencil, Trash2, ToggleLeft, ToggleRight,
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/Context/AuthContext'
import { getTiendasByEmpresa, deleteTienda, updateTienda } from '@/Connections/tiendas'
import { Title } from '@/components/Titles/Title'

function formatFecha(fecha) {
    if (!fecha) return '—'
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-PE', {
        day: '2-digit', month: 'short', year: 'numeric',
    })
}

function InfoRow({ icon, value }) {
    if (!value) return null
    return (
        <div className="flex items-center gap-2">
            <span style={{ color: 'rgba(31,47,87,0.35)' }}>{icon}</span>
            <span className="text-xs truncate" style={{ color: 'rgba(31,47,87,0.6)' }}>{value}</span>
        </div>
    )
}

function TiendaCard({ tienda, onEdit, onDelete, onToggleEstado }) {
    const initials = tienda.nombre?.slice(0, 2).toUpperCase() ?? 'T'

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="bg-white rounded-xl flex flex-col overflow-hidden hover:shadow-sm transition-shadow duration-200"
            style={{ border: '0.5px solid rgba(31,47,87,0.12)' }}
        >
            <div className="flex items-start gap-3.5 px-5 pt-5 pb-4">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white text-sm font-extrabold"
                    style={{ background: '#1F2F57' }}
                >
                    {initials}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                            <h3 className="text-sm font-bold truncate" style={{ color: '#1F2F57' }}>
                                {tienda.nombre}
                            </h3>
                            <p className="text-[11px] mt-0.5 font-mono" style={{ color: 'rgba(31,47,87,0.4)' }}>
                                {tienda.codigo}
                            </p>
                        </div>
                        <span
                            className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold"
                            style={
                                tienda.activa
                                    ? { background: 'rgba(57,96,169,0.1)', color: '#3960A9' }
                                    : { background: 'rgba(31,47,87,0.07)', color: 'rgba(31,47,87,0.4)' }
                            }
                        >
                            {tienda.activa ? 'Activa' : 'Inactiva'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mx-5" style={{ borderTop: '0.5px solid rgba(31,47,87,0.08)' }} />

            <div className="px-5 py-4 flex flex-col gap-2.5 flex-1">
                <InfoRow icon={<User size={12} />}     value={tienda.responsable} />
                <InfoRow icon={<MapPin size={12} />}   value={tienda.direccion} />
                <InfoRow icon={<Phone size={12} />}    value={tienda.telefono} />
                <InfoRow icon={<Calendar size={12} />} value={formatFecha(tienda.fecha_apertura)} />
            </div>

            <div
                className="px-5 py-3 flex items-center justify-between"
                style={{ borderTop: '0.5px solid rgba(31,47,87,0.07)' }}
            >
                <button
                    onClick={() => onToggleEstado(tienda)}
                    className="flex items-center gap-1.5 text-[11px] font-medium transition-opacity hover:opacity-60"
                    style={{ color: tienda.activa ? '#3960A9' : 'rgba(31,47,87,0.4)' }}
                >
                    {tienda.activa ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
                    {tienda.activa ? 'Desactivar' : 'Activar'}
                </button>

                <div className="flex items-center gap-0.5">
                    <button
                        onClick={() => onEdit(tienda)}
                        className="p-1.5 rounded-lg transition-colors hover:bg-[#E1E7F0]"
                        title="Editar"
                    >
                        <Pencil size={13} style={{ color: 'rgba(31,47,87,0.4)' }} />
                    </button>
                    <button
                        onClick={() => onDelete(tienda.id)}
                        className="p-1.5 rounded-lg transition-colors hover:bg-red-50"
                        title="Eliminar"
                    >
                        <Trash2 size={13} style={{ color: '#C0392B' }} />
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

function SkeletonCard() {
    return (
        <div
            className="bg-white rounded-xl p-5 flex flex-col gap-4 animate-pulse"
            style={{ border: '0.5px solid rgba(31,47,87,0.1)' }}
        >
            <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl shrink-0" style={{ background: 'rgba(31,47,87,0.08)' }} />
                <div className="flex-1 flex flex-col gap-2 pt-1">
                    <div className="h-3 rounded-md w-2/3" style={{ background: 'rgba(31,47,87,0.08)' }} />
                    <div className="h-2 rounded-md w-1/3"  style={{ background: 'rgba(31,47,87,0.05)' }} />
                </div>
            </div>
            {[70, 50, 40, 45].map((w, i) => (
                <div key={i} className="h-2.5 rounded" style={{ width: `${w}%`, background: 'rgba(31,47,87,0.05)' }} />
            ))}
        </div>
    )
}

export default function Page() {
    const { user } = useAuth()
    const [tiendas, setTiendas]   = useState([])
    const [loading, setLoading]   = useState(true)
    const [query, setQuery]       = useState('')
    const [tiendaEdit, setTiendaEdit] = useState(null)

    useEffect(() => {
        if (!user?.empresa_id) return
        async function load() {
            setLoading(true)
            try {
                const res = await getTiendasByEmpresa(user.empresa_id)
                setTiendas(res?.data?.data?.data ?? res?.data?.data ?? res?.data ?? [])
            } catch {
                toast.error('Error al cargar las tiendas')
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [user])

    const filtered = useMemo(() => {
        if (!query.trim()) return tiendas
        const q = query.toLowerCase()
        return tiendas.filter(t =>
            (t.nombre      ?? '').toLowerCase().includes(q) ||
            (t.codigo      ?? '').toLowerCase().includes(q) ||
            (t.responsable ?? '').toLowerCase().includes(q) ||
            (t.direccion   ?? '').toLowerCase().includes(q)
        )
    }, [tiendas, query])

    const handleEdit = tienda => setTiendaEdit(tienda)

    const handleDelete = async id => {
        if (!confirm('¿Eliminar esta tienda? Esta acción no se puede deshacer.')) return
        const res = await deleteTienda(id)
        if (res.ok) {
            setTiendas(prev => prev.filter(t => t.id !== id))
            toast.success('Tienda eliminada')
        } else {
            toast.error(res.message || 'Error al eliminar')
        }
    }

    const handleToggleEstado = async tienda => {
        const res = await updateTienda(tienda.id, { activa: !tienda.activa })
        if (res.ok) {
            const updated = { ...tienda, activa: !tienda.activa }
            setTiendas(prev => prev.map(t => t.id === tienda.id ? updated : t))
            toast.success(updated.activa ? 'Tienda activada' : 'Tienda desactivada')
        } else {
            toast.error(res.message || 'Error al cambiar estado')
        }
    }

    return (
        <div className="p-6 flex flex-col gap-6 bg-[#E1E7F0] min-h-full">

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <Title>Gestión de la Tienda</Title>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(31,47,87,0.55)' }}>
                        Visualiza el estado de tus tiendas y sus principales indicadores.
                    </p>
                </div>
                <Link
                    href="/dashboard/inventario/tienda/create"
                    className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90 self-start sm:self-auto"
                    style={{ background: '#1F2F57' }}
                >
                    <Plus size={14} />
                    Nueva Tienda
                </Link>
            </div>

            <div className="relative max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(31,47,87,0.35)' }} />
                <input
                    placeholder="Buscar por nombre, código o responsable..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 rounded-lg text-xs outline-none bg-white transition-all"
                    style={{ border: '0.5px solid rgba(31,47,87,0.18)', color: '#1F2F57' }}
                    onFocus={e => { e.target.style.borderColor = '#3960A9'; e.target.style.boxShadow = '0 0 0 3px rgba(57,96,169,0.1)' }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(31,47,87,0.18)'; e.target.style.boxShadow = 'none' }}
                />
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-20 text-center">
                    <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ background: 'rgba(31,47,87,0.07)' }}
                    >
                        <Store size={26} style={{ color: 'rgba(31,47,87,0.25)' }} />
                    </div>
                    <p className="text-sm font-semibold" style={{ color: 'rgba(31,47,87,0.4)' }}>
                        {query ? 'Sin resultados para tu búsqueda' : 'No hay tiendas registradas'}
                    </p>
                    {!query && (
                        <Link
                            href="/dashboard/inventario/tienda/create"
                            className="text-xs font-semibold mt-1 transition-opacity hover:opacity-70"
                            style={{ color: '#3960A9' }}
                        >
                            + Crear la primera tienda
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence mode="popLayout">
                        {filtered.map(tienda => (
                            <TiendaCard
                                key={tienda.id}
                                tienda={tienda}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onToggleEstado={handleToggleEstado}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            )}

        </div>
    )
}