'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, LayoutGrid } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import { useAuth } from '@/Context/AuthContext'
import { getAllCajas } from '@/Connections/caja'
import CajaCard from '@/components/Cards/CajaCard'
import { Title } from '@/components/Titles/Title'
import { toast } from 'react-toastify'

function normalizarCaja(caja) {
    const estado = caja.estado ?? 'CERRADA'
    const base   = { id: caja.id, nombre: caja.nombre, codigo: caja.codigo, estado }

    if (estado === 'ABIERTA') return {
        ...base,
        cajero:        caja.cajero        ?? caja.responsable ?? '-',
        hora_apertura: caja.hora_apertura ?? caja.fechaApertura ?? '-',
        ventas_hoy:    Number(caja.ventas_hoy  ?? 0),
        num_ventas:    Number(caja.num_ventas   ?? 0),
    }
    if (estado === 'TRASPASO') return {
        ...base,
        cajero:         caja.cajero          ?? '-',
        hora_apertura:  caja.hora_apertura    ?? '-',
        monto_traspaso: Number(caja.monto_traspaso ?? 0),
    }
    return {
        ...base,
        ultimo_cierre: caja.ultimo_cierre ?? caja.fechaCierre ?? 'Sin registros',
        ultimo_cajero: caja.ultimo_cajero ?? caja.cajero      ?? '-',
    }
}

function SkeletonCard() {
    return (
        <div
            className="bg-white rounded-xl p-4 flex flex-col gap-3 animate-pulse"
            style={{ border: '0.5px solid rgba(31,47,87,0.1)', borderLeft: '3px solid rgba(31,47,87,0.1)' }}
        >
            <div className="flex justify-between gap-2">
                <div className="h-3 rounded w-1/2" style={{ background: 'rgba(31,47,87,0.08)' }} />
                <div className="h-4 rounded-full w-14" style={{ background: 'rgba(31,47,87,0.06)' }} />
            </div>
            <div className="h-2 rounded w-1/4" style={{ background: 'rgba(31,47,87,0.05)' }} />
            <div style={{ borderTop: '0.5px solid rgba(31,47,87,0.08)' }} />
            {[60, 50, 40].map((w, i) => (
                <div key={i} className="h-2.5 rounded" style={{ width: `${w}%`, background: 'rgba(31,47,87,0.05)' }} />
            ))}
        </div>
    )
}

export default function PageCaja() {
    const { user }  = useAuth()
    const [cajas,   setCajas]   = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user?.empresa_id) return
        let cancelado = false

        async function fetchData() {
            setLoading(true)
            try {
                const res = await getAllCajas();                
                const data = res?.data?.data ?? res?.data ?? []
                const list = Array.isArray(data) ? data : []
                if (!cancelado) setCajas(list.map(normalizarCaja))
            } catch (err) {
                console.error('Error cargando cajas:', err)
                if (!cancelado) toast.error('Error al cargar las cajas')
            } finally {
                if (!cancelado) setLoading(false)
            }
        }

        fetchData()
        return () => { cancelado = true }
    }, [user?.empresa_id])

    return (
        <div className="p-6 flex flex-col gap-6 bg-[#E1E7F0] min-h-full">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <Title>Gestión de Cajas</Title>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(31,47,87,0.55)' }}>
                        Administra las cajas registradas en tus tiendas.
                    </p>
                </div>
                <Link
                    href="/dashboard/ventas/caja/create"
                    className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90 self-start sm:self-auto"
                    style={{ background: '#1F2F57' }}
                >
                    <Plus size={14} />
                    Nueva Caja
                </Link>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : cajas.length === 0 ? (
                <div
                    className="bg-white rounded-xl flex flex-col items-center gap-3 py-20 text-center"
                    style={{ border: '0.5px solid rgba(31,47,87,0.1)' }}
                >
                    <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ background: 'rgba(31,47,87,0.07)' }}
                    >
                        <LayoutGrid size={26} style={{ color: 'rgba(31,47,87,0.25)' }} />
                    </div>
                    <p className="text-sm font-semibold" style={{ color: 'rgba(31,47,87,0.4)' }}>
                        No hay cajas registradas
                    </p>
                    <Link
                        href="/dashboard/ventas/caja/create"
                        className="text-xs font-semibold mt-1 transition-opacity hover:opacity-70"
                        style={{ color: '#3960A9' }}
                    >
                        + Crear la primera caja
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence mode="popLayout">
                        {cajas.map(caja => (
                            <CajaCard key={caja.id} caja={caja} />
                        ))}
                    </AnimatePresence>
                </div>
            )}

        </div>
    )
}